// <ollie-otter mood="idle|wave|search|cheer|sleep" talking> — the 3D Ollie image, brought to life:
// redrawn eyes that look around, a mouth that smiles, talks and laughs, and body motion per mood.
(() => {
  const here = (document.currentScript && document.currentScript.src) || location.href;
  const IMG = new URL('ollie-cut.png', here).href;

  const css = `
  :host { display: inline-block; width: 200px; aspect-ratio: 328 / 400; position: relative; cursor: pointer; -webkit-tap-highlight-color: transparent; user-select: none; }
  .pop { position: absolute; left: 0; right: 0; top: 0; aspect-ratio: 328 / 366; transform-origin: 50% 100%; animation: stretch 9s ease-in-out 2s infinite; }
  .rig { position: absolute; inset: 0; transform-origin: 50% 100%; animation: breathe 3.2s ease-in-out infinite; }
  .tilt { position: absolute; inset: 0; transform-origin: 50% 90%; animation: sway 6s ease-in-out infinite; }
  img { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none;
        -webkit-mask-image: linear-gradient(#000 82%, transparent 99%); mask-image: linear-gradient(#000 82%, transparent 99%); }
  svg.face, svg.fx { position: absolute; inset: 0; width: 100%; height: 100%; overflow: visible; pointer-events: none; }
  svg.fx { aspect-ratio: auto; }
  svg * { transform-box: fill-box; }
  .shadow { position: absolute; left: 14%; right: 14%; bottom: 0; height: 7%; border-radius: 50%; background: radial-gradient(closest-side, rgba(43,45,66,.22), transparent); animation: shadow 3.2s ease-in-out infinite; }

  /* face layers */
  .look { animation: wander 7s ease-in-out infinite; transform-box: view-box; }
  .lid { transform-origin: 50% 0%; transform: scaleY(0); animation: blink 4.4s infinite; }
  .closed, .happy, .m-o, .m-laugh, .m-talk, .glass, .sparkles, .zzz, .hi { opacity: 0; transition: opacity .18s; }
  .m-smile { opacity: 1; transition: opacity .18s; }
  .m-talk { transform-origin: 50% 0%; }

  @keyframes stretch { 0%,86%,100% { transform: translateY(0); } 90%,95% { transform: translateY(-9%) scale(1.02); } }
  @keyframes breathe { 0%,100% { transform: scale(1,1); } 50% { transform: scale(1.012,.988) translateY(1px); } }
  @keyframes sway { 0%,35%,100% { transform: rotate(0); } 45%,55% { transform: rotate(-3deg); } 65%,75% { transform: rotate(2.5deg); } }
  @keyframes blink { 0%,90%,100% { transform: scaleY(0); } 93%,95% { transform: scaleY(1); } }
  @keyframes shadow { 0%,100% { transform: scaleX(1); } 50% { transform: scaleX(.96); } }
  @keyframes wander { 0%,18%,100% { transform: translate(0,0); } 24%,38% { transform: translate(-6px,1px); } 46%,60% { transform: translate(6px,-3px); } 68%,80% { transform: translate(0,-5px); } }
  @keyframes enter { 0% { transform: translateY(70%) scale(.9,1.1); } 60% { transform: translateY(-8%) scale(1.04,.97); } 80% { transform: translateY(2%); } 100% { transform: translateY(0); } }
  :host(.entering) .pop { animation: enter .75s cubic-bezier(.3,.8,.4,1) both; }

  /* talking: mouth flaps */
  :host([talking]) .m-smile, :host([talking]) .m-o, :host([talking]) .m-laugh { opacity: 0; }
  :host([talking]) .m-talk { opacity: 1; animation: talk .32s ease-in-out infinite alternate; }
  :host([talking]) .tilt { animation: nod .64s ease-in-out infinite alternate; }
  @keyframes talk { from { transform: scaleY(.25); } to { transform: scaleY(1); } }
  @keyframes nod { from { transform: rotate(-1.5deg); } to { transform: rotate(1.5deg) translateY(-1px); } }

  /* hello */
  :host([mood=wave]) .tilt { animation: hello 1.2s ease-in-out infinite; }
  :host([mood=wave]) .hi { opacity: 1; animation: hiPulse 1.2s ease-in-out infinite; }
  :host([mood=wave]) .m-smile { opacity: 0; } :host([mood=wave]) .m-laugh { opacity: 1; }
  :host([mood=wave]) .look { animation: none; transform: translate(0,-2px); }
  @keyframes hello { 0%,100% { transform: rotate(-7deg) translateY(0); } 25% { transform: rotate(0) translateY(-6px); } 50% { transform: rotate(7deg) translateY(0); } 75% { transform: rotate(0) translateY(-6px); } }
  @keyframes hiPulse { 0%,100% { transform: scale(.9); } 50% { transform: scale(1.08); } }

  /* on the hunt: eyes follow the glass */
  :host([mood=search]) .tilt { animation: peer 3.4s ease-in-out infinite; }
  :host([mood=search]) .glass { opacity: 1; animation: glass 3.4s ease-in-out infinite; }
  :host([mood=search]) .look { animation: follow 3.4s ease-in-out infinite; }
  :host([mood=search]) .m-smile { opacity: 0; } :host([mood=search]) .m-o { opacity: 1; }
  @keyframes peer { 0%,100% { transform: rotate(-6deg) translateX(-2px); } 50% { transform: rotate(6deg) translateX(2px); } }
  @keyframes glass { 0%,100% { transform: translate(-30px, 6px) rotate(-12deg); } 50% { transform: translate(34px, -4px) rotate(10deg); } }
  @keyframes follow { 0%,100% { transform: translate(-7px,4px); } 50% { transform: translate(7px,3px); } }

  /* you found it */
  :host([mood=cheer]) .pop { animation: jump .85s cubic-bezier(.3,.7,.4,1) infinite; }
  :host([mood=cheer]) .shadow { animation: jumpShadow .85s cubic-bezier(.3,.7,.4,1) infinite; }
  :host([mood=cheer]) .tilt, :host([mood=cheer]) .lid { animation: none; }
  :host([mood=cheer]) .happy, :host([mood=cheer]) .sparkles, :host([mood=cheer]) .m-laugh { opacity: 1; }
  :host([mood=cheer]) .m-smile { opacity: 0; }
  :host([mood=cheer]) .sparkles > * { animation: burst .85s ease-out infinite; transform-origin: 50% 50%; }
  :host([mood=cheer]) .sparkles > *:nth-child(2n) { animation-delay: .12s; }
  :host([mood=cheer]) .sparkles > *:nth-child(3n) { animation-delay: .24s; }
  @keyframes jump { 0%,100% { transform: translateY(0) scale(1.05,.95); } 18% { transform: translateY(0) scale(.96,1.05); } 50% { transform: translateY(-16%) scale(.99,1.01) rotate(-3deg); } 82% { transform: translateY(0) scale(1.04,.96); } }
  @keyframes jumpShadow { 0%,100% { transform: scaleX(1); opacity: 1; } 50% { transform: scaleX(.6); opacity: .4; } }
  @keyframes burst { 0% { transform: scale(.2); opacity: 0; } 35% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(.8) translateY(-10px); opacity: 0; } }

  /* napping */
  :host([mood=sleep]) .lid, :host([mood=sleep]) .pop { animation: none; }
  :host([mood=sleep]) .closed, :host([mood=sleep]) .zzz { opacity: 1; }
  :host([mood=sleep]) .rig { animation: snooze 3.8s ease-in-out infinite; }
  :host([mood=sleep]) .tilt { animation: none; transform: rotate(-7deg); transition: transform .6s; }
  :host([mood=sleep]) .zzz > * { animation: zzz 2.6s ease-in-out infinite; }
  :host([mood=sleep]) .zzz > *:nth-child(2) { animation-delay: 1.3s; }
  @keyframes snooze { 0%,100% { transform: scale(1,1); } 50% { transform: scale(1.025,.975); } }
  @keyframes zzz { 0% { transform: translate(0,0) scale(.7); opacity: 0; } 30% { opacity: 1; } 100% { transform: translate(14px,-26px) scale(1.1); opacity: 0; } }

  /* tap */
  :host(.tickle) .rig { animation: wiggle .6s ease-in-out; }
  :host(.tickle) .lid { animation: none; }
  :host(.tickle) .happy, :host(.tickle) .m-laugh { opacity: 1; }
  :host(.tickle) .m-smile, :host(.tickle) .m-o { opacity: 0; }
  @keyframes wiggle { 0%,100% { transform: rotate(0) scale(1); } 20% { transform: rotate(-7deg) scale(1.05,.95); } 50% { transform: rotate(6deg) scale(.96,1.04); } 80% { transform: rotate(-2deg); } }
  @media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
  `;

  // Face overlay shares the image's 328 x 366 pixel space. Eyes sit at (95,107) and (233,107).
  const L = { x: 95, y: 107 }, R = { x: 233, y: 107 };
  const sclera = (e) => `<ellipse cx="${e.x}" cy="${e.y}" rx="24" ry="25.5" fill="url(#sclera)" stroke="#3A2A22" stroke-opacity=".35" stroke-width="1.5"/>`;
  const iris = (x, y) => `<circle cx="${x}" cy="${y}" r="16.5" fill="url(#iris)"/><circle cx="${x}" cy="${y}" r="9.5" fill="#0E0B09"/>
      <circle cx="${x + 5}" cy="${y - 6}" r="5.5" fill="#fff"/><circle cx="${x - 5}" cy="${y + 6}" r="2" fill="#fff" opacity=".75"/>`;
  const lid = (e) => `<ellipse cx="${e.x}" cy="${e.y}" rx="27" ry="28" fill="url(#lidFur)" filter="url(#lidSoft)"/>`;
  const html = `
  <div class="shadow"></div>
  <div class="pop"><div class="rig"><div class="tilt">
    <img src="${IMG}" alt="Ollie the otter" draggable="false">
    <svg class="face" viewBox="0 0 328 366" aria-hidden="true">
      <defs>
        <radialGradient id="sclera" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".75" stop-color="#F4F1EE"/><stop offset="1" stop-color="#D9D2CC"/></radialGradient>
        <radialGradient id="iris" cx="50%" cy="60%" r="60%"><stop offset="0" stop-color="#7A5A40"/><stop offset=".6" stop-color="#3B2A1F"/><stop offset="1" stop-color="#1A120D"/></radialGradient>
        <linearGradient id="lidFur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C46F3B"/><stop offset=".55" stop-color="#D9834B"/><stop offset="1" stop-color="#E39157"/></linearGradient>
        <radialGradient id="muzzle" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#EBC9A2"/><stop offset=".7" stop-color="#E2BE97"/><stop offset="1" stop-color="#E2BE97" stop-opacity="0"/></radialGradient>
        <filter id="lidSoft" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.2"/></filter>
        <filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>
        <clipPath id="clipL"><ellipse cx="${L.x}" cy="${L.y}" rx="24" ry="25.5"/></clipPath>
        <clipPath id="clipR"><ellipse cx="${R.x}" cy="${R.y}" rx="24" ry="25.5"/></clipPath>
      </defs>
      ${sclera(L)}${sclera(R)}
      <g class="look">
        <g clip-path="url(#clipL)">${iris(L.x + 6, L.y + 1)}</g>
        <g clip-path="url(#clipR)">${iris(R.x - 6, R.y)}</g>
      </g>
      <g class="lid">${lid(L)}${lid(R)}</g>
      <g class="closed">${lid(L)}${lid(R)}
        <g stroke="#3A2A22" stroke-width="4.5" fill="none" stroke-linecap="round"><path d="M75 108 q 20 14 40 0"/><path d="M213 108 q 20 14 40 0"/></g>
      </g>
      <g class="happy">${lid(L)}${lid(R)}
        <g stroke="#3A2A22" stroke-width="5" fill="none" stroke-linecap="round"><path d="M75 116 q 20 -22 40 0"/><path d="M213 116 q 20 -22 40 0"/></g>
      </g>
      <ellipse cx="164" cy="178" rx="64" ry="17" fill="url(#muzzle)" filter="url(#soft)"/>
      <path class="m-smile" d="M114 172 q 24 16 50 3 q 26 13 50 -3" stroke="#5A2E24" stroke-width="4.5" fill="none" stroke-linecap="round"/>
      <g class="m-o"><ellipse cx="164" cy="182" rx="10" ry="12" fill="#4A2320"/><ellipse cx="164" cy="188" rx="6" ry="4" fill="#FF8DA1"/></g>
      <g class="m-laugh"><path d="M122 170 q 42 6 84 0 q -6 34 -42 34 q -36 0 -42 -34 z" fill="#4A2320"/><path d="M140 192 q 24 -10 48 0 q -6 12 -24 12 q -18 0 -24 -12 z" fill="#FF8DA1"/><path d="M128 171 q 36 5 72 0 l -2 6 q -34 4 -68 0 z" fill="#fff" opacity=".9"/></g>
      <g class="m-talk"><path d="M130 172 q 34 4 68 0 q -6 26 -34 26 q -28 0 -34 -26 z" fill="#4A2320"/><path d="M146 190 q 18 -7 36 0 q -5 8 -18 8 q -13 0 -18 -8 z" fill="#FF8DA1"/></g>
    </svg>
  </div></div></div>
  <svg class="fx" viewBox="0 0 328 400" aria-hidden="true">
    <g class="glass">
      <line x1="196" y1="262" x2="228" y2="306" stroke="#6B4A38" stroke-width="12" stroke-linecap="round"/>
      <circle cx="176" cy="234" r="38" fill="#E4F6FA" fill-opacity=".35" stroke="#4C6FFF" stroke-width="10"/>
      <path d="M156 222 a 22 22 0 0 1 18 -14" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/>
    </g>
    <g class="sparkles">
      <path d="M34 70 l7 17 l17 7 l-17 7 l-7 17 l-7 -17 l-17 -7 l17 -7 z" fill="#FFC83D"/>
      <path d="M290 54 l5 12 l12 5 l-12 5 l-5 12 l-5 -12 l-12 -5 l12 -5 z" fill="#FF6F91"/>
      <path d="M300 170 l4 10 l10 4 l-10 4 l-4 10 l-4 -10 l-10 -4 l10 -4 z" fill="#22B88A"/>
      <circle cx="40" cy="190" r="7" fill="#4C6FFF"/>
      <circle cx="270" cy="16" r="5" fill="#FFC83D"/>
      <rect x="60" y="10" width="12" height="12" rx="3" fill="#22B88A" transform="rotate(20 66 16)"/>
    </g>
    <g class="zzz" fill="#4C6FFF" font-family="'Bricolage Grotesque', 'Nunito', sans-serif" font-weight="800">
      <text x="262" y="60" font-size="34">z</text><text x="284" y="34" font-size="24">z</text>
    </g>
    <g class="hi" stroke="#FFC83D" stroke-width="7" stroke-linecap="round">
      <line x1="300" y1="96" x2="318" y2="84"/><line x1="304" y1="122" x2="326" y2="122"/><line x1="300" y1="148" x2="318" y2="160"/>
    </g>
  </svg>`;

  class OllieOtter extends HTMLElement {
    connectedCallback() {
      if (this.shadowRoot) return;
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `<style>${css}</style>${html}`;
      if (!this.hasAttribute('mood')) this.setAttribute('mood', 'idle');
      this.popIn();
      this.addEventListener('click', () => {
        this.classList.remove('tickle'); void this.offsetWidth; this.classList.add('tickle');
        setTimeout(() => this.classList.remove('tickle'), 620);
      });
    }
    popIn() {
      this.classList.remove('entering'); void this.offsetWidth; this.classList.add('entering');
      setTimeout(() => this.classList.remove('entering'), 800);
    }
    say(ms = 1800) {
      this.setAttribute('talking', '');
      clearTimeout(this._t);
      this._t = setTimeout(() => this.removeAttribute('talking'), ms);
    }
  }
  customElements.define('ollie-otter', OllieOtter);
})();
