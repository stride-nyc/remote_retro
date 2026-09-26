---
paths:
  - "test/features/**/*_test.exs"
---

# Backend feature/integration tests (Wallaby)

These are full-stack browser tests, run separately from the rest of the suite via `mix e2e` (tagged `feature_test`, excluded from plain `mix test`).

- `use RemoteRetro.IntegrationCase, async: false` — these tests drive real browser sessions and can't run concurrently against the same fixtures.
- `import ShorterMaps`; destructure the fixtures a test needs directly in the test signature, e.g. `test "...", ~M{retro, session: facilitator_session_one, facilitator} do`.
- Fixture data for a test is declared via `@tag [retro_stage: "voting", idea: %Idea{...}]` immediately above the test, combined with a `setup` list (e.g. `setup [:persist_idea_for_retro]`) that consumes those tags.
- Multi-user scenarios spin up a second session with `new_authenticated_browser_session/1` to simulate concurrent/realtime updates across clients.
- Use the existing `Query.css(...)` + `assert_has`/`find`/`Element.click()` helpers rather than raw Wallaby calls, and prefer existing assertion helpers (e.g. `assert_vote_count_for_idea_is/2`) over re-deriving the same DOM query in multiple tests.
