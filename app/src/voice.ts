// Ollie's voice, both ways, on top of the prototype screens (proto.js):
// - Mic in Ask Ollie: record → POST /api/voice/listen (Modulate) → the text is typed into the chat and sent.
//   Needs k-ID's voice-chat permission; never for kids.
// - Ollie's answers are read aloud: POST /api/ollie/speak (Inworld). Needs k-ID's ai-voice-mode permission.
//   Without an Inworld voice for the band, the browser's own voice is used.
// - Tapping Ollie: he says his line out loud.
// No voice either way for kids.

type Band = 'kid' | 'teen' | 'adult'
type Voiced = Exclude<Band, 'kid'>
type Phone = {
  p: { band: Band }
  r: Record<string, string>
  s: { chat?: unknown[] }
  screen: string
  kid: boolean
  phoneEl: HTMLElement
  ollie: HTMLElement
  roam: HTMLElement
  toast(msg: string, icon?: string): void
  chatSend(raw: string): void
  render(dir?: string): void
  ollieReact(): void
}

const MAX_RECORDING_MS = 15000
const plain = (html: string) => {
  const d = document.createElement('div')
  d.innerHTML = html.replace(/<br\s*\/?>/gi, ' ')
  return (d.textContent || '').replace(/["“”]/g, '').replace(/\p{Extended_Pictographic}/gu, '').replace(/\s+/g, ' ').trim()
}
const phoneOf = (el: Element | null) => (el?.closest('.phone') as (HTMLElement & { __eyb?: Phone }) | null)?.__eyb

/* ---------- text to speech ---------- */
let playing: HTMLAudioElement | null = null
let speakId = 0

function stopSpeaking() {
  speakId++
  playing?.pause()
  playing = null
  window.speechSynthesis?.cancel()
}

const BROWSER_VOICE: Record<Voiced, { pitch: number; rate: number }> = {
  teen: { pitch: 1.15, rate: 1.04 },
  adult: { pitch: 1.0, rate: 0.98 }, // calm guide
}
function browserVoice() {
  const voices = window.speechSynthesis?.getVoices() ?? []
  const en = voices.filter(v => v.lang.startsWith('en'))
  return ['Samantha', 'Google US English', 'Karen', 'Moira', 'Daniel'].map(n => en.find(v => v.name.startsWith(n))).find(Boolean) ?? en[0]
}

export async function speak(text: string, band: Band, ollie?: HTMLElement) {
  const line = plain(text)
  if (!line || band === 'kid') return
  stopSpeaking()
  const id = speakId
  // drive Ollie's own say(ms) timer, or the prototype's fixed-length say() would shut his mouth mid-sentence
  const o = ollie as (HTMLElement & { say?: (ms: number) => void }) | undefined
  const talking = (on: boolean, ms = 60000) => { if (o?.say) o.say(on ? ms : 0); else o?.toggleAttribute('talking', on) }
  try {
    const r = await fetch('/api/ollie/speak', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text: line, band }) })
    if (id !== speakId) return
    if (r.ok && r.headers.get('content-type')?.startsWith('audio/')) {
      const url = URL.createObjectURL(await r.blob())
      if (id !== speakId) return
      const audio = new Audio(url)
      playing = audio
      audio.onplay = () => talking(true, Number.isFinite(audio.duration) ? audio.duration * 1000 + 200 : 60000)
      audio.onended = audio.onpause = () => { talking(false); URL.revokeObjectURL(url) }
      await audio.play()
      return
    }
  } catch { /* back end down: use the browser's voice */ }
  if (id !== speakId || !window.speechSynthesis) return
  const u = new SpeechSynthesisUtterance(line)
  const v = browserVoice()
  if (v) u.voice = v
  Object.assign(u, BROWSER_VOICE[band])
  u.onstart = () => talking(true)
  u.onend = u.onerror = () => talking(false)
  window.speechSynthesis.speak(u)
}

/* ---------- speech to text ---------- */
let rec: { recorder: MediaRecorder; stream: MediaStream; timer: number; phone: Phone } | null = null
let starting = false // the mic can take a moment to open; ignore taps until it has

function setMicUi(phone: Phone, state: 'idle' | 'listening' | 'working') {
  const mic = phone.phoneEl.querySelector<HTMLButtonElement>('.chat-input .mic')
  const input = phone.phoneEl.querySelector<HTMLInputElement>('#chatIn')
  mic?.classList.toggle('rec', state === 'listening')
  mic?.classList.toggle('working', state === 'working')
  mic?.setAttribute('aria-label', state === 'listening' ? 'Stop and send' : 'Talk instead')
  if (input) {
    input.placeholder = state === 'listening' ? 'Listening… tap the mic when you’re done'
      : state === 'working' ? 'Typing what you said…' : 'Type what you want to do…'
    input.disabled = state !== 'idle'
  }
}

