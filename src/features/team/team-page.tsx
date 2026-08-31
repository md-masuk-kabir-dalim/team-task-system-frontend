import { UsersRound } from 'lucide-react'
import { PageIntro } from '../../components/layout/page-intro.tsx'

export function TeamPage() {
  return (
    <section className="page">
      <PageIntro
        description="Team members and ownership information will appear here once user fixtures are introduced."
        eyebrow="People"
        title="Team"
      />

      <section className="feature-placeholder" aria-label="Team workspace placeholder">
        <div className="feature-placeholder__icon"><UsersRound aria-hidden="true" size={22} /></div>
        <div>
          <h3>Ownership, without ambiguity</h3>
          <p>The task experience will use this team directory to provide clear assignments and useful filters.</p>
        </div>
      </section>
    </section>
  )
}
