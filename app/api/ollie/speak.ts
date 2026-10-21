import type { VercelRequest, VercelResponse } from '@vercel/node'

// Text → Ollie's voice (Inworld TTS). Tone follows who is listening: kid, teen, adult or group.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const key = process.env.INWORLD_API_KEY
  if (!key) return res.status(501).json({ error: 'INWORLD_API_KEY is not set. Add it in Vercel → Settings → Environment Variables.' })
  const { text, audience } = (req.body ?? {}) as { text?: string; audience?: 'kid' | 'teen' | 'adult' | 'group' }
  if (!text) return res.status(400).json({ error: 'text missing' })

  // TODO(Inworld): call Inworld's text-to-speech API with `key`, a voice for Ollie, and a style for `audience`.
  // Return the audio (e.g. base64 MP3) so the app can play it while Ollie's mouth moves.
  return res.status(501).json({ error: 'Inworld TTS call not wired yet', text, audience })
}
