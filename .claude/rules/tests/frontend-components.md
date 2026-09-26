---
paths:
  - "test/components/**/*_test.js"
---

# Frontend component tests (Enzyme)

- `describe("<ComponentName />", () => { ... })` at the top level, with nested `describe`/`context` blocks for scenarios (chai's `context` is an alias for `describe`, used for "when X" framing).
- Build a `defaultProps` object once per test file and spread/override it per scenario (`{ ...defaultProps, someProp: ... }`) rather than reconstructing props from scratch in every test.
- Use `shallow(...)` from enzyme for simple render assertions; use the global `mountWithConnectedSubcomponents(...)` helper (defined in `test/support/js/test_helper.js`) when the component tree includes Redux-connected subcomponents that need a real store/provider.
- Assert user-facing behavior via `sinon.spy()` passed in through `actions`, then check `.calledWith(...)` / `.not.called` (via sinon-chai) — don't reach into component internal state to verify a callback fired.
- Simulate interaction with Enzyme's `.simulate(...)`, then re-query the wrapper (re-`find(...)`) before asserting on updated DOM/props, since a stale reference from before the simulated event won't reflect the update.