function canTalk(phone: Phone) {
  if (phone.kid) return false
  if (phone.r.vchat === 'yes') return true
  phone.toast(phone.r.vchat === 'ask' ? 'Talking to Ollie needs a parent’s OK' : 'Talking to Ollie is off for you', 'ph-microphone-slash')
  return false
}

async function startListening(phone: Phone) {
  if (rec || starting || !canTalk(phone)) return
  if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
    phone.toast('This browser can’t record. Type instead.', 'ph-microphone-slash'); return
  }
  let stream: MediaStream
  starting = true
  try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }) }
  catch { phone.toast('Allow the microphone to talk to Ollie', 'ph-microphone-slash'); return }
  finally { starting = false }
  stopSpeaking()
  const type = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4'].find(t => MediaRecorder.isTypeSupported(t))
  const recorder = new MediaRecorder(stream, type ? { mimeType: type } : undefined)
  const chunks: Blob[] = []
  recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data) }
  recorder.onstop = () => transcribe(phone, new Blob(chunks, { type: recorder.mimeType || 'audio/webm' }))
  recorder.start()
  rec = { recorder, stream, phone, timer: window.setTimeout(stopListening, MAX_RECORDING_MS) }
  setMicUi(phone, 'listening')
}

function stopListening() {
  if (!rec) return
  clearTimeout(rec.timer)
  setMicUi(rec.phone, 'working')
  rec.recorder.stop()
  rec.stream.getTracks().forEach(t => t.stop())
  rec = null
}

async function transcribe(phone: Phone, clip: Blob) {
  const form = new FormData()
  form.append('audio', clip, 'voice')
  form.append('band', phone.p.band)
  let text = ''
  try {
    const r = await fetch('/api/voice/listen', { method: 'POST', body: form })
    if (r.ok) text = ((await r.json()) as { text: string }).text
    else console.warn('[voice] listen failed:', r.status, await r.text())
  } catch (e) { console.warn('[voice] back end unavailable:', e) }
  setMicUi(phone, 'idle')
  const input = phone.phoneEl.querySelector<HTMLInputElement>('#chatIn')
  if (!text) { phone.toast('Ollie didn’t catch that. Try again?', 'ph-ear'); return }
  if (input) input.value = text
  setTimeout(() => phone.chatSend(text), 450) // let them see what was typed, then send
}

/* ---------- hook into the prototype ---------- */
export function installVoice() {
  const EYB = window.EYB
  if (!EYB) return
  const proto = EYB.Phone.prototype as Phone

  // let DOM clicks find their Phone
  const render = proto.render
  proto.render = function (this: Phone, dir?: string) { render.call(this, dir); (this.phoneEl as HTMLElement & { __eyb?: Phone }).__eyb = this }

  // stop talking when a new question goes out; read the answer aloud when it's shown (src/ollieApi.ts)
  const send = proto.chatSend
  proto.chatSend = function (this: Phone, raw: string) {
    stopSpeaking()
    send.call(this, raw)
  }
  window.addEventListener('ollie:answer', e => {
    const { phone, reply } = (e as CustomEvent<{ phone: Phone; reply: string }>).detail
    if (phone.r.voice === 'yes') speak(reply, phone.p.band, phone.ollie)
  })

  // tap Ollie: he says his line out loud
  const react = proto.ollieReact
  proto.ollieReact = function (this: Phone) {
    react.call(this)
    if (this.kid || this.r.voice !== 'yes') return
    const line = this.roam.querySelector('.obub')?.textContent
    if (line) speak(line, this.p.band, this.ollie)
  }

  // the mic in Ask Ollie records for real (it used to open a scripted demo screen)
  document.addEventListener('click', e => {
    const t = e.target as Element
    const mic = t.closest('.chat-input .mic')
    if (mic) {
      e.preventDefault(); e.stopPropagation()
      const phone = phoneOf(mic)
      if (phone && rec) stopListening()
      else if (phone) startListening(phone)
      return
    }
    // the mic icon on "Ask Ollie anything…" opens the chat and starts listening
    if (t.closest('.askbar .ph-microphone')) {
      const phone = phoneOf(t)
      if (phone) setTimeout(() => { if (phone.screen === 'chat' && phone.phoneEl.querySelector('#chatIn')) startListening(phone) }, 450)
    }
  }, true)
}
