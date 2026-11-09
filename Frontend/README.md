# Grocery List - Frontend

React + TypeScript client for the Grocery List API. See the [main README](../README.md) for how to run it.

## Structure

The code follows a hexagonal (ports and adapters) architecture. Dependencies always point inward:
`ui` → `application` → `domain`, and `infrastructure` implements the ports defined in `application`.

```
src/
├─ domain/            Models and business rules (validation schemas). No React, no HTTP.
├─ application/       Ports (repository interfaces), use cases and application errors.
├─ infrastructure/    Adapters: HTTP client (axios), API repositories, environment configuration.
├─ store/             Global session state (Zustand), persisted in sessionStorage.
├─ ui/
│  ├─ components/     Reusable components, each with its own SCSS module.
│  ├─ hooks/          Custom hooks used by the pages (useAuth, useGroceryList).
│  ├─ pages/          Login, register and grocery list pages.
│  └─ routes/         Router and route guards (protected and public-only routes).
├─ styles/            Global styles and design tokens (CSS custom properties).
└─ dependencies.ts    Composition root: connects adapters to use cases.
```

## Main libraries

| Library | Purpose |
|---|---|
| `react-router` | Routing and route guards |
| `zustand` | Global session state |
| `zod` | Form validation and API response validation |
| `react-hook-form` + `@hookform/resolvers` | Form state, using the Zod schemas |
| `axios` | HTTP client (interceptors add the token and translate API errors) |
| `sass` | SCSS modules |

## Session handling

- The token returned by the API is stored in `sessionStorage`, so it survives a page reload
  but is discarded when the tab is closed.
- An expired session is discarded when the application starts.
- If the API answers `401` to an authenticated request, the session is cleared and the user is
  redirected to the login page.
- Logging out discards the token on the client; the API is stateless.
