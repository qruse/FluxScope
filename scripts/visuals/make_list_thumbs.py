"""Thumbnails for the home page and the project and story lists, all 720x480.
Projects crop a capture of the page to fill the frame. Story parts fit the first image of the part inside the frame, so a chart keeps
all of its labels. python scripts/visuals/make_list_thumbs.py [capture.png ...]
Each argument is a 1080x720 capture of a live project page, named <project id>.png (Oracle, duel and mafia have no suitable stored image);
without arguments their existing thumbnails stay."""
import pathlib
import re
import sys

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parents[2]
PUBLIC = ROOT / "public"
OUT = PUBLIC / "images" / "thumbs"
SIZE = (720, 480)
PROJECTS = {
    "beat-kma": "images/projects/beat-kma-forecast.webp",
    "my-voice-tts": "images/stories/my-voice-tts/part1-live-page.webp",
    "hslab-island": "images/stories/hslab-island/part5-cast.webp",
}


def save(image: Image.Image, path: pathlib.Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, quality=78, method=6)
    print(path.relative_to(PUBLIC), path.stat().st_size // 1024, "KiB")


for project, src in PROJECTS.items():
    save(ImageOps.fit(Image.open(PUBLIC / src).convert("RGB"), SIZE, centering=(0.5, 0.0)), OUT / "projects" / f"{project}.webp")
for capture in sys.argv[1:]:
    save(ImageOps.fit(Image.open(capture).convert("RGB"), SIZE, centering=(0.5, 0.0)), OUT / "projects" / f"{pathlib.Path(capture).stem}.webp")

for story in sorted((ROOT / "src/content/stories/ko").glob("*.md")):
    found = re.search(r"!\[[^\]]*\]\((/images/[^)\s]+)", story.read_text(encoding="utf-8"))
    if not found:
        print("no image:", story.name)
        continue
    image = Image.open(PUBLIC / found.group(1).lstrip("/")).convert("RGB")
    save(ImageOps.pad(image, SIZE, color=(255, 254, 251)), OUT / "stories" / f"{story.stem}.webp")
