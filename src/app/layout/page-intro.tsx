import type { ReactNode } from 'react'

interface BreadcrumbItem {
  label: string
}

interface PageIntroProps {
  breadcrumbs?: readonly BreadcrumbItem[]
  children?: ReactNode
  description: string
  eyebrow?: string
  title: string
}

export function PageIntro({ breadcrumbs, children, description, eyebrow, title }: PageIntroProps) {
  return (
    <header className="page-intro">
      <div>
        {breadcrumbs?.length ? (
          <ol aria-label="Breadcrumb" className="page-intro__breadcrumbs">
            {breadcrumbs.map((breadcrumb) => <li key={breadcrumb.label}>{breadcrumb.label}</li>)}
          </ol>
        ) : null}
        {eyebrow ? <p className="page-intro__eyebrow">{eyebrow}</p> : null}
        <h1 className="page-intro__title">{title}</h1>
        <p className="page-intro__description">{description}</p>
      </div>
      {children ? <div className="page-intro__actions">{children}</div> : null}
    </header>
  )
}
