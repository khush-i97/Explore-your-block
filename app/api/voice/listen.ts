import type { VercelRequest, VercelResponse } from '@vercel/node'

// Voice → text + emotion (Modulate). Redacts personal details for kids and teens.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const key = process.env.MODULATE_API_KEY
  if (!key) return res.status(501).json({ error: 'MODULATE_API_KEY is not set. Add it in Vercel → Settings → Environment Variables.' })

  // TODO(Modulate): send the recorded audio (req.body.audio, base64) to Modulate for transcription,
  // emotion ("excited") and redaction. Return { text, emotion, redacted }.
  return res.status(501).json({ error: 'Modulate call not wired yet' })
}
