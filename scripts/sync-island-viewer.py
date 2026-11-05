"""Copy the island viewer, map, rules and a few chosen replays from the hslab_island repository into public/island/.
python scripts/sync-island-viewer.py <hslab_island folder>
The public copy differs from the original in five ways: three.js comes from /island/vendor (the CSP only allows scripts
from 'self'), replays load only from ../replays/, the rules and replays carry only what the viewer reads, the page is
noindex with a way back to the project page, and small screens get a smaller HUD with a speed button."""
import json
import pathlib
import re
import shutil
import sys

ISL = pathlib.Path(sys.argv[1])
OUT = pathlib.Path(__file__).resolve().parents[1] / 'public/island'
BASE = ISL / 'replays/hl/cast_peppo_v3'
# Public name -> replay. IslandProject.astro lists the same names.
REPLAYS = {
    'attempt-1': 'attempt_1/01_drowned.json',
    'attempt-2000': 'attempt_2000/01_death.json',
    'attempt-5000': 'attempt_5000/01_death.json',
    'attempt-6000-fish': 'attempt_6000/08_fish.json',
    'attempt-10000': 'attempt_10000/01_survived.json',
    'attempt-11000-last-day': 'lastday/01_froze_2.1h.json',
}


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')


def replace_once(text, old, new):
    assert text.count(old) == 1, old
    return text.replace(old, new)


# ---------- viewer ----------
main = (ISL / 'viewer/main.js').read_text(encoding='utf-8')
main = replace_once(
    main,
    "const replayUrl = new URLSearchParams(location.search).get('replay');",
    "const replayUrl = /^\\.\\.\\/replays\\/[\\w-]+\\.json$/.exec(new URLSearchParams(location.search).get('replay') ?? '')?.[0];",
)
main = re.sub(r"name: '(\w+)',\s+brain: '\w+',", r"name: '\1',", main)   # labels from a pairing the project dropped
assert "brain: '" not in main
(OUT / 'viewer').mkdir(parents=True, exist_ok=True)
(OUT / 'viewer/main.js').write_text(main, encoding='utf-8')

page = (ISL / 'viewer/index.html').read_text(encoding='utf-8')
page = replace_once(page, '<title>HSL Island</title>', '<title>Island viewer | HSL Lab</title>\n<meta name="robots" content="noindex, follow">\n<link rel="icon" href="/favicon.svg">')
page = replace_once(page, 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js', '/island/vendor/three.module.min.js')
page = replace_once(page, 'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/', '/island/vendor/')
page = replace_once(page, '</style>', """  #back { position: fixed; left: 14px; bottom: 40px; padding: 6px 10px; font-size: 12px; font-weight: 700; color: inherit; text-decoration: none; }
  #speed { position: fixed; right: 14px; bottom: 96px; padding: 6px 10px; font: inherit; font-size: 12px; font-weight: 700; cursor: pointer; }
  @media (max-width: 640px) {
    #help, #log { display: none; }
    #status { top: 8px; left: 8px; width: 150px; padding: 8px 10px; }
    #status h1 { flex-direction: column; font-size: 11px; }
    .bar { grid-template-columns: 44px 1fr 22px; gap: 4px; font-size: 10px; margin: 2px 0; }
    #inv { font-size: 10px; margin-top: 4px; padding-top: 4px; }
    #stage { top: auto; bottom: 74px; font-size: 14px; padding: 4px 10px; }
    #caption { bottom: 110px; font-size: 13px; white-space: normal; width: 80%; text-align: center; }
    #timeline { left: 8px; right: 8px; }
    #speed { right: 8px; bottom: 40px; }
    #back { left: 8px; }
  }
</style>""")
page = replace_once(page, '<div id="dead">', """<a id="back" class="panel" href="/projects/hslab-island/">&larr; Project page</a>
<button id="speed" class="panel" type="button">Speed</button>
<div id="dead">""")
page = replace_once(page, '<script type="module" src="main.js"></script>', """<script>
document.getElementById('speed').addEventListener('click', () => {
  dispatchEvent(new KeyboardEvent('keydown', { key: 't' }));
  dispatchEvent(new KeyboardEvent('keyup', { key: 't' }));
});
if (new URLSearchParams(location.search).get('lang') === 'en') document.getElementById('back').href = '/en/projects/hslab-island/';
</script>
<script type="module" src="main.js"></script>""")
(OUT / 'viewer/index.html').write_text(page, encoding='utf-8')

# ---------- data: only what the viewer reads ----------
rules = json.loads((ISL / 'rules.json').read_text(encoding='utf-8'))


def strip_notes(value):
    if isinstance(value, dict):
        return {k: strip_notes(v) for k, v in value.items() if not k.startswith('_')}
    return value


write_json(OUT / 'rules.json', strip_notes({k: v for k, v in rules.items() if k not in ('trial', 'probe', 'personas')}))
(OUT / 'maps').mkdir(parents=True, exist_ok=True)
shutil.copyfile(ISL / 'maps/tutorial.json', OUT / 'maps/tutorial.json')
for name, src in REPLAYS.items():
    replay = json.loads((BASE / src).read_text(encoding='utf-8'))
    replay.pop('brain', None)
    write_json(OUT / 'replays' / f'{name}.json', replay)
    print(name, replay['label'], replay['days'], replay['cause'], round((OUT / 'replays' / f'{name}.json').stat().st_size / 1024), 'KiB')
