# Explore-your-block
## Design + prototype

- **Clickable prototype:** https://explore-your-block.vercel.app/prototype.html (source in `prototype/`)
- **Design notes** (who sees what, onboarding + profiles, group mode, partners, design system): [`docs/DESIGN-NOTES.md`](docs/DESIGN-NOTES.md)
- **Build plan** and **k-ID handoff** PDFs: [`docs/`](docs/)
- **React app with the real k-ID SDK:** [`app/`](app/)
- **Python back end (FastAPI, follows [`docs/API.md`](docs/API.md)):** [`backend/`](backend/)

## Run it locally

Needs Node 20+ and Python 3.10+. Put `k-id-core-web.tgz` in `app/vendor/` (not in git) and copy `app/.env.example` to `app/.env` with the k-ID publishable key.

```sh
./dev.sh
```

- http://localhost:5173 is the real flow: k-ID age check, then the app. The key must allow `http://localhost:5173` as an origin in the k-ID portal.
- http://localhost:5173/?demo skips k-ID and lets you switch between Mia (8), Leo (14), Lena (14, Germany), Sam (32) and the family phone.
- http://localhost:8000/docs lists the API. Ask Ollie's answers come from `POST /api/voice/ask`. Partner calls (k-ID claim, Inworld, Modulate, FastSpring) still return mock or 501 answers.

After changing `prototype/prototype.html`, run `python3 app/scripts/sync_proto.py` to copy the new screens into the app.

#test maya test