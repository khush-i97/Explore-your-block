import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { installOllieApi } from './ollieApi.ts'
import { installVoice } from './voice.ts'

installOllieApi()
installVoice() // after installOllieApi: it wraps the answers that one fetches

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
