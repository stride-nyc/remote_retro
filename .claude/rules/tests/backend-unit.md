---
paths:
  - "test/controllers/**/*_test.exs"
  - "test/models/**/*_test.exs"
  - "test/channels/**/*_test.exs"
  - "test/plugs/**/*_test.exs"
  - "test/views/**/*_test.exs"
  - "test/services/**/*_test.exs"
---

# Backend unit tests (ExUnit)

- Model tests: `use RemoteRetro.DataCase`.
- Controller tests: `use RemoteRetroWeb.ConnCase, async: true`, `import ShorterMaps`, and destructure the test context directly in the test signature: `test "...", ~M{conn} do`. Group related cases in `describe` blocks with a `setup` callback (e.g. `setup :authenticate_connection`).
- Shared setup helpers (auth, connection building) live in `test/support/*.ex` (`conn_case_web.ex`, `conn_case_helpers.ex`, `data_case.ex`, `channel_case_web.ex`) — extend those rather than duplicating setup logic in individual test files.
- Assert on real persisted state (`Repo.one`, `Repo.aggregate`) rather than mocking the repo for these tests.
- Test names are full sentences describing behavior, not `"test create"`-style short labels.
