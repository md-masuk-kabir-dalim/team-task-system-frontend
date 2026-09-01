import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { appRoutes } from '../lib/navigation.ts'

export function NotFoundPage() {
  return (
    <section className="not-found-page">
      <Compass aria-hidden="true" className="not-found-page__icon" size={28} />
      <p className="not-found-page__eyebrow">404</p>
      <h1>That page is not in this workspace.</h1>
      <p>It may have moved, or the address may be incorrect. Return to your task workspace to continue.</p>
      <Link className="text-link" to={appRoutes.tasks}>
        <ArrowLeft aria-hidden="true" size={17} />
        Back to Tasks
      </Link>
    </section>
  )
}
