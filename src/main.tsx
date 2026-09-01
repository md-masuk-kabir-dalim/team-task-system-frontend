import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/reset.css'
import './styles/global.css'
import './styles/utilities.css'
import './styles/app.css'
import './styles/kanban-sortable.css'
import './styles/hrivo-dark.css'
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
