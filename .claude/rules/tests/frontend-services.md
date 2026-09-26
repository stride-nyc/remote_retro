---
paths:
  - "test/services/**/*_test.js"
---

# Frontend service tests (plain JS)

Note: `test/services/` also contains a couple of `_test.exs` Elixir tests for backend "service"-named modules (e.g. `retro_management_test.exs`) — those follow `.claude/rules/tests/backend-unit.md`, not this file. This file only applies to the `.js` tests in that directory.

- Plain Mocha/Chai unit tests with no React/Enzyme involved — import the default export from `web/static/js/services/*` directly.
- Use nested `describe`/`context` blocks to enumerate input scenarios (e.g. `context("when the user authored the idea")` → `context("and is not the facilitator")`), one `it` per concrete scenario with a single assertion.
- Prefer chai's expressive boolean assertions (`.to.be.true` / `.to.be.false`) for predicate functions over `.to.equal(true)`.
