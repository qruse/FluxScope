from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import json, sys

slug = 'gemini-4-argon-launch-antigravity-ultra'
out = Path(sys.argv[1]); out.mkdir(parents=True, exist_ok=True)
BG = '#f6f4ed'; INK = '#182d3c'; GRAY = '#647582'; LINE = '#d1d9d9'; LIGHT = '#e6ebe9'
GOOGLE = '#3b7d3a'; GOOGLE_OLD = '#9dbb92'; CLAUDE = '#b75440'; OPENAI = '#3d4b55'; RED = '#c8322f'
W = 1200

def f(n, b=False):
    return ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf' if b else 'C:/Windows/Fonts/arial.ttf', n)

def wrap(d, text, xy, size, width, color=INK, b=False):
    words = text.split(); lines = []; line = ''
    for word in words:
        trial = (line + ' ' + word).strip()
        if d.textlength(trial, font=f(size, b)) > width and line:
            lines.append(line); line = word
        else:
            line = trial
    lines.append(line); x, y = xy
    for line in lines:
        d.text((x, y), line, font=f(size, b), fill=color); y += int(size * 1.3)
    return y

def base(title, subtitle, h):
    im = Image.new('RGB', (W, h), BG); d = ImageDraw.Draw(im)
    y = wrap(d, title, (60, 48), 54, W - 120, b=True)
    y = wrap(d, subtitle, (60, y + 14), 30, W - 120, GRAY)
    return im, d, y

manifest = []
def save(im, name):
    p = out / f'{slug}-{name}.webp'
    im.save(p, 'WEBP', quality=84, method=6)
    rec = {'name': name, 'width': im.width, 'height': im.height, 'bytes': p.stat().st_size}
    manifest.append(rec); print(json.dumps(rec))

def hbars(d, rows, top, x0, x1, vmax, ticks, rowh, unit=''):
    scale = (x1 - x0) / vmax
    for val in ticks:
        x = int(x0 + val * scale); d.line((x, top, x, top + len(rows) * rowh), fill=LINE, width=2)
        d.text((x - 16, top + len(rows) * rowh + 10), f'{val}{unit}', font=f(28), fill=GRAY)
    for i, (name, v, col) in enumerate(rows):
        yy = top + i * rowh
        d.text((x0, yy + 4), name, font=f(31, True), fill=INK)
        xx = int(x0 + v * scale); d.rounded_rectangle((x0, yy + 46, max(xx, x0 + 14), yy + 100), radius=9, fill=col)
        lbl = f'{v}{unit}'; tw = d.textlength(lbl, font=f(34, True))
        if xx - x0 > tw + 30:
            d.text((xx - tw - 16, yy + 54), lbl, font=f(34, True), fill='white')
        else:
            d.text((xx + 12, yy + 54), lbl, font=f(34, True), fill=INK)
    return top + len(rows) * rowh + 50

# 1. Frontier score and hallucination rate
im, d, y = base('Argon jumped to the frontier and guesses less',
                'Artificial Analysis | Gemini 4 Argon at high effort | checked Oct 14, 2026', 1540)
d.text((60, y + 30), 'Intelligence Index (points)', font=f(36, True), fill=INK)
yy = hbars(d, [('Claude Opus 5.5 (max)', 58, CLAUDE), ('Gemini 4 Argon (high)', 53, GOOGLE), ('GPT-6 Astra (max)', 53, OPENAI),
               ('Gemini 3.1 Pro Preview', 30, GOOGLE_OLD)], y + 90, 60, 1080, 60, [0, 20, 40, 60], 118)
d.line((60, yy, W - 60, yy), fill=LINE, width=3)
d.text((60, yy + 40), 'Hallucination rate (lower is better)', font=f(36, True), fill=INK)
yy = hbars(d, [('Gemini 4 Argon (high)', 15, GOOGLE), ('GPT-6 Astra (max)', 51, OPENAI), ('GPT-6.1 Sol (max)', 54, OPENAI)],
           yy + 100, 60, 1080, 60, [0, 20, 40, 60], 118, '%')
wrap(d, 'Hallucination rate = wrong answers among questions not answered correctly (AA-Omniscience). Argon also answered fewer correctly: 50% vs 63% for Astra, so part of the gain is saying "I don\'t know" more often.',
     (60, yy + 10), 28, W - 120, GRAY)
save(im, 'frontier')

# 2. Where Argon is available
im, d, y = base('Pro gets the chat app, Ultra gets Antigravity', 'Google announcement and US plan page | checked Oct 14, 2026', 1300)
cols = ['Gemini app / AI Mode', 'Antigravity']
rows = [('Free / AI Plus', '$0 / $4.99 a month', ['Not in launch post', 'No']),
        ('AI Pro', '$19.99 a month', ['Yes', 'No']),
        ('AI Ultra', 'from $99.99 a month', ['Yes, higher limits', 'Yes'])]
