import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type RuleValue = 'yes' | 'ask' | 'no' | 'zones'
type Band = 'kid' | 'teen' | 'adult'
type OllieAnswer = (text: string, band: Band, ctx: { family?: boolean; group?: boolean }) => { keys: string[]; reply: string }

declare global {
  interface Window {
    EYB?: {
      Phone: { new (host: HTMLElement, playerId: string, opts?: { screen?: string; profiles?: string[] }): unknown; prototype: object }
      PLAYERS: Record<string, { id: string; name: string; age: number; country: string; countryName: string; band: Band; color: string }>
      RULES: Record<string, Record<string, RuleValue>>
      ollieAnswer: OllieAnswer
    }
    // proto.js is a classic script, so its top-level functions are globals the screens call by name
    ollieAnswer: OllieAnswer
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
