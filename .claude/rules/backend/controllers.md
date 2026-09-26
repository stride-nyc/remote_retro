---
paths:
  - "lib/remote_retro_web/controllers/**/*.ex"
---

# Phoenix controllers

Thin, Plug-based controllers under `RemoteRetroWeb`. Business logic belongs in a service module (`lib/remote_retro_web/services/`), not in the controller.

- `use RemoteRetroWeb, :controller`, then a single multi-alias for domain structs: `alias RemoteRetro.{Retro, Participation, Idea}`.
- Scope custom plugs to specific actions: `plug :some_check when action in [:show]`.
- Public actions (`index/2`, `show/2`, `create/2`, ...) come first; private helper functions (`defp`) come after, at the bottom of the module.
- Prefer building an Ecto query and calling `Repo.all`/`Repo.one!` from a small private helper over inlining a large query in the action body.
- Render with an explicit map of assigns: `render(conn, "show.html", %{...})`, not with a bunch of `assign/3` calls.
