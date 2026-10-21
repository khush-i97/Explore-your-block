/* Generated from prototype/prototype.html by app/scripts/sync_proto.py. Don't edit. Classic script: exposes window.EYB. */

/* ---------- players + what k-ID returns ---------- */
const PLAYERS = {
  mia:  { id: 'mia',  name: 'Mia',  age: 8,  country: 'US', countryName: 'the US', band: 'kid',   color: '#FF6F91' },
  leo:  { id: 'leo',  name: 'Leo',  age: 14, country: 'US', countryName: 'the US', band: 'teen',  color: '#1E7BD8' },
  lena: { id: 'lena', name: 'Lena', age: 14, country: 'DE', countryName: 'Germany', band: 'teen', color: '#22B88A' },
  sam:  { id: 'sam',  name: 'Sam',  age: 32, country: 'US', countryName: 'the US', band: 'adult', color: '#C98552' },
};
const RULES = {
  mia:  { camera: 'no',  location: 'zones', sharing: 'no',  buying: 'no',  map: 'no',  voice: 'ask', vchat: 'no', ai: 'no' },
  leo:  { camera: 'yes', location: 'yes',   sharing: 'yes', buying: 'ask', map: 'yes', voice: 'yes', vchat: 'yes', ai: 'yes' },
  lena: { camera: 'yes', location: 'yes',   sharing: 'ask', buying: 'ask', map: 'yes', voice: 'yes', vchat: 'ask', ai: 'ask' },
  sam:  { camera: 'yes', location: 'yes',   sharing: 'yes', buying: 'yes', map: 'yes', voice: 'yes', vchat: 'yes', ai: 'yes' },
};
// the permissions we declare to k-ID, and which rule each one reads
const KPERMS = [
  ['camera-access', 'Camera', 'camera', 'ph-camera'],
  ['ai-media-upload', 'AI photo check', 'camera', 'ph-image-square'],
  ['photo-video-sharing', 'Share finds', 'sharing', 'ph-share-network'],
  ['in-game-purchases', 'Buying (FastSpring)', 'buying', 'ph-shopping-bag'],
  ['ai-chat', 'Ask Ollie chat (Inworld)', 'ai', 'ph-chat-circle-dots'],
  ['ai-voice-mode', 'Talk to Ollie (Inworld)', 'voice', 'ph-microphone'],
  ['voice-chat', 'Voice notes (Modulate)', 'vchat', 'ph-waveform'],
];
const NOTES = {
  mia: 'Under 13 in the US: a grown-up approves the account first. No camera, no sharing, no real map. Location only counts inside play zones.',
  leo: '14 in the US: real map, camera and sharing on. Buying needs a parent.',
  lena: '14 in Germany: the digital consent age is 16, so sharing waits for a parent\'s OK.',
  sam: 'Adult: full outing planner, real map, group outings, and buying packs through FastSpring.',
};

/* ---------- real places (Mission District, San Francisco) ---------- */
const PLACES = {
  md:      { name: 'Mission Dolores', lat: 37.76439, lng: -122.42703, img: 'assets/mission-dolores.jpg', cat: 'History', color: '#9C5A3C', icon: 'ph-church',
             fact: 'Finished in 1791, the old adobe chapel is the oldest intact building in San Francisco. It came through the 1906 earthquake standing.' },
  park:    { name: 'Dolores Park', lat: 37.75965, lng: -122.42608, img: 'assets/dolores-park.jpg', cat: 'Park', color: '#4F7A5E', icon: 'ph-tree' },
  hydrant: { name: 'The Golden Fire Hydrant', lat: 37.7584, lng: -122.4281, img: 'assets/golden-hydrant.jpg', cat: 'History', color: '#C9A23A', icon: 'ph-drop',
             story: 'In 1906, as fire spread toward the Mission, most hydrants in the city were dry. This one still worked. Firefighters used it to stop the fire at 20th Street and save the neighborhood. Every April 18, it gets a fresh coat of gold paint.' },
  clarion: { name: 'Clarion Alley murals', lat: 37.7630, lng: -122.4215, img: 'assets/clarion.jpg', cat: 'Art', color: '#FF6F91', icon: 'ph-paint-brush-broad' },
};
Object.assign(PLACES, {
  playground: { name: 'Helen Diller Playground', lat: 37.7601, lng: -122.4273, img: 'assets/playground.jpg', cat: 'Playground', color: '#1E7BD8', icon: 'ph-balloon' },
  birite:  { name: 'Bi-Rite Creamery', lat: 37.7616, lng: -122.4258, img: null, cat: 'Ice cream', color: '#FF6F91', icon: 'ph-ice-cream' },
  tartine: { name: 'Tartine Bakery', lat: 37.7614, lng: -122.4241, img: 'assets/tartine.jpg', cat: 'Bakery', color: '#C98552', icon: 'ph-bread' },
  ritual:  { name: 'Ritual Coffee Roasters', lat: 37.7564, lng: -122.4214, img: null, cat: 'Café', color: '#8A5638', icon: 'ph-coffee' },
  roxie:   { name: 'Roxie Theater', lat: 37.7650, lng: -122.4228, img: 'assets/roxie.jpg', cat: 'Movies', color: '#E5484D', icon: 'ph-film-slate' },
  foreign: { name: 'Foreign Cinema', lat: 37.7564, lng: -122.4193, img: null, cat: 'Dinner', color: '#1F2030', icon: 'ph-fork-knife' },
});
// who each spot suits (k-ID band); group mode keeps only spots that suit everyone
// kid + teen spots never include places that sell alcohol; anything we can't confirm stays adult-only
const AGES = { park: ['kid', 'teen', 'adult'], playground: ['kid', 'adult'], birite: ['kid', 'teen', 'adult'], md: ['kid', 'teen', 'adult'],
  ritual: ['teen', 'adult'], clarion: ['teen', 'adult'], tartine: ['adult'], roxie: ['adult'], foreign: ['adult'] };
const FOR_BAND = { kid: ['playground', 'birite', 'park'], teen: ['park', 'ritual', 'clarion', 'birite'], adult: ['md', 'tartine', 'roxie', 'foreign'] };
const BAND_ORDER = { kid: 0, teen: 1, adult: 2 };
const PROMPTS = { teen: ['Chill spot to hang with friends', 'Cheap eats under $10', 'Best photo spots', 'Somewhere to study'],
  adult: ['Date night idea', 'Rainy Saturday plans', 'Quiet place to read', 'Something new nearby'] };
function ollieAnswer(text, band, ctx) {
  const t = text.toLowerCase(); let keys, reply;
  if (ctx.family) { keys = ['playground', 'birite', 'park']; reply = 'Easy family plan: the playground first, then Bi-Rite for ice cream, then a picnic in Dolores Park.'; }
  else if (ctx.group) { keys = ['park', 'birite', 'md']; reply = 'These work for everyone in your group, and they follow the youngest person\'s rules.'; }
  else if (band === 'adult') {
    if (/date|romantic|dinner/.test(t)) { keys = ['foreign', 'roxie', 'tartine']; reply = 'Dinner at Foreign Cinema, a film at the Roxie, and pastries at Tartine in the morning.'; }
    else if (/rain|indoor|wet/.test(t)) { keys = ['roxie', 'md', 'tartine']; reply = 'Stay dry: a matinee at the Roxie, the old mission, then coffee and bread at Tartine.'; }
    else if (/quiet|read|calm|work/.test(t)) { keys = ['ritual', 'md']; reply = 'Ritual for a coffee and a corner seat, then a quiet walk past Mission Dolores.'; }
    else { keys = ['md', 'tartine', 'roxie']; reply = 'Here\'s a classic Mission evening: history, bread, then a movie.'; }
  } else {
    if (/cheap|eat|food|\$|snack/.test(t)) { keys = ['birite', 'ritual']; reply = 'Ice cream at Bi-Rite and a drink at Ritual. Easy on the wallet.'; }
    else if (/photo|pic|insta|mural|art/.test(t)) { keys = ['clarion', 'park']; reply = 'Clarion Alley\'s murals, then the top of Dolores Park at sunset for the skyline.'; }
    else if (/study|homework|work/.test(t)) { keys = ['ritual', 'park']; reply = 'Ritual has tables to study at, and the park is right there for a break.'; }
    else { keys = ['park', 'ritual', 'birite']; reply = 'Dolores Park is the spot. Grab a coffee at Ritual or ice cream at Bi-Rite on the way.'; }
  }
  keys = keys.filter(k2 => AGES[k2].includes(band)); // never suggest a spot k-ID's band can't go (no alcohol for teens)
  return { keys, reply };
}
const redact = (t) => { let hid = []; let out = t.replace(/\b(\+?\d[\d\s().-]{7,}\d)\b/g, () => { hid.push('phone number'); return '•••'; })
  .replace(/\b\d{2,5}\s+[A-Za-z]+\s+(st|street|ave|avenue|rd|road|blvd)\b/gi, () => { hid.push('address'); return '•••'; }); return { out, hid }; };
const SET = [['ph-sun-horizon', 'Skyline', 'rare'], ['ph-drop', 'Golden Hydrant', 'rare'], ['ph-church', 'Old Mission'], ['ph-ice-cream', 'Scoop'], ['ph-coffee', 'Coffee run'],
  ['ph-paint-brush-broad', 'Mural'], ['ph-tree-palm', 'Palm row'], ['ph-film-slate', 'Movie night'], ['ph-bicycle', 'Bike lane'], ['ph-music-notes', 'Street music'], ['ph-bus', 'Muni ride'], ['ph-star', 'Local legend', 'rare']];
const SET_COLORS = ['#FFC83D', '#C9A23A', '#9C5A3C', '#FF6F91', '#8A5638', '#E8663D', '#4F7A5E', '#E5484D', '#22B88A', '#0F7C80', '#1E7BD8', '#FFC83D'];
const TRIVIA = {
  teen: { q: 'Why is the hydrant at 20th & Church painted gold?', a: [['It helped stop the 1906 fire', true], ['It is made of real gold'], ['It is the city\'s newest hydrant'], ['A movie was filmed there']],
          fact: 'In 1906 most hydrants were dry. This one still worked, and it helped save the Mission. It gets a fresh coat of gold every April 18.' },
  adult: { q: 'When was the old Mission Dolores chapel finished?', a: [['1776'], ['1791', true], ['1850'], ['1906']],
           fact: 'Finished in 1791, the adobe chapel is the oldest intact building in San Francisco. It came through the 1906 earthquake standing.' },
};
const INSIDE = [
  { id: 'color', label: 'Color hunt', icon: 'ph-palette', color: '#E5484D', where: 'In your room', title: 'Find something red!', hint: ['#E5484D', '#FF8A80', '#B71C1C'],
    quiz: [['ph-apple-logo', 'An apple'], ['ph-book', 'A book'], ['ph-sneaker', 'A shoe'], ['ph-car-profile', 'A toy car']] },
  { id: 'shape', label: 'Shape safari', icon: 'ph-circle', color: '#1E7BD8', where: 'In the kitchen', title: 'Find something round!', shapes: ['ph-circle', 'ph-circle-half', 'ph-record'],
    quiz: [['ph-clock', 'A clock'], ['ph-cookie', 'A cookie'], ['ph-basketball', 'A ball'], ['ph-coin', 'A coin']] },
  { id: 'riddle', label: "Ollie's riddle", icon: 'ph-question', color: '#FFC83D', where: "Ollie's riddle", title: '"I\'m soft, and you<br>sleep on me!"', riddle: true,
    quiz: [['ph-bed', 'A pillow', true], ['ph-fork-knife', 'A fork'], ['ph-sneaker', 'A shoe'], ['ph-coffee', 'A cup']] },
];
const BINGO = [['ph-bird', 'A bird in a tree', '#1E7BD8'], ['ph-flower', 'A yellow flower', '#FFC83D'], ['ph-leaf', 'A leaf bigger than your hand', '#22B88A'],
  ['ph-cloud', 'A cloud shaped like an animal', '#7FB6E8'], ['ph-dog', 'A dog on a walk', '#C98552'], ['ph-butterfly', 'A butterfly', '#FF6F91']];
// made-up partner shops for the demo (no real business has signed up)
const PARTNERS = [
  { id: 'boba', name: 'Mission Boba', deal: '20% off', cat: 'Boba', icon: 'ph-bubble', color: '#F2A65A', lat: 37.7598, lng: -122.4213, teen: true },
  { id: 'comics', name: 'Lucky Comics', deal: '10% off', cat: 'Comics', icon: 'ph-book-open-text', color: '#FF6F91', lat: 37.7618, lng: -122.4219, teen: true },
  { id: 'arcade', name: 'Pixel Pit Arcade', deal: '2 free tokens', cat: 'Arcade', icon: 'ph-game-controller', color: '#1E7BD8', lat: 37.7577, lng: -122.4199, teen: true },
  { id: 'coffee', name: 'Sunday Coffee Co.', deal: '15% off', cat: 'Coffee', icon: 'ph-coffee', color: '#8A5638', lat: 37.7606, lng: -122.4222, teen: true },
  { id: 'vinyl', name: 'Valencia Vinyl', deal: '10% off', cat: 'Records', icon: 'ph-vinyl-record', color: '#1F2030', lat: 37.7589, lng: -122.4216, teen: false },
];
const passPartners = (teen) => PARTNERS.filter(x => teen ? x.teen : true);
// the cozy inside-the-house scene for kids
const house = () => `<svg viewBox="0 0 320 330" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <rect width="320" height="330" fill="#FFE9D6"/><rect y="250" width="320" height="80" fill="#E8C9A6"/><rect y="246" width="320" height="6" fill="#D9B48C"/>
  <rect x="190" y="70" width="104" height="110" rx="10" fill="#fff"/><rect x="198" y="78" width="88" height="94" rx="6" fill="#BFE3FF"/><circle cx="262" cy="104" r="12" fill="#FFE08A"/><ellipse cx="226" cy="140" rx="20" ry="7" fill="#fff"/><rect x="240" y="78" width="4" height="94" fill="#fff"/><rect x="198" y="123" width="88" height="4" fill="#fff"/>
  <rect x="24" y="96" width="96" height="8" rx="3" fill="#C98552"/><rect x="30" y="66" width="12" height="30" rx="2" fill="#FF6F91"/><rect x="44" y="72" width="10" height="24" rx="2" fill="#1E7BD8"/><rect x="56" y="62" width="14" height="34" rx="2" fill="#22B88A"/><circle cx="98" cy="84" r="12" fill="#FFC83D"/>
  <rect x="24" y="150" width="96" height="8" rx="3" fill="#C98552"/><path d="M40 150 q 10 -30 24 0 z" fill="#5FBF7F"/><rect x="46" y="140" width="12" height="10" fill="#E8663D"/><rect x="80" y="122" width="26" height="28" rx="4" fill="#fff"/><path d="M84 142 l7 -9 l6 7 l4 -4 l5 6 z" fill="#9FE0C8"/>
  <ellipse cx="160" cy="292" rx="120" ry="22" fill="#FF8FA8" opacity=".55"/><ellipse cx="160" cy="292" rx="84" ry="14" fill="#FFD2B8" opacity=".7"/>
</svg>`;
// Google Maps directions (no API key needed): one stop, or a walking route through several
const gmapsDir = (keys) => { const pts = keys.map(k2 => `${PLACES[k2].lat},${PLACES[k2].lng}`); const dest = pts.pop();
  return `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${dest}${pts.length ? `&waypoints=${encodeURIComponent(pts.join('|'))}` : ''}`; };
