# Frontend architecture

This project uses a feature-based, layered frontend architecture.

```text
src/
├── app/                       # Application composition and cross-feature shell
│   ├── layout/                # Sidebar, topbar, mobile header, page container
│   ├── routes/                # Application-level fallback routes
│   ├── stores/                # Cross-feature UI and preference state only
│   ├── app.tsx
│   ├── navigation.ts
│   ├── providers.tsx
│   └── router.tsx
├── features/                  # Business-domain modules
│   ├── calendar/
│   │   ├── components/
│   │   ├── model/             # Calendar state and tests
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts           # Public feature API
│   ├── home/
│   ├── tasks/
│   │   ├── api/
│   │   ├── components/
│   │   ├── data/
│   │   ├── hooks/
│   │   ├── model/             # Task state and view state
│   │   ├── types/
│   │   ├── utils/
│   │   └── index.ts
│   └── team/
│       ├── components/
│       ├── data/
│       ├── hooks/
│       ├── model/             # Team-directory state and tests
│       ├── types/
│       ├── utils/
│       └── index.ts
├── shared/                    # Reusable code with no business-feature ownership
│   ├── components/
│   │   ├── feedback/
│   │   └── ui/
│   ├── hooks/
│   ├── lib/
│   └── styles/
└── main.tsx
```

## Dependency rules

- `shared` must not import from `app` or `features`.
- `features` may import from `shared` and from another feature's `index.ts` public API.
- `app` composes routes, layout, and feature public APIs.
- Keep feature-private implementation files out of cross-feature imports.
- Put state that belongs to one business domain in that feature's `model/`; keep only cross-feature UI state in `app/stores/`.
- Use the `@/` alias for cross-layer imports. Use relative imports only within a feature or a tightly related folder.
