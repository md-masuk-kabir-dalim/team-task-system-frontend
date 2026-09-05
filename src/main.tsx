import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/tokens.css'
import './shared/styles/reset.css'
import './shared/styles/global.css'
import './shared/styles/utilities.css'
import './shared/styles/app.css'
import './shared/styles/kanban-sortable.css'
import './shared/styles/workspace-dark.css'
import { App } from './app/app.tsx'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Unable to find the application root.')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
