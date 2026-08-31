import type { ReactNode } from 'react'

interface PageIntroProps {
  children?: ReactNode
  description: string
  eyebrow?: string
  title: string
}

export function PageIntro({ children, description, eyebrow, title }: PageIntroProps) {
  return (
    <header className="page-intro">
      <div>
        {eyebrow ? <p className="page-intro__eyebrow">{eyebrow}</p> : null}
        <h2 className="page-intro__title">{title}</h2>
        <p className="page-intro__description">{description}</p>
      </div>
      {children ? <div className="page-intro__actions">{children}</div> : null}
    </header>
  )
}
