---
paths:
  - "lib/remote_retro_web/plugs/**/*.ex"
---

# Custom plugs

Small, single-purpose `Plug.Conn`-based modules under `RemoteRetroWeb.Plugs`.

- `import Plug.Conn`; implement `init/1` (typically `def init(options), do: options`) and `call/2`.
- Branch on a boolean check and either pass `conn` through unchanged or halt the pipeline: `put_resp_content_type` / `put_status` / `render` / `send_resp`, followed by `|> halt()` (or `|> halt` for plain `send_resp`).
- Keep each plug focused on one authorization/auth concern (e.g. `ForbidNonStriders`, `RedirectUnauthenticated`, `SetCurrentUserOnAssignsIfAuthenticated`) — compose multiple plugs in the router/controller rather than combining concerns into one plug.