const FAMILY = ['playground', 'birite', 'park', 'md'];
const GROUP = ['mia', 'lena', 'sam'];
const groupInfo = (ids) => {
  const youngest = ids.map(id => PLAYERS[id]).sort((a, b) => a.age - b.age)[0];
  const spots = Object.keys(AGES).filter(k => ids.every(id => AGES[k].includes(PLAYERS[id].band)));
  return { youngest, spots, rules: RULES[youngest.id] };
};
const WALK = ['md', 'tartine', 'roxie', 'foreign'];
const WALK_SUB = ['History', 'Bakery, 0.2 mi', 'Movies, 0.3 mi', 'Dinner, 0.6 mi'];
const ROUTE = [[37.76453,-122.42704],[37.76456,-122.42657],[37.76456,-122.42647],[37.76457,-122.42632],[37.76458,-122.42624],[37.76434,-122.42621],[37.76423,-122.4262],[37.76402,-122.42618],[37.76353,-122.42613],[37.76311,-122.42609],[37.76311,-122.42618],[37.76303,-122.42617],[37.76296,-122.42616],[37.76263,-122.42613],[37.7622,-122.42609],[37.76216,-122.42624],[37.7621,-122.42623],[37.76152,-122.42618],[37.76149,-122.42627],[37.76142,-122.42627],[37.76135,-122.42626],[37.76091,-122.42622],[37.7599,-122.42612],[37.75982,-122.42611],[37.75975,-122.42611],[37.75965,-122.4261],[37.75957,-122.42609],[37.7591,-122.42604],[37.75906,-122.42604],[37.75833,-122.42597],[37.75823,-122.42767],[37.75821,-122.42774],[37.75819,-122.42781],[37.75819,-122.42785],[37.75818,-122.42791],[37.75818,-122.42793],[37.75818,-122.42798],[37.75817,-122.4281],[37.7582,-122.4281],[37.7584,-122.42812],[37.7589,-122.42817],[37.7589,-122.42812],[37.75891,-122.42804],[37.75932,-122.4281],[37.7597,-122.42814],[37.7597,-122.42808],[37.75972,-122.42789],[37.75972,-122.42781],[37.75972,-122.42777],[37.75973,-122.42777],[37.75975,-122.42777],[37.75976,-122.42776],[37.75977,-122.42776],[37.75978,-122.42775],[37.75979,-122.42774],[37.75979,-122.42773],[37.7598,-122.42771],[37.7598,-122.42769],[37.75981,-122.42768],[37.75981,-122.42766],[37.75979,-122.42764],[37.75982,-122.42723],[37.75984,-122.42721],[37.75986,-122.42717],[37.75987,-122.42713],[37.75987,-122.42709],[37.75985,-122.42705],[37.75983,-122.42701],[37.75984,-122.4268],[37.75987,-122.42635],[37.75989,-122.42632],[37.7599,-122.42623],[37.7599,-122.42612],[37.75991,-122.42602],[37.75992,-122.42587],[37.75993,-122.42576],[37.75991,-122.42576],[37.75997,-122.42498],[37.75997,-122.42489],[37.75997,-122.42483],[37.76004,-122.42379],[37.76005,-122.4237],[37.76006,-122.42361],[37.76006,-122.42354],[37.76004,-122.42354],[37.76008,-122.42297],[37.76008,-122.42288],[37.76009,-122.42284],[37.76012,-122.42229],[37.76015,-122.42159],[37.76017,-122.42157],[37.76022,-122.42158],[37.76055,-122.42159],[37.76111,-122.42164],[37.76162,-122.42169],[37.76162,-122.42164],[37.76163,-122.42159],[37.76163,-122.42154],[37.76163,-122.42148],[37.76171,-122.42148],[37.76176,-122.42148],[37.76178,-122.4215],[37.7618,-122.4215],[37.76256,-122.42157],[37.76258,-122.42157],[37.76262,-122.42158],[37.76293,-122.42161],[37.76294,-122.42149],[37.76294,-122.42149]];

/* ---------- map style: green parks, blue water, clean white streets (OpenFreeMap, no key) ---------- */
let _mapStyle;
function cleanMapStyle() {
  if (_mapStyle) return _mapStyle;
  _mapStyle = fetch('https://tiles.openfreemap.org/styles/liberty').then(r => r.json()).then(st => {
    st.layers.forEach(l => {
      const id = l.id, pt = l.paint || (l.paint = {});
      if (/^(road|bridge|tunnel)_/.test(id) && l.type === 'line') pt['line-color'] = /casing/.test(id) ? '#DCD8CF' : '#FFFFFF';
      if (l.type === 'background') pt['background-color'] = '#F4F1EA';
      if (/landuse_residential|landcover_ice|landuse_commercial|landuse_retail/.test(id) && l.type === 'fill') pt['fill-color'] = '#F0ECE3';
      if (/^building/.test(id) && l.type === 'fill') pt['fill-color'] = '#E8E3D9';
      if (/^(park|landcover_grass|landcover_wood|landuse_park)/.test(id) && l.type === 'fill') { pt['fill-color'] = '#A6DA94'; pt['fill-opacity'] = 1; }
      if (/^water/.test(id) && l.type === 'fill') pt['fill-color'] = '#86C8EC';
      if (/^(park|landcover|landuse_park)/.test(id) && l.type === 'line') pt['line-color'] = '#8CCB78';
      if (/^poi|^airport/.test(id)) l.layout = Object.assign(l.layout || {}, { visibility: 'none' });
    });
    return st;
  });
  return _mapStyle;
}

/* ---------- drawn street (kids + teen home) ---------- */
const PAL = {
  day:  { sky1:'#BFE3FF', sky2:'#E6F4FF', sun:'#FFE08A', cloudO:.9, b1:'#FFB4A2', b2:'#9CC7EE', roof:'#6FA6DD', b3:'#FFD27A', stripe:'#FF8FA8', b4:'#9FE0C8', win:'#fff', winO:.85, tree:'#5FBF7F', walk:'#E9E3D8', kid:true },
  dusk: { sky1:'#7E8DBB', sky2:'#F3C9A8', sun:'#FFD6A0', cloudO:.35, b1:'#B9826E', b2:'#5F6F96', roof:'#4C5A7E', b3:'#C9A36F', stripe:'#8E5F55', b4:'#7F9E8E', win:'#FFE1A1', winO:.95, tree:'#4F7A5E', walk:'#D8D0C4', kid:false },
};
let sceneId = 0;
const scene = (key) => { const c = PAL[key]; const g = 'sky' + (++sceneId); return `<svg viewBox="0 0 320 330" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
  <defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c.sky1}"/><stop offset=".85" stop-color="${c.sky2}"/></linearGradient></defs>
  <rect width="320" height="330" fill="url(#${g})"/>
  <circle cx="262" cy="${c.kid?58:118}" r="${c.kid?22:26}" fill="${c.sun}" opacity="${c.kid?1:.85}"/>
  <g fill="#fff" opacity="${c.cloudO}"><ellipse cx="70" cy="62" rx="30" ry="11"/><ellipse cx="92" cy="54" rx="20" ry="12"/><ellipse cx="200" cy="96" rx="22" ry="8"/></g>
  <rect x="-6" y="150" width="70" height="120" rx="6" fill="${c.b1}"/><g fill="${c.win}" opacity="${c.winO}"><rect x="8" y="170" width="16" height="20" rx="3"/><rect x="34" y="170" width="16" height="20" rx="3"/><rect x="8" y="204" width="16" height="20" rx="3"/></g>
  <rect x="60" y="120" width="64" height="150" rx="6" fill="${c.b2}"/><path d="M56 124 L92 96 L128 124 Z" fill="${c.roof}"/><g fill="${c.win}" opacity="${c.winO}"><rect x="74" y="146" width="14" height="20" rx="3"/><rect x="98" y="146" width="14" height="20" rx="3"/><rect x="74" y="180" width="14" height="20" rx="3"/><rect x="98" y="180" width="14" height="20" rx="3"/></g>
  <rect x="200" y="136" width="74" height="134" rx="6" fill="${c.b3}"/><g fill="${c.win}" opacity="${c.winO}"><rect x="212" y="152" width="18" height="22" rx="3"/><rect x="242" y="152" width="18" height="22" rx="3"/></g><rect x="200" y="190" width="74" height="10" fill="${c.stripe}"/>
  <rect x="270" y="110" width="60" height="160" rx="6" fill="${c.b4}"/><g fill="${c.win}" opacity="${c.winO}"><rect x="282" y="128" width="14" height="18" rx="3"/><rect x="282" y="160" width="14" height="18" rx="3"/></g>
  <g fill="${c.tree}"><circle cx="150" cy="196" r="26"/><circle cx="176" cy="206" r="20"/></g><rect x="158" y="214" width="6" height="40" fill="#6E5440"/>
  <rect x="-10" y="250" width="340" height="90" fill="${c.walk}"/>
  ${c.kid ? `<g stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"><rect x="22" y="272" width="22" height="22" rx="2"/><rect x="44" y="272" width="22" height="22" rx="2"/><rect x="33" y="294" width="22" height="22" rx="2"/><path d="M250 286 c 10 -14, 26 -14, 34 0"/><circle cx="296" cy="300" r="6"/></g>`
          : `<rect x="186" y="170" width="4" height="84" fill="#3E4258"/><path d="M180 172 h16 l-3 -10 h-10 z" fill="#3E4258"/><circle cx="188" cy="176" r="10" fill="#FFE1A1" opacity=".35"/>`}
