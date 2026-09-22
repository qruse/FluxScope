"""FluxScope Static Image Optimizer.

Automatically resizes oversized images down to optimal Retina display bounds
(max width 1600px) with high-quality Lanczos resampling and applies modern
compression (WebP / optimized PNG) to eliminate payload bloat while maintaining
high-resolution sharpness.
"""

import argparse
from pathlib import Path
import sys
from PIL import Image

# Reconfigure stdout for utf-8 on Windows
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

SUPPORTED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
DEFAULT_MAX_WIDTH = 1600
DEFAULT_QUALITY = 85


def optimize_single_image(
    src_path: Path,
    max_width: int = DEFAULT_MAX_WIDTH,
    quality: int = DEFAULT_QUALITY,
    convert_to_webp: bool = False,
    output_path: Path | None = None,
) -> dict:
    """Optimize a single image file, resizing if wider than max_width and compressing."""
    if src_path.suffix.lower() not in SUPPORTED_EXTENSIONS:
        return {"status": "skipped", "reason": "unsupported format"}

    original_size = src_path.stat().st_size

    with Image.open(src_path) as img:
        orig_w, orig_h = img.size
        needs_resize = orig_w > max_width

        # Determine target dimensions
        if needs_resize:
            target_w = max_width
            target_h = max(1, int(orig_h * (max_width / orig_w)))
            processed = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
        else:
            target_w, target_h = orig_w, orig_h
            processed = img.copy()

        # Handle color mode for WebP/JPEG saving
        if convert_to_webp or src_path.suffix.lower() == ".webp":
            if processed.mode in ("RGBA", "LA") or (
                processed.mode == "P" and "transparency" in processed.info
            ):
                save_mode = "RGBA"
                processed = processed.convert("RGBA")
            else:
                save_mode = "RGB"
                processed = processed.convert("RGB")
            out_ext = ".webp"
            out_fmt = "WEBP"
        elif src_path.suffix.lower() in (".jpg", ".jpeg"):
            save_mode = "RGB"
            processed = processed.convert("RGB")
            out_ext = src_path.suffix.lower()
            out_fmt = "JPEG"
        else:
            # PNG
            out_ext = ".png"
            out_fmt = "PNG"

        # Determine destination
        if output_path:
            dest = output_path
        elif convert_to_webp:
            dest = src_path.with_suffix(".webp")
        else:
            dest = src_path

        dest.parent.mkdir(parents=True, exist_ok=True)

        # Save with optimization to a temporary file first if in-place
        import tempfile
        import os

        is_inplace = (dest == src_path)
        if is_inplace and not needs_resize and not convert_to_webp:
            # Check temp save first
            with tempfile.NamedTemporaryFile(suffix=out_ext, delete=False) as tmp:
                tmp_path = Path(tmp.name)
            try:
                if out_fmt == "PNG":
                    processed.save(tmp_path, format="PNG", optimize=True)
                elif out_fmt == "JPEG":
                    processed.save(tmp_path, format="JPEG", quality=quality, optimize=True)
                else:
                    processed.save(tmp_path, format="WEBP", quality=quality, method=6)
                
                tmp_size = tmp_path.stat().st_size
                if tmp_size < original_size:
                    tmp_path.replace(dest)
                    new_size = tmp_size
                else:
                    # Keep original
                    os.unlink(tmp_path)
                    new_size = original_size
            except Exception:
                if tmp_path.exists():
                    os.unlink(tmp_path)
                new_size = original_size
        else:
            if out_fmt == "WEBP":
                processed.save(dest, format="WEBP", quality=quality, method=6)
            elif out_fmt == "PNG":
                processed.save(dest, format="PNG", optimize=True)
            elif out_fmt == "JPEG":
                processed.save(dest, format="JPEG", quality=quality, optimize=True)
            new_size = dest.stat().st_size
    diff_pct = (1 - (new_size / original_size)) * 100 if original_size > 0 else 0

    return {
        "status": "success",
        "file": str(src_path),
        "dest": str(dest),
        "orig_dim": f"{orig_w}x{orig_h}",
        "new_dim": f"{target_w}x{target_h}",
        "orig_size": original_size,
        "new_size": new_size,
        "savings_pct": diff_pct,
    }


def optimize_path(
    target_path: Path,
    max_width: int = DEFAULT_MAX_WIDTH,
    quality: int = DEFAULT_QUALITY,
    convert_to_webp: bool = False,
):
    """Recursively optimize directory or single file."""
    files_to_process = []
    if target_path.is_file():
        files_to_process.append(target_path)
    elif target_path.is_dir():
        for ext in SUPPORTED_EXTENSIONS:
            files_to_process.extend(target_path.rglob(f"*{ext}"))

    if not files_to_process:
        print(f"No images found in {target_path}")
        return

    print(f"\n🖼️  Optimizing {len(files_to_process)} image(s)... (max_width={max_width}px, quality={quality})")
    total_orig = 0
    total_new = 0

    for f in files_to_process:
        res = optimize_single_image(
            f, max_width=max_width, quality=quality, convert_to_webp=convert_to_webp
        )
        if res.get("status") == "success":
            total_orig += res["orig_size"]
            total_new += res["new_size"]
            print(
                f"  ✓ {f.name}: {res['orig_dim']} -> {res['new_dim']} | "
                f"{res['orig_size'] // 1024}KB -> {res['new_size'] // 1024}KB "
                f"({res['savings_pct']:.1f}% saved)"
            )

    net_savings = total_orig - total_new
    net_pct = (net_savings / total_orig) * 100 if total_orig > 0 else 0
    print(
        f"\n✨ Optimization Complete: {total_orig // 1024}KB -> {total_new // 1024}KB "
        f"(Saved {net_savings // 1024}KB / {net_pct:.1f}%)\n"
    )


def main():
    parser = argparse.ArgumentParser(description="FluxScope Static Image Optimizer")
    parser.add_argument("path", help="Path to image file or directory")
    parser.add_argument(
        "--max-width",
        type=int,
        default=DEFAULT_MAX_WIDTH,
        help=f"Max width cap in pixels (default: {DEFAULT_MAX_WIDTH})",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=DEFAULT_QUALITY,
        help=f"Compression quality for WebP/JPEG (default: {DEFAULT_QUALITY})",
    )
    parser.add_argument(
        "--webp",
        action="store_true",
        help="Convert images to .webp format",
    )
    args = parser.parse_args()

    p = Path(args.path)
    if not p.exists():
        print(f"Error: Path does not exist: {p}")
        sys.exit(1)

    optimize_path(
        p,
        max_width=args.max_width,
        quality=args.quality,
        convert_to_webp=args.webp,
    )


if __name__ == "__main__":
    main()
