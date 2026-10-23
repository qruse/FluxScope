"""Run the helper AIs' research for one article (AGENTS §7 role split).

Usage: python editorial/helpers/run_helpers.py <workdir>
<workdir> (outside the repo) holds the filled briefs. Antigravity (argon-research.md -> research-argon.md) and Codex
(codex.md -> research-codex.md and community.md) research in parallel, while Claude writes research-claude.md itself.
Claude writes the article from the three files (user instruction, 2026-10-24); there is no helper draft stage.
Run it detached (Start-Process); background shell tasks are killed after 10 minutes. Writes <workdir>/done-research.txt.
Antigravity researches on Gemini 3.8 Flash (user instruction, 2026-10-24). Argon's remaining weekly share is still read
from `agy -p=/usage` and recorded in done-research.txt so it can be reported to the user.
"""
import os, pathlib, re, subprocess, sys, time

work = pathlib.Path(sys.argv[1]).resolve()
local = pathlib.Path(os.environ["LOCALAPPDATA"])
agy = local / "agy" / "bin" / "agy.exe"
codex = next((local / "OpenAI" / "Codex" / "bin").glob("*/codex.exe"))

FLASH = "gemini-3.8-flash-medium"


def argon_usage():
    """Argon weekly limit remaining (%) and its reset time (UTC) from `agy -p=/usage`, or None."""
    out = subprocess.run([str(agy), "--print-timeout", "60s", "-p=/usage"], capture_output=True, text=True,
                         encoding="utf-8", timeout=120).stdout
    m = re.search(r"Gemini 4 Argon Weekly Limit\s+(\d+)%\s+(\S+)", out)
    return (int(m.group(1)), m.group(2)) if m else None


usage = argon_usage()
jobs = {
    # Prompt on stdin: as an argument it hits the Windows command-line length limit.
    "argon-research": ([str(agy), "--model", FLASH,"--dangerously-skip-permissions", "--print-timeout", "3300s"], work,
                       (work / "argon-research.md").read_text(encoding="utf-8")),
    "codex": ([str(codex), "exec", "-C", str(work), "--skip-git-repo-check", "-s", "workspace-write", "-m", "gpt-6.1-sol",
               "-c", 'model_reasoning_effort="high"', "-c", 'web_search="live"', "-"], work,
              (work / "codex.md").read_text(encoding="utf-8")),
}

procs, start = {}, time.time()
for name, (cmd, cwd, stdin) in jobs.items():
    log = open(work / f"{name}.log", "w", encoding="utf-8")
    p = subprocess.Popen(cmd, cwd=cwd, stdin=subprocess.PIPE, stdout=log, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
    p.stdin.write(stdin)
    p.stdin.close()
    procs[name] = (p, log)
lines = [f"argon weekly remaining: {f'{usage[0]}% (resets {usage[1]})' if usage else 'unknown'}"]
for name, (p, log) in procs.items():
    try:
        code = p.wait(timeout=3500)
    except subprocess.TimeoutExpired:
        p.kill()
        code = "timeout"
    log.close()
    lines.append(f"{name}: exit {code} after {int(time.time() - start)}s")
(work / "done-research.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
