// Ask Ollie answers come from the Python back end (POST /api/voice/ask).
// The prototype's chat calls the global ollieAnswer() about a second after you send, so we start the
// request as soon as the message is sent and hand back the server's answer when the chat asks for it.
// If the back end is down or slow, the prototype's own answer is used.

type Ctx = { family?: boolean; group?: boolean }
type Answer = { keys: string[]; reply: string }

const local = window.ollieAnswer
const ready = new Map<string, Answer>()
const keyOf = (text: string, band: string, ctx: Ctx) => JSON.stringify([text, band, !!ctx.family, !!ctx.group])

export function prefetchAnswer(text: string, band: string, ctx: Ctx) {
  fetch('/api/voice/ask', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, band, family: !!ctx.family, group: !!ctx.group }),
  })
    .then(r => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
    .then((d: Answer) => ready.set(keyOf(text, band, ctx), { keys: d.keys, reply: d.reply }))
    .catch(err => console.warn('[ollie] back end unavailable, using local answer:', err.message))
}

export function installOllieApi() {
  const EYB = window.EYB
  if (!EYB || !local) return
  window.ollieAnswer = (text, band, ctx) => {
    const k = keyOf(text, band, ctx)
    const hit = ready.get(k)
    ready.delete(k)
    return hit ?? local(text, band, ctx)
  }
  const proto = EYB.Phone.prototype as { chatSend(raw: string): void; p: { band: string }; s: { family?: boolean }; groupMode?: boolean }
  const send = proto.chatSend
  proto.chatSend = function (raw: string) {
    if (raw?.trim()) prefetchAnswer(raw, this.p.band, { family: this.s.family, group: this.groupMode })
    send.call(this, raw)
  }
}
