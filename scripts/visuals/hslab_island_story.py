"""Figures of the hslab-island project stories, drawn from the project's own result files and viewer captures.
python scripts/visuals/hslab_island_story.py <hslab_island folder>  ->  public/images/stories/hslab-island/part<N>-<name>.webp"""
import ast
import json
import math
import pathlib
import re
import sys

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw, ImageFont

ISL = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(__file__).resolve().parents[2] / 'public/images/stories/hslab-island'
OUT.mkdir(parents=True, exist_ok=True)
BG, INK, MUTED, LINE = '#f6f5f1', '#1b262b', '#627078', '#d9ddda'
DROWN, THIRST, HUNGER, COLD, ALIVE, GREY = '#0284c7', '#d97706', '#e66043', '#7c3aed', '#0d9488', '#9aa6b0'
plt.rcParams.update({'font.family': 'Arial', 'font.size': 15, 'text.color': INK, 'axes.edgecolor': LINE, 'axes.labelcolor': MUTED,
                     'xtick.color': MUTED, 'ytick.color': INK, 'figure.facecolor': BG, 'axes.facecolor': BG})


def fig(title, w=12, h=6.5):
    f, ax = plt.subplots(figsize=(w, h), dpi=100)
    f.text(0.05, 0.92, title, fontsize=30, fontweight='bold', color=INK, va='center')
    f.subplots_adjust(left=0.05, right=0.95, top=0.84, bottom=0.1)
    for s in ('top', 'right'):
        ax.spines[s].set_visible(False)
    return f, ax


def save(f, name):
    tmp = OUT / f'{name}.png'
    f.savefig(tmp, facecolor=BG)
    plt.close(f)
    Image.open(tmp).convert('RGB').save(OUT / f'{name}.webp', quality=86, method=6)
    tmp.unlink()


