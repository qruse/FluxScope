"""Run the helper AIs for one article (AGENTS §7 role split), in two stages.

Usage: python editorial/helpers/run_helpers.py <workdir> research|draft
<workdir> (outside the repo) holds the filled briefs.
- research: Antigravity (argon-research.md -> research-argon.md) and Codex (codex.md -> research-codex.md and
  community.md) research in parallel, while Claude writes research-claude.md itself
- draft: Antigravity (argon.md) runs in the blog repo and writes the payloads, review record and body charts
  from all three research files
Run it detached (Start-Process); background shell tasks are killed after 10 minutes. Writes <workdir>/done-<stage>.txt.
"""
import os, pathlib, subprocess, sys, time

work = pathlib.Path(sys.argv[1]).resolve()
stage = sys.argv[2] if len(sys.argv) > 2 else "research"
blog = pathlib.Path(__file__).resolve().parents[2]
local = pathlib.Path(os.environ["LOCALAPPDATA"])
agy = local / "agy" / "bin" / "agy.exe"
codex = next((local / "OpenAI" / "Codex" / "bin").glob("*/codex.exe"))


def argon(brief, cwd):
    # Prompt on stdin: as an argument it hits the Windows command-line length limit.
    return ([str(agy), "--model", "gemini-4-argon-medium", "--dangerously-skip-permissions", "--print-timeout", "3300s"],
            cwd, (work / brief).read_text(encoding="utf-8"))


if stage == "research":
    jobs = {
        "argon-research": argon("argon-research.md", work),
        "codex": ([str(codex), "exec", "-C", str(work), "--skip-git-repo-check", "-s", "workspace-write", "-m", "gpt-6.1-sol",
                   "-c", 'model_reasoning_effort="high"', "-c", 'web_search="live"', "-"], work,
                  (work / "codex.md").read_text(encoding="utf-8")),
    }
else:
    jobs = {"argon-draft": argon("argon.md", blog)}

procs, start = {}, time.time()
for name, (cmd, cwd, stdin) in jobs.items():
    log = open(work / f"{name}.log", "w", encoding="utf-8")
    p = subprocess.Popen(cmd, cwd=cwd, stdin=subprocess.PIPE, stdout=log, stderr=subprocess.STDOUT, text=True, encoding="utf-8")
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
(work / f"done-{stage}.txt").write_text("\n".join(lines) + "\n", encoding="utf-8")
