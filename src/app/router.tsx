import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './layout/app-layout.tsx'
import { CalendarPage } from '@/features/calendar'
import { HomePage } from '@/features/home'
import { TaskDetailsPage, TasksPage } from '@/features/tasks'
import { EmployeeDetailsPage, TeamPage } from '@/features/team'
import { NotFoundPage } from './routes/not-found-page.tsx'
import { appRoutes } from '@/app/navigation.ts'

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: appRoutes.tasks.slice(1), element: <TasksPage /> },
      { path: appRoutes.calendar.slice(1), element: <CalendarPage /> },
      { path: `${appRoutes.tasks.slice(1)}/:taskId`, element: <TaskDetailsPage /> },
      { path: appRoutes.team.slice(1), element: <TeamPage /> },
      { path: `${appRoutes.team.slice(1)}/:employeeId`, element: <EmployeeDetailsPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
