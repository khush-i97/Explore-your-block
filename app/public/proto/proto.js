/* Explore Your Block prototype screens, shared with prototype.html. Classic script: exposes window.EYB. */

/* ---------- players + what k-ID returns ---------- */
const PLAYERS = {
  mia:  { id: 'mia',  name: 'Mia',  age: 8,  country: 'US', countryName: 'the US', band: 'kid',   color: '#FF6F91' },
  leo:  { id: 'leo',  name: 'Leo',  age: 14, country: 'US', countryName: 'the US', band: 'teen',  color: '#4C6FFF' },
  lena: { id: 'lena', name: 'Lena', age: 14, country: 'DE', countryName: 'Germany', band: 'teen', color: '#22B88A' },
  sam:  { id: 'sam',  name: 'Sam',  age: 32, country: 'US', countryName: 'the US', band: 'adult', color: '#C98552' },
};
const RULES = {
  mia:  { camera: 'no',  location: 'zones', sharing: 'no',  buying: 'no',  map: 'no',  voice: 'ask', vchat: 'no' },
  leo:  { camera: 'yes', location: 'yes',   sharing: 'yes', buying: 'ask', map: 'yes', voice: 'yes', vchat: 'yes' },
  lena: { camera: 'yes', location: 'yes',   sharing: 'ask', buying: 'ask', map: 'yes', voice: 'yes', vchat: 'ask' },
  sam:  { camera: 'yes', location: 'yes',   sharing: 'yes', buying: 'yes', map: 'yes', voice: 'yes', vchat: 'yes' },
};
// the permissions we declare to k-ID, and which rule each one reads
const KPERMS = [
  ['camera-access', 'Camera', 'camera', 'ph-camera'],
  ['ai-media-upload', 'AI photo check', 'camera', 'ph-sparkle'],
  ['photo-video-sharing', 'Share finds', 'sharing', 'ph-share-network'],
  ['in-game-purchases', 'Buying (FastSpring)', 'buying', 'ph-shopping-bag'],
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
  clarion: { name: 'Clarion Alley murals', lat: 37.7630, lng: -122.4215, img: null, cat: 'Art', color: '#FF6F91', icon: 'ph-paint-brush-broad' },
};
Object.assign(PLACES, {
  playground: { name: 'Helen Diller Playground', lat: 37.7601, lng: -122.4273, img: null, cat: 'Playground', color: '#4C6FFF', icon: 'ph-balloon' },
  birite:  { name: 'Bi-Rite Creamery', lat: 37.7616, lng: -122.4258, img: null, cat: 'Ice cream', color: '#FF6F91', icon: 'ph-ice-cream' },
  tartine: { name: 'Tartine Bakery', lat: 37.7614, lng: -122.4241, img: null, cat: 'Bakery', color: '#C98552', icon: 'ph-bread' },
  ritual:  { name: 'Ritual Coffee Roasters', lat: 37.7564, lng: -122.4214, img: null, cat: 'Café', color: '#8A5638', icon: 'ph-coffee' },
  roxie:   { name: 'Roxie Theater', lat: 37.7650, lng: -122.4228, img: null, cat: 'Movies', color: '#E5484D', icon: 'ph-film-slate' },
  foreign: { name: 'Foreign Cinema', lat: 37.7564, lng: -122.4193, img: null, cat: 'Dinner', color: '#1F2030', icon: 'ph-fork-knife' },
});
// who each spot suits (k-ID band); group mode keeps only spots that suit everyone
const AGES = { park: ['kid', 'teen', 'adult'], playground: ['kid', 'adult'], birite: ['kid', 'teen', 'adult'], tartine: ['kid', 'teen', 'adult'], md: ['kid', 'teen', 'adult'],
  ritual: ['teen', 'adult'], clarion: ['teen', 'adult'], roxie: ['teen', 'adult'], foreign: ['adult'] };
