# Design QA

## Comparison target

- Source visual truth: the dark Hrivo Kanban and Task Details desktop screenshots supplied in this conversation.
- Intended implementation: `/tasks` in its default Kanban state and `/tasks/:taskId` for task details.
- Target state: a deep navy task workspace with cyan primary actions, compact Kanban cards, and a two-panel Task Details screen with overview, attachments, checklist, metadata, and progress controls.

## Evidence status

- Source visual target: available in the conversation.
- Implementation browser capture: unavailable. The connected browser surface has no active browser instances.
- Local implementation: Vite dev server responds at `/tasks` and task-detail routes; production build, lint, and automated tests succeed.
- Viewport, CSS size, density normalization, full-view comparison, focused-region comparison, console review, and interaction verification: blocked until a browser is connected.

## Findings

- [P1] Browser-rendered fidelity check is blocked.
  - Location: `/tasks` Kanban desktop view and `/tasks/:taskId` Task Details desktop view.
  - Evidence: no in-app browser connection is available to capture the local implementation at the reference viewport.
  - Impact: color, spacing, scroll behavior, generated-avatar crop, and control alignment cannot be honestly verified against the reference image.
  - Fix: connect an in-app browser, capture `/tasks` and `/tasks/:taskId` at the source desktop dimensions, compare the two images, then address any P0/P1/P2 mismatches.

## Implemented design changes awaiting visual verification

- Reworked the app shell, sidebar, utility header, task panel, Kanban columns, cards, badges, and form surfaces to the reference dark navy palette and density.
- Updated the board to use the reference’s `In review` label, compact priority dots, slim internal scrolling, and fixed bottom `Add Task` actions.
- Made Kanban the default task view, retained drag-and-drop movement, and preserved the keyboard-accessible move control.
- Added a generated profile image at `public/images/alex-morgan.png` for the visible account avatar.
- Rebuilt Task Details into the reference two-panel layout with attachments, interactive subtasks, status/priority metadata, progress, and a working completion action.

## Implementation checklist

- [x] Apply the dark visual system and reference-matched Kanban pattern.
- [x] Keep task creation, filtering, view switching, and drag-and-drop behavior in scope.
- [x] Add the reference-matched task-detail layout while preserving task status updates.
- [x] Build, lint, and automated tests pass.
- [ ] Capture and compare the browser-rendered desktop view.

## Comparison history

No rendered comparison could be performed because no browser surface is attached.

final result: blocked
