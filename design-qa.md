# Design QA

## Comparison target

- Source visual truth: dark desktop Calendar, Tasks-with-sidebar, and Employee Directory screenshots supplied in this conversation.
- Intended implementation: `/calendar`, `/team`, and the shared desktop workspace sidebar.
- Target state: a dark Hrivo workspace calendar, a streamlined Tasks sidebar, and a filterable employee directory with Board and List states.

## Evidence status

- Source visual target: available in the conversation.
- Implementation browser capture: blocked. The required in-app browser (`iab`) reports `Browser is not available: iab`.
- Implementation screenshot path: unavailable because no browser-rendered capture can be produced.
- Intended viewport: source desktop screenshot, approximately 1893 × 895 px. Implementation CSS viewport and device scale factor: unavailable.
- Full-view and focused-region comparison: blocked because the implementation cannot be captured and placed alongside the reference.
- Automated validation: production build, lint, 14 tests, and diff checks pass.

## Findings

- [P1] Browser-rendered calendar fidelity verification is blocked.
  - Location: `/calendar`.
  - Evidence: the in-app browser connection is unavailable, so the new calendar grid cannot be captured at the reference desktop viewport.
  - Impact: calendar column density, time-grid height, sidebar width, event-card overlap, and small-screen behavior cannot be compared honestly with the supplied screenshot.
  - Fix: connect the in-app browser, capture `/calendar` in Week view at the source desktop dimensions, compare the source and implementation together, then address any P0/P1/P2 differences.
- [P1] Browser-rendered sidebar fidelity verification is blocked.
  - Location: shared desktop app shell.
  - Evidence: the in-app browser connection is unavailable, so the active outline, compact sidebar, and collapse transition cannot be captured at the supplied desktop viewport.
  - Impact: the visual density and precise active-state alignment cannot be compared honestly with the latest sidebar reference.
  - Fix: connect the in-app browser, capture `/tasks` with the sidebar expanded and collapsed, then address any P0/P1/P2 differences.
- [P1] Browser-rendered employee-directory fidelity verification is blocked.
  - Location: `/team`.
  - Evidence: the in-app browser connection is unavailable, so the directory header, employee-summary cards, board/list switch, and member-card density cannot be captured at the supplied desktop viewport.
  - Impact: visual spacing, column sizing, responsive overflow, and the profile-inspector sheet cannot be compared honestly with the latest reference.
  - Fix: connect the in-app browser, capture `/team` in Board and List states at the reference desktop viewport, then address any P0/P1/P2 differences.

## Implemented design and interaction work awaiting visual verification

- Added a responsive dark `/calendar` page with the screenshot-matched project header, left mini month, category toggles, upcoming-task rail, task time grid, and Day/Week/Month controls.
- Calendar task cards are derived from real task due dates, priority/status data, and assignees; each opens its associated Task Details page.
- Added reusable calendar types, date/event utilities, event card, mini month, sidebar, toolbar, and grid components.
- Added Zustand-backed calendar view, selected date, category visibility, and import-feedback state; the calendar page has no local interaction state.
- Added a direct Zustand store test for date navigation, filters, views, and import feedback.
- Added a shared Zustand sidebar preference, an accessible collapse/expand control, keyboard focus treatment, and a more distinguishable active navigation state.
- Rebuilt `/team` as a reusable employee directory with a dark reference-aligned header, summary cards, department board, paginated list, CSV export, employee inspector, and form-driven employee creation.
- Added URL-backed Team search, department, page, and view state; Zustand retains only ephemeral selection, profile-inspector, and creation-form state. New employees are registered as task assignees during the active session.
- Normalized the workflow language to `To do`, `In progress`, `In review`, and `Completed`; exposed pagination in List, Board, and Timeline; and added responsive Timeline, Calendar, and Team List fallbacks to remove their horizontal-scroll dependency.

## Required fidelity surfaces

- Fonts and typography: implemented with the existing Hrivo font and compact desktop scale; browser comparison blocked.
- Spacing and layout rhythm: implemented with reference-inspired sidebar/grid proportions and responsive collapse; browser comparison blocked.
- Colors and visual tokens: uses the existing Hrivo deep navy palette with blue, green, violet, and amber event categories; browser comparison blocked.
- Image and asset fidelity: reuses the existing application logo, avatar component, and icon library; no new raster assets were required by the task calendar UI.
- Copy and content: calendar labels, range controls, and cards use live task titles and task due dates; browser comparison blocked.

## Implementation checklist

- [x] Add Calendar navigation, route, and top-bar shortcut.
- [x] Render tasks in reusable day, week, and month calendar views.
- [x] Store calendar UI state in Zustand.
- [x] Verify build, lint, unit tests, and diff safety.
- [x] Improve shared sidebar scanability and desktop density with shared Zustand UI state.
- [x] Build reusable employee board/list surfaces with URL-backed shareable views and dedicated Zustand UI state.
- [ ] Capture and compare the browser-rendered calendar against the supplied reference.

## Comparison history

No rendered implementation comparison was possible because the required in-app browser is unavailable.

final result: blocked
