---
paths:
  - "lib/remote_retro_web/services/**/*.ex"
  - "lib/remote_retro/**/*.ex"
---

# Backend services / domain modules

Business logic lives here, kept out of controllers and channel handlers.

- `import ShorterMaps` and use `~m`/`~M` sigils to destructure and build maps concisely (e.g. `def update!(retro_id, ~m{ideasWithEphemeralGroupingIds} = context)`), matching the JS-style camelCase keys that arrive from the frontend over the channel.
- Public functions at the top of the module; private (`defp`) helpers below, ordered roughly in the sequence the public function calls them.
- Prefer multiple function clauses (pattern-matched heads) over `case`/`cond` when branching on the shape of the input map.
- Side effects that fan out from a core update (e.g. sending an email, incrementing a counter) are triggered conditionally right after the primary persistence step, in the same public function — not hidden in a changeset callback.
- `Repo.transaction/1` wraps multi-step writes that must succeed or fail together (e.g. persisting several grouped records).
