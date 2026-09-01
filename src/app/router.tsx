import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '../components/layout/app-layout.tsx'
import { CalendarPage } from '../features/calendar/calendar-page.tsx'
import { TaskDetailsPage } from '../features/tasks/task-details-page.tsx'
import { TasksPage } from '../features/tasks/tasks-page.tsx'
import { TeamPage } from '../features/team/team-page.tsx'
import { NotFoundPage } from '../routes/not-found-page.tsx'
import { appRoutes } from '../lib/navigation.ts'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate replace to={appRoutes.tasks} /> },
      { path: appRoutes.tasks.slice(1), element: <TasksPage /> },
      { path: appRoutes.calendar.slice(1), element: <CalendarPage /> },
      { path: `${appRoutes.tasks.slice(1)}/:taskId`, element: <TaskDetailsPage /> },
      { path: appRoutes.team.slice(1), element: <TeamPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
