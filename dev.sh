#!/usr/bin/env bash
# Runs the app locally: Python back end on :8000, React front end on :5173 (proxies /api to the back end).
# Usage: ./dev.sh        then open http://localhost:5173  (or http://localhost:5173/?demo to skip k-ID)
set -euo pipefail
cd "$(dirname "$0")"

# back end: venv on first run (Python 3.10+; Homebrew's 3.14 can't make venvs with pip, so prefer 3.13)
if [ ! -x backend/.venv/bin/uvicorn ]; then
  PY=$(command -v python3.13 || command -v python3.12 || command -v python3)
  echo "Setting up backend/.venv with $PY"
  "$PY" -m venv backend/.venv
  backend/.venv/bin/pip install -q -r backend/requirements.txt
fi

# front end
if [ ! -f app/vendor/k-id-core-web.tgz ]; then
  echo "Missing app/vendor/k-id-core-web.tgz (the k-ID SDK isn't in git). Ask the team for it." >&2
  exit 1
fi
[ -d app/node_modules ] || (cd app && npm install)
[ -f app/.env ] || [ -f app/.env.local ] || echo "Note: no app/.env, so k-ID is off. Use http://localhost:5173/?demo"

trap 'kill 0' EXIT
(cd backend && .venv/bin/uvicorn main:app --reload --port 8000) &
(cd app && npm run dev -- --strictPort) &
wait
