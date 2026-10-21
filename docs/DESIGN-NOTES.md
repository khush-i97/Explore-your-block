# Explore Your Block: design notes

One neighborhood outing app that reshapes for whoever is looking: kid spots for kids, hangouts for teens, a full planner for adults. For a mixed group, it shows only the spots that work for everyone, under the youngest person's k-ID rules.

**Live links**
- Clickable prototype: https://explore-your-block.vercel.app/prototype.html
- Ollie (the mascot) and his moods: https://explore-your-block.vercel.app/ollie.html
- k-ID handoff for coders: https://explore-your-block.vercel.app/kid-handoff.html
- Build plan: https://explore-your-block.vercel.app/build-plan.html
- React app with the real k-ID SDK: https://explore-your-block-app.vercel.app

## What's in this repo

| Folder | What it is |
| --- | --- |
| `prototype/` | The visual prototype and design pages (plain HTML, CSS, JS). Open `prototype/prototype.html` in a browser. **This is the latest design.** |
| `app/` | React + Vite app that wraps the prototype screens in the real k-ID SDK, plus `/api` Vercel functions (k-ID claim, Inworld, Modulate, FastSpring, group spots). See `app/README.md`. |
| `docs/` | The build plan and k-ID handoff as PDFs, plus these notes. |

`app/public/proto/proto.js` is an earlier copy of the prototype screens. Re-copy from `prototype/prototype.html` to pick up group mode, voice, the pack and profiles.

The k-ID SDK file (`k-id-core-web.tgz`) is **not** committed because this repo is public. Download it from the k-ID participant instructions and put it in `app/vendor/`.

## Who sees what

| | Kid (Mia, 8) | Teen (Leo / Lena, 14) | Adult (Sam, 32) |
| --- | --- | --- | --- |
| Spots | Playground, park, ice cream, plus a sticker hunt | Hangouts: park hill, café, murals, movies | Full planner: history, bakery, movies, dinner |
| Home | Drawn street, big Ollie | Evening street, Ollie in the scene | Real map first |
| Prove a find | Tap "I found it!" + Ollie's quiz (no camera) | Photo, AI check | Photo, AI check |
| Profile lock | None | 4-digit PIN | Face ID or PIN |
| Sharing / buying | Hidden | Per k-ID (Germany: a parent's OK) | On |

## Onboarding and profiles

1. Pick your age (swipe dial).
2. k-ID checks the age against where you are and sets the experience (kid, teen or adult).
3. Lock by age: kid none, teen a PIN, adult Face ID or a PIN.
4. One profile on the phone: the app opens straight into it. "Add profile" is on the Me tab.
5. Two or more profiles: the app opens on "Who's exploring?". Tap a profile, unlock it with its own lock, and enter that experience. Each profile has its own k-ID check.

The locks protect older profiles: a kid on a family phone can't open a teen's or a parent's profile.

## Group mode

Pick who's going. The app shows only the spots that suit everyone and follows the strictest k-ID rules in the group (usually the youngest): location sharing off, chat filtered, no buying for kids. An adult buys a Family Outing Pack on their own phone (FastSpring), and it unlocks for the group.

## Partners

- **k-ID:** age, location, parent consent, every permission, and the group's strictest rules.
- **Inworld:** Ollie talks as a live guide, and his tone changes by age and group.
- **Modulate:** voice input ("What can we all do?"), emotion reading to rank spots, and redaction of kids' personal details.
- **FastSpring:** the Family Outing Pack. Adults buy, teens ask a parent, kids never see it.

## Design system (short)

- Fonts: Bricolage Grotesque (headlines, condensed 78%) + Nunito (body).
- Colors: ink `#1F2030`, paper `#F5F0E8`, chalk blue `#4C6FFF`, sunny yellow `#FFC83D`, mint `#22B88A`, hopscotch pink `#FF6F91`, Ollie fur `#C98552`.
- Big moments use "stage" screens: a solid color, a dome, Ollie on top, one big word, one white button.
- Ollie: `prototype/assets/ollie.js` (`<ollie-otter mood="idle|wave|search|cheer|sleep">`, plus `talking`).
- Navigation: a floating bottom pill with 4 icons (Home, Map, Finds, Me).

## Real data and credits

Real places in San Francisco's Mission District: Dolores Park, Helen Diller Playground, Bi-Rite Creamery, Tartine Bakery, Ritual Coffee Roasters, Clarion Alley, Roxie Theater, Foreign Cinema, Mission Dolores. No ratings, hours or deals are made up for real businesses. The Family Outing Pack price is a placeholder.

Photos via Wikimedia Commons: Mission Dolores by David Ohmer (CC BY 2.0), Dolores Park by Alexwennerberg (CC0), Golden Fire Hydrant by AccidentalLichens (CC BY-SA 4.0). Map tiles © Esri, HERE, Garmin and OpenStreetMap contributors.
