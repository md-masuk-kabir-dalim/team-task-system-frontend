import { CircleUserRound, UserPlus, UserRoundCheck, UserRoundMinus } from 'lucide-react'

interface TeamDirectorySummaryProps {
  active: number
  newJoiners: number
  onLeave: number
  total: number
}

const summaryItems = [
  { icon: CircleUserRound, key: 'total', label: 'Total employees', tone: 'blue' },
  { icon: UserRoundCheck, key: 'active', label: 'Active employees', tone: 'green' },
  { icon: UserRoundMinus, key: 'onLeave', label: 'On leave', tone: 'amber' },
  { icon: UserPlus, key: 'newJoiners', label: 'New joiners', tone: 'violet' },
] as const

export function TeamDirectorySummary({ active, newJoiners, onLeave, total }: TeamDirectorySummaryProps) {
  const values = { active, newJoiners, onLeave, total }

  return (
    <section aria-label="Employee summary" className="team-directory-summary">
      {summaryItems.map((item) => {
        const Icon = item.icon

        return (
          <article className="team-directory-summary__card" key={item.key}>
            <span aria-hidden="true" className={`team-directory-summary__icon team-directory-summary__icon--${item.tone}`}>
              <Icon size={20} strokeWidth={1.9} />
            </span>
            <div>
              <strong>{values[item.key]}</strong>
              <span>{item.label}</span>
            </div>
          </article>
        )
      })}
    </section>
  )
}
