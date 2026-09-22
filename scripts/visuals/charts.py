"""FluxScope Programmatic Chart & Sketch Diagram Generator.

Provides modular functions to rapidly produce technical figures matching
FluxScope's minimalist Swiss engineering style or hand-drawn sketch aesthetic.
"""

import io
from pathlib import Path
from typing import Any, Literal
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image

from scripts.visuals.theme import apply_theme, get_series_colors, get_theme


def _ensure_parent(output_path: str | Path) -> Path:
    p = Path(output_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    return p


def _save_and_optimize(fig: plt.Figure, output_path: Path):
    """Save matplotlib figure, downscale if >1600px with Lanczos, and compress via WebP/PNG."""
    buf = io.BytesIO()
    fig.savefig(buf, format="png", facecolor=fig.get_facecolor(), edgecolor="none")
    buf.seek(0)

    with Image.open(buf) as img:
        target_w, target_h = img.size
        # Auto-clamp to max 1600px width (optimal 2x Retina bounds)
        if target_w > 1600:
            target_h = max(1, int(target_h * (1600 / target_w)))
            img = img.resize((1600, target_h), Image.Resampling.LANCZOS)

        output_path.parent.mkdir(parents=True, exist_ok=True)
        if output_path.suffix.lower() == ".webp":
            img.save(output_path, format="WEBP", quality=88, method=6)
        else:
            img.save(output_path, format="PNG", optimize=True)


def plot_bar_comparison(
    labels: list[str],
    values: list[float],
    title: str,
    output_path: str | Path,
    subtitle: str | None = None,
    xlabel: str = "",
    ylabel: str = "",
    unit: str = "",
    highlight_indices: list[int] | None = None,
    mode: Literal["dark", "light"] = "dark",
    sketch: bool = False,
    figsize: tuple[float, float] = (12.0, 6.3),
    dpi: int = 120,
) -> Path:
    """Generate a high-density bar chart comparing metrics (latency, memory, throughput)."""
    p = _ensure_parent(output_path)
    t = get_theme(mode)
    series_colors = get_series_colors(mode)

    ctx = plt.xkcd() if sketch else plt.rc_context({})
    with ctx:
        fig, ax = plt.subplots(figsize=figsize, dpi=dpi)
        apply_theme(fig, ax, mode=mode, sketch=sketch)

        x = np.arange(len(labels))
        bars = []

        for i, val in enumerate(values):
            is_highlight = highlight_indices and i in highlight_indices
            color = t["accent"] if is_highlight else series_colors[i % len(series_colors)]
            edgecolor = t["ink"] if sketch else "none"
            bar = ax.bar(
                x[i],
                val,
                width=0.55,
                color=color,
                edgecolor=edgecolor,
                linewidth=1.4 if sketch else 0,
                alpha=0.95 if is_highlight else 0.85,
                zorder=3,
            )
            bars.append(bar)

            # Value label on top
            val_str = f"{val:g}{unit}"
            ax.text(
                x[i],
                val + (max(values) * 0.02),
                val_str,
                ha="center",
                va="bottom",
                fontsize=11,
                fontweight="bold",
                color=t["ink"],
            )

        ax.set_xticks(x)
        ax.set_xticklabels(labels, fontsize=11, fontweight="bold", color=t["ink"])
        if xlabel:
            ax.set_xlabel(xlabel)
        if ylabel:
            ax.set_ylabel(ylabel)

        # Title & Subtitle
        fig.text(
            0.08,
            0.88,
            title,
            fontsize=16,
            fontweight="bold",
            color=t["ink"],
        )
        if subtitle:
            fig.text(
                0.08,
                0.83,
                subtitle,
                fontsize=11,
                color=t["muted"],
            )

        y_max = max(values) * 1.15 if values else 1.0
        ax.set_ylim(0, y_max)

        plt.subplots_adjust(top=0.78, bottom=0.15, left=0.08, right=0.95)
        _save_and_optimize(fig, p)
        plt.close(fig)

    return p


def plot_line_trend(
    x_data: list[Any],
    series_dict: dict[str, list[float]],
    title: str,
    output_path: str | Path,
    subtitle: str | None = None,
    xlabel: str = "",
    ylabel: str = "",
    mode: Literal["dark", "light"] = "dark",
    sketch: bool = False,
    figsize: tuple[float, float] = (12.0, 6.3),
    dpi: int = 120,
) -> Path:
    """Generate line trend chart (scaling curves, loss convergence, latency vs sequence length)."""
    p = _ensure_parent(output_path)
    t = get_theme(mode)
    series_colors = get_series_colors(mode)

    ctx = plt.xkcd() if sketch else plt.rc_context({})
    with ctx:
        fig, ax = plt.subplots(figsize=figsize, dpi=dpi)
        apply_theme(fig, ax, mode=mode, sketch=sketch)

        for idx, (label, y_vals) in enumerate(series_dict.items()):
            color = series_colors[idx % len(series_colors)]
            ax.plot(
                x_data,
                y_vals,
                label=label,
                color=color,
                linewidth=2.5 if not sketch else 2.2,
                marker="o" if len(x_data) <= 15 else None,
                markersize=6,
                alpha=0.9,
                zorder=4,
            )

        ax.set_xlabel(xlabel)
        ax.set_ylabel(ylabel)

        fig.text(0.08, 0.88, title, fontsize=16, fontweight="bold", color=t["ink"])
        if subtitle:
            fig.text(0.08, 0.83, subtitle, fontsize=11, color=t["muted"])

        legend = ax.legend(
            loc="upper right",
            frameon=True,
            facecolor=t["surface"],
            edgecolor=t["line"],
            fontsize=10,
        )
        for text in legend.get_texts():
            text.set_color(t["ink"])

        plt.subplots_adjust(top=0.78, bottom=0.15, left=0.08, right=0.95)
        _save_and_optimize(fig, p)
        plt.close(fig)

    return p


def plot_sketch_pipeline(
    steps: list[dict[str, str]],
    title: str,
    output_path: str | Path,
    subtitle: str | None = None,
    mode: Literal["dark", "light"] = "dark",
    figsize: tuple[float, float] = (12.0, 6.3),
    dpi: int = 120,
) -> Path:
    """Generate a hand-drawn sketch pipeline schematic / algorithm flow diagram."""
    p = _ensure_parent(output_path)
    t = get_theme(mode)
    series_colors = get_series_colors(mode)

    with plt.xkcd():
        fig, ax = plt.subplots(figsize=figsize, dpi=dpi)
        apply_theme(fig, ax, mode=mode, sketch=True, grid=False)
        ax.axis("off")

        fig.text(0.08, 0.88, title, fontsize=16, fontweight="bold", color=t["ink"])
        if subtitle:
            fig.text(0.08, 0.83, subtitle, fontsize=11, color=t["muted"])

        n = len(steps)
        box_width = 0.8 / n
        box_height = 0.38
        y_center = 0.42

        for i, step in enumerate(steps):
            x_left = 0.08 + i * (0.85 / n)
            color = series_colors[i % len(series_colors)]

            # Draw block box
            rect = plt.Rectangle(
                (x_left, y_center - box_height / 2),
                box_width * 0.82,
                box_height,
                facecolor=t["surface"],
                edgecolor=color,
                linewidth=2.2,
                zorder=3,
            )
            ax.add_patch(rect)

            # Step number badge
            badge_text = step.get("badge", f"STEP {i+1}")
            ax.text(
                x_left + (box_width * 0.82) / 2,
                y_center + (box_height / 2) + 0.04,
                badge_text,
                ha="center",
                va="bottom",
                fontsize=9,
                fontweight="bold",
                color=color,
            )

            # Step name & description
            name = step.get("name", f"Phase {i+1}")
            desc = step.get("desc", "")
            ax.text(
                x_left + (box_width * 0.82) / 2,
                y_center + 0.04,
                name,
                ha="center",
                va="center",
                fontsize=11,
                fontweight="bold",
                color=t["ink"],
            )
            if desc:
                ax.text(
                    x_left + (box_width * 0.82) / 2,
                    y_center - 0.06,
                    desc,
                    ha="center",
                    va="center",
                    fontsize=8.5,
                    color=t["muted"],
                    wrap=True,
                )

            # Connecting arrow between boxes
            if i < n - 1:
                arrow_start = x_left + (box_width * 0.82) + 0.01
                arrow_end = arrow_start + (0.85 / n) - (box_width * 0.82) - 0.02
                ax.annotate(
                    "",
                    xy=(arrow_end, y_center),
                    xytext=(arrow_start, y_center),
                    arrowprops=dict(
                        arrowstyle="-|>",
                        color=t["accent"],
                        linewidth=2.0,
                        mutation_scale=15,
                    ),
                    zorder=4,
                )

        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)

        plt.subplots_adjust(top=0.78, bottom=0.1, left=0.05, right=0.95)
        _save_and_optimize(fig, p)
        plt.close(fig)

    return p
