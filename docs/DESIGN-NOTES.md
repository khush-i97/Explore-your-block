# Ollie Ollie Out!: design notes

App name: **Ollie Ollie Out!** (team: Explore your block). Mascot: Ollie the otter.

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

## Kids: inside by default, outside with a grown-up's OK

- Inside games (no camera, no location): Color hunt ("Find something red!"), Shape safari ("Find something round!"), Ollie's riddles ("I'm soft and you sleep on me").
- "Can we go outside?" → the grown-up approves on their phone (our own approval step; k-ID has no "go outside" permission) → Nature bingo: a bird in a tree, a yellow flower, a big leaf, a cloud animal, a dog on a walk, a butterfly. Location only counts inside a play zone and is never shared.

## Family mode (adults)

A "Just me | Family" switch on the adult home. "Who's with you?" asks only the kids' ages (no accounts for them). Family mode swaps to family-friendly spots and searches and can start Ollie's sticker hunt for the kids on the parent's phone.

## No alcohol for kids and teens

Kid and teen spots never include places that sell alcohol. Anything we can't confirm stays adult-only. In the real app, Google Places' serves-beer and serves-wine flags can do this automatically.

## FastSpring: local discounts

- **Block Pass** (adults, $4.99/month placeholder): deals at local small businesses, shown as deal pins on the map and a QR code at the counter.
- **Teen Pass** ($2.99/month placeholder): teen-friendly shops only, never anywhere that sells alcohol. Teens ask a parent, who buys it as a gift (k-ID `in-game-purchases` = GUARDIAN).
- **Family Outing Pack:** a one-time group unlock.
- Partner shops in the demo (Mission Boba, Lucky Comics, Pixel Pit Arcade, Sunday Coffee Co., Valencia Vinyl) are made up. No real business has signed up.
- Business model idea: shops pay a monthly listing fee through FastSpring to be featured.

## Google Maps

"Walk there in Google Maps" and whole-route buttons use Google Maps direction links (no key). Embedding a real Google map needs a Maps JavaScript API key restricted to our domains.

## Updates (21 Oct afternoon)

- **Onboarding:** Ollie Ollie Out! splash → "Hi, I'm Ollie! Tell me your age" (swipe dial) → k-ID result → lock (kid none, teen PIN, adult Face ID/PIN) → teen/adult get a 4-card "What you can do" intro → home with a "Start here" 3-step checklist.
- **Ask Ollie (typed AI chat):** teens and adults type what they want ("date night idea", "cheap eats"); Ollie answers with real spot cards → Add to my plan → Start or Google Maps. k-ID `ai-chat`: Lena (14, Germany) needs a parent's OK; kids have no free typing. Phone numbers and addresses are hidden. Teen answers never include places that sell alcohol. Ollie pops up above the chat box.
- **Game loop for teens/adults:** gift drops at spots → spot challenge (photo challenge or true trivia) → 3 cards flip (sticker, story card, deal) → 12-sticker Mission District set on Finds. Rewards are earned, never bought.
- **Ollie interactions:** hide-and-seek on the kid home ("Ollie Ollie Out!"), Ollie as your map marker, tap Ollie for a reaction, an Ollie helper button by the nav with tips.
- **Look:** in-app screens follow the Alan app style (Figtree, white cards, labelled bottom nav + Ollie button). Brand accent = Ollie's bandana teal `#0F7C80`; no purple and no AI-looking sparkles/glows. Onboarding and big moments keep the bold Bricolage stage screens with a dome-shaped sheet.
- **Map:** OpenFreeMap vector map restyled to white streets, green parks and blue water (no key). Embedding Google Maps needs a Maps JavaScript API key; "Walk there in Google Maps" links work now.

## Partners

- **k-ID:** age, location, parent consent, every permission, and the group's strictest rules.
- **Inworld:** Ollie talks as a live guide, and his tone changes by age and group.
- **Modulate:** voice input ("What can we all do?"), emotion reading to rank spots, and redaction of kids' personal details.
- **FastSpring:** the Family Outing Pack. Adults buy, teens ask a parent, kids never see it.

## Design system (short)

- Fonts: Bricolage Grotesque (headlines, condensed 78%) + Nunito (body).
- Colors: ink `#1F2030`, paper `#F5F0E8`, cobalt `#1E7BD8`, Ollie teal `#0F7C80`, sunny yellow `#FFC83D`, mint `#22B88A`, hopscotch pink `#FF6F91`, Ollie fur `#C98552`.
- Big moments use "stage" screens: a solid color, a dome, Ollie on top, one big word, one white button.
- Ollie: `prototype/assets/ollie.js` (`<ollie-otter mood="idle|wave|search|cheer|sleep">`, plus `talking`).
- Navigation: a floating bottom pill with 4 icons (Home, Map, Finds, Me).

## Real data and credits

Real places in San Francisco's Mission District: Dolores Park, Helen Diller Playground, Bi-Rite Creamery, Tartine Bakery, Ritual Coffee Roasters, Clarion Alley, Roxie Theater, Foreign Cinema, Mission Dolores. No ratings, hours or deals are made up for real businesses. The Family Outing Pack price is a placeholder.

Photos via Wikimedia Commons: Mission Dolores by David Ohmer (CC BY 2.0), Dolores Park by Alexwennerberg (CC0), Golden Fire Hydrant by AccidentalLichens (CC BY-SA 4.0). Map tiles © Esri, HERE, Garmin and OpenStreetMap contributors.