const FOR_BAND = { kid: ['playground', 'birite', 'park'], teen: ['park', 'ritual', 'clarion', 'roxie', 'birite'], adult: ['md', 'tartine', 'roxie', 'foreign'] };
const BAND_ORDER = { kid: 0, teen: 1, adult: 2 };
const GROUP = ['mia', 'lena', 'sam'];
const groupInfo = (ids) => {
  const youngest = ids.map(id => PLAYERS[id]).sort((a, b) => a.age - b.age)[0];
  const spots = Object.keys(AGES).filter(k => ids.every(id => AGES[k].includes(PLAYERS[id].band)));
  return { youngest, spots, rules: RULES[youngest.id] };
};
const WALK = ['md', 'tartine', 'roxie', 'foreign'];
const WALK_SUB = ['History · start here', 'Bakery · 0.2 mi', 'Movies · 0.3 mi', 'Dinner · 0.6 mi'];
const ROUTE = [[37.76453,-122.42704],[37.76456,-122.42657],[37.76456,-122.42647],[37.76457,-122.42632],[37.76458,-122.42624],[37.76434,-122.42621],[37.76423,-122.4262],[37.76402,-122.42618],[37.76353,-122.42613],[37.76311,-122.42609],[37.76311,-122.42618],[37.76303,-122.42617],[37.76296,-122.42616],[37.76263,-122.42613],[37.7622,-122.42609],[37.76216,-122.42624],[37.7621,-122.42623],[37.76152,-122.42618],[37.76149,-122.42627],[37.76142,-122.42627],[37.76135,-122.42626],[37.76091,-122.42622],[37.7599,-122.42612],[37.75982,-122.42611],[37.75975,-122.42611],[37.75965,-122.4261],[37.75957,-122.42609],[37.7591,-122.42604],[37.75906,-122.42604],[37.75833,-122.42597],[37.75823,-122.42767],[37.75821,-122.42774],[37.75819,-122.42781],[37.75819,-122.42785],[37.75818,-122.42791],[37.75818,-122.42793],[37.75818,-122.42798],[37.75817,-122.4281],[37.7582,-122.4281],[37.7584,-122.42812],[37.7589,-122.42817],[37.7589,-122.42812],[37.75891,-122.42804],[37.75932,-122.4281],[37.7597,-122.42814],[37.7597,-122.42808],[37.75972,-122.42789],[37.75972,-122.42781],[37.75972,-122.42777],[37.75973,-122.42777],[37.75975,-122.42777],[37.75976,-122.42776],[37.75977,-122.42776],[37.75978,-122.42775],[37.75979,-122.42774],[37.75979,-122.42773],[37.7598,-122.42771],[37.7598,-122.42769],[37.75981,-122.42768],[37.75981,-122.42766],[37.75979,-122.42764],[37.75982,-122.42723],[37.75984,-122.42721],[37.75986,-122.42717],[37.75987,-122.42713],[37.75987,-122.42709],[37.75985,-122.42705],[37.75983,-122.42701],[37.75984,-122.4268],[37.75987,-122.42635],[37.75989,-122.42632],[37.7599,-122.42623],[37.7599,-122.42612],[37.75991,-122.42602],[37.75992,-122.42587],[37.75993,-122.42576],[37.75991,-122.42576],[37.75997,-122.42498],[37.75997,-122.42489],[37.75997,-122.42483],[37.76004,-122.42379],[37.76005,-122.4237],[37.76006,-122.42361],[37.76006,-122.42354],[37.76004,-122.42354],[37.76008,-122.42297],[37.76008,-122.42288],[37.76009,-122.42284],[37.76012,-122.42229],[37.76015,-122.42159],[37.76017,-122.42157],[37.76022,-122.42158],[37.76055,-122.42159],[37.76111,-122.42164],[37.76162,-122.42169],[37.76162,-122.42164],[37.76163,-122.42159],[37.76163,-122.42154],[37.76163,-122.42148],[37.76171,-122.42148],[37.76176,-122.42148],[37.76178,-122.4215],[37.7618,-122.4215],[37.76256,-122.42157],[37.76258,-122.42157],[37.76262,-122.42158],[37.76293,-122.42161],[37.76294,-122.42149],[37.76294,-122.42149]];

