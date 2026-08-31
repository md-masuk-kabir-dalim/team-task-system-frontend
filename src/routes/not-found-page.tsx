import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <section className="not-found-page">
      <Compass aria-hidden="true" className="not-found-page__icon" size={28} />
      <p className="not-found-page__eyebrow">404</p>
      <h2>That page is not in this workspace.</h2>
      <p>Use the navigation to return to a familiar part of Pulseboard.</p>
      <Link className="text-link" to="/dashboard">
        <ArrowLeft aria-hidden="true" size={17} />
        Back to dashboard
      </Link>
    </section>
  )
}
