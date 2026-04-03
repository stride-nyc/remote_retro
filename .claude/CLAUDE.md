# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

RemoteRetro is an Elixir/Phoenix + React/Redux web app for conducting distributed Agile retrospectives. Real-time collaboration is powered by Phoenix Channels (WebSockets) and Phoenix Presence.

## Commands

### Running the App
```bash
mix           # runs preflight + phx.server (default task)
```

### Backend (Elixir/Mix)
```bash
mix test                        # run backend unit tests (excludes feature/e2e tests)
mix test path/to/test_file.exs  # run a single test file
mix test path/to/test_file.exs:42  # run a single test by line number
mix test.watch                  # run backend tests on file change
mix e2e                         # run end-to-end (Wallaby) tests
mix lint                        # run eslint on JS
mix ecto.migrate                # run DB migrations
mix ecto.reset                  # drop + recreate + migrate + seed DB
```

### Frontend (JavaScript/Yarn)
```bash
yarn test              # run Jest unit tests
yarn test:watch        # run Jest tests on file change
yarn watch             # build JS assets + start webpack dev server
```

## Environment Setup

Copy `.env-sample` to `.env`. Required vars:
- `REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_ID` / `REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_SECRET`
- `REMOTE_RETRO_GOOGLE_OAUTH_REDIRECT_URI` (default: `http://localhost:4000/auth/google/callback`)
- `NODE_OPTIONS=--openssl-legacy-provider` (required for Node 24 compatibility)

**Docker dev**: When running via Docker Compose, change the DB hostname in `config/dev.exs` from `localhost` to `db`.

## Architecture

### Elixir/Phoenix Backend (`lib/`)
- `lib/remote_retro_web/` — Phoenix web layer
  - `channels/retro_channel.ex` — main WebSocket channel; delegates to handler modules (`ideation_handlers`, `voting_handlers`, `group_handlers`, `retro_management_handlers`, `user_handlers`)
  - `controllers/` — `AuthController` (Google OAuth), `RetroController`, `PageController`
  - `models/` — Ecto schemas: `Retro`, `Idea`, `Vote`, `Group`, `User`, `Participation`
  - `services/` — `RetroManagement`, `UserManagement`, `EctoSchemaPresenter`
  - `plugs/` — auth/session plugs
- `lib/remote_retro/` — core domain: `Repo`, `Mailer`, `RetroFormats`

### React/Redux Frontend (`web/static/js/`)
- `app.js` — entry point; bootstraps Redux store and mounts root component
- `components/` — React components; `room.jsx` is the top-level retro room
- `redux/` — Redux reducers/actions: `ideas`, `votes`, `groups`, `retro`, `presences`, `users_by_id`, `stage_config`, etc.
- `services/retro_channel.js` — wraps the Phoenix JS client; connects to `RetroChannel`, maps server events to Redux dispatch
- `configs/stages.js` — retro stage constants (LOBBY → PRIME_DIRECTIVE → IDEA_GENERATION → GROUPING → VOTING → ... → CLOSED)
- `configs/` — per-format stage configs (`happy_sad_confused_stage_configs.js`, `start_stop_continue_stage_configs.js`)

### Channel Handler Pattern
Handler modules use a `:slender_channel` macro `handle_in_and_broadcast` to declare both receiving and broadcasting in one step. Critical operations wrap DB calls in `Repo.transaction`; failures are reported to HoneyBadger. `RetroChannel` routes messages by prefix (`"idea_"`, `"vote_"`, `"retro_"`) to the appropriate handler module. Use `broadcast!` to notify all subscribers or `broadcast_from!` to exclude the sender. Use `EctoSchemaPresenter.drop_metadata/1` when serializing Ecto structs for broadcast.

### Redux / Channel Integration
Redux thunk actions receive `(dispatch, getState, retroChannel)` — the channel is injected as the third middleware argument. This is how async actions push to and receive from the Phoenix channel without importing it directly.

### Retro Flow
A retro progresses through stages (defined in `configs/stages.js`). Stage transitions are driven by the facilitator pushing `"retro_edited"` to the backend (`RetroManagementHandlers`), which validates, persists, and broadcasts to all clients. The frontend switches UI based on `stage_config` in the Redux store. When a retro closes, the backend emails action items and increments `completed_retros_count` for all participants.

### Real-Time Communication
All real-time state (ideas, votes, groups, presence, stage) flows through a single Phoenix Channel (`retro:<uuid>`). The JS `RetroChannel` service subscribes to server-pushed events and dispatches to Redux. Client actions (add idea, cast vote, etc.) push messages to the channel with retry logic built in.

### Authentication
Google OAuth via `AuthController`. Session token passed as a socket param on WebSocket connect.

### Retro Formats
Two formats: `Happy/Sad/Confused` and `Start/Stop/Continue`. Format determines available categories and stage progression config. Each format has its own stage config file that spreads `sharedStageConfigs` and overrides as needed.

## Test Gotchas

- **Database sandbox**: Set to `:manual` mode — tests must explicitly manage transactions. Channel tests must use `async: false` because of this.
- **Auth tokens in channel tests**: Create tokens via `Phoenix.Token.sign(socket(UserSocket), "user", user)` and pass as socket params when joining.
- **Feature tests**: Tagged `feature_test` and excluded from `mix test` by default; run with `mix e2e` (requires Chrome/Chromedriver).

## Test Structure
- `test/channels/` — Phoenix channel tests
- `test/models/` — Ecto model tests
- `test/controllers/` — controller tests
- `test/features/` — Wallaby end-to-end browser tests
- `test/redux/`, `test/components/`, `test/services/` — Jest frontend tests (mirrored under `web/static/js/`)

## Deployment

- **Platform**: [Gigalixir](https://gigalixir.com/) (Heroku-style PaaS for Elixir)
- **CI/CD**: CircleCI (`.circleci/config.yml`) — build job runs tests, deploy job pushes to Gigalixir and notifies HoneyBadger
- **Buildpacks** (`.buildpacks`): Elixir buildpack, Phoenix static buildpack, Distillery (Erlang releases), clean cache buildpack
- **Runtime versions** (`elixir_buildpack.config`): Erlang 26.2.1, Elixir 1.16.0
- **Frontend build** (`phoenix_static_buildpack.config`): Node 18.19.0, Yarn 4.6.0
- **Procfile**: `web` starts the Phoenix server; `release` runs DB migrations on deploy
- Supports hot code upgrades via Distillery; production version uses truncated git SHA appended to the version string
