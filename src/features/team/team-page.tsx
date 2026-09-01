import { UsersRound } from 'lucide-react'
import { EmptyState } from '../../components/feedback/empty-state.tsx'
import { ErrorState } from '../../components/feedback/error-state.tsx'
import { PageIntro } from '../../components/layout/page-intro.tsx'
import { TeamWorkspace, TeamWorkspaceSkeleton } from './components/team-workspace.tsx'
import { useTeamWorkspace } from './hooks/use-team-workspace.ts'

export function TeamPage() {
  const { error, isLoading, members, retry } = useTeamWorkspace()

  return (
    <section className="page">
      <PageIntro
        description="See ownership at a glance and spot where the team needs support."
        eyebrow="People"
        title="Team"
      />

      {isLoading ? <TeamWorkspaceSkeleton /> : null}
      {error ? (
        <ErrorState
          description="Something went wrong while loading the team workspace. Please try again."
          onRetry={retry}
          title="Unable to load the team"
        />
      ) : null}
      {members?.length ? <TeamWorkspace members={members} /> : null}
      {members && !members.length ? (
        <EmptyState
          description="Team members will appear here once they are added to the workspace."
          icon={<UsersRound aria-hidden="true" size={24} />}
          title="No team members yet"
        />
      ) : null}
    </section>
  )
}
