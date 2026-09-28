"""Same-prompt build cost: Claude Opus 5.5 vs GPT-6 Astra (Moe Lueker, 2026-09-25)."""
from io import BytesIO
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from PIL import Image

OUT = Path(__file__).resolve().parents[2] / "public/images/posts/ai/astra-opus-same-prompt-cost.webp"
rounds = ["Round 1: runner game", "Round 2: island builder"]
opus, astra = [15.25, 5.40], [7.09, 6.88]
minutes_opus, minutes_astra = ["62 min", "~30 min"], ["24 min", "27 min"]

fig, ax = plt.subplots(figsize=(14.4, 8.1), dpi=100)
fig.patch.set_facecolor("#f6f5f1"); ax.set_facecolor("#f6f5f1")
x = [0, 1]; w = 0.34
b1 = ax.bar([i - w / 2 for i in x], opus, w, color="#e66043", label="Claude Opus 5.5")
b2 = ax.bar([i + w / 2 for i in x], astra, w, color="#1f4e8c", label="GPT-6 Astra")
for bars, mins in ((b1, minutes_opus), (b2, minutes_astra)):
    for bar, m in zip(bars, mins):
        ax.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.25, f"${bar.get_height():.2f}\n{m}",
                ha="center", va="bottom", fontsize=17, color="#1b262b", fontweight="bold")
ax.set_xticks(x, rounds, fontsize=17, color="#1b262b")
ax.set_ylim(0, 18.5); ax.set_ylabel("Build-turn API cost (USD)", fontsize=15, color="#627078")
ax.tick_params(axis="y", labelsize=13, colors="#627078")
for s in ("top", "right"): ax.spines[s].set_visible(False)
ax.grid(axis="y", color="#e2e6e3"); ax.set_axisbelow(True)
ax.legend(fontsize=15, frameon=False, loc="upper right")
fig.text(0.06, 0.93, "Same prompt, different bill", fontsize=26, fontweight="bold", color="#1b262b")
fig.text(0.06, 0.885, "Opus is 2.5x cheaper per token, yet cost more on the runner because it wrote about 7x more output",
         fontsize=14, color="#627078")
fig.text(0.06, 0.03, "One build per model per round, list API rates, follow-up prompts excluded. Data: Moe Lueker, Sep 25, 2026. Chart: HSL",
         fontsize=12, color="#627078")
fig.subplots_adjust(left=0.08, right=0.97, top=0.82, bottom=0.12)
buf = BytesIO(); fig.savefig(buf, format="png", facecolor=fig.get_facecolor()); buf.seek(0)
Image.open(buf).convert("RGB").save(OUT, "WEBP", quality=90, method=6)
print(OUT, Image.open(OUT).size, OUT.stat().st_size)
