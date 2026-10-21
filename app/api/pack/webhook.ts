import type { VercelRequest, VercelResponse } from '@vercel/node'

// FastSpring order webhook: confirms the Family Outing Pack purchase, then unlocks it for the group.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const secret = process.env.FASTSPRING_WEBHOOK_SECRET
  if (!secret) return res.status(501).json({ error: 'FASTSPRING_WEBHOOK_SECRET is not set. Add it in Vercel → Settings → Environment Variables.' })

  // TODO(FastSpring): verify the X-FS-Signature header (HMAC-SHA256 of the raw body with `secret`),
  // then for each "order.completed" event mark the pack as unlocked for the buyer's group.
  return res.status(200).json({ ok: true, note: 'Signature check + unlock not wired yet' })
}
