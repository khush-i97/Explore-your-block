import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type RuleValue = 'yes' | 'ask' | 'no' | 'zones'

declare global {
  interface Window {
    EYB?: {
      Phone: new (host: HTMLElement, playerId: string, opts?: { screen?: string }) => unknown
      PLAYERS: Record<string, { id: string; name: string; age: number; country: string; countryName: string; band: 'kid' | 'teen' | 'adult'; color: string }>
      RULES: Record<string, Record<string, RuleValue>>
    }
  }
}

// Ollie, the animated web component from /assets/ollie.js
declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'ollie-otter': DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & { mood?: string }
    }
  }
}

export {}
