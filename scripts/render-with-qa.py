#!/usr/bin/env python3
"""Two-attempt Remotion render and encoded-output QA, not an infinite loop.

Usage:
  python3 scripts/render-with-qa.py --composition WawasanSeamlessLoop \
      --output out/wawasan-seamless-loop.mp4 --frames 120 --seam
On failure, emits distinct per-attempt logs and exits nonzero. On success
preserves a quality JSON report. This never edits the original movie.
"""
from __future__ import annotations
import argparse
import json
import subprocess
import sys
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
PROJECT=ROOT/"videos"/"wawasan-authentic"
CHECKER=ROOT/"scripts"/"verify-render-loop.py"

def main() -> int:
    ap=argparse.ArgumentParser()
    ap.add_argument("--composition",default="WawasanSeamlessLoop")
    ap.add_argument("--output",default="out/wawasan-seamless-loop.mp4")
    ap.add_argument("--frames",type=int,default=120)
    ap.add_argument("--fps",type=int,default=30)
    ap.add_argument("--width",type=int,default=1080)
    ap.add_argument("--height",type=int,default=1920)
    ap.add_argument("--seam",action="store_true")
    ap.add_argument("--expected-audio",choices=("none","optional","required"),default="none")
    ap.add_argument("--attempts",type=int,default=2)
    args=ap.parse_args()
    output=Path(args.output)
    assert not output.is_absolute() and output.parts[0]=="out" and output.suffix==".mp4", \
      "Output must be a relative MP4 inside out/"
    assert 1<=args.attempts<=3,"Retry count must be finite and <=3"
    assert args.frames>=4 and args.fps>0
    report_dir=PROJECT/"out"/"loop-render-qc"
    report_dir.mkdir(parents=True,exist_ok=True)
    target=PROJECT/output
    target.parent.mkdir(parents=True,exist_ok=True)
    report=report_dir/"qa-report.json"

    render=["npx","remotion","render","src/index.ts",args.composition,
            str(output),"--codec=h264","--crf=19","--concurrency=2",
            "--gl=swangle"]
    qa=[sys.executable,str(CHECKER),"--input",str(output),
        "--fps",str(args.fps),"--frames",str(args.frames),
        "--width",str(args.width),"--height",str(args.height),
        "--expected-audio",args.expected_audio,
        "--report",str(report)]
    if args.seam:
        qa.append("--seam")
    for attempt in range(1,args.attempts+1):
        log=report_dir/("attempt-"+str(attempt)+".log")
        target.unlink(missing_ok=True)
        report.unlink(missing_ok=True)
        with log.open("w",encoding="utf-8") as out:
            out.write("Attempt "+str(attempt)+"/"+str(args.attempts)+"\n")
            out.write("Render command: "+json.dumps(render)+"\n")
            out.flush()
            try:
                render_result=subprocess.run(render,cwd=PROJECT,stdout=out,
                    stderr=subprocess.STDOUT,check=False,timeout=780)
            except subprocess.TimeoutExpired:
                out.write("\nRender timed out after 780 seconds.\n")
                render_result=None
            if render_result is not None and render_result.returncode==0:
                out.write("\nEncoding succeeded. Checking decoded output.\n")
                out.flush()
                try:
                    qa_result=subprocess.run(qa,cwd=PROJECT,stdout=out,
                        stderr=subprocess.STDOUT,check=False,timeout=300)
                    if qa_result.returncode==0:
                        out.write("PASSED: all quality gates.\n")
                        print("Successful render on attempt",attempt)
                        print(report.read_text(encoding="utf-8"))
                        return 0
                except subprocess.TimeoutExpired:
                    out.write("\nEncoded-file QA timed out.\n")
            else:
                out.write("\nRemotion render failed.\n")
        print("Attempt",attempt,"did not pass; last log lines:",flush=True)
        lines=log.read_text(encoding="utf-8",errors="replace").splitlines()
        print("\n".join(lines[-18:]),flush=True)
    print("Failed: all "+str(args.attempts)+" attempts failed; see QA logs.",file=sys.stderr)
    return 1

if __name__=="__main__":
    sys.exit(main())