</svg>`; };

const HUNT = [
  { icon: 'ph-leaf', color: '#22B88A', at: 'Dolores Park', name: 'A green leaf', hint: ['#22B88A', '#7ED957', '#2E7D32'] },
  { icon: 'ph-heart', color: '#E5484D', at: 'the playground', name: 'Something red', hint: ['#E5484D', '#FF8A80', '#B71C1C'] },
  { icon: 'ph-circle', color: '#1E7BD8', at: 'the playground', name: 'A circle', hint: ['#1E7BD8', '#1E7BD8', '#1E7BD8'] },
  { icon: 'ph-flower', color: '#FF6F91', at: 'Dolores Park', name: 'A flower', hint: ['#FF6F91', '#FFC83D', '#F2A65A'] },
  { icon: 'ph-sun', color: '#FFC83D', at: 'Bi-Rite Creamery', name: 'Something yellow', hint: ['#FFC83D', '#FFE08A', '#F2AE12'] },
];

/* floating props (leaf, star, pin, sparkle) */
const PROP = {
  leaf: '<svg viewBox="0 0 40 40"><path d="M8 32 C 6 14, 20 4, 34 6 C 36 22, 24 34, 8 32 Z" fill="#5FD39A"/><path d="M8 32 C 16 24, 22 18, 30 10" stroke="#2E9C68" stroke-width="2.5" fill="none" stroke-linecap="round"/></svg>',
  star: '<svg viewBox="0 0 40 40"><path d="M20 3 l5 11 12 1.5 -9 8.2 2.6 12 -10.6 -6 -10.6 6 2.6 -12 -9 -8.2 12 -1.5 z" fill="#FFC83D" stroke="#F2A900" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  pin: '<svg viewBox="0 0 40 40"><path d="M20 37 C 10 25, 7 20, 7 14 a13 13 0 0 1 26 0 c 0 6 -3 11 -13 23 z" fill="#FF6F91"/><circle cx="20" cy="14" r="5" fill="#fff"/></svg>',
  spark: '<svg viewBox="0 0 40 40"><path d="M20 2 L24 16 L38 20 L24 24 L20 38 L16 24 L2 20 L16 16 Z" fill="#fff"/></svg>',
  heart: '<svg viewBox="0 0 40 40"><path d="M20 35 C 6 25, 3 17, 6 11 a8 8 0 0 1 14 -1 a8 8 0 0 1 14 1 c 3 6 0 14 -14 24 z" fill="#FF6F91"/></svg>',
};
const floaties = (list) => list.map(([k, x, y, w, r, d]) => `<div class="floaty" style="left:${x}%;top:${y}%;width:${w}px;height:${w}px;--r:${r}deg;animation-delay:${d || 0}s">${PROP[k]}</div>`).join('');
const twinkles = (n) => Array.from({ length: n }, (_, i) => `<i class="twinkle" style="left:${(i * 53) % 100}%;top:${(i * 29) % 55}%;animation-delay:${(i % 7) * .3}s"></i>`).join('');
// one big bold screen: solid colour, a dome, Ollie on top, one word, one action
const stageScreen = (o) => `<div class="stage-bg" style="--sbg:${o.bg}"></div>${o.extra || ''}
  <div class="dome" style="--dome:${o.dome};${o.domeTop ? `--dome-top:${o.domeTop}` : ''}"></div>
  <div class="stage-top" style="--stxt:${o.ink || '#fff'}">${o.kick ? `<div class="kick">${o.kick}</div>` : ''}<div class="big">${o.title}</div></div>
  <div class="stage-bot" style="--btxt:${o.botInk || '#fff'}">${o.bottom}</div>`;

/* where Ollie stands on each screen: x = centre %, y = top %, w = width %, front = above the sheet */
function spot(screen, band, navSide) {
  const kid = band === 'kid', adult = band === 'adult';
  const corner = 14;
  const S = {
    splash:   { x: 50, y: 41, w: 70, mood: 'wave' },
    welcome:  { x: 50, y: 26, w: 76, mood: 'wave' },
    kidcheck: { x: 50, y: 25, w: 70, mood: 'cheer' },
    lock:     { x: 86, y: 3, w: 20, mood: 'idle', front: true },
    profiles: { x: 50, y: 78, w: 40, mood: 'wave', front: true },
    unlock:   { x: 86, y: 3, w: 20, mood: 'idle', front: true },
    addProfile: { x: 84, y: 84, w: 22, mood: 'wave', front: true },
    age:      { x: 50, y: 8, w: 54, mood: 'wave' },
    consent:  { x: 50, y: 14, w: 58, mood: 'wave' },
    waiting:  { x: 50, y: 29, w: 72, mood: 'sleep' },
    parent:   { x: 50, y: 14, w: 40, mood: 'idle', hide: true },
    approved: { x: 50, y: 26, w: 76, mood: 'cheer' },
    prohibited: { x: 50, y: 28, w: 72, mood: 'wave' },
    intro:    { x: 70, y: 14, w: 44, mood: 'wave' },
    askOutside: { x: 50, y: 27, w: 72, mood: 'wave' },
    pass:     { x: 50, y: 26, w: 70, mood: 'cheer' },
    group:    { x: 84, y: 26, w: 26, mood: 'wave', hide: true },
    ask:      { x: 50, y: 27, w: 74, mood: 'idle', talk: true },
    pack:     { x: 50, y: 26, w: 72, mood: 'cheer' },
    denied:   { x: 50, y: 29, w: 72, mood: 'idle' },
    home:     kid ? (navSide === 'seek' ? { x: 87, y: 12, w: 20, mood: 'search' } : { x: 50, y: 13, w: 58, mood: 'idle' }) : adult ? { x: 18, y: 37, w: 26, mood: 'idle', hide: true } : { x: 50, y: 5, w: 44, mood: 'idle' },
    task:     kid ? { x: 50, y: 27, w: 74, mood: 'search' } : { x: 80, y: 27, w: 34, mood: 'search', hide: true },
    quiz:     { x: 50, y: 12, w: 56, mood: 'idle', talk: true },
    camera:   { x: 84, y: 82, w: 20, mood: 'search', front: true },
    celebrate: kid ? { x: 50, y: 25, w: 74, mood: 'cheer' } : { x: 50, y: 3, w: 34, mood: 'cheer', front: true },
    trivia:   { x: 50, y: 7, w: 50, mood: 'search' },
    chat:     { x: 15, y: 81, w: 25, mood: 'wave', peek: true },
    share:    { x: 78, y: 10, w: 36, mood: 'wave' },
    locked:   { x: 50, y: 28, w: 70, mood: 'idle' },
    finds:    kid ? { x: 80, y: 5, w: 30, mood: 'idle' } : { x: corner, y: 74, w: 20, mood: 'idle', hide: true },
    map:      { x: corner, y: 74, w: 20, mood: 'idle', hide: true },
    me:       { x: 84, y: 5, w: 22, mood: 'wave', hide: true },
  };
  return S[screen] || S.home;
}

/* ---------- one phone ---------- */
let navPref = (() => { try { return JSON.parse(localStorage.getItem('eyb-nav3')) || { side: 'right', top: 46 }; } catch (e) { return { side: 'right', top: 46 }; } })();

class Phone {
  constructor(host, playerId, opts = {}) {
    this.host = host;
    this.host.innerHTML = `<div class="phone"><div class="screen"></div></div>`;
    this.phoneEl = this.host.querySelector('.phone');
    this.roam = document.createElement('div'); this.roam.className = 'roam';
    this.roam.innerHTML = '<ollie-otter mood="idle"></ollie-otter>';
    this.profiles = opts.profiles || [playerId];
    this.famStart = opts.family;
    this.outStart = opts.outside;
    this.onAge = opts.onAge; // the React app hands the dial's age to the real k-ID check
    this.setPlayer(playerId, opts.screen || 'welcome');
  }
  chatSend(raw) {
    if (!raw || !raw.trim()) return;
    const { out, hid } = redact(raw.trim());
    this.s.chat = this.s.chat || []; this.s.chat.forEach(m => m.last = false);
    this.s.chat.push({ from: 'me', text: out, hid: hid.length ? hid.join(' and ') : '' }, { typing: true });
    this.render('none'); this.scrollChat(); this.ollie.setAttribute('mood', 'search'); this.roam.classList.remove('hop'); void this.roam.offsetWidth; this.roam.classList.add('hop');
    setTimeout(() => {
      const ans = ollieAnswer(raw, this.p.band, { family: this.s.family, group: this.groupMode });
      this.s.chat = this.s.chat.filter(m => !m.typing); this.s.chat.push({ from: 'o', text: ans.reply, keys: ans.keys, last: true });
      this.render('none'); this.scrollChat(); this.ollie.setAttribute('mood', 'wave'); if (this.ollie.say) this.ollie.say(1600);
    }, 1100);
  }
  scrollChat() { const b = this.phoneEl.querySelector('#chatBody'); if (b) b.scrollTop = b.scrollHeight; }
  ollieReact() {
    if (this.kid && this.screen === 'home' && !this.s.outside && !this.s.ollieFound) {
      this.s.ollieFound = true; this.s.found = Math.min(this.s.found + 1, HUNT.length);
      this.render('none'); this.confetti(); this.toast('You found me! Ollie Ollie Out!', 'ph-confetti');
      setTimeout(() => { this.ollie.setAttribute('mood', 'cheer'); setTimeout(() => this.ollie.setAttribute('mood', 'idle'), 1800); }, 50);
      return;
    }
    const lines = { kid: ['Hee hee, that tickles!', 'Boop!', 'Let\'s find something red!', 'You\'re my best explorer!'],
      teen: ['Sup. 2 drops nearby 👀', 'Ritual\'s got the best seats.', 'Sunset from the hill hits different.', 'Ok ok, I\'m awake.'],
      adult: ['Tartine bread sells out early.', 'The Roxie has a late show.', 'Shall I plan your evening?', 'Mission Dolores is from 1791!'] };
    const set = lines[this.p.band] || lines.teen; this.tapN = ((this.tapN || 0) + 1) % set.length;
    this.roam.querySelectorAll('.obub,.oheart').forEach(n => n.remove());
    const b = document.createElement('div'); b.className = 'obub'; b.textContent = set[this.tapN]; this.roam.appendChild(b);
    for (let i = 0; i < 5; i++) { const h = document.createElement('i'); h.className = 'oheart'; h.style.left = (30 + i * 10) + '%'; h.style.animationDelay = (i * .08) + 's'; h.innerHTML = '<span class="ph-fill ph-heart"></span>'; this.roam.appendChild(h); }
    if (this.ollie.say) this.ollie.say(1300);
    setTimeout(() => this.roam.querySelectorAll('.obub,.oheart').forEach(n => n.remove()), 2600);
  }
  famFlip() {
    this.render('none');
    const scr = this.phoneEl.querySelector('.screen'); scr.classList.add('fam-flip');
    this.ollie.setAttribute('mood', 'cheer'); setTimeout(() => this.ollie.setAttribute('mood', 'idle'), 1600);
    this.confetti(); this.toast('Family mode on', 'ph-users-three');
  }
  enterProfile(id) {
    const keep = this.profiles; this.p = PLAYERS[id]; this.r = RULES[id];
    this.s = { found: 1, finds: 11, story: false, shareOk: this.r.sharing === 'yes', age: this.p.age, game: 0, bingo: {} };
    this.profiles = keep; this.hist = ['profiles']; this.navIdx = undefined;
    this.go('home'); this.toast(`Hi ${this.p.name}!`, 'ph-hand-waving');
  }
  lockOf(id) { const b = PLAYERS[id].band; return b === 'kid' ? 'none' : b === 'teen' ? 'pin' : 'face'; }
  setPlayer(id, screen) {
    this.p = PLAYERS[id]; this.r = RULES[id];
    this.s = { found: 1, finds: 11, story: false, shareOk: this.r.sharing === 'yes', age: this.p.age, game: 0, bingo: {} };
    if (this.famStart && this.adult) { this.s.family = true; this.s.kids = [5, 8]; }
    if (this.outStart && this.kid) this.s.outside = true;
    this.hist = []; this.navIdx = undefined; this.last = null;
    this.go(screen);
  }
  get kid() { return this.p.band === 'kid'; }
  get adult() { return this.p.band === 'adult'; }
  get ollie() { return this.roam.querySelector('ollie-otter'); }
  go(screen, dir) {
    if (!dir) {
      if (this.hist.length > 1 && this.hist[this.hist.length - 2] === screen) { dir = 'back'; this.hist.pop(); }
      else { dir = ['celebrate', 'approved'].includes(screen) ? 'pop' : 'fwd'; this.hist.push(screen); }
    }
    if (screen === 'ask' && dir !== 'back') this.s.askDone = false;
    if (screen === 'home') this.groupMode = false;
    this.screen = screen; this.render(dir);
  }
  toast(msg, icon = 'ph-check-circle') {
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = `<i class="ph-fill ${icon}"></i>${msg}`;
    this.phoneEl.appendChild(t); setTimeout(() => t.remove(), 2500);
  }
  confetti() {
    const box = document.createElement('div'); box.className = 'confetti';
    const cols = ['#FFC83D', '#FF6F91', '#22B88A', '#1E7BD8', '#C98552'];
    box.innerHTML = Array.from({ length: 44 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${cols[i % 5]};animation-delay:${(i % 11) * .06}s;transform:rotate(${i * 23}deg)"></i>`).join('');
    this.phoneEl.appendChild(box); setTimeout(() => box.remove(), 3000);
  }
  status(light) { return `<div class="status ${light ? 'light' : ''}"><span>9:41</span><span><i class="ph-fill ph-cell-signal-full"></i> <i class="ph-fill ph-battery-high"></i></span></div>`; }
  curGame() {
    const s = this.s;
    if (s.outside || s.familyHunt) { const i = s.bingoNow ?? 0; const b = BINGO[i]; return { id: 'bingo', label: 'Nature bingo', icon: b[0], color: b[2], where: 'Outside · play zone', title: `Find ${b[1].toLowerCase()}!`, bingo: true }; }
    return INSIDE[Math.min(s.game || 0, INSIDE.length - 1)];
  }
  kidStars() { return `<div class="kid-stars">${HUNT.map((h, i) => i < this.s.found ? `<i style="background:${h.color}"><span class="ph-fill ${h.icon}"></span></i>` : `<i class="empty"></i>`).join('')}</div>`; }
  vnav(active) {
    const b = (k, ic, label) => `<button class="${active === k ? 'on' : ''}" data-go="${k}" aria-label="${label}"><i class="${active === k ? 'ph-fill' : 'ph'} ${ic}"></i><small>${label}</small></button>`;
    const tip = active === 'home' && !this.adult ? 'Psst, a drop is 2 minutes away!' : '';
    return `<div class="navbar"><nav class="bnav" aria-label="Main"><span class="ind"></span>${b('home', 'ph-house', 'Home')}${b('map', 'ph-map-trifold', 'Map')}${b('finds', 'ph-seal-check', 'Finds')}${b('me', 'ph-user', 'Me')}</nav>
      <button class="ollie-btn" data-go="chat" aria-label="Ask Ollie"><span class="ollie-ic"></span>${tip ? '<i class="ndot"></i>' : ''}</button>${tip ? `<div class="ollie-tip" data-go="chat">${tip}</div>` : ''}</div>`;
  }
  modeSwitch() {
    const fam = !!this.s.family;
    return `<div class="mode-sw ${fam ? 'fam' : ''}" role="tablist" aria-label="Mode"><span class="knob"></span>
      <button role="tab" aria-selected="${!fam}" data-act="${fam ? 'familyOff' : ''}"><i class="ph-fill ph-user"></i>Just me</button>
      <button role="tab" aria-selected="${fam}" data-act="${fam ? '' : 'familyOn'}"><i class="ph-fill ph-users-three"></i>Family</button></div>`;
  }
  startHere() {
    if (this.s.startGone || (!this.s.firstRun && !new URLSearchParams(location.search).get('first'))) return '';
    const s = this.s, ad = this.adult;
    const steps = [
      [s.finds > 11 || s.setGot > 4, ad ? 'Check in at your first stop' : 'Catch your first drop', 'task'],
      [!!(s.chat && s.chat.length), 'Ask Ollie for an idea', 'chat'],
      [!!(this.groupMode || s.family), ad ? 'Try family or group mode' : 'Plan a group outing', ad ? '' : ''],
    ];
    const done = steps.filter(x => x[0]).length;
    return `<div class="start-card"><div style="display:flex;justify-content:space-between;align-items:center"><b>Start here</b><span>${done} of 3</span></div>
      <div class="progress" style="margin-top:6px"><i style="width:0" data-w="${Math.max(4, done / 3 * 100)}%"></i></div>
      ${steps.map(([ok, t, go], j) => `<button class="sh-step ${ok ? 'ok' : ''}" ${go ? `data-go="${go}"` : `data-act="startGroup"`}><span>${ok ? '<i class="ph-bold ph-check"></i>' : j + 1}</span>${t}<i class="ph ph-caret-right"></i></button>`).join('')}
      <button class="link" style="padding:6px 0 0;font-size:12.5px" data-act="startDone">Hide</button></div>`;
  }
  quick() {
    return `<div class="quick"><button data-act="startGroup"><i class="ph ph-users-three"></i>Group outing</button><button data-go="pass"><i class="ph ph-ticket"></i>${this.s.passOn ? 'My deals' : 'Local deals'}</button></div>`;
  }
  topActions(compact) {
    if (compact) return `<div class="top-actions"><button class="chip glass icon" style="border:0;cursor:pointer;box-shadow:var(--soft)" data-go="pass" aria-label="Local deals"><i class="ph-fill ph-ticket"></i></button><button class="chip glass icon" style="border:0;cursor:pointer;box-shadow:var(--soft)" data-act="startGroup" aria-label="Going with others"><i class="ph-bold ph-users-three"></i></button><button class="chip glass icon" style="border:0;cursor:pointer;box-shadow:var(--soft)" data-go="ask" aria-label="Ask Ollie"><i class="ph-fill ph-microphone"></i></button></div>`;
    return `<div class="top-actions"><button class="chip glass icon" style="border:0;cursor:pointer;box-shadow:var(--soft)" data-go="pass" aria-label="Local deals"><i class="ph-fill ph-ticket"></i></button><button class="chip glass" style="border:0;cursor:pointer;box-shadow:var(--soft)" data-act="startGroup"><i class="ph-bold ph-users-three"></i>Going with others?</button><button class="chip glass" style="border:0;cursor:pointer;box-shadow:var(--soft)" data-go="ask" aria-label="Ask Ollie"><i class="ph-fill ph-microphone"></i></button></div>`;
  }
  spotCard(key, extra = '') {
    const pl = PLACES[key];
    return `<div class="pcard"><div class="th ${pl.img ? '' : 'mono'}" style="${pl.img ? `background-image:url(${pl.img})` : `--c:${pl.color}`}">${pl.img ? '' : `<i class="ph ${pl.icon}"></i>`}</div><div style="flex:1;min-width:0"><b>${pl.name}</b><small>${pl.cat}</small></div>${extra}</div>`;
  }
  arrive(placeKey, label) {
    const pl = PLACES[placeKey];
    if (this.s.hereGone) return '';
    return `<div class="here-card"><div class="dot" style="background-image:url(${pl.img})"></div><div class="at"><small><i class="live"></i>You're here</small><b>${pl.name}</b></div>
      <button class="go" data-go="task">${label}</button><button class="x" data-act="dismiss" aria-label="Dismiss"><i class="ph ph-x"></i></button></div>`;
  }

  /* ---------- screens ---------- */
  screens() {
    const p = this.p, r = this.r, s = this.s, adult = this.adult;
    const k = this.kid || (s.familyHunt && ['task', 'quiz', 'celebrate', 'finds'].includes(this.screen));
    const H = PLACES.hydrant, MD = PLACES.md;
    const here = adult ? MD : PLACES.park;
    return {
      splash: () => `${this.status(true)}
        <div class="stage-bg" style="--sbg:#1E7BD8"></div>
        <div class="splash" data-go="age">
          <div class="wordmark"><span>Ollie</span><span>Ollie</span><span class="out">Out!</span></div>
          <p class="tag">Explore your block</p>
        </div>
        <div class="dome" style="--dome:#FFC83D;--dome-top:66%"></div>
        <div class="stage-bot" style="--btxt:#1F2030"><button class="btn-white" data-go="age" style="background:#1F2030;color:#fff">Let's go</button></div>`,

      welcome: () => `${this.status()}${stageScreen({ bg: '#DCEFF7', dome: '#1E7BD8', ink: '#1F2030', title: 'Hi, I\'m<br>Ollie!',
          extra: floaties([['leaf', 8, 30, 38, -20], ['star', 80, 22, 34, 10, .6], ['pin', 84, 44, 30, 8, 1.2]]),
          bottom: `<p>Let's explore your block together. Find things, unlock stories, collect stickers.</p><button class="btn-white" data-go="age">Let's go <i class="ph-bold ph-arrow-right"></i></button>` })}`,

      age: () => `
        <div class="hero-grad" style="height:280px"></div>${this.status()}
        <button class="back" data-go="splash" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet center" style="top:238px">
          <h2 class="disp h-l">Hi, I'm Ollie!</h2>
          <p class="p">Tell me your age so I can make the game just right for you.</p>
          <div class="dial-wrap"><div class="dial" id="dial">${Array.from({ length: 96 }, (_, i) => `<span data-v="${i + 4}">${i + 4}</span>`).join('')}</div></div>
          <div class="bands" id="bands"><span data-b="kid">Kid</span><span data-b="teen">Teen</span><span data-b="adult">Adult</span></div>
          <div class="grow"></div>
          <span class="chip" style="margin-bottom:12px"><i class="ph-fill ph-globe-hemisphere-west"></i>${p.country === 'DE' ? 'Germany' : 'California, US'} · found automatically</span>
          <button class="btn btn-pill full" data-act="ageDone">Continue</button>
          <p class="kid-badge" style="margin-top:10px"><i class="ph-fill ph-shield-check"></i>Age check powered by k-ID</p>
        </div>`,

      consent: () => `
        <div class="scenebox" style="height:300px">${scene('day')}</div>${this.status()}
        <div class="sheet center" style="top:280px">
          <h2 class="disp h-l">Let's ask a grown-up!</h2>
          <p class="p">A grown-up needs to say OK before we go exploring.</p>
          <input class="field" value="mia.mom@email.com" aria-label="Grown-up's email">
          <div class="grow"></div>
          <button class="btn btn-kid blue" data-go="waiting">Send to my grown-up</button>
        </div>`,

      waiting: () => `${this.status(true)}${stageScreen({ bg: '#1E2A33', dome: '#2B3B46', kick: 'Hang tight', title: 'Waiting for<br>a grown-up', extra: twinkles(18),
          bottom: `<p>Ollie is napping until they say OK.</p><button class="btn-white" data-go="parent"><i class="ph-bold ph-device-mobile"></i>Open the grown-up's phone</button>` })}`,

      parent: () => {
        const share = !!this.parentFor, buy = this.parentFor === 'buy' || this.parentFor === 'pass', outside = this.parentFor === 'outside';
        const perms = share
          ? (this.parentFor === 'chat' ? [['ph-chat-circle-dots', 'Ask Ollie chat', 'AI chat to plan outings · teen-safe answers', 'ask', 'Asking'], ['ph-brain', 'Remember chats', 'Stays off', 'no', 'Off']] : outside ? [['ph-tree', 'Play outside', 'Nature bingo near home', 'ask', 'Asking'], ['ph-map-pin', 'Location', 'Only inside a play zone, never shared', 'yes', 'Zones only'], ['ph-camera', 'Camera', 'Stays off', 'no', 'Off']] : this.parentFor === 'pass' ? [['ph-gift', 'Teen Pass · $2.99/month', 'Deals at teen-friendly shops, no alcohol. Billed to you via FastSpring', 'ask', 'Asking']] : buy ? [['ph-shopping-bag', 'Family Outing Pack · $4.99', 'One-time purchase through FastSpring', 'ask', 'Asking']] : [['ph-share-network', 'Share finds with friends', 'Photos and stories, friends only', 'ask', 'Asking']])
          : [['ph-map-pin', 'Location', 'Only inside play zones, never shared', 'yes', 'Zones only'], ['ph-camera', 'Camera', 'Off for under 13', 'no', 'Off'],
             ['ph-users', 'Friends and sharing', 'Off for under 13', 'no', 'Off'], ['ph-shopping-bag', 'Buying', 'Off', 'no', 'Off']];
        return `${this.status(true)}
        <div class="parent-top"><p class="eyebrow" style="color:rgba(255,255,255,.6)">Grown-up's phone · k-ID</p><h2 class="disp h-m" style="margin-top:4px">${this.parentFor === 'chat' ? `${p.name} wants to use Ask Ollie` : outside ? `${p.name} wants to play outside` : this.parentFor === 'pass' ? `${p.name} asked for Teen Pass` : buy ? `${p.name} wants to buy a pack` : share ? `${p.name} wants to share` : `${p.name} wants to join Explore Your Block`}</h2></div>
        <div class="sheet" style="top:128px;border-radius:0;background:#fff">
          <p class="p" style="margin-top:0">${this.parentFor === 'chat' ? `k-ID needs a parent's OK for AI chat at ${p.age} in ${p.countryName}. Answers never include places that sell alcohol.` : outside ? `Ollie keeps ${p.name} inside a play zone around home. Nobody can see where ${p.name} is.` : this.parentFor === 'pass' ? `Get it as a gift. k-ID needs a parent's OK for purchases at ${p.age}.` : buy ? `k-ID needs a parent's OK for purchases at ${p.age}.` : share ? `In Germany, under-16s need a parent's OK to share. Here's what turns on:` : `Here's what ${p.name} can do at age ${s.age}. You can change this anytime.`}</p>
          <div style="margin-top:8px">${perms.map(([ic, t, d, cls, lab]) => `<div class="perm"><i class="ic ph ${ic}"></i><div><b>${t}</b><small>${d}</small></div><span class="tag ${cls}">${lab}</span></div>`).join('')}</div>
          <div class="grow"></div>
          <button class="btn btn-pill full" data-act="approve">Approve</button>
          <button class="link" data-act="deny">Not now</button>
        </div>`;
      },

      kidcheck: () => { const band = this.p.band, where = this.p.country === 'DE' ? 'Germany' : 'California, US';
        const label = band === 'kid' ? 'Kid explorer' : band === 'teen' ? 'Teen explorer' : 'Adult explorer';
        const what = band === 'kid' ? 'Playgrounds, parks and ice cream, with a sticker hunt. A grown-up says OK first.' : band === 'teen' ? 'Hangouts, cafés and movies. Some features need a parent\'s OK in your country.' : 'The full outing planner, group outings and outing packs.';
        return `${this.status()}${stageScreen({ bg: '#DCEFF7', dome: '#1F2030', ink: '#1F2030', kick: 'k-ID checked your age + location', title: `${s.age} in<br>${where.split(',')[0]}`,
          bottom: `<div class="kcheck"><div style="animation-delay:.2s"><i class="ph-fill ph-check-circle"></i>Age ${s.age} · ${where}</div><div style="animation-delay:.5s"><i class="ph-fill ph-check-circle"></i>${label}</div></div>
            <p style="font-size:14px">${what}</p>
            <button class="btn-white" data-act="afterCheck">Continue</button>` })}`; },

      lock: () => { const pin = this.p.band === 'teen' || s.usePin;
        return `${this.status()}
        <div class="plain" style="background:var(--paper)"></div>
        <div class="sheet center vcenter" style="top:0;border-radius:0;padding-top:40px;background:transparent;box-shadow:none">
          <p class="eyebrow">${this.p.band === 'teen' ? 'Teen profile' : 'Adult profile'} · keep it yours</p>
          <h2 class="disp h-l" style="margin-top:6px">${pin ? 'Create a 4-digit PIN' : 'Lock with Face ID'}</h2>
          <p class="p">${pin ? 'So nobody else on this phone can open your profile.' : 'Only you can open your profile, your purchases and your group plans.'}</p>
          ${pin ? `<div class="pin-dots" id="pinDots">${'<i></i>'.repeat(4)}</div>
            <div class="pinpad">${[1,2,3,4,5,6,7,8,9].map(n => `<button data-act="pin" data-n="${n}">${n}</button>`).join('')}<span></span><button data-act="pin" data-n="0">0</button><button class="ghost" data-act="pinBack" aria-label="Delete"><i class="ph-bold ph-backspace"></i></button></div>`
          : `<div class="face" id="face"><i class="ph ph-smiley"></i><span class="scan"></span></div>
            <button class="btn btn-pill full" style="margin-top:28px" data-act="faceOk"><i class="ph-bold ph-scan-smiley"></i>Turn on Face ID</button>
            <button class="link" data-act="usePin">Use a PIN instead</button>`}
        </div>`; },

      profiles: () => `${this.status()}
        <div class="plain" style="background:var(--paper)"></div>
        <div class="sheet center" style="top:0;border-radius:0;padding-top:64px;background:transparent;box-shadow:none">
          <p class="eyebrow">This phone · ${this.profiles.length} explorers</p>
          <h2 class="disp h-xl" style="margin-top:6px">Who's<br>exploring?</h2>
          <div class="prof-grid">
            ${this.profiles.map(id => { const q = PLAYERS[id], l = this.lockOf(id);
              return `<button class="prof" data-act="pickProfile" data-id="${id}"><span class="av" style="background:${q.color}">${q.name[0]}<span class="lockdot"><i class="ph-fill ${l === 'none' ? 'ph-smiley' : l === 'pin' ? 'ph-lock-simple' : 'ph-scan-smiley'}"></i></span></span><b>${q.name}</b><small>${q.age} · ${l === 'none' ? 'no lock' : l === 'pin' ? 'PIN' : 'Face ID'}</small></button>`; }).join('')}
            <button class="prof add" data-go="addProfile"><span class="av"><i class="ph-bold ph-plus"></i></span><b>Add profile</b><small>k-ID checks each age</small></button>
          </div>
        </div>`,

      unlock: () => { const q = PLAYERS[this.unlockFor], l = s.usePin ? 'pin' : this.lockOf(this.unlockFor);
        return `${this.status()}
        <div class="plain" style="background:var(--paper)"></div>
        <button class="back" data-go="profiles" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet center vcenter" style="top:0;border-radius:0;padding-top:40px;background:transparent;box-shadow:none">
          <span class="av" style="width:72px;height:72px;border-radius:24px;background:${q.color};color:#fff;display:grid;place-items:center;font:800 30px var(--display)">${q.name[0]}</span>
          <h2 class="disp h-l" style="margin-top:12px">Hi, ${q.name}</h2>
          <p class="p">${l === 'pin' ? 'Enter your PIN' : 'Look at your phone to unlock'}</p>
          ${l === 'pin' ? `<div class="pin-dots" id="pinDots">${'<i></i>'.repeat(4)}</div>
            <div class="pinpad">${[1,2,3,4,5,6,7,8,9].map(n => `<button data-act="pin" data-n="${n}">${n}</button>`).join('')}<span></span><button data-act="pin" data-n="0">0</button><button class="ghost" data-act="pinBack" aria-label="Delete"><i class="ph-bold ph-backspace"></i></button></div>`
          : `<div class="face" id="face"><i class="ph ph-smiley"></i><span class="scan"></span></div><button class="link" style="margin-top:20px" data-act="usePin">Use PIN instead</button>`}
        </div>`; },

      addProfile: () => `${this.status()}
        <div class="plain" style="background:var(--paper)"></div>
        <button class="back" data-go="${this.hist[this.hist.length - 2] || 'me'}" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet" style="top:0;border-radius:0;padding-top:80px;background:transparent;box-shadow:none">
          <p class="eyebrow">Add someone to this phone</p>
          <h2 class="disp h-l" style="margin-top:6px">Who's joining?</h2>
          <input class="field" placeholder="Their name" aria-label="Name" value="">
          <div class="stack" style="margin-top:14px">
            ${[['ph-smiley', 'Kid', 'No lock. A grown-up approves with k-ID.'], ['ph-lock-simple', 'Teen', 'Their own PIN. k-ID checks the age.'], ['ph-scan-smiley', 'Adult', 'Face ID or a PIN.']].map(([ic, t, d]) => `<div class="perm"><i class="ic ph ${ic}"></i><div><b>${t}</b><small>${d}</small></div></div>`).join('')}
          </div>
          <div class="grow"></div>
          <button class="btn btn-pill full" data-act="addGo">Next: pick their age</button>
        </div>`,

      askOutside: () => `${this.status()}${stageScreen({ bg: '#DDF5EA', dome: '#22B88A', ink: '#1F2030', kick: 'Outside needs a grown-up', title: 'Can we go<br>outside?',
          extra: floaties([['leaf', 8, 30, 36, -15], ['star', 82, 24, 28, 10, .6]]),
          bottom: `<p>Ollie wants to play nature bingo! A grown-up needs to say OK first.</p>
            <button class="btn-white big" data-act="askOutsideGo">Ask my grown-up</button>` })}
        <button class="back" data-go="home" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>`,

      pass: () => { const teen = p.band === 'teen', list = passPartners(teen), canBuy = r.buying === 'yes' || s.passGift;
        if (s.passOn) return `${this.status()}
        <div class="plain" style="background:var(--paper)"></div>
        <button class="back" data-go="home" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet" style="top:0;border-radius:0;padding-top:86px;background:transparent;box-shadow:none;overflow-y:auto">
          <p class="eyebrow">${teen ? 'Teen Pass' : 'Block Pass'} · active</p>
          <h2 class="disp h-l" style="margin-top:4px">Your local deals</h2>
          <div class="qr-card"><div class="qr">${Array.from({ length: 49 }, (_, i) => `<i style="opacity:${[0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48,10,16,24,30,32,38].includes(i) || (i * 7) % 5 === 0 ? 1 : 0}"></i>`).join('')}</div><div><b>Show at the counter</b><small>One scan per visit · ${teen ? 'teen-friendly shops only' : 'all partner shops'}</small></div></div>
          <div class="stack">${list.map(x => `<div class="pcard"><div class="th" style="background:${x.color}"><i class="ph-fill ${x.icon}"></i></div><div style="flex:1"><b>${x.name}</b><small>${x.cat} · demo partner</small></div><span class="pill-st here">${x.deal}</span></div>`).join('')}</div>
        </div>`;
        return `${this.status()}${stageScreen({ bg: teen ? '#E2F3F2' : '#FFEBD6', dome: teen ? '#0F7C80' : '#1F2030', ink: '#1F2030', kick: 'Support local shops', title: teen ? 'Teen<br>Pass' : 'Block<br>Pass',
          extra: floaties([['star', 8, 24, 30, -10], ['heart', 82, 20, 26, 12, .5]]),
          bottom: `<div class="deal-row">${list.slice(0, 3).map(x => `<span><i class="ph-fill ${x.icon}"></i>${x.deal}<small>${x.name}</small></span>`).join('')}</div>
            <p style="font-size:14px">${teen ? `Deals at ${list.length} teen-friendly shops. Never anywhere that sells alcohol.` : `Deals at ${list.length} local shops on your block.`}<br><b style="font-size:24px;font-family:var(--display);font-stretch:80%">${teen ? '$2.99' : '$4.99'} / month</b></p>
            ${canBuy ? `<button class="btn-white" data-act="checkout" data-product="${teen ? 'Teen Pass' : 'Block Pass'}" data-price="${teen ? '2.99' : '4.99'}"><i class="ph-fill ph-lock-simple"></i>${s.passGift ? 'Accept the gift' : 'Get it with FastSpring'}</button>`
              : r.buying === 'ask' ? `<button class="btn-white" data-act="askPass"><i class="ph-fill ph-gift"></i>Ask a parent to get it</button>` : ''}` })}
        <button class="back" data-go="home" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>`; },

      intro: () => { const i = this.introI || 0, ad = this.adult;
        const C = [
          { bg: '#FFE4D2', ic: 'ph-map-pin-area', t: 'Explore spots<br>near you', d: ad ? 'Ollie plans outings on your block: history, food, movies, dinner.' : 'Find the best hangouts on your block: the park hill, cafés, murals.' },
          { bg: '#DDF0EE', ic: 'ph-gift', t: 'Catch drops,<br>collect stickers', d: 'Walk to a spot, take the photo challenge or the trivia, and add rare stickers to your set.' },
          { bg: '#E3EEF9', ic: 'ph-chat-circle-dots', t: 'Tell Ollie<br>what you want', d: 'Type or say "date night idea" or "cheap eats" and Ollie builds a plan.' },
          { bg: '#FFF1CF', ic: 'ph-users-three', t: ad ? 'Bring your family<br>or friends' : 'Go with<br>friends', d: ad ? 'Family mode for the kids, group outings for everyone, and local deals with Block Pass.' : 'Group outings find spots that work for everyone, plus deals with Teen Pass.' },
        ];
        const c = C[i], last = i === C.length - 1;
        return `${this.status()}
        <div class="stage-bg" style="--sbg:${c.bg};transition:background .4s"></div>
        <button class="link" style="position:absolute;z-index:9;top:40px;right:12px" data-act="introSkip">Skip</button>
        <div class="intro-ic" key="${i}"><i class="ph ${c.ic}"></i></div>
        <div class="sheet center" style="top:auto;height:330px;padding-bottom:22px">
          <p class="eyebrow">What you can do · ${i + 1} of ${C.length}</p>
          <h2 class="disp h-l" style="margin-top:6px">${c.t}</h2>
          <p class="p">${c.d}</p>
          <div class="grow"></div>
          <div class="dots-i">${C.map((_, j) => `<i class="${j === i ? 'on' : ''}"></i>`).join('')}</div>
          <button class="btn btn-pill full" data-act="introNext">${last ? 'Start exploring' : 'Next'}</button>
        </div>`; },

      prohibited: () => `${this.status()}${stageScreen({ bg: '#E6F2F7', dome: '#5E8FA6', ink: '#1F2030', kick: 'Not quite yet', title: 'Too young<br>to play here',
          bottom: `<p>In your country, players need to be a little older for this game. Ollie will be right here when you are.</p><button class="btn-white" data-go="splash">Back to start</button>` })}
        <span class="chip glass" style="position:absolute;z-index:9;top:46px;left:50%;transform:translateX(-50%)"><i class="ph-fill ph-shield-check"></i>k-ID: under the minimum age</span>`,

      denied: () => `${this.status(true)}${stageScreen({ bg: '#2C3238', dome: '#454E57', kick: 'Your grown-up said', title: 'Not yet!',
          bottom: `<p>That's OK. You can ask again later, or ask a different grown-up.</p><button class="btn-white" data-go="consent">Ask again</button>` })}`,

      approved: () => `${this.status()}${stageScreen({ bg: '#DDF5EA', dome: '#22B88A', ink: '#1F2030', kick: 'Your grown-up said yes', title: 'You\'re<br>all set!',
          extra: floaties([['star', 10, 24, 34, -10], ['heart', 82, 20, 30, 12, .5], ['leaf', 78, 46, 34, 20, 1]]),
          bottom: `<p>Let's go find some treasures on your block.</p><button class="btn-white big" data-go="home">Start exploring</button>` })}`,

      home: () => k ? (s.outside ? `
        <div class="scenebox" style="height:300px">${scene('day')}</div>${this.status()}
        ${this.kidStars()}
        <button class="corner-btn" data-go="finds" aria-label="My stickers"><i class="ph-fill ph-book-open"></i></button>
        <div class="sheet" style="top:270px">
          <p class="eyebrow"><i class="ph-fill ph-map-pin-area"></i> Outside · your grown-up said yes</p>
          <h2 class="disp h-l" style="margin-top:4px">Nature bingo</h2>
          <div class="bingo">${BINGO.map(([ic, t, c], i) => `<button class="bcell ${s.bingo[i] ? 'got' : ''}" data-act="bingo" data-i="${i}" style="--c:${c}"><i class="ph-fill ${ic}"></i><small>${t}</small>${s.bingo[i] ? '<span class="tick"><i class="ph-bold ph-check"></i></span>' : ''}</button>`).join('')}</div>
          <div class="grow"></div>
          <button class="btn btn-pill light full" data-act="goInside"><i class="ph-bold ph-house"></i>Back inside</button>
        </div>` : `
        <div class="scenebox" style="height:300px">${house()}</div>${this.status()}
        ${this.kidStars()}
        <button class="corner-btn" data-go="finds" aria-label="My stickers"><i class="ph-fill ph-book-open"></i></button>
        ${this.profiles.length > 1 ? `<button class="corner-btn" style="right:68px;background:${p.color};color:#fff;font:800 18px var(--display)" data-go="profiles" aria-label="Switch profile">${p.name[0]}</button>` : ''}
        <div class="sheet" style="top:270px">
          ${s.ollieFound ? '' : `<span class="chip" style="background:#FFF1D6;color:#9A6500;margin-bottom:6px"><i class="ph-fill ph-eyes"></i>Ollie is hiding! Can you find him?</span>`}
          <p class="eyebrow">Inside games · today</p>
          <h2 class="disp h-l" style="margin-top:4px">Home explorer</h2>
          <div class="kpath" style="background:#FFF1E2">
            <svg viewBox="0 0 300 150" preserveAspectRatio="none"><path d="M30 110 C 70 30, 110 30, 140 80 S 220 140, 270 40" fill="none" stroke="#E8C9A6" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 14"/></svg>
            ${INSIDE.map((g, i) => { const pos = [[12, 70], [36, 32], [58, 64]][i]; const st = i < (s.game || 0) ? 'done' : i === (s.game || 0) ? 'now' : 'lock';
              return `<div class="stop ${st}" style="left:${pos[0]}%;top:${pos[1]}%" ${st === 'now' ? 'data-go="task"' : ''}><span style="${st !== 'lock' ? `background:${g.color}` : ''}"><i class="ph-fill ${st === 'lock' ? 'ph-lock-simple' : g.icon}"></i></span></div>`; }).join('')}
            <div class="stop door" style="left:86%;top:36%" data-go="askOutside"><span><i class="ph-fill ph-tree"></i></span></div>
          </div>
          <div class="grow"></div>
          <button class="btn btn-kid blue nudge" data-go="task">${(s.game || 0) < INSIDE.length ? `Play: ${INSIDE[s.game || 0].label}` : 'All done inside!'}</button>
          <button class="btn btn-pill light full" style="margin-top:8px" data-go="askOutside"><i class="ph-fill ph-tree"></i>Can we go outside?<i class="ph-fill ph-lock-simple" style="opacity:.5"></i></button>
        </div>`)
      : adult ? (s.family ? `
        <div class="leaf" style="height:340px" data-map="near" data-keys="${FAMILY.join(',')}"></div>${this.status()}
        <div class="sheet family-sheet" style="top:300px;padding:18px 16px 150px;overflow-y:auto">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px">
            <div><p class="eyebrow">With ${s.kids.length} kid${s.kids.length === 1 ? '' : 's'}, ages ${s.kids.join(' and ')}</p><h2 class="disp h-l" style="margin-top:2px">Family day out</h2></div>
            <button class="btn btn-pill sm" data-act="familyHunt">Start</button>
          </div>
          <button class="askbar" style="margin-top:12px" data-go="chat"><span class="ollie-dot"></span>Ask Ollie for family ideas…<i class="ph-fill ph-microphone"></i></button>
          <div class="sugg">${['Playgrounds nearby', 'Ice cream', 'Easy walks', 'Rainy day ideas'].map(t => `<span class="chip">${t}</span>`).join('')}</div>
          <div class="stack" style="margin-top:2px">${['playground', 'birite', 'park'].map((k2, i) => this.spotCard(k2, `<span class="pill-st ${i === 0 ? 'here' : ''}">${i === 0 ? 'Here now' : i + 1}</span>`)).join('')}</div>
          <a class="gm-link" href="${gmapsDir(['playground', 'birite', 'park'])}" target="_blank" rel="noopener"><i class="ph ph-google-logo"></i>Open the route in Google Maps</a>
          <button class="hunt-cta" data-act="familyHunt"><span class="sticker-mini"><i class="ph-fill ph-star"></i></span><div><b>Start Ollie's sticker hunt</b><small>The kids find things at each stop</small></div><i class="ph-bold ph-caret-right"></i></button>
        </div>${this.modeSwitch()}${this.vnav('home')}` : `
        <div class="leaf" style="height:330px" data-map="walk"></div>${this.status()}
        <div class="sheet" style="top:300px;padding:18px 16px 150px;overflow-y:auto">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px">
            <div><p class="eyebrow">Tonight, about 1 mile</p><h2 class="disp h-l" style="margin-top:2px">Your Mission evening</h2></div>
            <button class="btn btn-pill sm" data-go="task">Start</button>
          </div>
          <button class="askbar" style="margin-top:12px" data-go="chat"><span class="ollie-dot"></span>Ask Ollie anything…<i class="ph-fill ph-microphone"></i></button>
          ${this.startHere()}
          ${this.quick()}
          ${this.arrive('md', 'Check in')}
          <div class="stack" style="margin-top:4px">${WALK.map((key, i) => { const pl = PLACES[key];
            return `<div class="pcard"><div class="th" style="background-image:url(${pl.img})"></div><div style="flex:1"><b>${pl.name}</b><small>${WALK_SUB[i]}</small></div>${i === 0 ? '<span class="pill-st here">Here now</span>' : `<span class="pill-st">${i + 1}</span>`}</div>`; }).join('')}</div>
          <a class="gm-link" href="${gmapsDir(WALK)}" target="_blank" rel="noopener"><i class="ph ph-google-logo"></i>Open the route in Google Maps</a>
        </div>${this.modeSwitch()}${this.vnav('home')}`)
      : `
        <div class="hero-grad"></div>${this.status()}
        <div class="sheet arc" style="top:208px;padding:20px 16px 150px;overflow-y:auto">
          <div style="text-align:center"><small style="font-weight:700;color:var(--ink-2)">Good evening, ${p.name}</small><h2 class="disp h-l" style="margin-top:2px">${s.finds} spots found</h2>
            <p style="font-size:13.5px;font-weight:600;color:var(--ink-2);margin-top:2px">2 drops nearby on Mission St</p></div>
          <button class="askbar" style="margin-top:14px" data-go="chat"><span class="ollie-dot"></span>Ask Ollie anything…<i class="ph-fill ph-microphone"></i></button>
          ${this.startHere()}
          ${this.quick()}
          ${this.arrive('park', 'Snap it')}
          <p class="eyebrow" style="margin-top:16px">Next hangout</p>
          <div class="card-soft next-card" style="margin-top:8px" data-go="task">
            <div class="ph-img" style="background-image:url(${PLACES.park.img})"></div>
            <div><h3 class="disp h-m">Top of Dolores Park</h3><div class="meta"><span><i class="ph ph-map-pin"></i>0.1 mi</span><span><i class="ph ph-gift"></i>Drop here</span></div></div>
          </div>
          <p class="eyebrow" style="margin-top:16px">Nearby</p>
          <div class="stack">${this.spotCard('ritual')}${this.spotCard('clarion')}${this.spotCard('birite')}</div>
          ${s.passOn ? '' : `<button class="pass-cta" data-go="pass"><span><i class="ph ph-ticket"></i></span><div><b>Teen Pass</b><small>Deals at teen-friendly shops</small></div><i class="ph-bold ph-caret-right"></i></button>`}
        </div>${this.vnav('home')}`,

      task: () => k ? (() => { const g = this.curGame();
        const bot = g.hint ? `<div class="hint-dots">${g.hint.map(c => `<i style="background:${c}"></i>`).join('')}</div>`
          : g.shapes ? `<div class="hint-dots">${g.shapes.map(ic => `<i style="background:#fff;display:grid;place-items:center;color:#1E7BD8;font-size:22px;font-style:normal"><span class="ph-fill ${ic}"></span></i>`).join('')}</div>`
          : g.bingo ? `<div class="hint-dots"><i style="background:#fff;display:grid;place-items:center;color:${g.color};font-size:22px;font-style:normal"><span class="ph-fill ${g.icon}"></span></i></div>` : '';
        return `${this.status(true)}${stageScreen({ bg: g.bingo ? '#2E7D5B' : g.riddle ? '#0F7C80' : '#178A74', dome: g.bingo ? '#3FA06F' : g.riddle ? '#2A9A93' : '#25A98C',
          kick: `<span data-act="say" style="cursor:pointer;pointer-events:auto"><i class="ph-fill ph-speaker-high"></i> ${g.where}</span>`, title: g.title,
          extra: floaties(g.bingo ? [['leaf', 6, 34, 36, -15]] : [['star', 8, 34, 30, -10]]),
          bottom: `${bot}<p style="font-size:13px"><i class="ph-fill ${g.bingo ? 'ph-map-pin-area' : 'ph-house'}"></i> ${g.bingo ? "You're in the play zone" : 'Look around inside'}</p>
            <button class="btn-white big nudge" data-go="${g.bingo ? 'celebrate' : 'quiz'}" ${g.bingo ? 'data-act="bingoFound"' : ''}>${g.riddle ? 'I know it!' : 'I found it!'}</button>` })}
        <button class="back right" data-go="home" aria-label="Close"><i class="ph-bold ph-x"></i></button>`; })() : `
        <div class="hero-img" style="background-image:url(${here.img})"><div class="lab"><span class="chip glass">${adult ? 'Stop 1 of 4 · History' : 'Hangout · Dolores Park'}</span></div></div>${this.status(true)}
        <button class="back" data-go="home" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet" style="top:276px">
          <p class="eyebrow" style="color:var(--indigo)"><i class="ph ph-gift"></i> There's a drop here</p>
          <h2 class="disp h-l" style="padding-right:90px;margin-top:2px">${adult ? here.name : 'Top of Dolores Park'}</h2>
          <div class="meta"><span><i class="ph ph-map-pin"></i>${adult ? 'Dolores St & 16th' : 'Dolores St & 20th'}</span><span><i class="ph ph-clock"></i>${adult ? '15 min' : 'Sunset'}</span></div>
          <div class="challenges">
            <button class="chal" data-go="camera"><span style="background:#1E7BD8"><i class="ph-fill ph-camera"></i></span><div><b>Photo challenge</b><small>${adult ? 'Snap the old white chapel' : 'Snap the skyline from the top of the hill'}</small></div><em>+1 sticker</em></button>
            <button class="chal" data-go="trivia"><span style="background:#0F7C80"><i class="ph-fill ph-question"></i></span><div><b>Bonus trivia</b><small>One question about this spot</small></div><em>+1 rare</em></button>
          </div>
          <div class="grow"></div>
          <a class="gm-link" href="${gmapsDir([adult ? 'md' : 'park'])}" target="_blank" rel="noopener"><i class="ph-fill ph-google-logo"></i>Walk there in Google Maps</a>
        </div>`,

      trivia: () => { const t = TRIVIA[adult ? 'adult' : 'teen'];
        return `${this.status(true)}
        <div class="stage-bg" style="--sbg:#123A40"></div>
        <button class="back" data-go="task" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet" style="top:250px;background:#fff">
          <p class="eyebrow" style="color:var(--indigo)">Bonus trivia for a rare sticker</p>
          <h2 class="disp h-m" style="margin-top:6px;font-size:28px">${t.q}</h2>
          <div class="answers">${t.a.map(([txt, ok]) => `<button data-act="answer" ${ok ? 'data-ok="1"' : ''}>${txt}</button>`).join('')}</div>
        </div>`; },

      chat: () => {
        if (r.ai !== 'yes' && !s.chatOk) return `${this.status()}${stageScreen({ bg: '#E2F3F2', dome: '#0F7C80', ink: '#1F2030', kick: `Rule from k-ID · ${p.country}`, title: 'Chat needs<br>a parent\'s OK',
            bottom: `<p>In ${p.countryName}, AI chat at ${p.age} needs a parent to turn it on. You can still use everything else.</p><button class="btn-white" data-act="askChat"><i class="ph-fill ph-user-circle"></i>Ask a parent</button>` })}
          <button class="back" data-go="home" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>`;
        const msgs = s.chat || [];
        return `${this.status()}
        <div class="plain" style="background:var(--paper)"></div>
        <div class="chat-top"><button class="back" style="position:static;box-shadow:none;background:#fff" data-go="home" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
          <div><b>Ask Ollie</b><small>${this.s.family ? 'Family ideas' : this.groupMode ? 'Ideas for your whole group' : adult ? 'Your outing planner' : 'Ideas for you and your friends'}</small></div></div>
        <div class="chat-body" id="chatBody">
          ${msgs.length ? '' : `<div class="bubble-o">Hey ${p.name}! What are you in the mood for? Tell me, or tap an idea.</div>`}
          ${msgs.map(m => m.from === 'me' ? `<div class="bubble-me">${m.text}</div>${m.hid ? `<div class="redact"><i class="ph-fill ph-eye-slash"></i>Ollie hid your ${m.hid}</div>` : ''}`
            : m.typing ? `<div class="bubble-o typing"><i></i><i></i><i></i></div>`
            : m.plan ? `<div class="plan-card"><p class="eyebrow" style="color:#9FE0C8">Your plan · ${m.keys.length} stops</p>${m.keys.map((k2, i) => `<div class="plan-stop"><span>${i + 1}</span>${PLACES[k2].name}</div>`).join('')}
                <div style="display:flex;gap:8px;margin-top:10px"><button class="btn btn-pill sm" style="flex:1;background:#fff;color:var(--ink)" data-act="planStart">Start</button><a class="btn btn-pill sm" style="background:rgba(255,255,255,.15);text-decoration:none" href="${gmapsDir(m.keys)}" target="_blank" rel="noopener"><i class="ph-fill ph-google-logo"></i></a></div></div>`
            : `<div class="bubble-o">${m.text}</div><div class="chat-cards">${m.keys.map(k2 => { const pl = PLACES[k2]; return `<div class="ccard"><div class="th" style="${pl.img ? `background-image:url(${pl.img})` : `background:${pl.color}`}">${pl.img ? '' : `<i class="ph-fill ${pl.icon}"></i>`}</div><b>${pl.name}</b><small>${pl.cat}</small></div>`; }).join('')}</div>
              ${m.last ? `<div class="chat-acts"><button class="chip" data-act="planAdd" style="border:0;cursor:pointer;background:var(--ink);color:#fff"><i class="ph-bold ph-plus"></i>Add to my plan</button><button class="chip" data-act="chatSend" data-text="Something closer?" style="border:0;cursor:pointer;background:#fff">Closer?</button><button class="chip" data-act="chatSend" data-text="Something cheaper?" style="border:0;cursor:pointer;background:#fff">Cheaper?</button></div>` : ''}`).join('')}
        </div>
        ${msgs.length ? '' : `<div class="chat-prompts">${(this.s.family ? ['Rainy day with kids', 'Ice cream + playground', 'Easy walk for little legs'] : PROMPTS[adult ? 'adult' : 'teen']).map(t => `<button data-act="chatSend" data-text="${t}">${t}</button>`).join('')}</div>`}
        <form class="chat-input" data-chatform="1"><input id="chatIn" placeholder="Type what you want to do…" autocomplete="off"><button type="button" class="mic" data-go="ask" aria-label="Talk instead"><i class="ph-fill ph-microphone"></i></button><button type="submit" class="send" aria-label="Send"><i class="ph-fill ph-paper-plane-right"></i></button></form>`; },

      quiz: () => `
        <div class="scenebox" style="height:300px">${house()}</div>${this.status()}
        <div class="sheet center" style="top:270px">
          <button class="chip blue" style="border:0;cursor:pointer" data-act="say"><i class="ph-fill ph-speaker-high"></i>Ollie asks</button>
          <h2 class="disp h-l" style="margin-top:10px">${this.curGame().riddle ? 'What am I?' : 'Ooh! What was it?'}</h2>
          <div class="quiz">${this.curGame().quiz.map(([ic, t, ok]) => `<button data-act="pick" ${ok ? 'data-ok="1"' : ''}><i class="ph-fill ${ic}" style="color:${this.curGame().color}"></i>${t}</button>`).join('')}</div>
        </div>`,

      camera: () => `
        <div class="cam">
          <div class="view" style="background-image:url(${here.img})"></div>
          ${this.status(true)}
          <button class="back" data-go="${this.hist[this.hist.length - 2] || 'task'}" aria-label="Close camera"><i class="ph-bold ph-x"></i></button>
          <span class="chip glass hint"><i class="ph-fill ph-scan"></i>Fit the ${adult ? 'mission' : 'skyline'} in the frame</span>
          <div class="frame"><i></i><i></i><i></i><i></i></div>
          <div class="bar"><i class="ph ph-images" style="font-size:26px;opacity:.7"></i><button class="shutter" data-act="snap" aria-label="Take photo"><span></span></button><span style="width:60px"></span></div>
        </div>`,

      celebrate: () => k ? `${this.status()}${stageScreen({ bg: '#FFEBD6', dome: '#FF8A4C', ink: '#1F2030', title: 'You<br>found it!',
          extra: floaties([['star', 8, 22, 36, -12], ['heart', 82, 18, 30, 10, .4], ['star', 12, 46, 24, 15, 1.2]]),
          bottom: `<div class="sticker-big" style="width:96px;height:96px;padding:7px;margin-top:-30px"><span style="background:${(s.lastWin || INSIDE[0]).color};font-size:40px"><i class="ph-fill ${(s.lastWin || INSIDE[0]).icon}"></i></span></div>
            <div class="mini-stats"><span><b data-count="${s.found}">0</b> stickers</span><span><b data-count="1240">0</b> steps</span></div>
            <button class="btn-white big" data-go="home">Keep going</button>` })}` : `
        ${this.status(true)}
        <div class="stage-bg" style="--sbg:#1F2030"></div>
        <div class="reward">
          <p class="eyebrow" style="color:#BFE6E2;text-align:center">${adult ? 'Mission Dolores' : 'Top of Dolores Park'}</p>
          <h2 class="disp h-l" style="color:#fff;text-align:center;margin-top:4px">Spot unlocked!</h2>
          <div class="rcards">
            ${(() => { const st = SET[adult ? 2 : (s.trivia ? 1 : 0)], col = SET_COLORS[adult ? 2 : (s.trivia ? 1 : 0)], rare = s.trivia || st[2] === 'rare';
              const deal = passPartners(!adult)[0];
              return [
                `<div class="rcard" style="--d:.5s"><div class="rc-in"><div class="rc-back"><i class="ph-fill ph-question"></i></div><div class="rc-front ${rare ? 'rare' : ''}"><span class="rsticker" style="background:${col}"><i class="ph-fill ${st[0]}"></i></span><b>${st[1]}</b><small>${rare ? 'Rare sticker' : 'Sticker'}</small></div></div></div>`,
                `<div class="rcard" style="--d:1s"><div class="rc-in"><div class="rc-back"><i class="ph-fill ph-question"></i></div><div class="rc-front"><span class="rsticker" style="background:#0F7C80"><i class="ph-fill ph-book-open-text"></i></span><b>Story card</b><small>${adult ? 'Oldest building in SF' : (s.trivia ? 'The golden hydrant' : 'Best view in the Mission')}</small></div></div></div>`,
                `<div class="rcard" style="--d:1.5s" ${s.passOn ? '' : 'data-go="pass"'}><div class="rc-in"><div class="rc-back"><i class="ph-fill ph-question"></i></div><div class="rc-front ${s.passOn ? '' : 'locked'}"><span class="rsticker" style="background:${s.passOn ? 'var(--mint)' : '#A19FA8'}"><i class="ph-fill ${s.passOn ? 'ph-ticket' : 'ph-lock-simple'}"></i></span><b>${s.passOn ? deal.deal : 'Deal'}</b><small>${s.passOn ? `${deal.name} · 0.1 mi` : `Get ${adult ? 'Block' : 'Teen'} Pass`}</small></div></div></div>`].join(''); })()}
          </div>
          <div class="setbar"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:900;color:#fff"><span>Mission District set</span><span>${(s.setGot || 4) + 1} of 12</span></div><div class="progress" style="background:rgba(255,255,255,.15)"><i style="width:0;background:#FFC83D" data-w="${Math.round(((s.setGot || 4) + 1) / 12 * 100)}%"></i></div></div>
        </div>
        <div class="sheet" style="top:auto;height:96px;background:transparent;box-shadow:none;padding:16px 20px">
          <div class="grow"></div>
          <div style="display:flex;gap:10px">
            <button class="btn btn-pill" style="flex:1;background:rgba(255,255,255,.14)" data-act="share"><i class="ph-bold ${r.sharing === 'yes' || s.shareOk ? 'ph-share-network' : 'ph-lock-simple'}"></i>Share</button>
            <button class="btn btn-pill" style="flex:1;background:#fff;color:var(--ink)" data-act="rewardDone">${adult ? 'Next stop' : 'Done'}</button>
          </div>
        </div>`,

      group: () => { const g = groupInfo(GROUP), y = g.youngest;
        return `<div class="leaf" style="height:290px" data-map="near" data-keys="${g.spots.join(',')}"></div>${this.status()}
        <button class="back" data-go="home" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet" style="top:252px;padding:18px 16px 16px;overflow-y:auto">
          <p class="eyebrow">Group outing</p>
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-top:2px">
            <h2 class="disp h-l">${g.spots.length} spots work for all ${GROUP.length}</h2>
            <div style="display:flex">${GROUP.map((id, i) => `<span title="${PLAYERS[id].name}" style="width:34px;height:34px;border-radius:50%;background:${PLAYERS[id].color};color:#fff;font-weight:900;display:grid;place-items:center;border:3px solid var(--paper);margin-left:${i ? -10 : 0}px">${PLAYERS[id].name[0]}</span>`).join('')}</div>
          </div>
          <div class="card-soft" style="margin-top:10px;background:var(--ink);color:#fff;display:flex;gap:10px;align-items:flex-start">
            <i class="ph-fill ph-shield-check" style="font-size:22px;color:#9FE0C8;flex:none"></i>
            <div><b style="font-size:14px">Following ${y.name}'s rules (${y.age}, ${y.country})</b><br><small style="font-size:12px;font-weight:600;opacity:.75">Location sharing off, chat filtered, no buying for kids</small></div>
          </div>
          <div class="stack">${g.spots.map(k2 => this.spotCard(k2, '<span class="pill-st">Works for all</span>')).join('')}</div>
          <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-pill" style="flex:1" data-go="ask"><i class="ph-fill ph-microphone"></i>"What can we all do?"</button><a class="btn btn-pill light" style="text-decoration:none;background:#fff" href="${gmapsDir(g.spots)}" target="_blank" rel="noopener" aria-label="Route in Google Maps"><i class="ph-fill ph-google-logo"></i></a></div>
          ${r.buying !== 'no' ? `<div class="deal-locked" style="margin-top:10px;cursor:pointer" data-go="pack"><span class="shine"></span><div class="lk"><i class="ph-fill ph-gift"></i></div><div><b>Family Outing Pack</b><small>${r.buying === 'yes' ? '5 guided outings for the whole group · FastSpring' : 'Ask a parent to unlock · FastSpring'}</small></div><i class="ph-bold ph-caret-right" style="margin-left:auto"></i></div>` : ''}
        </div>`; },

      ask: () => { const grp = this.groupMode;
        const reply = grp ? "Dolores Park! There's a playground for Mia, the hill for Lena, and Bi-Rite ice cream for everyone."
          : adult ? "Start at Mission Dolores, grab bread at Tartine, then catch a movie at the Roxie."
          : "Ritual's close for a coffee, or grab ice cream at Bi-Rite and head up the park for the sunset.";
        const chips = grp ? ['park', 'playground', 'birite'] : adult ? ['md', 'tartine', 'roxie'] : ['ritual', 'birite', 'park'];
        return `${this.status(true)}${stageScreen({ bg: '#1F2030', dome: '#2B2E4A', kick: s.askDone ? 'Ollie says' : 'Listening…',
          title: `"What can ${grp ? 'we all' : 'I'} do<br>nearby?"`,
          bottom: s.askDone
            ? `<span class="chip" style="background:rgba(255,255,255,.12);color:#fff"><i class="ph-fill ph-smiley"></i>You sound excited!</span>
               <div class="card-soft" style="background:#fff;color:var(--ink);text-align:left;font-size:15px;font-weight:700;line-height:1.4">${reply}</div>
               <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">${chips.map(c => `<span class="chip" style="background:rgba(255,255,255,.14);color:#fff"><i class="ph-fill ${PLACES[c].icon}"></i>${PLACES[c].name}</span>`).join('')}</div>
               <button class="btn-white" data-go="${grp ? 'group' : 'map'}">Show on the map</button>`
            : `<div class="wave">${Array.from({ length: 13 }, (_, i) => `<i style="animation-delay:${(i % 5) * .12}s"></i>`).join('')}</div>
               <p>Say what you're in the mood for. Ollie keeps personal details private.</p>
               <button class="btn-round" data-act="askDone" aria-label="Done talking"><i class="ph-fill ph-stop"></i></button>` })}
        <button class="back" data-go="${this.hist[this.hist.length - 2] || 'home'}" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>`; },

      pack: () => { const canBuy = r.buying === 'yes' || s.packOk;
        return `${this.status()}${stageScreen({ bg: '#FFEBD6', dome: '#FF8A4C', ink: '#1F2030', kick: s.bought ? 'Unlocked for the whole group' : 'FastSpring · digital pack', title: s.bought ? 'Pack<br>unlocked!' : 'Family<br>Outing Pack',
          extra: floaties([['star', 8, 24, 32, -10], ['pin', 84, 22, 28, 8, .5], ['heart', 80, 46, 26, 12, .9]]),
          bottom: s.bought
            ? `<p>5 guided outings, group badges and Ollie's voice tours are ready for Mia, Lena and Sam.</p><button class="btn-white big" data-go="group">Back to the outing</button>`
            : `<p>5 guided outings · group badges · Ollie voice tours<br><b style="font-size:26px;font-family:var(--display);font-stretch:80%">$4.99</b></p>
               ${canBuy ? `<button class="btn-white" data-act="checkout"><i class="ph-fill ph-lock-simple"></i>Buy with FastSpring</button>` : `<button class="btn-white" data-act="askBuy"><i class="ph-fill ph-user-circle"></i>Ask a parent to buy</button>`}
               <small style="opacity:.75;font-weight:800;font-size:11.5px">Only shown when k-ID allows buying</small>` })}
        <button class="back" data-go="group" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>`; },

      share: () => `
        <div class="scenebox dusk" style="height:250px">${scene('dusk')}</div>${this.status(true)}
        <button class="back" data-go="celebrate" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet" style="top:206px">
          <p class="eyebrow">Share your find</p>
          <h2 class="disp h-l" style="margin-top:4px">Send to friends</h2>
          <div class="share-friends">${[['A', '#1E7BD8', 'Ava'], ['J', '#22B88A', 'Jay'], ['N', '#FF6F91', 'Noor'], ['K', '#C98552', 'Kai']].map(([l, c, n]) => `<div><i style="background:${c}">${l}</i>${n}</div>`).join('')}</div>
          <div class="card-soft" style="margin-top:16px;display:flex;gap:10px;align-items:center"><i class="ph-fill ph-shield-check" style="color:var(--blue);font-size:22px"></i><small style="font-size:12.5px;font-weight:700;color:var(--ink-2)">Friends only. Your exact location is never shared.</small></div>
          <div class="grow"></div>
          <button class="btn btn-pill full" data-act="sent">Share</button>
        </div>`,

      locked: () => `${this.status()}${stageScreen({ bg: '#F3EEE6', dome: '#1F2030', ink: '#1F2030', kick: `Rule from k-ID · ${p.country}`, title: 'Sharing needs<br>a parent\'s OK',
          bottom: `<p>In ${p.countryName}, players under 16 need a parent to turn on sharing. Everything else works as normal.</p>
            <button class="btn-white" data-act="askParent"><i class="ph-fill ph-lock-simple"></i>Ask a parent</button><button class="link" style="color:rgba(255,255,255,.7);padding:4px" data-go="celebrate">Maybe later</button>` })}
        <button class="back" data-go="celebrate" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>`,

      finds: () => k ? `
        <div class="scenebox" style="height:200px">${scene('day')}</div>${this.status()}
        <button class="back" data-go="home" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet" style="top:150px">
          <p class="eyebrow">My sticker book</p>
          <h2 class="disp h-l" style="margin-top:4px">${s.found} of ${HUNT.length} found</h2>
          <div class="grid-stickers">${HUNT.concat([{ icon: 'ph-bird', color: '#1E7BD8', name: 'A bird' }]).map((h, i) => `<div><div class="stop ${i < s.found ? 'done' : 'lock'}"><span style="${i < s.found ? `background:${h.color}` : ''}"><i class="ph-fill ${i < s.found ? h.icon : 'ph-question'}"></i></span></div><small>${i < s.found ? h.name : '???'}</small></div>`).join('')}</div>
        </div>` : `
        <div class="plain"></div>${this.status()}
        <div class="sheet plain-sheet" style="top:0;border-radius:0;padding-top:56px;background:transparent;box-shadow:none">
          <p class="eyebrow">${s.finds} places visited</p>
          <h2 class="disp h-l" style="margin-top:4px">Mission District set</h2>
          <div style="margin-top:10px"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800"><span>${s.setGot || 4} of 12 stickers</span><span>${SET.filter(x => x[2]).length} rare</span></div><div class="progress"><i style="width:0;background:#FFC83D" data-w="${Math.round((s.setGot || 4) / 12 * 100)}%"></i></div></div>
          <div class="setgrid">${SET.map(([ic, t, rare], i) => { const got = i < (s.setGot || 4);
            return `<div class="sg ${got ? 'got' : ''} ${rare ? 'rare' : ''}"><span style="${got ? `background:${SET_COLORS[i]}` : ''}"><i class="ph-fill ${got ? ic : 'ph-question'}"></i></span><small>${got ? t : '???'}</small></div>`; }).join('')}</div>
          <p class="kid-note" style="margin-top:12px">Stickers are earned by visiting spots, never bought.</p>
        </div>${this.vnav('finds')}`,

      map: () => `
        <div class="leaf" style="bottom:0" data-map="${adult && !s.planKeys ? 'walk' : 'near'}" ${s.planKeys ? `data-keys="${s.planKeys.join(',')}"` : ''}></div>${this.status()}
        <div style="position:absolute;z-index:6;top:48px;left:16px;right:16px;display:flex;gap:8px"><span class="chip glass" style="flex:1;box-shadow:var(--soft)"><i class="ph-bold ph-magnifying-glass"></i>Search the Mission</span></div>
        <div style="position:absolute;z-index:6;top:88px;left:16px;display:flex;gap:6px"><span class="chip ink">All</span><span class="chip glass">History</span><span class="chip glass">Art</span>${adult ? '<span class="chip glass">Food</span>' : ''}</div>
        ${this.vnav('map')}`,

      me: () => `
        <div class="plain"></div>${this.status()}
        <div class="sheet plain-sheet" style="top:0;border-radius:0;padding-top:56px;background:transparent;box-shadow:none">
          <div style="display:flex;gap:14px;align-items:center"><div style="width:58px;height:58px;border-radius:50%;background:${p.color};display:grid;place-items:center;color:#fff;font:800 24px var(--display);flex:none">${p.name[0]}</div><div><h2 class="disp h-m">${p.name}</h2><small style="font-weight:800;color:var(--ink-2)">${p.age} · ${p.country === 'DE' ? 'Germany' : 'California, US'}</small></div></div>
          <p class="eyebrow" style="margin-top:14px">Profiles on this phone</p>
          <div style="display:flex;gap:8px;align-items:center;margin-top:8px">${this.profiles.map(id => `<span title="${PLAYERS[id].name}" style="width:36px;height:36px;border-radius:12px;background:${PLAYERS[id].color};color:#fff;font-weight:900;display:grid;place-items:center">${PLAYERS[id].name[0]}</span>`).join('')}
            <button class="chip" style="border:0;cursor:pointer" data-go="addProfile"><i class="ph-bold ph-plus"></i>Add profile</button>
            ${this.profiles.length > 1 ? `<button class="chip" style="border:0;cursor:pointer" data-go="profiles"><i class="ph-bold ph-arrows-left-right"></i>Switch</button>` : ''}</div>
          <p class="eyebrow" style="margin-top:18px;display:flex;gap:6px;align-items:center"><i class="ph ph-shield-check"></i>Your features</p>
          <div class="stack" style="margin-top:4px">${KPERMS.filter(([, , key]) => r[key] !== 'no').map(([id, t, key, ic]) => { const v = (key === 'sharing' && s.shareOk) ? 'yes' : r[key];
            return `<div class="perm"><i class="ic ph ${ic}"></i><div><b>${t}</b><small>${v === 'yes' ? 'You can turn this on or off' : 'A parent needs to OK this'}</small></div>${v === 'yes'
              ? `<button class="tog on" data-act="tog" aria-label="Toggle ${t}"><i></i></button>`
              : `<button class="chip ${s.asked && s.asked[id] ? 'mint' : ''}" style="border:0;cursor:pointer;margin-left:auto" data-act="stage" data-id="${id}">${s.asked && s.asked[id] ? 'Added' : 'Ask'}</button>`}</div>`; }).join('')}</div>
          ${Object.keys(s.asked || {}).length ? `<button class="btn btn-pill full" style="margin-top:14px" data-act="sendAsk"><i class="ph-bold ph-paper-plane-tilt"></i>Ask my parent (${Object.keys(s.asked).length})</button>` : ''}
          <p class="kid-note" style="margin-top:10px">Features k-ID doesn't allow at your age in your country are hidden.</p>

        </div>${this.vnav('me')}`,
    };
  }

  /* ---------- render + motion ---------- */
  render(dir = 'fwd') {
    const html = (this.screens()[this.screen] || this.screens().home)();
    const old = this.phoneEl.querySelector('.screen');
    const scr = document.createElement('div');
    const hasNav = html.includes('class="bnav"');
    const kidish = this.kid || (this.s.familyHunt && ['task', 'quiz', 'celebrate'].includes(this.screen));
    const isApp = ['home', 'map', 'finds', 'me', 'group', 'chat', 'share', 'trivia', 'task', 'celebrate', 'pass'].includes(this.screen) && !kidish;
    scr.className = `screen enter-${dir} entering ${this.adult ? 'adult' : ''} ${hasNav ? 'with-nav' : ''} ${isApp ? 'app' : ''}`;
    scr.innerHTML = html;
    old.replaceWith(scr);
    scr.addEventListener('click', (e) => this.onClick(e));
    if (!this.roamBound) { this.roamBound = true; this.roam.addEventListener('click', (e) => { e.stopPropagation(); this.ollieReact(); }); }
    scr.addEventListener('submit', (e) => { if (!e.target.dataset.chatform) return; e.preventDefault(); const i = scr.querySelector('#chatIn'); this.chatSend(i.value); });
    if (this.screen === 'chat') setTimeout(() => this.scrollChat(), 0);
    const qs = new URLSearchParams(location.search).get('ask');
    if (this.screen === 'chat' && qs && !this.askedOnce) { this.askedOnce = true; setTimeout(() => this.chatSend(qs), 300); }
    setTimeout(() => scr.classList.remove('entering', 'enter-' + dir), 1100);
    this.placeOllie(scr);
    this.afterMount(scr);
  }
  placeOllie(scr) {
    const seek = this.kid && this.screen === 'home' && !this.s.outside && !this.s.ollieFound;
    const from = this.last, to = spot(this.screen, this.p.band, seek ? 'seek' : navPref.side), roam = this.roam;
    scr.appendChild(roam);
    roam.classList.toggle('front', !!to.front);
    roam.classList.toggle('peek', !!to.peek);
    if (to.peek && (!from || !from.peek)) { roam.classList.remove('pop'); void roam.offsetWidth; roam.classList.add('pop'); }
    const apply = (q) => { roam.style.left = q.x + '%'; roam.style.top = q.y + '%'; roam.style.width = q.w + '%'; roam.style.opacity = q.hide ? 0 : 1; };
    if (from) { roam.style.transition = 'none'; apply(from); void roam.offsetWidth; roam.style.transition = ''; } else apply(to);
    requestAnimationFrame(() => {
      apply(to);
      const moved = from && (Math.abs(from.x - to.x) + Math.abs(from.y - to.y) + Math.abs(from.w - to.w) > 6);
      if (moved && !to.hide) { roam.classList.remove('hop'); void roam.offsetWidth; roam.classList.add('hop'); setTimeout(() => roam.classList.remove('hop'), 760); }
    });
    const o = this.ollie;
    o.setAttribute('mood', to.mood);
    if (to.talk && o.say) setTimeout(() => o.say(1800), 50);
    this.last = to;
  }
  afterMount(scr) {
    scr.querySelectorAll('[data-count]').forEach(el => {
      const end = +el.dataset.count, t0 = performance.now() + 450, dur = 900;
      const tick = (t) => { const k = Math.min(1, Math.max(0, (t - t0) / dur)); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))).toLocaleString(); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    setTimeout(() => scr.querySelectorAll('[data-w]').forEach(el => el.style.width = el.dataset.w), 500);
    if (this.screen === 'task' && this.kid) setTimeout(() => this.say(), 800);
    if (this.screen === 'celebrate') this.confetti();
    this.setupNav(scr);
    this.setupDial(scr);
    const m = scr.querySelector('[data-map]'); if (m) this.setupMap(m);
  }
  setupNav(scr) {
    const nav = scr.querySelector('.bnav'); if (!nav) return;
    const btns = [...nav.querySelectorAll('button')], idx = Math.max(0, btns.findIndex(b => b.classList.contains('on')));
    const ind = nav.querySelector('.ind'), at = (i) => btns[i].offsetLeft + 'px';
    ind.style.width = btns[idx].offsetWidth + 'px';
    ind.style.transition = 'none'; ind.style.left = at(this.navIdx ?? idx);
    requestAnimationFrame(() => requestAnimationFrame(() => { ind.style.transition = ''; ind.style.left = at(idx); }));
    this.navIdx = idx;
  }
  setupDial(scr) {
    const dial = scr.querySelector('#dial'); if (!dial) return;
    const spans = [...dial.children], bands = scr.querySelectorAll('#bands span');
    const bandOf = (a) => a < 13 ? 'kid' : a < 18 ? 'teen' : 'adult';
    const mark = (v) => {
      spans.forEach(sp => { const d = Math.abs(+sp.dataset.v - v); sp.classList.toggle('on', d === 0); sp.classList.toggle('near', d === 1); });
      bands.forEach(b => b.classList.toggle('on', b.dataset.b === bandOf(v)));
    };
    const center = (v, smooth) => { const sp = spans[v - 4]; dial.scrollTo({ left: sp.offsetLeft - dial.clientWidth / 2 + sp.offsetWidth / 2, behavior: smooth ? 'smooth' : 'auto' }); };
    setTimeout(() => { center(this.s.age); mark(this.s.age); }, 30);
    let raf;
    dial.addEventListener('scroll', () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const mid = dial.scrollLeft + dial.clientWidth / 2;
        const v = 4 + Math.max(0, Math.min(95, Math.round((mid - spans[0].offsetLeft - spans[0].offsetWidth / 2) / spans[0].offsetWidth)));
        if (v !== this.s.age) { this.s.age = v; mark(v); if (navigator.vibrate) navigator.vibrate(4); }
      });
    }, { passive: true });
    spans.forEach(sp => sp.addEventListener('click', () => center(+sp.dataset.v, true)));
    // mouse drag to scroll (for laptops)
    let md = null;
    dial.addEventListener('mousedown', (e) => { md = { x: e.clientX, l: dial.scrollLeft }; dial.style.scrollSnapType = 'none'; });
    window.addEventListener('mousemove', (e) => { if (md) dial.scrollLeft = md.l - (e.clientX - md.x); });
    window.addEventListener('mouseup', () => { if (!md) return; md = null; dial.style.scrollSnapType = ''; center(this.s.age, true); });
  }
  setupMap(el) {
    if (!window.L) { el.innerHTML = '<p style="padding:120px 20px;text-align:center;color:#888;font-weight:800">Map needs an internet connection</p>'; return; }
    const map = L.map(el, { zoomControl: false, attributionControl: true, scrollWheelZoom: false });
    if (window.maplibregl && L.maplibreGL) cleanMapStyle().then(style => L.maplibreGL({ style, attribution: '© OpenFreeMap © OpenMapTiles © OpenStreetMap' }).addTo(map));
    else L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }).addTo(map);
    const walk = el.dataset.map === 'walk', home = this.screen === 'home';
    const pin = (pl, num, label) => L.marker([pl.lat, pl.lng], { icon: L.divIcon({ className: '', iconSize: [36, 46], iconAnchor: [18, 46],
      html: `<div class="mpin">${num ? `<i class="n">${num}</i>` : ''}<span style="${pl.img ? `background-image:url(${pl.img})` : `background:${pl.color}`}">${pl.img ? '' : `<i class="ph-fill ${pl.icon}"></i>`}</span>${label ? `<em class="mlabel" style="font-style:normal">${label}</em>` : ''}</div>` }) });
    if (walk) L.polyline(WALK.map(k2 => [PLACES[k2].lat, PLACES[k2].lng]), { color: '#1F2030', weight: 4, opacity: .8, dashArray: '1 9', lineCap: 'round' }).addTo(map);
    const keys = el.dataset.keys ? el.dataset.keys.split(',') : walk ? WALK : FOR_BAND[this.p.band];
    keys.forEach((k2, i) => pin(PLACES[k2], walk ? String(i + 1) : '', home || this.screen === 'group' ? '' : PLACES[k2].name.replace('The ', '').replace(' murals', '')).addTo(map));
    if (false && this.p.band !== 'kid' && !el.dataset.keys) (walk ? ['tartine', 'roxie'] : ['park', 'clarion']).forEach(k2 => L.marker([PLACES[k2].lat + .0007, PLACES[k2].lng - .0006], { icon: L.divIcon({ className: '', iconSize: [34, 34], iconAnchor: [17, 34],
      html: '<div class="drop"><i class="ph-fill ph-gift"></i></div>' }) }).addTo(map));
    if (this.s.passOn) passPartners(this.p.band === 'teen').forEach(x => L.marker([x.lat, x.lng], { icon: L.divIcon({ className: '', iconSize: [36, 46], iconAnchor: [18, 46],
      html: `<div class="mpin"><span style="background:${x.color}"><i class="ph-fill ${x.icon}"></i></span><em class="mlabel" style="font-style:normal;background:var(--mint);color:#fff">${x.deal}</em></div>` }) }).addTo(map));
    const me = walk ? PLACES.md : PLACES.park;
    L.marker([me.lat - .0011, me.lng + .0016], { icon: L.divIcon({ className: '', iconSize: [40, 40], iconAnchor: [20, 20], html: '<div class="me-ollie"><span class="ollie-ic"></span></div>' }) }).addTo(map);
    const b = L.latLngBounds(keys.map(k2 => [PLACES[k2].lat, PLACES[k2].lng]));
    const left = navPref.side === 'left';
    const grp = this.screen === 'group';
    const fit = () => map.fitBounds(b, { paddingTopLeft: [40, grp ? 90 : home ? 115 : 140], paddingBottomRight: [home || grp ? 40 : 130, grp ? 30 : home ? 40 : 120], maxZoom: 16 });
    fit(); setTimeout(() => { map.invalidateSize(); fit(); }, 450);
  }
  say() {
    const o = this.ollie; if (!o.say) return;
    const prev = o.getAttribute('mood'); o.setAttribute('mood', 'idle'); o.say(1800);
    setTimeout(() => o.setAttribute('mood', prev), 1800);
  }
  onClick(e) {
    const go = e.target.closest('[data-go]'), act = e.target.closest('[data-act]');
    if (act) return this.act(act.dataset.act, act);
    if (go && go.dataset.go) { if (go.dataset.go === 'camera' && this.r.camera !== 'yes') return; this.go(go.dataset.go); }
  }
  act(a, el) {
    if (a === 'ageDone') {
      if (this.onAge && !this.adding) return this.onAge(this.s.age);
      // k-ID decides the experience from the age + where you are; the demo maps it to a persona
      const band = this.s.age < 13 ? 'kid' : this.s.age < 18 ? 'teen' : 'adult';
      const target = band === 'kid' ? 'mia' : band === 'teen' ? (this.p.country === 'DE' ? 'lena' : 'leo') : 'sam';
      if (this.adding) { if (!this.profiles.includes(target)) this.profiles.push(target); }
      else if (target !== this.p.id) { const age = this.s.age; this.p = PLAYERS[target]; this.r = RULES[target]; this.s.shareOk = this.r.sharing === 'yes'; this.s.age = age; this.profiles = [target]; }
      if (this.adding) { const added = PLAYERS[target]; this.adding = false; this.toast(`${added.name} added · k-ID checked`, 'ph-user-plus'); this.go('profiles'); return; }
      this.go('kidcheck');
    }
    if (a === 'afterCheck') this.go(this.kid ? 'consent' : 'lock');
    if (a === 'usePin') { this.s.usePin = true; this.render('none'); }
    if (a === 'faceOk') { const f = this.phoneEl.querySelector('#face'); f.classList.add('ok'); f.innerHTML = '<i class="ph-fill ph-check-circle"></i>'; setTimeout(() => { this.toast('Face ID is on', 'ph-scan-smiley'); this.introI = 0; this.go('intro'); }, 800); }
    if (a === 'pin' || a === 'pinBack') {
      this.pin = this.pin || '';
      this.pin = a === 'pin' ? (this.pin + el.dataset.n).slice(0, 4) : this.pin.slice(0, -1);
      this.phoneEl.querySelectorAll('#pinDots i').forEach((d, i) => d.classList.toggle('on', i < this.pin.length));
      if (navigator.vibrate) navigator.vibrate(5);
      if (this.pin.length === 4) {
        const done = this.pin; this.pin = '';
        setTimeout(() => {
          if (this.screen === 'lock') { this.toast('PIN saved', 'ph-lock-simple'); this.introI = 0; this.go('intro'); }
          else { this.enterProfile(this.unlockFor); }
        }, 250);
      }
    }
    if (a === 'pickProfile') {
      const id = el.dataset.id; this.unlockFor = id; this.s.usePin = false;
      if (this.lockOf(id) === 'none') return this.enterProfile(id);
      this.go('unlock');
      if (this.lockOf(id) === 'face') setTimeout(() => { const f = this.phoneEl.querySelector('#face'); if (!f || this.screen !== 'unlock') return; f.classList.add('ok'); f.innerHTML = '<i class="ph-fill ph-check-circle"></i>'; setTimeout(() => this.enterProfile(id), 600); }, 1400);
    }
    if (a === 'addGo') { this.adding = true; this.go('age'); }
    if (a === 'say') this.say();
    if (a === 'introNext') { if ((this.introI || 0) >= 3) { this.s.firstRun = true; this.go('home'); } else { this.introI = (this.introI || 0) + 1; this.render('fwd'); } }
    if (a === 'introSkip') { this.s.firstRun = true; this.go('home'); }
    if (a === 'startDone') { this.s.startGone = true; const c = el.closest('.start-card'); if (c) { c.classList.add('gone'); setTimeout(() => c.remove(), 320); } }
    if (a === 'chatSend') this.chatSend(el.dataset.text);
    if (a === 'planAdd') { const last = [...(this.s.chat || [])].reverse().find(m => m.keys && !m.plan); this.s.chat.forEach(m => m.last = false); this.s.chat.push({ from: 'o', plan: true, keys: last ? last.keys : [] }); this.render('none'); this.scrollChat(); this.toast('Added to your plan', 'ph-check-circle'); }
    if (a === 'planStart') { const pl = [...this.s.chat].reverse().find(m => m.plan); this.s.planKeys = pl ? pl.keys : null; this.go('map'); }
    if (a === 'askChat') { this.parentFor = 'chat'; this.go('parent'); }
    if (a === 'answer') {
      if (!el.dataset.ok) { el.classList.add('wrong'); this.toast('Not quite, try again!', 'ph-x-circle'); return; }
      el.classList.add('right'); this.ollie.setAttribute('mood', 'cheer'); this.s.trivia = true;
      setTimeout(() => this.go('celebrate'), 700);
    }
    if (a === 'rewardDone') { this.s.setGot = (this.s.setGot || 4) + 1; this.s.trivia = false; this.go('home'); }
    if (a === 'familyOn') {
      if (this.s.kids) { this.s.family = true; this.famFlip(); return; }
      const sh = document.createElement('div'); sh.className = 'fam-setup';
      this.s.kidsDraft = [5, 8];
      const draw = () => sh.innerHTML = `<div class="fam-card"><p class="eyebrow">Family mode</p><h2 class="disp h-l" style="margin-top:4px">Who's with you?</h2>
        <p class="p">Add the kids' ages. No accounts for them, nothing about them leaves your phone.</p>
        <div class="kid-ages">${this.s.kidsDraft.map((ag, i) => `<span>Kid, ${ag}<button data-x="${i}" aria-label="Remove"><i class="ph-bold ph-x"></i></button></span>`).join('')}<span style="padding:6px 6px 6px 12px;background:transparent;box-shadow:inset 0 0 0 2px #E9DCC8">Add<button data-add="1" aria-label="Add a kid"><i class="ph-bold ph-plus"></i></button></span></div>
        <button class="btn btn-pill full" style="margin-top:18px" data-start="1"><i class="ph-fill ph-users-three"></i>Start family mode</button>
        <button class="link" style="width:100%" data-cancel="1">Not now</button></div>`;
      draw();
      sh.addEventListener('click', (e) => {
        const t = e.target.closest('button'); if (!t) return; e.stopPropagation();
        if (t.dataset.x) { this.s.kidsDraft.splice(+t.dataset.x, 1); draw(); }
        if (t.dataset.add) { this.s.kidsDraft.push([3, 6, 10, 11][this.s.kidsDraft.length % 4]); draw(); }
        if (t.dataset.cancel) sh.remove();
        if (t.dataset.start) { this.s.kids = this.s.kidsDraft.length ? this.s.kidsDraft : [6]; this.s.family = true; sh.remove(); this.famFlip(); }
      });
      this.phoneEl.querySelector('.screen').appendChild(sh);
    }
    if (a === 'familyOff') { this.s.family = false; this.s.familyHunt = false; this.render('none'); this.toast('Back to just you', 'ph-user'); }
    if (a === 'familyHunt') { this.s.familyHunt = true; this.go('task'); }
    if (a === 'startGroup') { this.groupMode = true; this.go('group'); this.toast('Mia, Lena and Sam are in', 'ph-users-three'); }
    if (a === 'askDone') { this.s.askDone = true; this.render('none'); this.ollie.setAttribute('mood', 'wave'); setTimeout(() => this.ollie.say && this.ollie.say(3200), 60); }
    if (a === 'checkout') {
      const prod = el.dataset.product || 'Family Outing Pack', price = +(el.dataset.price || 4.99), monthly = !!el.dataset.product;
      const sh = document.createElement('div'); sh.className = 'fs-sheet';
      sh.innerHTML = `<div class="fs-card"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:13px;letter-spacing:1px">FASTSPRING · SECURE CHECKOUT</b><i class="ph-fill ph-lock-simple"></i></div>
        <div style="display:flex;justify-content:space-between;margin-top:14px;font-weight:800"><span>${prod}</span><span>$${price.toFixed(2)}${monthly ? '/mo' : ''}</span></div>
        <div style="display:flex;justify-content:space-between;color:var(--ink-2);font-size:13px;font-weight:700;margin-top:4px"><span>Sales tax (handled by FastSpring)</span><span>$${(price * .0863).toFixed(2)}</span></div>
        <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--line);font-weight:900"><span>Total</span><span>$${(price * 1.0863).toFixed(2)}</span></div>
        <button class="btn btn-pill full" style="margin-top:14px" data-pay="1"><i class="ph-fill ph-apple-logo"></i>Pay</button>
        <small style="display:block;text-align:center;color:var(--ink-3);font-weight:700;margin-top:8px">Sandbox · no real charge</small></div>`;
      this.phoneEl.querySelector('.screen').appendChild(sh);
      sh.querySelector('[data-pay]').onclick = () => { sh.remove(); if (monthly) { this.s.passOn = true; this.render('pop'); this.toast(`${prod} is on`, 'ph-ticket'); } else { this.s.bought = true; this.render('pop'); } this.confetti(); };
    }
    if (a === 'askBuy') { this.parentFor = 'buy'; this.go('parent'); }
    if (a === 'tog') { el.classList.toggle('on'); if (navigator.vibrate) navigator.vibrate(6); }
    if (a === 'stage') { this.s.asked = this.s.asked || {}; const id = el.dataset.id; if (this.s.asked[id]) delete this.s.asked[id]; else this.s.asked[id] = 1; this.render('none'); }
    if (a === 'sendAsk') { this.s.asked = {}; this.render('none'); this.toast('Sent to your parent', 'ph-paper-plane-tilt'); }
    if (a === 'dismiss') { this.s.hereGone = true; const c = el.closest('.here-card'); if (c) { c.classList.add('gone'); setTimeout(() => c.remove(), 320); } }
    if (a === 'pick') {
      const g = this.curGame();
      if (g.riddle && !el.dataset.ok) { el.classList.add('dim'); this.toast('Hmm, not quite. Try again!', 'ph-question'); this.ollie.setAttribute('mood', 'search'); return; }
      el.classList.add('picked'); el.parentNode.querySelectorAll('button').forEach(b => b !== el && b.classList.add('dim'));
      this.ollie.removeAttribute('talking'); this.ollie.setAttribute('mood', 'cheer');
      setTimeout(() => { this.s.lastWin = g; this.s.game = Math.min((this.s.game || 0) + 1, INSIDE.length); this.s.found = Math.min(this.s.found + 1, HUNT.length); this.go('celebrate'); }, 750);
    }
    if (a === 'bingo') { this.s.bingoNow = +el.dataset.i; this.go('task'); }
    if (a === 'bingoFound') { const i = this.s.bingoNow ?? 0; this.s.bingo[i] = 1; this.s.lastWin = this.curGame(); this.s.found = Math.min(this.s.found + 1, HUNT.length); this.go('celebrate'); return; }
    if (a === 'goInside') { this.s.outside = false; this.render('none'); }
    if (a === 'askOutsideGo') { this.parentFor = 'outside'; this.go('parent'); }
    if (a === 'askPass') { this.parentFor = 'pass'; this.go('parent'); }
    if (a === 'approve') {
      if (this.parentFor === 'chat') { this.s.chatOk = true; this.parentFor = null; this.go('chat'); this.toast('Parent turned on Ask Ollie', 'ph-chat-circle-dots'); return; }
      if (this.parentFor === 'outside') { this.s.outside = true; this.parentFor = null; this.go('home'); this.toast('Your grown-up said yes!', 'ph-tree'); this.confetti(); return; }
      if (this.parentFor === 'pass') { this.s.passOn = true; this.parentFor = null; this.go('pass'); this.toast('Your parent gifted you Teen Pass', 'ph-gift'); this.confetti(); return; }
      if (this.parentFor === 'buy') { this.s.packOk = true; this.parentFor = null; this.go('pack'); this.toast('Parent approved the pack'); return; }
      if (this.parentFor === 'share') {
        this.s.shareOk = true; this.parentFor = null;
        const u = document.createElement('div'); u.className = 'unlock'; u.innerHTML = '<div><i class="ph-fill ph-lock-simple-open"></i></div>';
        this.phoneEl.querySelector('.screen').appendChild(u);
        setTimeout(() => { this.go('share'); this.toast('Parent approved sharing'); }, 900);
      } else this.go('approved');
    }
    if (a === 'deny') { const f = this.parentFor; this.parentFor = null; this.go(f === 'share' ? 'celebrate' : f === 'buy' ? 'pack' : f === 'pass' ? 'pass' : f === 'outside' ? 'home' : f === 'chat' ? 'home' : 'denied'); }
    if (a === 'snap') {
      const scr = this.phoneEl.querySelector('.screen'), cam = scr.querySelector('.cam');
      const f = document.createElement('div'); f.className = 'flash'; scr.appendChild(f);
      const c = document.createElement('div'); c.className = 'checking';
      c.innerHTML = `<div><div class="spin"></div><b style="font-size:16px">Checking your photo…</b><br><small style="opacity:.7;font-weight:700">AI match</small></div>`;
      setTimeout(() => scr.appendChild(c), 250);
      setTimeout(() => { c.remove(); cam.classList.add('matched'); this.ollie.setAttribute('mood', 'cheer'); const m = document.createElement('div'); m.className = 'match'; m.innerHTML = '<i class="ph-bold ph-check"></i>Match!'; scr.appendChild(m); }, 1350);
      setTimeout(() => { this.s.story = true; this.s.trivia = false; this.s.finds++; this.go('celebrate'); }, 2100);
    }
    if (a === 'share') { if (this.r.sharing === 'yes' || this.s.shareOk) this.go('share'); else if (this.r.sharing === 'ask') this.go('locked'); }
    if (a === 'askParent') { this.parentFor = 'share'; this.go('parent'); }
    if (a === 'sent') { this.go('home'); this.toast('Shared with 4 friends', 'ph-paper-plane-tilt'); }
  }
}

/* ---------- press feedback ---------- */
const PRESS = '.btn, .vnav button, .back, .corner-btn, .quiz button, .shutter, .player, .ctrl, .chip[data-act], .link, .arrive .go, .next-card, .pcard';
document.addEventListener('pointerdown', (e) => {
  const st = e.target.closest('.stop'); if (st) { st.classList.add('pressed-s'); return; }
  const el = e.target.closest(PRESS); if (!el) return;
  el.classList.add('pressable', 'pressed'); el.classList.remove('boing');
  if (navigator.vibrate) navigator.vibrate(8);
});
const release = () => {
  document.querySelectorAll('.pressed-s').forEach(x => x.classList.remove('pressed-s'));
  document.querySelectorAll('.pressed').forEach(el => { el.classList.remove('pressed'); void el.offsetWidth; el.classList.add('boing'); setTimeout(() => el.classList.remove('boing'), 460); });
};
['pointerup', 'pointercancel'].forEach(t => document.addEventListener(t, release));

/* ---------- exports for the React shell ---------- */
window.EYB = { Phone, PLAYERS, RULES, KPERMS, PLACES, AGES, FOR_BAND, HUNT, PARTNERS, ollieAnswer, redact, stageScreen };
