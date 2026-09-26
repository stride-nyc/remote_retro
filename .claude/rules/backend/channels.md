---
paths:
  - "lib/remote_retro_web/channels/**/*.ex"
---

# Phoenix channels

`RetroChannel` is the single entry point for realtime traffic; it dispatches to per-concern handler modules rather than handling every message itself.

- `join/3` loads and preloads the `Retro` record, assigns needed data onto the socket, and schedules `:after_join` via `send(self(), :after_join)` for presence tracking.
- `handle_in/3` clauses match on a message-type prefix (`"idea_" <> _`, `"vote_" <> _`, `"retro_" <> _`, ...) and delegate to the matching `*Handlers.handle_in/3` module (`IdeationHandlers`, `VotingHandlers`, `RetroManagementHandlers`, `GroupHandlers`, `UserHandlers`) — new message types should get their own handler module rather than growing `RetroChannel` itself.
- Keep a catch-all `handle_in/3` clause last that reports unhandled messages to Honeybadger and replies with `{:error, ...}` instead of crashing the channel.
- Presence-related work goes through `Presence` / `PresenceUtils`, not ad-hoc tracking calls scattered across handlers.
