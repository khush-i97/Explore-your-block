import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  KidAskAnAdult, KidCollectAge, KidCoreProvider, KidSelectJurisdiction, KidSessionProvider,
  useKidAgeGate, useKidPermission, useKidSession, type KidDeclare,
} from '@k-id/core'

type Rule = 'yes' | 'ask' | 'no' | 'zones'
type PermName = Parameters<ReturnType<typeof useKidPermission>['can']>[0]

const BASE_URL = 'https://kai-api.test.k-id.com/fapi/v1'
const PUBLISHABLE_KEY = import.meta.env.VITE_KID_PUBLISHABLE_KEY as string | undefined

// The features Explore Your Block really has (names from the SDK's PERMISSIONS.md)
const DECLARE: KidDeclare = {
  permissions: [
    { name: 'camera-access' },
    { name: 'ai-media-upload' },
    { name: 'photo-video-sharing' },
    { name: 'send-accept-friend-requests' },
    { name: 'in-game-purchases' },
    { name: 'ai-voice-mode' },
    { name: 'ai-companion-chatbot' },
    { name: 'voice-chat' },
    { name: 'multiplayer' },
    { name: 'text-chat-private' },
    { name: 'real-time-location-sharing' },
  ],
  iconUrl: 'https://explore-your-block.vercel.app/assets/ollie-icon.png',
  supportEmail: 'support@example.com',
}

const APPEARANCE = {
  variables: {
    colorPrimary: '#1F2030', colorOnPrimary: '#FFFFFF',
    colorText: '#1F2030', colorTextMuted: '#6B6A75',
    colorSurface: '#FFFFFF', colorSurfaceMuted: '#F6F3EE',
    colorBorder: '#EFE9E0', colorDanger: '#E5484D',
    fontFamily: "'Nunito', system-ui, sans-serif", radius: '20px',
  },
}

const store = {
  get: (k: string) => { try { return localStorage.getItem(k) ?? undefined } catch { return undefined } },
  set: (k: string, v: string) => { try { localStorage.setItem(k, v) } catch { /* private mode */ } },
  clear: () => { try { ['kid.sessionId', 'kid.challengeId', 'eyb.age'].forEach(k => localStorage.removeItem(k)) } catch { /* private mode */ } },
}

// ?j=US-CA or ?j=DE pins the country for a live demo; otherwise k-ID resolves it from the IP
const jurisdiction = new URLSearchParams(location.search).get('j') || 'auto'

const ageFrom = (signal: { age: number } | { dateOfBirth: string }) =>
  'age' in signal ? signal.age : Math.floor((Date.now() - Date.parse(signal.dateOfBirth)) / 3.15576e10)

/* ---------- a phone-shaped frame (full screen on a real phone) ---------- */
function Frame({ children }: { children: ReactNode }) {
  return <div className="app"><div className="phone"><div className="screen">{children}</div></div></div>
}

/* ---------- one big bold stage screen, same classes as the prototype ---------- */
function Stage({ bg, dome, ink = '#fff', kick, title, mood, children }: {
  bg: string; dome: string; ink?: string; kick?: string; title: ReactNode; mood: string; children: ReactNode
}) {
  return (
    <Frame>
      <div className="stage-bg" style={{ ['--sbg' as string]: bg }} />
      <div className="stage-ollie"><ollie-otter mood={mood} /></div>
      <div className="dome" style={{ ['--dome' as string]: dome }} />
      <div className="stage-top" style={{ ['--stxt' as string]: ink }}>
        {kick && <div className="kick">{kick}</div>}
        <div className="big">{title}</div>
      </div>
      <div className="stage-bot" style={{ ['--btxt' as string]: '#fff' }}>{children}</div>
    </Frame>
  )
}

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <Stage bg="#DDE6FF" dome="#4C6FFF" ink="#1F2030" mood="wave" title={<>Hi, I'm<br />Ollie!</>}>
      <p>Let's explore your block together. Outings that fit you, and your whole group.</p>
      <button className="btn-white" onClick={onStart}>Let's go <i className="ph-bold ph-arrow-right" /></button>
    </Stage>
  )
}

/* ---------- k-ID capture: our header, k-ID's own pieces (they show only during their step) ---------- */
function Capture() {
  return (
    <Frame>
      <div className="kid-capture">
        <div className="head"><ollie-otter mood="idle" /><h2>Let's make it<br />just right for you</h2></div>
        <KidSelectJurisdiction />
        <KidCollectAge onSubmit={(signal) => store.set('eyb.age', String(ageFrom(signal)))} />
        <KidAskAnAdult />
        <p className="note"><i className="ph-fill ph-shield-check" />Age check and parent consent by k-ID</p>
      </div>
    </Frame>
  )
}

