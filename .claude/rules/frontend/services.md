---
paths:
  - "web/static/js/services/**/*.js"
---

# Frontend services

Plain JS helper/business-logic modules with no React or Redux dependency — pure functions and framework-agnostic wrappers (e.g. `retro_channel.js` wraps the Phoenix channel client, `idea_permissions.js` centralizes permission checks).

- Export a plain object (often the `default` export) of related functions rather than individual named exports, matching the existing modules.
- Keep these modules importable and testable without mounting any React component or Redux store — that separation is the reason logic lives here instead of in a component or redux module.
- A function that needs both a domain object and the current user (e.g. permission checks) takes them as explicit parameters rather than reaching into global/module state.
