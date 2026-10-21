# Explore Your Block: API contract

What each screen in the prototype needs from the back end. **Draft v1:** new screens may add endpoints, but the existing ones should stay the same. Change any format you like and the front end will follow. A working FastAPI example that follows this contract is available from Michelle if it helps.

Permission values everywhere: `"yes"` (on), `"ask"` (needs a parent's OK, k-ID `managedBy: GUARDIAN`), `"no"` (off or prohibited). Bands: `kid` (under 13), `teen` (13 to 17), `adult` (18 and over).

| Screen | Call | Request | Response |
| --- | --- | --- | --- |
| After the k-ID age gate | `POST /kid/claim` | `{ "claim_token": "…" }` (from the SDK's `onClaim`) | `{ "session": { "age", "band", "jurisdiction", "permissions": { "camera-access": "yes", … } } }` |
| Home (per age) | `GET /spots?band=teen&family=false` | | `{ "spots": [ { "id", "name", "cat", "lat", "lng", "ages": [...] } ] }` |
| Family mode | `GET /spots?band=adult&family=true` | | family-friendly spots only |
| Group outing | `POST /group/spots` | `{ "members": [ { "name", "age", "jurisdiction", "permissions": {…} } ] }` | `{ "spots": [...], "youngest": { "name", "age", "jurisdiction" }, "rules": { "in-game-purchases": "no", "real-time-location-sharing": "no", … } }`. The strictest value wins. |
| Photo challenge | `POST /photo/check` (multipart) | `spot_id`, `image` | `{ "match": true, "confidence": 0.93, "spot": {…} }` |
| Ollie talks | `POST /ollie/speak` | `{ "text", "band", "group" }` | `audio/mpeg` (Inworld). Until wired: `{ "mock": true, "text" }` |
| "What can we all do?" | `POST /voice/ask` | JSON `{ "text", "band", "group" }` or multipart with `audio` (Modulate) | `{ "transcript", "emotion", "reply", "spots": [...] }` |
| Block Pass / Teen Pass | `GET /deals?band=teen` | | `{ "pass": { "id", "name", "price", "interval" }, "partners": [ { "name", "deal", "cat" } ] }`. Teens only get teen-friendly shops; kids get none. |
| Buy a pass or pack | `POST /checkout` | `{ "product": "block-pass" \| "teen-pass" \| "family-pack", "band", "can_buy": "yes" \| "ask" \| "no" }` | `{ "checkout_url" }`, or `{ "needs_parent": true }` when `can_buy` is `"ask"`, or 403 when it's `"no"` |
| FastSpring webhook | `POST /fastspring/webhook` | FastSpring event | `{ "ok": true }` after unlocking the purchase |
| Status | `GET /health` | | `{ "ok": true, "keys": { "kid", "inworld", "modulate", "fastspring" } }` |

## Rules the back end enforces (not just the screens)

- Kid and teen spots never include places that sell alcohol. Anything unconfirmed stays adult-only. (Google Places' `servesBeer` and `servesWine` can automate this.)
- Kids: no camera, no purchases, location only inside a play zone and never shared.
- Group: a spot is shown only if it suits every member; each permission takes the strictest member's value; with a kid in the group, location sharing is off.
- Stickers and rewards are earned by visiting, never sold. No paid random rewards.
- Secret keys (`KID_SECRET_KEY`, `INWORLD_API_KEY`, `MODULATE_API_KEY`, `FASTSPRING_API_KEY`, `FASTSPRING_WEBHOOK_SECRET`) live only in the server's environment.

## Still needed from partners

- k-ID: the exact URL and auth header for redeeming a `claimToken` at `/client/claim`.
- Inworld: the voice ID for Ollie.
- FastSpring: product paths for `block-pass`, `teen-pass` and `family-pack` in the sandbox store.