def capture(src, name, crop=None, width=1600):
    im = Image.open(ISL / 'captures' / src).convert('RGB')
    if crop:
        im = im.crop(crop)
    if im.width > width:
        im = im.resize((width, im.height * width // im.width), Image.LANCZOS)
    im.save(OUT / f'{name}.webp', quality=82, method=6)


def stages(report):
    """(label, mean days, deaths) per '## Attempt' block of a highlights report."""
    text = (ISL / report).read_text(encoding='utf-8')
    return [(m[1], float(m[2]), ast.literal_eval(m[3])) for m in re.finditer(r"## (Attempt [\d,]+)[^\n]*\n+mean ([\d.]+) days · deaths (\{[^}]*\})", text)]


# ---------- part 1 ----------
capture('story_hud_a.png', 'part1-viewer')
capture('story_coco.png', 'part1-coconuts')
rows = stages('replays/hl/full_v2/report.md')
f, ax = fig('One wall, then the next')
causes = [('drowned', 'Drowned', DROWN), ('dehydrated', 'Thirst', THIRST), ('starved', 'Hunger', HUNGER), ('froze', 'Cold', COLD)]
for y, (label, days, d) in enumerate(reversed(rows)):
    n = sum(d.values())
    x = 0
    for key, _, c in causes:
        w = d.get(key, 0) / n * 100
        ax.barh(y, w - 0.4, left=x, color=c, height=0.62)
        if w >= 12:
            ax.text(x + w / 2, y, f'{w:.0f}%', ha='center', va='center', color='white', fontweight='bold')
        x += w
    ax.text(-1.5, y, f'{label}  ·  {days:.1f} days', ha='right', va='center', fontsize=15)
ax.set_xlim(-34, 100)
ax.set_ylim(-0.6, len(rows) + 0.2)
ax.axis('off')
for i, (_, name, c) in enumerate(causes):
    ax.text(i * 25 + 12.5, len(rows) - 0.25, name, ha='center', color=c, fontweight='bold', fontsize=16)
save(f, 'part1-deaths')

# ---------- part 2 ----------
capture('story_map.png', 'part2-map', crop=(240, 0, 1680, 1080))
f, ax = fig('What the castaway sees')
ax.axis('off')
ax.set_aspect('equal')
fov = math.radians(200)
for k in range(24):
    a = -fov / 2 + k * fov / 23
    ax.plot([0, 12 * math.sin(a)], [0, 12 * math.cos(a)], color=GREY, lw=1.3)
ax.add_patch(plt.Circle((0, 0), 0.55, color=HUNGER, zorder=5))
ax.annotate('', xy=(0, 2.2), xytext=(0, 0.6), arrowprops=dict(arrowstyle='-|>', color=INK, lw=2.2), zorder=6)
ax.text(0, -1.4, 'castaway', ha='center', color=INK)
ax.text(0, 12.5, '24 rays · 200°', ha='center', fontweight='bold', fontsize=18)
ax.annotate('', xy=(11.8, 2.1), xytext=(0.2, 0.05), arrowprops=dict(arrowstyle='<->', color=INK, lw=1.4))
ax.text(7.2, 0.0, '12 m', fontsize=16, ha='center')
ax.set_xlim(-15, 15)
ax.set_ylim(-3.5, 13.5)
save(f, 'part2-rays')

log = (ISL / 'lastday_v3.log').read_text(encoding='utf-8')
per_day = ast.literal_eval(re.search(r'among islands still alive \(alive, mean stock\): (\{.*\})\n', log)[1])
days = sorted(per_day)
START = 9 * 3 + 7 * 4
fruit = [(per_day[d][1]['palm'] + per_day[d][1]['bush']) / START * 100 for d in days]
alive = [per_day[d][0] / 512 * 100 for d in days]
f, ax = fig('The fruit runs out around day 18')
ax.plot(days, fruit, color=HUNGER, lw=3)
ax.plot(days, alive, color=ALIVE, lw=3)
ax.text(10.3, 56, 'Fruit left', color=HUNGER, fontweight='bold', fontsize=18)
ax.text(22, 57, 'Islands alive', color=ALIVE, fontweight='bold', fontsize=18)
ax.set_xlabel('Day')
ax.set_ylabel('% of start')
ax.set_ylim(0, 105)
ax.set_xlim(1, 29)
ax.grid(axis='y', color=LINE, lw=0.8)
f.subplots_adjust(left=0.08, bottom=0.13)
save(f, 'part2-fruit')

# ---------- part 3 ----------
RUNS = [('mk1_ppo', 'PPO + GRU', HUNGER), ('mk1_agalite', 'AGaLiTe', ALIVE), ('mk1_pqn', 'PQN', THIRST), ('mk1_reppo', 'RePPO', COLD)]
f, ax = fig('Same 15 minutes, four brains')
for run, name, c in RUNS:
    d = json.loads((ISL / f'runs/{run}/log.json').read_text(encoding='utf-8'))
    d = [e for e in d if e['mean_days'] == e['mean_days']]
    ax.plot([e['minutes'] for e in d], [e['mean_days'] for e in d], color=c, lw=2.6)
    ax.text(d[-1]['minutes'] + 0.15, d[-1]['mean_days'], f"{name}  {d[-1]['mean_days']:.1f}", color=c, va='center', fontweight='bold')
ax.set_xlim(0, 18.2)
ax.set_ylim(0, 16)
ax.set_xlabel('Minutes')
ax.set_ylabel('Mean days alive')
ax.grid(axis='y', color=LINE, lw=0.8)
f.subplots_adjust(left=0.08, bottom=0.13)
save(f, 'part3-curves')
capture('story_f2.png', 'part3-fishing')
f, ax = fig('Almost nobody found the fish', h=5)
for y, (run, name, c) in enumerate(reversed(RUNS)):
    d = json.loads((ISL / f'runs/{run}/log.json').read_text(encoding='utf-8'))
    peak = max(e.get('fished', 0) for e in d) * 100
    ax.plot([0, 100], [y, y], color=LINE, lw=3, zorder=1)
    ax.plot([0, peak], [y, y], color=c, lw=4, zorder=2)
    ax.plot(peak, y, 'o', color=c, ms=13, zorder=3)
    ax.text(peak + 2, y + 0.24, f'{peak:.1f}%', va='center', fontweight='bold', color=INK)
    ax.text(-2, y, name, ha='right', va='center')
ax.set_xlim(-24, 104)
ax.set_ylim(-0.6, 3.9)
ax.text(100, 3.55, '100% of lives', ha='right', color=MUTED)
ax.axis('off')
save(f, 'part3-fished')

# ---------- part 4 ----------
capture('story_day30.png', 'part4-day30')
f, ax = fig('Same 20M steps, four times the learning', h=5)
ax.axis('off')
for y, (name, n, c, res) in enumerate([('2,048 islands', 152, ALIVE, '22.5 days'), ('8,192 islands', 38, GREY, '8.3 days')]):
    for k in range(n):
        ax.add_patch(plt.Rectangle((k % 38, y * 6 + 3 - k // 38), 0.72, 0.72, color=c))
    ax.text(-1, y * 6 + 3.35, name, ha='right', va='center', fontsize=17, fontweight='bold')
    ax.text(-1, y * 6 + 2.35, f'{n} updates', ha='right', va='center', color=MUTED)
    ax.text(39, y * 6 + 3.35, res, va='center', fontsize=22, fontweight='bold', color=INK)
ax.set_xlim(-11, 50)
ax.set_ylim(-1, 10.5)
save(f, 'part4-updates')

f, ax = fig('HyPPO')
ax.axis('off')
ax.set_xlim(0, 100)
ax.set_ylim(0, 50)


def box(x, y, w, h, title, sub, c=INK):
    ax.add_patch(plt.Rectangle((x, y), w, h, fc='#fffefa', ec=c, lw=2.2))
    ax.text(x + w / 2, y + h * 0.62, title, ha='center', va='center', fontweight='bold', fontsize=16, color=c)
    ax.text(x + w / 2, y + h * 0.28, sub, ha='center', va='center', fontsize=13.5, color=MUTED)


def arrow(a, b):
    ax.annotate('', xy=b, xytext=a, arrowprops=dict(arrowstyle='-|>', color=INK, lw=1.8))


box(1, 18, 17, 14, 'Observation', '369 numbers')
box(25, 18, 19, 14, 'SimBaV2', '256')
box(51, 18, 20, 14, 'Sphere GRU', '8 groups × 16', HUNGER)
box(79, 28, 20, 14, 'Policy', '13 actions')
box(79, 8, 20, 14, 'Value', 'HL-Gauss')
arrow((18, 25), (25, 25))
arrow((44, 25), (51, 25))
arrow((71, 27), (79, 34))
arrow((71, 23), (79, 16))
ax.text(34.5, 12, '+ RND curiosity', ha='center', color=MUTED, fontsize=15)
save(f, 'part4-arch')

summary = (ISL / 'runs/mk2/summary.md').read_text(encoding='utf-8')
LABEL = {'M1_noanchor': 'HyPPO', 'M0_full': '+ anchors', 'M2_plaingru': 'Plain GRU', 'M3_nohl': 'No HL-Gauss', 'M4_nornd': 'No RND'}
f, ax = fig('Everything stays but the anchors', h=5.6)
for y, (key, name) in enumerate(reversed(list(LABEL.items()))):
    m = re.search(rf'\| {key} \| 40M \| 3 \| ([\d.]+) ± [\d.]+ \| ([\d.]+) ± [\d.]+ \| [^|]+\| ([\d. /]+) \|', summary)
    seeds = [float(s) for s in m[3].split('/')]
    c = ALIVE if key == 'M1_noanchor' else GREY
    ax.plot(seeds, [y] * 3, 'o', color=c, ms=12, alpha=0.9)
    ax.plot([float(m[1])] * 2, [y - 0.27, y + 0.27], color=INK, lw=2.4)
    ax.text(19.4, y, name, ha='right', va='center', fontweight='bold' if key == 'M1_noanchor' else 'normal')
    ax.text(28.6, y, f'{m[1]} days · {float(m[2]):.0f}% to day 30', va='center', color=INK)
ax.set_xlim(14.5, 33.5)
ax.set_ylim(-0.6, 4.6)
ax.set_xticks([20, 22, 24, 26, 28])
ax.spines['left'].set_visible(False)
ax.tick_params(axis='y', left=False, labelleft=False)
ax.set_xlabel('Mean days alive, each dot one seed', loc='center')
f.subplots_adjust(bottom=0.15)
save(f, 'part4-ablation')

# ---------- part 5 ----------
font = ImageFont.truetype('arialbd.ttf', 40)
W, H = 1600, 800
sheet = Image.new('RGB', (W, H), BG)
for i, (src, name) in enumerate([('story_c_peppo.png', 'Peppo'), ('story_c_pickle.png', 'Pickle'), ('story_c_galoot.png', 'Galoot')]):
    im = Image.open(ISL / 'captures' / src).convert('RGB').crop((600, 0, 1320, 1080)).resize((533, 800), Image.LANCZOS)
    sheet.paste(im, (i * 533 + (i > 0) * 1, 0))
    d = ImageDraw.Draw(sheet)
    tw = d.textlength(name, font=font)
    x = i * 533 + 266 - tw / 2
    d.rounded_rectangle((x - 20, 18, x + tw + 20, 80), 12, fill=(251, 248, 241))
    d.text((x, 25), name, font=font, fill=INK)
sheet.save(OUT / 'part5-cast.webp', quality=82, method=6)

rows = stages('replays/hl/cast_peppo_v3/report_stages.md') + stages('replays/hl/cast_peppo_v3/report.md')
f, ax = fig('Sea, thirst, hunger, then fish')
COL = {'drowned': DROWN, 'dehydrated': THIRST, 'starved': HUNGER, 'froze': COLD, 'alive': ALIVE}
xs = list(range(len(rows)))
ax.plot(xs, [r[1] for r in rows], color=LINE, lw=2.5, zorder=1)
for x, (label, days, d) in zip(xs, rows):
    top = max(d, key=d.get)
    ax.plot(x, days, 'o', color=COL[top], ms=15, zorder=2)
    ax.text(x, days + 1.3, f'{days:.1f}', ha='center', fontweight='bold', fontsize=13.5)
ax.set_xticks(xs)
ax.set_xticklabels([r[0].replace('Attempt ', '') for r in rows], fontsize=12.5, color=MUTED)
ax.set_xlabel('Attempt')
ax.set_ylabel('Mean days alive')
ax.set_ylim(0, 32)
for i, (n, c) in enumerate([('Drowned', DROWN), ('Thirst', THIRST), ('Hunger', HUNGER), ('Made it to day 30', ALIVE)]):
    ax.plot(0.1, 27.6 - i * 2.6, 'o', color=c, ms=12)
    ax.text(0.45, 27.6 - i * 2.6, n, color=INK, va='center')
f.subplots_adjust(left=0.08, bottom=0.14)
save(f, 'part5-stages')

m = re.search(r'caught a fish: (\d+) lives, (\d+) survived', log)
n = re.search(r'never caught one: (\d+) lives, (\d+) survived', log)
caught, c_ok, never, n_ok = int(m[1]), int(m[2]), int(n[1]), int(n[2])
f, ax = fig('No fish, no day 30', h=5.6)
ax.axis('off')


def waffle(x0, total, ok, name):
    for k in range(total):
        ax.add_patch(plt.Rectangle((x0 + k % 22, 9 - k // 22 * 1.0), 0.8, 0.8, color=ALIVE if k < ok else GREY))
    ax.text(x0, 12.9, name, fontsize=18, fontweight='bold')
    ax.text(x0, 10.7, f'{ok} of {total} lived 30 days', fontsize=16, color=MUTED)


waffle(0, caught, c_ok, 'Caught a fish')
waffle(25, never, n_ok, 'Never caught one')
ax.set_xlim(-0.5, 48)
ax.set_ylim(-6, 14)
ax.set_aspect('equal')
save(f, 'part5-fish')

# Thirty days of each castaway on one map: a full life from each step_40M highlight set, all on the same (pre-11/2) rules.
tut = json.loads((ISL / 'maps/tutorial.json').read_text(encoding='utf-8'))
f, axes = plt.subplots(1, 3, figsize=(13, 5.4), dpi=100)
f.text(0.04, 0.92, 'Same island, thirty days', fontsize=30, fontweight='bold', color=INK, va='center')
f.subplots_adjust(left=0.02, right=0.98, top=0.8, bottom=0.03, wspace=0.04)
for ax, (cast, name, c) in zip(axes, [('cast_peppo', 'Peppo', '#e0782f'), ('cast_pickle', 'Pickle', '#4c9a4a'), ('cast_galoot', 'Galoot', '#3d6fc4')]):
    life = json.loads((ISL / f'replays/hl/{cast}/step_40M/01_survived.json').read_text(encoding='utf-8'))
    ax.contourf(range(65), range(65), tut['heights'], levels=[0, 99], colors=['#e8e3d3'])
    ax.plot([p[0] for p in life['frames']], [p[1] for p in life['frames']], color=c, lw=0.5, alpha=0.55)
    for s in tut['fishSpots']:
        ax.add_patch(plt.Circle((s['x'], s['z']), s['r'], fill=False, ec=DROWN, lw=1.8))
    ax.text(3, 61, name, fontsize=20, fontweight='bold', color=c, va='center')
    ax.set_xlim(0, 64)
    ax.set_ylim(64, 0)
    ax.set_aspect('equal')
    ax.axis('off')
save(f, 'part5-tracks')

for p in sorted(OUT.glob('*.webp')):
    im = Image.open(p)
    print(p.name, im.size, round(p.stat().st_size / 1024), 'KiB')
