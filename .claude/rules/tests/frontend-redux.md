---
paths:
  - "test/redux/**/*_test.js"
---

# Frontend Redux tests (reducers/selectors/actions)

- Import `{ reducer, selectors, actions }` from the corresponding `web/static/js/redux/*` module under test.
- Wrap any `initialState` fixture in `deepFreeze(initialState)` (from `deep-freeze`) before passing it into the reducer, so an accidental in-place mutation throws instead of silently passing.
- Assert reducer output with `expect(result).to.eql(...)` / `.to.deep.equal(...)` (structural equality), not `.to.equal(...)`.
- Group cases by `describe("when the action is ACTION_TYPE", ...)`, mirroring the reducer's `switch` cases.
- For thunks that dispatch against a channel (`(dispatch, getState, retroChannel) => {...}`), use `setupMockRetroChannel` from `test/support/js/test_helper.js` rather than hand-rolling a channel stub.
