"""Copy the prototype's screens into the React app.

prototype/prototype.html is the design source. This pulls its <style> block into
app/public/proto/proto.css and its screen code (everything above the demo console)
into app/public/proto/proto.js, exposed as window.EYB, and copies prototype/assets.

Run after every prototype update:  python3 app/scripts/sync_proto.py
"""
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRC = ROOT / "prototype" / "prototype.html"
OUT = ROOT / "app" / "public" / "proto"
ASSETS_SRC = ROOT / "prototype" / "assets"
ASSETS_OUT = ROOT / "app" / "public" / "assets"

# what the React shell (src/App.tsx) reads from window.EYB
EXPORTS = ["Phone", "PLAYERS", "RULES", "KPERMS", "PLACES", "AGES", "FOR_BAND", "HUNT", "PARTNERS",
           "ollieAnswer", "redact", "stageScreen"]
CONSOLE_MARK = "/* ---------- console ---------- */"


def main() -> None:
    html = SRC.read_text(encoding="utf-8")

    style = re.search(r"<style>\n(.*?)</style>", html, re.S)
    script = re.search(r"<body>.*?<script>\n(.*?)</script>", html, re.S)
    if not style or not script:
        raise SystemExit("Couldn't find the <style> or <script> block in prototype.html")
    code = script.group(1)
    if CONSOLE_MARK not in code:
        raise SystemExit(f"Couldn't find {CONSOLE_MARK!r}; the prototype's layout changed")
    code = code.split(CONSOLE_MARK)[0].rstrip()

    missing = [n for n in EXPORTS if not re.search(rf"\b(const|let|class|function)\s+{n}\b", code)]
    if missing:
        raise SystemExit(f"prototype.html no longer defines: {', '.join(missing)}")

    # CSS urls resolve against the stylesheet (/proto/proto.css), not the page, so point them up a level
    css = re.sub(r"url\((['\"]?)assets/", r"url(\1../assets/", style.group(1))

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "proto.css").write_text("/* Generated from prototype/prototype.html by app/scripts/sync_proto.py. Don't edit. */\n"
                                   + css, encoding="utf-8")
    (OUT / "proto.js").write_text(
        "/* Generated from prototype/prototype.html by app/scripts/sync_proto.py. Don't edit. Classic script: exposes window.EYB. */\n\n"
        + code + "\n\n/* ---------- exports for the React shell ---------- */\n"
        + f"window.EYB = {{ {', '.join(EXPORTS)} }};\n",
        encoding="utf-8")

    ASSETS_OUT.mkdir(parents=True, exist_ok=True)
    copied = 0
    for f in ASSETS_SRC.iterdir():
        if f.is_file() and not f.name.startswith("."):
            shutil.copy2(f, ASSETS_OUT / f.name)
            copied += 1
    print(f"proto.css + proto.js written to {OUT.relative_to(ROOT)}, {copied} assets copied")


if __name__ == "__main__":
    main()
