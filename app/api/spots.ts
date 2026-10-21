import type { VercelRequest, VercelResponse } from '@vercel/node'

// Group mode: given who is going, return the spots that suit everyone and the strictest (youngest) rules.
// GET /api/spots?members=Mia:8:kid,Lena:14:teen,Sam:32:adult
type Band = 'kid' | 'teen' | 'adult'
const SPOTS: { id: string; name: string; ages: Band[] }[] = [
  { id: 'park', name: 'Dolores Park', ages: ['kid', 'teen', 'adult'] },
  { id: 'playground', name: 'Helen Diller Playground', ages: ['kid', 'adult'] },
  { id: 'birite', name: 'Bi-Rite Creamery', ages: ['kid', 'teen', 'adult'] },
  { id: 'tartine', name: 'Tartine Bakery', ages: ['adult'] },
  { id: 'md', name: 'Mission Dolores', ages: ['kid', 'teen', 'adult'] },
  { id: 'ritual', name: 'Ritual Coffee Roasters', ages: ['teen', 'adult'] },
  { id: 'clarion', name: 'Clarion Alley murals', ages: ['teen', 'adult'] },
  { id: 'roxie', name: 'Roxie Theater', ages: ['adult'] },
  { id: 'foreign', name: 'Foreign Cinema', ages: ['adult'] },
]
const RULES: Record<Band, { locationSharing: boolean; chat: 'filtered' | 'moderate' | 'full'; buying: boolean }> = {
  kid: { locationSharing: false, chat: 'filtered', buying: false },
  teen: { locationSharing: false, chat: 'moderate', buying: false },
  adult: { locationSharing: true, chat: 'full', buying: true },
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  const raw = String(req.query.members ?? '')
  const members = raw.split(',').filter(Boolean).map(m => {
    const [name, age] = m.split(':')
    const a = Number(age)
    const band: Band = a < 13 ? 'kid' : a < 18 ? 'teen' : 'adult'
    return { name, age: a, band }
  }).filter(m => m.name && Number.isFinite(m.age))
  if (!members.length) return res.status(400).json({ error: 'Pass ?members=Name:age,Name:age' })

  const youngest = members.reduce((a, b) => (a.age <= b.age ? a : b))
  const spots = SPOTS.filter(s => members.every(m => s.ages.includes(m.band)))
  // Real permissions come from each member's claimed k-ID session; these band defaults are the fallback.
  return res.status(200).json({ members, followingRulesOf: youngest.name, rules: RULES[youngest.band], spots })
}
