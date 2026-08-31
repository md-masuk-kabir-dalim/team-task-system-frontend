import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/app-layout.tsx'
import { DashboardPage } from '../features/dashboard/dashboard-page.tsx'
import { TaskDetailsPage } from '../features/tasks/task-details-page.tsx'
import { TasksPage } from '../features/tasks/tasks-page.tsx'
import { TeamPage } from '../features/team/team-page.tsx'
import { NotFoundPage } from '../routes/not-found-page.tsx'
import { SettingsPage } from '../routes/settings-page.tsx'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'tasks', element: <TasksPage /> },
      { path: 'tasks/:taskId', element: <TaskDetailsPage /> },
      { path: 'team', element: <TeamPage /> },
      { path: 'settings', element: <SettingsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