/* ---------- drawn street (kids + teen home) ---------- */
const PAL = {
  day:  { sky1:'#BFE3FF', sky2:'#E6F4FF', sun:'#FFE08A', cloudO:.9, b1:'#FFB4A2', b2:'#A8C5FF', roof:'#7F9EF0', b3:'#FFD27A', stripe:'#FF8FA8', b4:'#9FE0C8', win:'#fff', winO:.85, tree:'#5FBF7F', walk:'#E9E3D8', kid:true },
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
  { icon: 'ph-circle', color: '#4C6FFF', at: 'the playground', name: 'A circle', hint: ['#4C6FFF', '#4C6FFF', '#4C6FFF'] },
  { icon: 'ph-flower', color: '#FF6F91', at: 'Dolores Park', name: 'A flower', hint: ['#FF6F91', '#FFC83D', '#B388FF'] },
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
    welcome:  { x: 50, y: 26, w: 76, mood: 'wave' },
    age:      { x: 50, y: 10, w: 50, mood: 'idle' },
    consent:  { x: 50, y: 14, w: 58, mood: 'wave' },
    waiting:  { x: 50, y: 29, w: 72, mood: 'sleep' },
    parent:   { x: 50, y: 14, w: 40, mood: 'idle', hide: true },
    approved: { x: 50, y: 26, w: 76, mood: 'cheer' },
    prohibited: { x: 50, y: 28, w: 72, mood: 'wave' },
    group:    { x: 84, y: 26, w: 26, mood: 'wave' },
    ask:      { x: 50, y: 27, w: 74, mood: 'idle', talk: true },
    pack:     { x: 50, y: 26, w: 72, mood: 'cheer' },
    denied:   { x: 50, y: 29, w: 72, mood: 'idle' },
    home:     kid ? { x: 50, y: 13, w: 58, mood: 'idle' } : adult ? { x: 18, y: 37, w: 26, mood: 'idle' } : { x: 32, y: 22, w: 42, mood: 'idle' },
    task:     kid ? { x: 50, y: 27, w: 74, mood: 'search' } : { x: 80, y: 27, w: 34, mood: 'search' },
    quiz:     { x: 50, y: 12, w: 56, mood: 'idle', talk: true },
    camera:   { x: 84, y: 82, w: 20, mood: 'search', front: true },
    celebrate: kid ? { x: 50, y: 25, w: 74, mood: 'cheer' } : { x: 50, y: 4, w: 54, mood: 'cheer' },
    share:    { x: 78, y: 10, w: 36, mood: 'wave' },
    locked:   { x: 50, y: 28, w: 70, mood: 'idle' },
    finds:    kid ? { x: 80, y: 5, w: 30, mood: 'idle' } : { x: corner, y: 74, w: 20, mood: 'idle', front: true },
    map:      { x: corner, y: 74, w: 20, mood: 'idle', front: true },
    me:       { x: 84, y: 5, w: 22, mood: 'wave', front: true },
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
    this.setPlayer(playerId, opts.screen || 'welcome');
  }
  setPlayer(id, screen) {
    this.p = PLAYERS[id]; this.r = RULES[id];
    this.s = { found: 1, finds: 11, story: false, shareOk: this.r.sharing === 'yes', age: this.p.age };
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
    const cols = ['#FFC83D', '#FF6F91', '#22B88A', '#4C6FFF', '#C98552'];
    box.innerHTML = Array.from({ length: 44 }, (_, i) => `<i style="left:${(i * 37) % 100}%;background:${cols[i % 5]};animation-delay:${(i % 11) * .06}s;transform:rotate(${i * 23}deg)"></i>`).join('');
    this.phoneEl.appendChild(box); setTimeout(() => box.remove(), 3000);
  }
  status(light) { return `<div class="status ${light ? 'light' : ''}"><span>9:41</span><span><i class="ph-fill ph-cell-signal-full"></i> <i class="ph-fill ph-battery-high"></i></span></div>`; }
  kidStars() { return `<div class="kid-stars">${HUNT.map((h, i) => i < this.s.found ? `<i style="background:${h.color}"><span class="ph-fill ${h.icon}"></span></i>` : `<i class="empty"></i>`).join('')}</div>`; }
  vnav(active) {
    const b = (k, ic, label) => `<button class="${active === k ? 'on' : ''}" data-go="${k}" aria-label="${label}" title="${label}"><i class="${active === k ? 'ph-fill' : 'ph'} ${ic}"></i></button>`;
    return `<nav class="bnav" aria-label="Main"><span class="ind"></span>${b('home', 'ph-house', 'Home')}${b('map', 'ph-map-trifold', 'Map')}${b('finds', 'ph-seal-check', 'Finds')}${b('me', 'ph-user', 'Me')}</nav>`;
  }
  topActions() {
    return `<div class="top-actions"><button class="chip glass" style="border:0;cursor:pointer;box-shadow:var(--soft)" data-act="startGroup"><i class="ph-bold ph-users-three"></i>Going with others?</button><button class="chip glass" style="border:0;cursor:pointer;box-shadow:var(--soft)" data-go="ask" aria-label="Ask Ollie"><i class="ph-fill ph-microphone"></i></button></div>`;
  }
  spotCard(key, extra = '') {
    const pl = PLACES[key];
    const dots = AGES[key].map(b => `<i title="${b}" style="width:8px;height:8px;border-radius:50%;display:inline-block;background:${b === 'kid' ? '#FF6F91' : b === 'teen' ? '#4C6FFF' : '#C98552'}"></i>`).join('');
    return `<div class="pcard"><div class="th" style="${pl.img ? `background-image:url(${pl.img})` : `background:${pl.color}`}">${pl.img ? '' : `<i class="ph-fill ${pl.icon}"></i>`}</div><div style="flex:1;min-width:0"><b>${pl.name}</b><small>${pl.cat}</small> <span style="display:inline-flex;gap:3px;margin-left:4px">${dots}</span></div>${extra}</div>`;
  }
  arrive(placeKey, label) {
    const pl = PLACES[placeKey];
    return `<div class="arrive" id="arrive"><div class="dot" style="background-image:url(${pl.img})"></div><div><small>You've arrived</small><b>${pl.name}</b></div>
      <button class="go" data-go="camera"><i class="ph-fill ph-camera"></i>${label}</button><button class="x" data-act="dismiss" aria-label="Dismiss"><i class="ph-bold ph-x"></i></button></div>`;
  }

  /* ---------- screens ---------- */
  screens() {
    const p = this.p, r = this.r, s = this.s, k = this.kid, adult = this.adult;
    const H = PLACES.hydrant, MD = PLACES.md;
    const here = adult ? MD : PLACES.park;
    return {
      welcome: () => `${this.status()}${stageScreen({ bg: '#DDE6FF', dome: '#4C6FFF', ink: '#1F2030', title: 'Hi, I\'m<br>Ollie!',
          extra: floaties([['leaf', 8, 30, 38, -20], ['star', 80, 22, 34, 10, .6], ['pin', 84, 44, 30, 8, 1.2], ['spark', 14, 50, 18, 0, .9]]),
          bottom: `<p>Let's explore your block together. Find things, unlock stories, collect stickers.</p><button class="btn-white" data-go="age">Let's go <i class="ph-bold ph-arrow-right"></i></button>` })}`,

      age: () => `
        <div class="scenebox" style="height:260px">${scene('day')}</div>${this.status()}
        <button class="back" data-go="welcome" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet center" style="top:238px">
          <h2 class="disp h-l">How old are you?</h2>
          <p class="p">Swipe to pick. I'll make the game just right for you.</p>
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

      waiting: () => `${this.status(true)}${stageScreen({ bg: '#262A52', dome: '#363B70', kick: 'Hang tight', title: 'Waiting for<br>a grown-up', extra: twinkles(18),
          bottom: `<p>Ollie is napping until they say OK.</p><button class="btn-white" data-go="parent"><i class="ph-bold ph-device-mobile"></i>Open the grown-up's phone</button>` })}`,

      parent: () => {
        const share = !!this.parentFor, buy = this.parentFor === 'buy';
        const perms = share
          ? (buy ? [['ph-shopping-bag', 'Family Outing Pack · $4.99', 'One-time purchase through FastSpring', 'ask', 'Asking']] : [['ph-share-network', 'Share finds with friends', 'Photos and stories, friends only', 'ask', 'Asking']])
          : [['ph-map-pin', 'Location', 'Only inside play zones, never shared', 'yes', 'Zones only'], ['ph-camera', 'Camera', 'Off for under 13', 'no', 'Off'],
             ['ph-users', 'Friends and sharing', 'Off for under 13', 'no', 'Off'], ['ph-shopping-bag', 'Buying', 'Off', 'no', 'Off']];
        return `${this.status(true)}
        <div class="parent-top"><p class="eyebrow" style="color:rgba(255,255,255,.6)">Grown-up's phone · k-ID</p><h2 class="disp h-m" style="margin-top:4px">${buy ? `${p.name} wants to buy a pack` : share ? `${p.name} wants to share` : `${p.name} wants to join Explore Your Block`}</h2></div>
        <div class="sheet" style="top:128px;border-radius:0;background:#fff">
          <p class="p" style="margin-top:0">${buy ? `k-ID needs a parent's OK for purchases at ${p.age}.` : share ? `In Germany, under-16s need a parent's OK to share. Here's what turns on:` : `Here's what ${p.name} can do at age ${s.age}. You can change this anytime.`}</p>
          <div style="margin-top:8px">${perms.map(([ic, t, d, cls, lab]) => `<div class="perm"><i class="ic ph ${ic}"></i><div><b>${t}</b><small>${d}</small></div><span class="tag ${cls}">${lab}</span></div>`).join('')}</div>
          <div class="grow"></div>
          <button class="btn btn-pill full" data-act="approve">Approve</button>
          <button class="link" data-act="deny">Not now</button>
        </div>`;
      },

      prohibited: () => `${this.status()}${stageScreen({ bg: '#EEF1FF', dome: '#7C8DB8', ink: '#1F2030', kick: 'Not quite yet', title: 'Too young<br>to play here',
          bottom: `<p>In your country, players need to be a little older for this game. Ollie will be right here when you are.</p><button class="btn-white" data-go="welcome">Back to start</button>` })}
        <span class="chip glass" style="position:absolute;z-index:9;top:46px;left:50%;transform:translateX(-50%)"><i class="ph-fill ph-shield-check"></i>k-ID: under the minimum age</span>`,

      denied: () => `${this.status(true)}${stageScreen({ bg: '#3A3550', dome: '#5A5378', kick: 'Your grown-up said', title: 'Not yet!',
          bottom: `<p>That's OK. You can ask again later, or ask a different grown-up.</p><button class="btn-white" data-go="consent">Ask again</button>` })}`,

      approved: () => `${this.status()}${stageScreen({ bg: '#DDF5EA', dome: '#22B88A', ink: '#1F2030', kick: 'Your grown-up said yes', title: 'You\'re<br>all set!',
          extra: floaties([['star', 10, 24, 34, -10], ['heart', 82, 20, 30, 12, .5], ['leaf', 78, 46, 34, 20, 1], ['spark', 16, 48, 20, 0, .8]]),
          bottom: `<p>Let's go find some treasures on your block.</p><button class="btn-white big" data-go="home">Start exploring</button>` })}`,

      home: () => k ? `
        <div class="scenebox" style="height:300px">${scene('day')}</div>${this.status()}
        ${this.kidStars()}
        <button class="corner-btn" data-go="finds" aria-label="My stickers"><i class="ph-fill ph-book-open"></i></button>
        <div class="sheet" style="top:270px">
          <p class="eyebrow">Today's outing · playground, park, ice cream</p>
          <h2 class="disp h-l" style="margin-top:4px">Park day hunt</h2>
          <div class="kpath">
            <svg viewBox="0 0 300 150" preserveAspectRatio="none"><path d="M30 110 C 70 30, 110 30, 140 80 S 220 140, 270 40" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-dasharray="1 14"/></svg>
            ${HUNT.map((h, i) => { const pos = [[10, 72], [33, 30], [50, 56], [72, 84], [90, 30]][i]; const st = i < s.found ? 'done' : i === s.found ? 'now' : 'lock';
              return `<div class="stop ${st}" style="left:${pos[0]}%;top:${pos[1]}%" ${st === 'now' ? 'data-go="task"' : ''}><span style="${st !== 'lock' ? `background:${h.color}` : ''}"><i class="ph-fill ${st === 'lock' ? 'ph-lock-simple' : h.icon}"></i></span></div>`; }).join('')}
          </div>
          <div class="grow"></div>
          <button class="btn btn-kid blue nudge" data-go="task">Next: ${HUNT[Math.min(s.found, 4)].name.toLowerCase()} at ${HUNT[Math.min(s.found, 4)].at}</button>
        </div>`
      : adult ? `
        <div class="leaf" style="height:370px" data-map="walk"></div>${this.status()}
        <div class="sheet" style="top:330px;padding:18px 16px 16px">
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:10px">
            <div><p class="eyebrow">Tonight · 4 stops · about 1 mi</p><h2 class="disp h-l" style="margin-top:3px">Your Mission evening</h2></div>
            <button class="btn btn-pill sm" data-go="task">Start</button>
          </div>
          <div class="stack" style="margin-top:4px">${WALK.map((key, i) => { const pl = PLACES[key];
            return `<div class="pcard"><div class="th" style="${pl.img ? `background-image:url(${pl.img})` : `background:${pl.color}`}">${pl.img ? '' : `<i class="ph-fill ${pl.icon}"></i>`}</div><div style="flex:1"><b>${pl.name}</b><small>${WALK_SUB[i]}</small></div>${i === 0 ? '<span class="pill-st here">Here now</span>' : `<span class="pill-st">${i + 1}</span>`}</div>`; }).join('')}</div>
        </div>${this.topActions()}${this.vnav('home')}${this.arrive('md', 'Check in')}`
      : `
        <div class="scenebox dusk" style="height:320px">${scene('dusk')}</div>${this.status(true)}
        <div style="position:absolute;z-index:6;top:86px;left:20px;color:#fff"><small style="font-size:12.5px;font-weight:800;opacity:.8">Good evening, ${p.name}</small><h2 class="disp h-l" style="text-shadow:0 2px 12px rgba(0,0,0,.25)">Mission St</h2></div>
        <div class="sheet" style="top:292px;padding-bottom:84px">
          <p class="eyebrow">Hangouts near you</p>
          <div class="card-soft next-card" style="margin-top:8px" data-go="task">
            <div class="ph-img" style="background-image:url(${PLACES.park.img})"></div>
            <div><h3 class="disp h-m" style="font-size:23px">Top of Dolores Park</h3><div class="meta"><span><i class="ph ph-map-pin"></i>0.1 mi</span><span><i class="ph ph-sun-horizon"></i>Best view</span></div>
              <span class="chip" style="margin-top:8px;background:#fff"><i class="ph-fill ph-seal-check" style="color:var(--mint)"></i>${s.finds} spots so far</span></div>
          </div>
          <div class="stack">${this.spotCard('ritual')}${this.spotCard('clarion')}</div>
        </div>${this.topActions()}${this.vnav('home')}${this.arrive('park', 'Snap it')}`,

      task: () => k ? `${this.status(true)}${stageScreen({ bg: '#178A74', dome: '#25A98C', kick: `<span data-act="say" style="cursor:pointer;pointer-events:auto"><i class="ph-fill ph-speaker-high"></i> At ${HUNT[Math.min(s.found, 4)].at}</span>`, title: `Find ${HUNT[Math.min(s.found, 4)].name.toLowerCase()}!`,
          extra: floaties([['leaf', 6, 34, 36, -15], ['pin', 84, 36, 30, 10, .7], ['spark', 12, 54, 16, 0, 1.1]]),
          bottom: `<div class="hint-dots">${HUNT[Math.min(s.found, 4)].hint.map(c => `<i style="background:${c}"></i>`).join('')}</div>
            <p style="font-size:13px"><i class="ph-fill ph-map-pin-area"></i> You're in the play zone</p>
            <button class="btn-white big nudge" data-go="quiz">I found it!</button>` })}
        <button class="back right" data-go="home" aria-label="Close"><i class="ph-bold ph-x"></i></button>` : `
        <div class="hero-img" style="background-image:url(${here.img})"><div class="lab"><span class="chip glass">${adult ? 'Stop 1 of 4 · History' : 'Hangout · Dolores Park'}</span></div></div>${this.status(true)}
        <button class="back" data-go="home" aria-label="Back"><i class="ph-bold ph-arrow-left"></i></button>
        <div class="sheet" style="top:276px">
          <h2 class="disp h-l" style="padding-right:90px">${adult ? here.name : 'Top of Dolores Park'}</h2>
          <div class="meta"><span><i class="ph ph-map-pin"></i>${adult ? 'Dolores St & 16th' : 'Dolores St & 20th'}</span><span><i class="ph ph-clock"></i>${adult ? '15 min' : 'Sunset'}</span></div>
          <p class="p">${adult ? 'The small white chapel next to the basilica is the original mission. Check in with a photo to log stop 1 and keep your walk going.' : 'Climb to the top of the park for the best view of downtown. Snap it to add the spot to your map and unlock 3 more hangouts nearby.'}</p>
          <div class="card-soft" style="margin-top:12px;display:flex;gap:10px;align-items:center"><i class="ph-fill ph-check-circle" style="color:var(--mint);font-size:22px"></i><div><b style="font-size:14px">You're here</b><br><small style="color:var(--ink-2);font-size:12px;font-weight:700">Inside the ${adult ? 'Mission Dolores' : 'landmark'} zone</small></div></div>
          <div class="grow"></div>
          <button class="btn btn-pill full" data-go="camera"><i class="ph-fill ph-camera"></i>${adult ? 'Check in with a photo' : 'Snap to unlock'}</button>
        </div>`,

      quiz: () => `
        <div class="scenebox" style="height:300px">${scene('day')}</div>${this.status()}
        <div class="sheet center" style="top:270px">
          <button class="chip blue" style="border:0;cursor:pointer" data-act="say"><i class="ph-fill ph-speaker-high"></i>Ollie asks</button>
          <h2 class="disp h-l" style="margin-top:10px">Ooh! What was it?</h2>
          <div class="quiz">${[['ph-apple-logo', 'An apple'], ['ph-door', 'A door'], ['ph-car-profile', 'A car'], ['ph-flower-tulip', 'A flower']].map(([ic, t]) => `<button data-act="pick"><i class="ph-fill ${ic}"></i>${t}</button>`).join('')}</div>
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
          extra: floaties([['star', 8, 22, 36, -12], ['heart', 82, 18, 30, 10, .4], ['spark', 86, 44, 22, 0, .8], ['star', 12, 46, 24, 15, 1.2]]),
          bottom: `<div class="sticker-big" style="width:96px;height:96px;padding:7px;margin-top:-30px"><span style="background:${HUNT[s.found - 1].color};font-size:40px"><i class="ph-fill ${HUNT[s.found - 1].icon}"></i></span></div>
            <div class="mini-stats"><span><b data-count="${s.found}">0</b> stickers</span><span><b data-count="1240">0</b> steps</span></div>
            <button class="btn-white big" data-go="home">Keep going</button>` })}` : `
        ${adult ? `<div class="hero-img" style="height:250px;background-image:url(${MD.img})"></div>` : `<div class="scenebox dusk" style="height:250px">${scene('dusk')}</div>`}${this.status(true)}
        <div class="sheet" style="top:224px">
          ${adult ? `
            <p class="eyebrow">Stop 1 of 4 · checked in</p>
            <h2 class="disp h-l" style="margin-top:4px">Mission Dolores</h2>
            <p class="p" style="margin-top:6px">${MD.fact}</p>
            <div style="margin-top:12px"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800"><span>Your Mission evening</span><span>1 of 4</span></div><div class="progress"><i style="width:0" data-w="25%"></i></div></div>
            <p class="eyebrow" style="margin-top:14px">Next stop</p>${this.spotCard('tartine', '<span class="pill-st">0.2 mi</span>')}`
          : `
            <p class="eyebrow">AI check · it's a match</p>
            <h2 class="disp h-l" style="margin-top:4px">Spot unlocked</h2>
            <p class="p">Top of Dolores Park is on your map. 3 more hangouts just opened nearby.</p>
            <div class="stack">${this.spotCard('ritual')}${this.spotCard('roxie')}</div>
            <div style="margin-top:12px"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800"><span>Local Explorer badge</span><span>4 of 5</span></div><div class="progress"><i style="width:0" data-w="80%"></i></div></div>`}
          <div class="grow"></div>
          <div style="display:flex;gap:10px">
            <button class="btn btn-pill light" style="flex:1" data-act="share"><i class="ph-bold ${r.sharing === 'yes' || s.shareOk ? 'ph-share-network' : 'ph-lock-simple'}"></i>Share</button>
            <button class="btn btn-pill" style="flex:1" data-go="home">${adult ? 'Next stop' : 'Done'}</button>
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
            <div><b style="font-size:14px">Following ${y.name}'s rules (${y.age}, ${y.country})</b><br><small style="font-size:12px;font-weight:700;opacity:.75">k-ID: location sharing off · chat filtered · no buying for kids</small></div>
          </div>
          <div class="stack">${g.spots.map(k2 => this.spotCard(k2, '<span class="pill-st here">All 3</span>')).join('')}</div>
          <button class="btn btn-pill full" style="margin-top:12px" data-go="ask"><i class="ph-fill ph-microphone"></i>"What can we all do?"</button>
          ${r.buying !== 'no' ? `<div class="deal-locked" style="margin-top:10px;cursor:pointer" data-go="pack"><span class="shine"></span><div class="lk"><i class="ph-fill ph-gift"></i></div><div><b>Family Outing Pack</b><small>${r.buying === 'yes' ? '5 guided outings for the whole group · FastSpring' : 'Ask a parent to unlock · FastSpring'}</small></div><i class="ph-bold ph-caret-right" style="margin-left:auto"></i></div>` : ''}
        </div>`; },

      ask: () => { const grp = this.groupMode;
        const reply = grp ? "Dolores Park! There's a playground for Mia, the hill for Lena, and Bi-Rite ice cream for everyone."
          : adult ? "Start at Mission Dolores, grab bread at Tartine, then catch a movie at the Roxie."
          : "Ritual's close for a coffee, or head to the top of Dolores Park for the sunset view.";
        const chips = grp ? ['park', 'playground', 'birite'] : adult ? ['md', 'tartine', 'roxie'] : ['ritual', 'park'];
        return `${this.status(true)}${stageScreen({ bg: '#1F2030', dome: '#2B2E4A', kick: s.askDone ? 'Ollie · Inworld voice' : 'Listening · Modulate',
          title: `"What can ${grp ? 'we all' : 'I'} do<br>nearby?"`,
          bottom: s.askDone
            ? `<span class="chip" style="background:rgba(255,255,255,.12);color:#fff"><i class="ph-fill ph-smiley"></i>Modulate: you sound excited</span>
               <div class="card-soft" style="background:#fff;color:var(--ink);text-align:left;font-size:15px;font-weight:700;line-height:1.4">${reply}</div>
               <div style="display:flex;gap:6px;flex-wrap:wrap;justify-content:center">${chips.map(c => `<span class="chip" style="background:rgba(255,255,255,.14);color:#fff"><i class="ph-fill ${PLACES[c].icon}"></i>${PLACES[c].name}</span>`).join('')}</div>
               <button class="btn-white" data-go="${grp ? 'group' : 'map'}">Show on the map</button>`
            : `<div class="wave">${Array.from({ length: 13 }, (_, i) => `<i style="animation-delay:${(i % 5) * .12}s"></i>`).join('')}</div>
               <p>Ollie is listening… Modulate reads the tone of your voice and keeps kids' details private.</p>
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
          <div class="share-friends">${[['A', '#4C6FFF', 'Ava'], ['J', '#22B88A', 'Jay'], ['N', '#FF6F91', 'Noor'], ['K', '#C98552', 'Kai']].map(([l, c, n]) => `<div><i style="background:${c}">${l}</i>${n}</div>`).join('')}</div>
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
          <div class="grid-stickers">${HUNT.concat([{ icon: 'ph-bird', color: '#4C6FFF', name: 'A bird' }]).map((h, i) => `<div><div class="stop ${i < s.found ? 'done' : 'lock'}"><span style="${i < s.found ? `background:${h.color}` : ''}"><i class="ph-fill ${i < s.found ? h.icon : 'ph-question'}"></i></span></div><small>${i < s.found ? h.name : '???'}</small></div>`).join('')}</div>
        </div>` : `
        <div class="plain"></div>${this.status()}
        <div class="sheet plain-sheet" style="top:0;border-radius:0;padding-top:56px;background:transparent;box-shadow:none">
          <p class="eyebrow">Your finds</p>
          <h2 class="disp h-l" style="margin-top:4px">${s.finds} places</h2>
          <div style="margin-top:12px"><div style="display:flex;justify-content:space-between;font-size:13px;font-weight:800"><span>Local Explorer</span><span>${s.story ? 5 : 4} of 5</span></div><div class="progress"><i style="width:0" data-w="${s.story ? 100 : 80}%"></i></div></div>
          <div class="stack" style="margin-top:6px">${[['hydrant', s.story], ['park', true], ['md', adult && s.story], ['clarion', !adult]].map(([key, got]) => { const pl = PLACES[key];
            return `<div class="pcard"><div class="th" style="${pl.img ? `background-image:url(${pl.img});${got ? '' : 'filter:grayscale(1);opacity:.5'}` : `background:${got ? pl.color : '#E2DDD5'}`}">${pl.img ? '' : `<i class="ph-fill ${pl.icon}"></i>`}</div><div><b>${pl.name}</b><small>${pl.cat}</small></div><span class="pill-st ${got ? 'done' : ''}">${got ? '<i class="ph-bold ph-check"></i>' : '<i class="ph-bold ph-lock-simple"></i>'}</span></div>`; }).join('')}</div>
        </div>${this.vnav('finds')}`,

      map: () => `
        <div class="leaf" style="bottom:0" data-map="${adult ? 'walk' : 'near'}"></div>${this.status()}
        <div style="position:absolute;z-index:6;top:48px;left:16px;right:16px;display:flex;gap:8px"><span class="chip glass" style="flex:1;box-shadow:var(--soft)"><i class="ph-bold ph-magnifying-glass"></i>Search the Mission</span></div>
        <div style="position:absolute;z-index:6;top:88px;left:16px;display:flex;gap:6px"><span class="chip ink">All</span><span class="chip glass">History</span><span class="chip glass">Art</span>${adult ? '<span class="chip glass">Food</span>' : ''}</div>
        ${this.vnav('map')}`,

      me: () => `
        <div class="plain"></div>${this.status()}
        <div class="sheet plain-sheet" style="top:0;border-radius:0;padding-top:56px;background:transparent;box-shadow:none">
          <div style="display:flex;gap:14px;align-items:center"><div style="width:58px;height:58px;border-radius:50%;background:${p.color};display:grid;place-items:center;color:#fff;font:800 24px var(--display);flex:none">${p.name[0]}</div><div><h2 class="disp h-m">${p.name}</h2><small style="font-weight:800;color:var(--ink-2)">${p.age} · ${p.country === 'DE' ? 'Germany' : 'California, US'}</small></div></div>
          <p class="eyebrow" style="margin-top:18px;display:flex;gap:6px;align-items:center"><i class="ph-fill ph-shield-check"></i>Your features · k-ID</p>
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
    scr.className = `screen enter-${dir} entering ${this.adult ? 'adult' : ''} ${hasNav ? 'with-nav' : ''}`;
    scr.innerHTML = html;
    old.replaceWith(scr);
    scr.addEventListener('click', (e) => this.onClick(e));
    setTimeout(() => scr.classList.remove('entering', 'enter-' + dir), 1100);
    this.placeOllie(scr);
    this.afterMount(scr);
  }
  placeOllie(scr) {
    const from = this.last, to = spot(this.screen, this.p.band, navPref.side), roam = this.roam;
    scr.appendChild(roam);
    roam.classList.toggle('front', !!to.front);
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
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, attribution: 'Tiles © Esri, HERE, Garmin, © OpenStreetMap' }).addTo(map);
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16 }).addTo(map);
    const walk = el.dataset.map === 'walk', home = this.screen === 'home';
    const pin = (pl, num, label) => L.marker([pl.lat, pl.lng], { icon: L.divIcon({ className: '', iconSize: [36, 46], iconAnchor: [18, 46],
      html: `<div class="mpin">${num ? `<i class="n">${num}</i>` : ''}<span style="${pl.img ? `background-image:url(${pl.img})` : `background:${pl.color}`}">${pl.img ? '' : `<i class="ph-fill ${pl.icon}"></i>`}</span>${label ? `<em class="mlabel" style="font-style:normal">${label}</em>` : ''}</div>` }) });
    if (walk) L.polyline(WALK.map(k2 => [PLACES[k2].lat, PLACES[k2].lng]), { color: '#1F2030', weight: 4, opacity: .8, dashArray: '1 9', lineCap: 'round' }).addTo(map);
    const keys = el.dataset.keys ? el.dataset.keys.split(',') : walk ? WALK : FOR_BAND[this.p.band];
    keys.forEach((k2, i) => pin(PLACES[k2], walk ? String(i + 1) : '', home ? '' : PLACES[k2].name.replace('The ', '')).addTo(map));
    const me = walk ? PLACES.md : PLACES.park;
    L.marker([me.lat - .0004, me.lng + .0005], { icon: L.divIcon({ className: '', iconSize: [18, 18], iconAnchor: [9, 9], html: '<div class="udot"></div>' }) }).addTo(map);
    const b = L.latLngBounds(keys.map(k2 => [PLACES[k2].lat, PLACES[k2].lng]));
    const left = navPref.side === 'left';
    const grp = this.screen === 'group';
    const fit = () => map.fitBounds(b, { paddingTopLeft: [40, grp ? 60 : home ? 60 : 130], paddingBottomRight: [grp ? 90 : 90, grp ? 30 : home ? 60 : 120], maxZoom: 16 });
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
    if (a === 'ageDone') this.go(this.kid ? 'consent' : 'home');
    if (a === 'say') this.say();
    if (a === 'startGroup') { this.groupMode = true; this.go('group'); this.toast('Mia, Lena and Sam are in', 'ph-users-three'); }
    if (a === 'askDone') { this.s.askDone = true; this.render('none'); this.ollie.setAttribute('mood', 'wave'); setTimeout(() => this.ollie.say && this.ollie.say(3200), 60); }
    if (a === 'checkout') {
      const sh = document.createElement('div'); sh.className = 'fs-sheet';
      sh.innerHTML = `<div class="fs-card"><div style="display:flex;justify-content:space-between;align-items:center"><b style="font-size:13px;letter-spacing:1px">FASTSPRING · SECURE CHECKOUT</b><i class="ph-fill ph-lock-simple"></i></div>
        <div style="display:flex;justify-content:space-between;margin-top:14px;font-weight:800"><span>Family Outing Pack</span><span>$4.99</span></div>
        <div style="display:flex;justify-content:space-between;color:var(--ink-2);font-size:13px;font-weight:700;margin-top:4px"><span>Sales tax (handled by FastSpring)</span><span>$0.43</span></div>
        <div style="display:flex;justify-content:space-between;margin-top:10px;padding-top:10px;border-top:1px solid var(--line);font-weight:900"><span>Total</span><span>$5.42</span></div>
        <button class="btn btn-pill full" style="margin-top:14px" data-pay="1"><i class="ph-fill ph-apple-logo"></i>Pay</button>
        <small style="display:block;text-align:center;color:var(--ink-3);font-weight:700;margin-top:8px">Sandbox · no real charge</small></div>`;
      this.phoneEl.querySelector('.screen').appendChild(sh);
      sh.querySelector('[data-pay]').onclick = () => { sh.remove(); this.s.bought = true; this.render('pop'); this.confetti(); };
    }
    if (a === 'askBuy') { this.parentFor = 'buy'; this.go('parent'); }
    if (a === 'tog') { el.classList.toggle('on'); if (navigator.vibrate) navigator.vibrate(6); }
    if (a === 'stage') { this.s.asked = this.s.asked || {}; const id = el.dataset.id; if (this.s.asked[id]) delete this.s.asked[id]; else this.s.asked[id] = 1; this.render('none'); }
    if (a === 'sendAsk') { this.s.asked = {}; this.render('none'); this.toast('Sent to your parent', 'ph-paper-plane-tilt'); }
    if (a === 'dismiss') { const ar = this.phoneEl.querySelector('#arrive'); ar.style.transition = 'transform .4s ease'; ar.style.transform = 'translateY(140%)'; }
    if (a === 'pick') {
      el.classList.add('picked'); el.parentNode.querySelectorAll('button').forEach(b => b !== el && b.classList.add('dim'));
      this.ollie.removeAttribute('talking'); this.ollie.setAttribute('mood', 'cheer');
      setTimeout(() => { this.s.found = Math.min(this.s.found + 1, HUNT.length); this.go('celebrate'); }, 750);
    }
    if (a === 'approve') {
      if (this.parentFor === 'buy') { this.s.packOk = true; this.parentFor = null; this.go('pack'); this.toast('Parent approved the pack'); return; }
      if (this.parentFor === 'share') {
        this.s.shareOk = true; this.parentFor = null;
        const u = document.createElement('div'); u.className = 'unlock'; u.innerHTML = '<div><i class="ph-fill ph-lock-simple-open"></i></div>';
        this.phoneEl.querySelector('.screen').appendChild(u);
        setTimeout(() => { this.go('share'); this.toast('Parent approved sharing'); }, 900);
      } else this.go('approved');
    }
    if (a === 'deny') { const f = this.parentFor; this.parentFor = null; this.go(f === 'share' ? 'celebrate' : f === 'buy' ? 'pack' : 'denied'); }
    if (a === 'snap') {
      const scr = this.phoneEl.querySelector('.screen'), cam = scr.querySelector('.cam');
      const f = document.createElement('div'); f.className = 'flash'; scr.appendChild(f);
      const c = document.createElement('div'); c.className = 'checking';
      c.innerHTML = `<div><div class="spin"></div><b style="font-size:16px">Checking your photo…</b><br><small style="opacity:.7;font-weight:700">AI match</small></div>`;
      setTimeout(() => scr.appendChild(c), 250);
      setTimeout(() => { c.remove(); cam.classList.add('matched'); this.ollie.setAttribute('mood', 'cheer'); const m = document.createElement('div'); m.className = 'match'; m.innerHTML = '<i class="ph-bold ph-check"></i>Match!'; scr.appendChild(m); }, 1350);
      setTimeout(() => { this.s.story = true; this.s.finds++; this.go('celebrate'); }, 2100);
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
window.EYB = { Phone, PLAYERS, RULES, KPERMS, PLACES, AGES, FOR_BAND, HUNT, GROUP, groupInfo, spot, scene, stageScreen, floaties };
