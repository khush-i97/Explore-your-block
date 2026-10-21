// Ask Ollie answers come from the Python back end (POST /api/voice/ask: Gemini, with keyword answers as backup).
// The prototype's chatSend shows a fixed 1.1 s "typing" and then answers from its own keyword list, so this
// replaces it with one that waits for the back end (and sends the last few messages, so "Cheaper?" makes sense).
// If the back end is down or slow, the prototype's own answer is used.
// When an answer is shown, a window 'ollie:answer' event fires with { phone, reply } (src/voice.ts reads it aloud).

type Ctx = { family?: boolean; group?: boolean }
type Answer = { keys: string[]; reply: string }
type Msg = { from?: 'me' | 'o'; text?: string; typing?: boolean; hid?: string; keys?: string[]; last?: boolean }
type Phone = {
  p: { band: 'kid' | 'teen' | 'adult' }
  s: { chat?: Msg[]; family?: boolean }
  groupMode?: boolean
  ollie: HTMLElement & { say?: (ms: number) => void }
  roam: HTMLElement
  render(dir?: string): void
  scrollChat(): void
}

const MIN_TYPING_MS = 600 // keep Ollie's "typing…" visible for a beat, even when the answer is instant
const TIMEOUT_MS = 10000

async function ask(text: string, band: string, ctx: Ctx, history: { from: 'me' | 'ollie'; text: string }[]): Promise<Answer> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const r = await fetch('/api/voice/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, band, family: !!ctx.family, group: !!ctx.group, history }),
      signal: ctrl.signal,
    })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    const d = await r.json() as Answer
    return { keys: d.keys, reply: d.reply }
  } catch (err) {
    console.warn('[ollie] back end unavailable, using local answer:', (err as Error).message)
    return window.EYB!.ollieAnswer(text, band as 'teen', ctx)
  } finally {
    clearTimeout(t)
  }
}

export function installOllieApi() {
  const EYB = window.EYB
  if (!EYB) return
  const proto = EYB.Phone.prototype as Phone & { chatSend(raw: string): void }

  // same steps and look as the prototype's chatSend, but the answer waits for the back end
  proto.chatSend = function (this: Phone, raw: string) {
    if (!raw || !raw.trim()) return
    const { out, hid } = EYB.redact(raw.trim())
    const chat = this.s.chat = this.s.chat || []
    const history = chat.filter(m => m.text && !m.typing).slice(-6).map(m => ({ from: m.from === 'me' ? 'me' as const : 'ollie' as const, text: m.text! }))
    chat.forEach(m => m.last = false)
    chat.push({ from: 'me', text: out, hid: hid.length ? hid.join(' and ') : '' }, { typing: true })
    this.render('none'); this.scrollChat(); this.ollie.setAttribute('mood', 'search')
    this.roam.classList.remove('hop'); void this.roam.offsetWidth; this.roam.classList.add('hop')

    const started = Date.now()
    ask(raw, this.p.band, { family: this.s.family, group: this.groupMode }, history).then(ans => {
      setTimeout(() => {
        this.s.chat = (this.s.chat || []).filter(m => !m.typing)
        this.s.chat.push({ from: 'o', text: ans.reply, keys: ans.keys, last: true })
        this.render('none'); this.scrollChat(); this.ollie.setAttribute('mood', 'wave')
        if (this.ollie.say) this.ollie.say(1600)
        window.dispatchEvent(new CustomEvent('ollie:answer', { detail: { phone: this, reply: ans.reply } }))
      }, Math.max(0, MIN_TYPING_MS - (Date.now() - started)))
    })
  }
}