/* ---------- the real app: k-ID permissions drive the prototype screens ---------- */
function PassApp() {
  const { permissions } = useKidSession()
  const { can, get } = useKidPermission()
  const host = useRef<HTMLDivElement>(null)

  const age = Number(store.get('eyb.age')) || 14 // no age asked (k-ID said none needed): treat as teen
  const band = age < 13 ? 'kid' : age < 18 ? 'teen' : 'adult'
  const rules = useMemo(() => {
    const rule = (name: PermName): Rule => can(name) ? 'yes' : get(name)?.managedBy === 'GUARDIAN' ? 'ask' : 'no'
    return {
      camera: rule('camera-access'),
      sharing: rule('photo-video-sharing'),
      buying: rule('in-game-purchases'),
      voice: rule('ai-voice-mode'),
      vchat: rule('voice-chat'),
      location: band === 'kid' || rule('real-time-location-sharing') !== 'yes' ? 'zones' : 'yes',
      map: band === 'kid' ? 'no' : 'yes',
    } satisfies Record<string, Rule>
    // permissions changes (e.g. a parent approves) re-run this
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, band])

  useEffect(() => {
    const EYB = window.EYB
    if (!EYB || !host.current) return
    const country = jurisdiction.startsWith('DE') ? 'DE' : 'US'
    EYB.PLAYERS.me = { id: 'me', name: 'You', age, country, countryName: country === 'DE' ? 'Germany' : 'the US', band, color: '#4C6FFF' }
    EYB.RULES.me = rules
    new EYB.Phone(host.current, 'me', { screen: 'home' })
  }, [age, band, rules])

  return <div className="app"><div className="host" ref={host} /></div>
}

/* ---------- route by k-ID's status ---------- */
function Flow({ onRetry }: { onRetry: () => void }) {
  const { status } = useKidAgeGate()
  if (status === 'pass') return <PassApp />
  if (status === 'pending') return (
    <Stage bg="#262A52" dome="#363B70" kick="Hang tight" title={<>Waiting for<br />a grown-up</>} mood="sleep">
      <p>We emailed your grown-up. Ollie is napping until they say OK. This page updates by itself.</p>
    </Stage>
  )
  if (status === 'prohibited') return (
    <Stage bg="#EEF1FF" dome="#7C8DB8" ink="#1F2030" kick="Not quite yet" title={<>Too young<br />to play here</>} mood="wave">
      <p>In your country, players need to be a little older for this game. Ollie will be right here when you are.</p>
    </Stage>
  )
  if (status === 'fail') return (
    <Stage bg="#3A3550" dome="#5A5378" kick="Your grown-up said" title="Not yet!" mood="idle">
      <p>That's OK. You can ask again later, or ask a different grown-up.</p>
      <button className="btn-white" onClick={onRetry}>Ask again</button>
    </Stage>
  )
  if (status === 'error') return (
    <Stage bg="#F3EEE6" dome="#1F2030" ink="#1F2030" kick="Hmm" title={<>Couldn't<br />reach k-ID</>} mood="idle">
      <p>Check your connection and try again.</p>
      <button className="btn-white" onClick={onRetry}>Try again</button>
    </Stage>
  )
  return <Capture />
}

export default function App() {
  const [started, setStarted] = useState(Boolean(store.get('kid.sessionId')))
  const [attempt, setAttempt] = useState(0)

  if (!PUBLISHABLE_KEY) return (
    <Stage bg="#F3EEE6" dome="#1F2030" ink="#1F2030" kick="Setup" title={<>Add the k-ID<br />key</>} mood="idle">
      <p>Set VITE_KID_PUBLISHABLE_KEY in .env.local (or in Vercel), then reload.</p>
    </Stage>
  )
  if (!started) return <Welcome onStart={() => setStarted(true)} />

  const retry = () => { store.clear(); setAttempt(a => a + 1) } // remounting the provider is the reset
  return (
    <KidCoreProvider publishableKey={PUBLISHABLE_KEY} baseUrl={BASE_URL} declare={DECLARE} appearance={APPEARANCE}>
      <KidSessionProvider
        key={attempt}
        jurisdiction={jurisdiction}
        sessionId={store.get('kid.sessionId')}
        challengeId={store.get('kid.challengeId')}
        onSession={(id) => store.set('kid.sessionId', id)}
        onChallenge={(id) => store.set('kid.challengeId', id)}
        onClaim={(claimToken) => { fetch('/api/kid/claim', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ claimToken }) }).catch(() => {}) }}
      >
        <Flow onRetry={retry} />
      </KidSessionProvider>
    </KidCoreProvider>
  )
}
