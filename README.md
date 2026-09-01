# Pulseboard Team Tasks

Pulseboard is a responsive frontend for a team task-management workflow. It is designed around a calm, dense task list that helps a team find work, identify risk, assign ownership, and move a task through its workflow without turning the interface into an analytics dashboard.

This repository is intentionally frontend-only. It uses a deterministic mock service with 360 generated tasks so the interface can be assessed against realistic long text, absent fields, overdue work, unassigned work, and varied owners.

## Setup

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal. The primary product route is `/tasks`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Run the strict TypeScript build and create a production bundle. |
| `npm run lint` | Run Oxlint. |
| `npm run test` | Run the focused Vitest suite. |
| `npm run preview` | Preview the production bundle locally. |

## Product capabilities

- Responsive app shell: full sidebar at desktop, compact tablet rail, and accessible mobile Sheet navigation.
- Three task workspace views built from the same data: dense grouped List, Kanban, and Timeline; mobile never relies on horizontal table scrolling.
- Drag a Kanban card into another workflow column to change its status, with optimistic feedback, rollback on failure, and an accessible status-select alternative.
- Real mock-service loading, retryable error, empty, and in-place refresh states.
- Search across task titles, descriptions, and assignee names.
- Filters for status, priority, owner, and due-date state, including quick filters and a mobile filter Sheet.
- URL-driven search, filters, sorting, pagination, and workspace view. For example: `/tasks?status=blocked&priority=urgent&sort=title&direction=desc&page=2&view=board`.
- Task details, validated task creation, and asynchronous workflow status updates.
- Team workspace with workload, urgent, and overdue signals.

## Architecture

```text
src/
├── app/                         # Router and application entry points
├── components/
│   ├── feedback/                # Loading, error, empty, inline-error states
│   ├── layout/                  # Responsive application shell
│   └── ui/                      # Reusable accessible primitives
├── features/
│   ├── tasks/
│   │   ├── api/                 # Mock API-shaped task service
│   │   ├── components/          # Task list, form, filters, details, workflow
│   │   ├── data/                # Generated fixtures and team fixtures
│   │   ├── hooks/               # Query, list, and detail hooks
│   │   ├── types/               # Strict domain and query types
│   │   └── utils/               # Date helpers
│   └── team/                    # Team workspace and data hook
├── stores/                      # Zustand UI-only state
├── styles/                      # Tokens, reset, globals, and component styling
└── lib/                         # Shared navigation and small helpers
```

The mock collection is private to `features/tasks/api/task-service.ts`. UI components never reach into fixture arrays directly, which keeps a future HTTP API replacement localized to the service boundary.

## Data model

`Task` contains an id, title, optional description, workflow status, priority, optional assignee id, optional due date, and created/updated timestamps. `TeamMember` contains an id, name, and email.

Workflow states are `todo`, `in-progress`, `blocked`, and `done`. Priorities are `low`, `medium`, `high`, and `urgent`.

The fixture generator creates 360 tasks from a deterministic seed, but dates are placed relative to the current day so the product always has meaningful overdue, today, future, and no-date cases. The data is held in memory; created tasks and status changes last for the running browser session and reset on refresh.

## Product decisions

### List first, with focused workspace views

The List is the default because desktop work management benefits from scanning aligned status, priority, owner, and due-date columns. Kanban supports stage-based triage and Timeline makes dates easier to scan without creating a separate data source. At mobile sizes the List becomes task cards with wrapping titles and visible metadata; it is not a squeezed or horizontally scrollable table.

### URL-owned task views

Search, filters, sorting, and pagination belong in the URL because they represent a shareable view of work. Text search updates history with `replace` to avoid a browser-history entry for every keystroke; intentional filter, sort, and page actions create navigable history entries. Zustand is reserved for application UI state: the mobile filter Sheet and create-task dialog.

### Focused signals

The workspace uses status, priority, due-date, and ownership signals directly in each task view rather than a decorative analytics dashboard. The team page continues that approach with ownership and workload signals.

## Accessibility and responsive behavior

- Semantic landmarks, headings, table structure, navigation labels, and `aria-current` are used throughout.
- Native dialogs/Sheets handle modal focus, Escape dismissal, backdrop dismissal, and focus restoration.
- Keyboard-visible focus styles are part of the tokenized design system.
- Controls use 44px minimum targets where practical; pagination deliberately simplifies at small widths.
- The three intended layouts are 1280px desktop, 768px tablet, and 375px mobile.

## Testing

`npm run test` currently runs five focused tests across two files. The suite verifies:

- URL parsing and serialization, including malformed values;
- status filtering, assignee-name search, sorting, and pagination;
- recoverable mock-service errors;
- creation and persisted workflow updates.

## Intentionally not built

- Authentication, authorization, or real accounts;
- A real backend or persistence beyond the browser session;
- Notifications, comments, attachments, file uploads, or real-time collaboration;
- Saved views, advanced analytics, and bulk editing;
- Drag-and-drop workflow movement.

These cuts keep the assessment focused on task discovery, ownership, and workflow quality rather than unsupported surrounding systems.

## Least confident decisions

1. **Auto-saving search input:** URL replacement avoids history noise, but a short debounce could reduce mock-service requests further. The current 320ms service delay and stale-request protection keep it responsive without another state layer.
2. **Status control placement:** Status movement is intentionally on the detail view rather than every list row. Inline list controls would be faster for high-volume triage, but they would make the dense table materially noisier.
3. **Single-select filters:** Status and priority use one value each to keep the mobile filter Sheet quick to understand. Multi-select chips would better support power users but add a larger interaction and URL-serialization surface.

## Screenshots

The intended screenshot widths are 375px, 768px, and 1280px. An authenticated browser-control surface was unavailable in the implementation environment, so no screenshots are included here rather than presenting generated or inaccurate images. To capture them locally, run `npm run dev`, open `/tasks`, and use browser device emulation at those three widths.

## AI usage

Codex was used as an implementation assistant. The architecture, state boundaries, UI behavior, accessibility choices, and generated code were reviewed during implementation. Every submitted component and decision should be explainable from this repository.
