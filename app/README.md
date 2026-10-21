# Explore Your Block

One neighborhood outing app that reshapes for whoever is looking: kid spots for kids, hangouts for teens, a full planner for adults, and for a mixed group only the spots that work for everyone, under the youngest person's k-ID rules.

Build for Everyone hackathon (Google × k-ID), Games track.

- Visual prototype (reference for every screen): https://explore-your-block.vercel.app/prototype.html
- k-ID setup notes: https://explore-your-block.vercel.app/kid-handoff.html

## Run it

```sh
npm install
cp .env.example .env.local   # then fill in VITE_KID_PUBLISHABLE_KEY
npm run dev
```

Add `?j=US-CA` or `?j=DE` to the URL to pin the country for a demo. Without it, k-ID works out the country from the IP.

## How it fits together

- `src/App.tsx`: React shell. `KidCoreProvider` → `KidSessionProvider` → our welcome screen, then k-ID's capture pieces (country, age, ask an adult). Our big screens fill k-ID's pending, prohibited, fail and error states. On pass, k-ID's permissions become the rules that drive the prototype screens.
- `public/proto/proto.js` + `proto.css`: the prototype's screens (the same code as `prototype.html` on the design site). Exposed as `window.EYB`.
- `public/assets/ollie.js`: Ollie, the animated otter (`<ollie-otter mood="…">`).
- `vendor/k-id-core-web.tgz`: the k-ID SDK.

## Back end (Vercel functions in `/api`)

| Endpoint | Partner | Status |
| --- | --- | --- |
| `POST /api/kid/claim` | k-ID | Stub: needs the `/client/claim` URL from the k-ID helpers |
| `POST /api/ollie/speak` | Inworld | Stub: text → Ollie's voice |
| `POST /api/voice/listen` | Modulate | Stub: voice → text + emotion + redaction |
| `POST /api/pack/webhook` | FastSpring | Stub: verify signature, unlock the pack |
| `GET /api/spots?members=Mia:8,Lena:14,Sam:32` | ours | Working: shared spots + youngest's rules |

## Keys

Put keys in Vercel → Settings → Environment Variables (names in `.env.example`). For local runs use `.env.local`, which git ignores. Only `VITE_KID_PUBLISHABLE_KEY` is safe in the browser; everything else stays on the server. Never commit or paste keys.
