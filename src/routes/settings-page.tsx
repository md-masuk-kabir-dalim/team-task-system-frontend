import { SlidersHorizontal } from 'lucide-react'
import { PageIntro } from '../components/layout/page-intro.tsx'

export function SettingsPage() {
  return (
    <section className="page">
      <PageIntro
        description="Workspace preferences will live here without interrupting the team’s daily task flow."
        eyebrow="Workspace"
        title="Settings"
      />

      <section className="feature-placeholder" aria-label="Settings placeholder">
        <div className="feature-placeholder__icon"><SlidersHorizontal aria-hidden="true" size={22} /></div>
        <div>
          <h3>Preferences are ready for a home</h3>
          <p>Future user interface preferences will remain separate from shareable task filters in the URL.</p>
        </div>
      </section>
    </section>
  )
}
