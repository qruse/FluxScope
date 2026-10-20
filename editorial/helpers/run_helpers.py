"""Run the two helper AIs for one article in parallel (AGENTS §7 role split).

Usage: python editorial/helpers/run_helpers.py <workdir>
<workdir> (outside the repo) holds the filled briefs argon.md and codex.md.
- Antigravity (Gemini 4 Argon) runs in the blog repo and writes the payloads, review record and body charts
- Codex runs in <workdir> and writes community.md
Run it detached (Start-Process); background shell tasks are killed after 10 minutes. Writes <workdir>/done.txt at the end.
"""
import os, pathlib, subprocess, sys, time

work = pathlib.Path(sys.argv[1]).resolve()
blog = pathlib.Path(__file__).resolve().parents[2]
local = pathlib.Path(os.environ["LOCALAPPDATA"])
agy = local / "agy" / "bin" / "agy.exe"
codex = next((local / "OpenAI" / "Codex" / "bin").glob("*/codex.exe"))

jobs = {
    "argon": ([str(agy), "-p", (work / "argon.md").read_text(encoding="utf-8"), "--model", "gemini-4-argon-medium",
               "--dangerously-skip-permissions", "--print-timeout", "3300s"], blog, None),
    "codex": ([str(codex), "exec", "-C", str(work), "--skip-git-repo-check", "-s", "workspace-write", "-m", "gpt-6.1-sol",
               "-c", 'model_reasoning_effort="high"', "-c", 'web_search="live"', "-"], work,
              (work / "codex.md").read_text(encoding="utf-8")),
}
procs, start = {}, time.time()
for name, (cmd, cwd, stdin) in jobs.items():
    log = open(work / f"{name}.log", "w", encoding="utf-8")
    p = subprocess.Popen(cmd, cwd=cwd, stdin=subprocess.PIPE if stdin else subprocess.DEVNULL, stdout=log,
                         stderr=subprocess.STDOUT, text=True, encoding="utf-8")
    if stdin:
        p.stdin.write(stdin)
        p.stdin.close()
    procs[name] = (p, log)
lines = []
for name, (p, log) in procs.items():
    try:
        code = p.wait(timeout=3500)
    except subprocess.TimeoutExpired:
        p.kill()
        code = "timeout"
    log.close()
    lines.append(f"{name}: exit {code} after {int(time.time() - start)}s")
(work / "done.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
