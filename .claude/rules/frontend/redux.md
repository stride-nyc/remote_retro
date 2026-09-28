---
paths:
  - "web/static/js/redux/**/*.js"
---

# Redux modules

Classic Redux (v3) — one file per domain slice (`votes.js`, `ideas.js`, `groups.js`, ...), each exporting all three of:

- `actions` — an object of action creators; action creators that need to hit the channel return a thunk `(dispatch, getState, retroChannel) => { ... }` (redux-thunk with the Phoenix channel injected as the third arg via `configure_store.js`).
- `reducer` (also the module's `default` export) — a `switch (action.type) { case ...: return ...; default: return state }`, handling `SET_INITIAL_STATE` to hydrate from the server-provided initial payload.
- `selectors` — plain functions of `(state, ...)` for any derived/computed data consumers need, so components don't recompute the same derivation inline.
- Action type strings are centralized in `action_types.js` and referenced as `actionTypes.SOME_TYPE`, never as inline string literals in a reducer/action creator.
- Optimistic UI updates (submit immediately, reconcile on channel ack/error) follow the existing pattern: dispatch an optimistic action with a generated `optimisticUUID` (via `uuidv4`), then reconcile via `push.receive("ok", ...)` / `push.receive("error", ...)`.
- Remember the backend sends snake_case keys (`user_id`, `idea_id`) over the channel — don't casing-normalize them unless the rest of that slice already does.
