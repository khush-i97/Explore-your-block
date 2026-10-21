import type { VercelRequest, VercelResponse } from '@vercel/node'

// Redeems the one-time k-ID claimToken (valid 10 minutes) with the SECRET key, server-side only.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' })
  const secret = process.env.KID_SECRET_KEY
  if (!secret) return res.status(501).json({ error: 'KID_SECRET_KEY is not set. Add it in Vercel → Settings → Environment Variables.' })
  const { claimToken } = (req.body ?? {}) as { claimToken?: string }
  if (!claimToken) return res.status(400).json({ error: 'claimToken missing' })

  // TODO(k-ID): redeem at k-ID's /client/claim. Ask the k-ID helpers for the exact server URL and auth header,
  // e.g. POST https://<k-ID server API>/client/claim with the secret key and { claimToken }.
  // Then save the returned age result + permissions for this player (needed for group mode).
  return res.status(501).json({ error: 'Claim call not wired yet: waiting on the k-ID /client/claim URL.', received: true })
}