tx0, cw = 60, [420, 330, 330]; ty = y + 50; rh = 170
d.rounded_rectangle((tx0, ty, W - 60, ty + 80), radius=14, fill=INK)
d.text((tx0 + 24, ty + 22), 'Plan (US price)', font=f(30, True), fill='white')
for j, c in enumerate(cols):
    d.text((tx0 + cw[0] + sum(cw[1:1 + j]) + 24, ty + 22), c, font=f(30, True), fill='white')
for i, (plan, price, cells) in enumerate(rows):
    ry = ty + 80 + i * rh
    d.rectangle((tx0, ry, W - 60, ry + rh), fill='white' if i % 2 == 0 else LIGHT)
    d.text((tx0 + 24, ry + 40), plan, font=f(38, True), fill=INK)
    d.text((tx0 + 24, ry + 94), price, font=f(28), fill=GRAY)
    for j, cell in enumerate(cells):
        cx = tx0 + cw[0] + sum(cw[1:1 + j]) + 24
        ok = cell.startswith('Yes'); col = GOOGLE if ok else (RED if cell == 'No' else GRAY)
        d.text((cx, ry + 62), cell, font=f(34, True), fill=col)
ay = ty + 80 + len(rows) * rh + 40
d.rounded_rectangle((60, ay, W - 60, ay + 200), radius=18, fill='white', outline=GOOGLE, width=4)
d.text((90, ay + 26), 'Gemini API (pay as you go)', font=f(36, True), fill=GOOGLE)
d.text((90, ay + 86), '$2 in / $10 out per 1M tokens until Nov 30, 2026', font=f(31), fill=INK)
d.text((90, ay + 136), 'then $4 / $20 per 1M tokens', font=f(31), fill=INK)
wrap(d, 'Prices before tax. Google lists Argon in Antigravity for AI Ultra only; Pro users there see it as unavailable.', (60, ay + 240), 28, W - 120, GRAY)
save(im, 'access')

# 3. My usage meter math
im, d, y = base('About 5% per question: roughly 20 questions', 'My Gemini app usage meter on Google AI Pro | illustrative math, Oct 14, 2026', 930)
bx, by, bw, bh, gap = 60, y + 90, 51, 150, 3
for i in range(20):
    x = bx + i * (bw + gap)
    d.rounded_rectangle((x, by, x + bw - 4, by + bh), radius=8, fill=GOOGLE if i >= 1 else RED)
    d.text((x + (bw - 4) / 2 - d.textlength(str(i + 1), font=f(22)) / 2, by + bh + 12), str(i + 1), font=f(22), fill=GRAY)
d.text((bx, by - 56), 'One block = one question at about 5% of the meter', font=f(30, True), fill=INK)
d.text((bx, by + bh + 70), '100% / 5% per question = about 20 questions', font=f(40, True), fill=INK)
ny = wrap(d, 'Google counts usage by compute: prompt complexity, model, features and chat length all change the cost.', (60, by + bh + 150), 30, W - 120)
ny = wrap(d, 'Pro limits refresh every five hours, with a weekly cap on top. My 5% is what the meter showed, not a Google figure.', (60, ny + 14), 30, W - 120)
wrap(d, 'Source for limit rules: Google Gemini Help, usage limits page.', (60, ny + 30), 27, W - 120, GRAY)
save(im, 'usage')

# 4. Codename path: Argon now, Carbon next
im, d, y = base('Argon shipped; Carbon is already in the queue', 'Public dates vs. reported internal testing | Oct 14, 2026', 930)
steps = [('Sep 30', 'Argon announced', 'Trusted cyber defenders only', GOOGLE),
         ('Oct 9', 'Carbon testing reported', 'Business Insider: internal Jetski tool', GRAY),
         ('Oct 13', 'Argon general release', 'API, Pro and Ultra plans', GOOGLE),
         ('Next?', 'Carbon release', 'No name, date or benchmark', RED)]
sx, sy, sw, sh = 60, y + 70, 247, 400
for i, (date, title, note, col) in enumerate(steps):
    x = sx + i * (sw + 30)
    dashed = col == RED or col == GRAY
    d.rounded_rectangle((x, sy, x + sw, sy + sh), radius=18, fill='white', outline=col, width=5 if not dashed else 3)
    d.text((x + 22, sy + 24), date, font=f(40, True), fill=col)
    ty2 = wrap(d, title, (x + 22, sy + 96), 32, sw - 44, INK, True)
    wrap(d, note, (x + 22, ty2 + 18), 27, sw - 44, GRAY)
    if i < len(steps) - 1:
        ax = x + sw + 4; ay2 = sy + sh // 2
        d.line((ax, ay2, ax + 22, ay2), fill=INK, width=4); d.polygon([(ax + 22, ay2 - 9), (ax + 22, ay2 + 9), (ax + 30, ay2)], fill=INK)
wrap(d, 'Per Business Insider (via secondary reports), internal documents list Gemini 4 builds named Argon, Barium and Carbon; one employee said Carbon "feels like Opus 5.5" for coding. Google has not commented.',
     (60, sy + sh + 50), 28, W - 120, GRAY)
save(im, 'carbon')


