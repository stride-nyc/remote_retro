# Staging Environment Research

## Goal

Deploy a working staging environment on Gigalixir that mirrors production closely enough to validate changes before they reach production. This document captures what we know, what we tried, what broke, and what the path forward looks like.

---

## What Production Looks Like (master branch)

Production is deployed to Gigalixir from the `master` branch via CircleCI on merge. Here are the key specs:

### Runtime versions (`master`)
| Component | Version |
|-----------|---------|
| Erlang | 22.3.4.16 |
| Elixir | 1.11.4 |
| Node | 14.16.0 |
| npm | 7.24.2 |
| Yarn | 1.22.0 |

### Buildpack chain (`.buildpacks` on `master`)
```
gigalixir-buildpack-clean-cache
heroku-buildpack-elixir
gigalixir-buildpack-phoenix-static
gigalixir-buildpack-distillery   ← key piece
```

### How config/prod.exs works on production

`prod.exs` uses `${VAR}` syntax for environment variables:
```elixir
config :remote_retro, RemoteRetro.Repo,
  url: "${DATABASE_URL}",  # NOT System.get_env()
  ...
```

This works because of **Distillery**. Distillery packages the app as an OTP release and substitutes `${VAR}` strings with real environment variable values at container startup via `REPLACE_OS_VARS=true`. Without Distillery, these are literal strings — never replaced — and the app crashes immediately.

### The `compile` file
Located at project root, runs during the `gigalixir-buildpack-phoenix-static` phase:
```bash
npm run compile-production
mix phx.digest --no-vsn
```
Note: A previous version used `info "..."` (a logging helper from the buildpack environment). This was removed in `b2337aa5` on master. The staging branch independently made the same fix.

### Frontend package management
`phoenix` and `phoenix_html` npm packages are resolved from local Elixir deps:
```json
"phoenix": "file:deps/phoenix",
"phoenix_html": "file:deps/phoenix_html"
```
This works because the Elixir buildpack runs first and the deps are already compiled before the Node build happens.

---

## What We Tried (jw/create-staging-env branch)

This branch started from `development` (not `master`) and contains a large set of upgrades that haven't been deployed yet:

### Upgraded stack (staging branch)
| Component | Version |
|-----------|---------|
| Erlang | 25.3.2.15 |
| Elixir | 1.16.0 |
| Node | 24.14.1 |
| npm | 11.11.0 |
| Yarn | 4.13.0 (but yarn.lock deleted) |

### Changes made during staging attempt
| File | Change | Reason |
|------|--------|--------|
| `.buildpacks` | Removed Distillery buildpack | Distillery buildpack failed (see errors below) |
| `mix.exs` | Removed `{:distillery, "~> 2.1.1"}` | Required after removing buildpack |
| `compile` | `info` → `echo`, `yarn run` → `npm run` | `info` is not a standard shell command |
| `phoenix_static_buildpack.config` | Node 24.14.1, npm 11.11.0, removed `yarn_version` | Matching new node version |
| `package.json` | `phoenix`/`phoenix_html` changed from `file:deps/...` to versioned npm packages | Compatibility with new setup |
| `package.json` | Mocha → Jest, Enzyme → React Testing Library | Part of broader dev modernization |

---

## Errors Encountered

### Error 1: `info: command not found`
**During**: Phoenix static buildpack's `compile` script  
**Root cause**: The `compile` file used `info "..."` which is not a standard shell command. It was apparently a helper function available in older buildpack environments but not the current one.  
**Fix**: Changed to `echo`.  
**Status**: Resolved.

### Error 2: Distillery buildpack fails — `RELEASES: no such file or directory`
```
==> Failed to archive release: _build/prod/rel/remote_retro/releases/RELEASES: no such file or directory
```
**During**: `gigalixir-buildpack-distillery` phase  
**Root cause**: Distillery 2.1.1 is not compatible with Erlang 25 / Elixir 1.16. The `mix release` step silently fails to produce the `RELEASES` file. This is a known incompatibility — Distillery was abandoned before Elixir 1.12 and has no support for newer Erlang/OTP versions.  
**Fix attempted**: Removed the Distillery buildpack and dep entirely.  
**Status**: Build now completes. But this introduced Error 3.

### Error 3: 502 — `Ecto.InvalidURLError: invalid URL ${DATABASE_URL}`
```
** (Ecto.InvalidURLError) invalid URL ${DATABASE_URL}, host is not present.
    The parsed URL is: %URI{..., path: "${DATABASE_URL}", ...}
```
**During**: Container startup — `release` process (`mix ecto.migrate`)  
**Root cause**: `prod.exs` uses Distillery-style `${VAR}` placeholders. Without Distillery's runtime substitution, these are literal strings. `mix ecto.migrate` tries to connect to a database at the URL `"${DATABASE_URL}"`, which is invalid. The process exits with code 1, which Gigalixir interprets as a container failure → 502.  
**Status**: Unresolved. This is the current blocker.

---

## Why the Branch Diverges from Master

The `development` branch (source of this staging branch) contains a large modernization effort:

- **Elixir/Erlang**: 1.11.4/22 → 1.16.0/25 
- **Node**: 14 → 24
- **Package manager**: Yarn 1.22 → Yarn 4 (in progress, messy — see below)
- **React**: 16 → 18
- **Drag and drop**: react-dnd → dnd-kit
- **JS tests**: Mocha/Enzyme → Jest/React Testing Library
- **Distillery**: Present → Removed (required by Elixir/Erlang upgrade)

### The Yarn Situation (a known mess)

The `development` branch migrated to Yarn 4, but the staging attempt removed `yarn.lock` and switched to npm in the buildpack config. `package.json` still has `"packageManager": "yarn@4.13.0"` but no yarn.lock exists. This is inconsistent and needs to be resolved one way or the other:

- **Option A**: Commit to Yarn 4. Restore yarn.lock (`yarn install`), set `yarn_version=4.13.0` in `phoenix_static_buildpack.config` (the buildpack supports yarn). Restore `"phoenix": "file:deps/phoenix"` in `package.json` or verify the versioned package works.
- **Option B**: Commit to npm. Remove `"packageManager"` from `package.json`. Keep `npm_version` in `phoenix_static_buildpack.config`. Verify `phoenix` npm package (versioned vs file reference).

---

## The Core Problem: Distillery is Required to Decode the Config

`prod.exs` was written assuming Distillery's `REPLACE_OS_VARS=true` substitution. Removing Distillery breaks this. There are two valid paths forward:

### Path A — Restore Distillery compatibility (match production)

Distillery 2.1.x does not support Erlang 25 / Elixir 1.16. The only way to keep Distillery is to **not upgrade Erlang/Elixir**. This means staging would run on Elixir 1.11.4 / Erlang 22 — same as production. The development branch's code changes might still work on the older runtime (worth checking), but the upgraded deps that require Elixir 1.16 would not.

**Verdict**: Not viable if the goal is to stage the modernized development branch.

### Path B — Replace Distillery with `config/runtime.exs` (modernize)

Elixir 1.11+ supports `config/runtime.exs`, which runs at application startup and can read env vars with `System.get_env()`. This is Gigalixir's recommended approach for non-Distillery deployments.

1. Create `config/runtime.exs` that reads all `${VAR}` values with `System.get_env()`
2. Keep `prod.exs` as-is (it becomes the compile-time defaults; `runtime.exs` overrides at startup)
3. Do not restore Distillery

The values that need to move to `runtime.exs`:
- `DATABASE_URL`
- `SECRET_KEY_BASE`
- `SIGNING_SALT`
- `HOST`
- `CLOUDFRONT_DOMAIN`
- `POOL_SIZE`
- `SOURCE_VERSION`
- `HONEYBADGER_API_KEY`

**Verdict**: The correct path if we want to deploy the development branch. Aligns with Gigalixir's current recommendations.

---

## Steps to Create a Working Staging Environment

Assuming **Path B** (modernize, no Distillery):

1. **Resolve the yarn/npm situation** — pick one and make it consistent (`package.json` `packageManager` field, `phoenix_static_buildpack.config`, and presence of yarn.lock must all agree).

2. **Create `config/runtime.exs`** — reads env vars with `System.get_env()` for all values currently using `${VAR}` syntax in `prod.exs`.

3. **Set required Gigalixir env vars** on the staging app — the following are already set on `remote-retro-staged`:
   - `DATABASE_URL` ✓
   - `SECRET_KEY_BASE` ✓
   - `SIGNING_SALT` ✓
   - `HOST` ✓
   - `CLOUDFRONT_DOMAIN` ✓
   - `POOL_SIZE` ✓
   - `ENVIRONMENT_NAME` ✓
   - Missing: `HONEYBADGER_API_KEY` (optional — app will still start without it)

4. **Verify `compile` file** — current content is correct:
   ```bash
   echo "Building Phoenix static assets"
   npm run compile-production
   mix phx.digest --no-vsn
   ```

5. **Test locally with `MIX_ENV=prod`** to verify `runtime.exs` reads env vars correctly before pushing.

6. **Push to staging remote**:
   ```bash
   git -c http.extraheader="GIGALIXIR-CLEAN: true" push gigalixir-staged jw/create-staging-env:master
   ```

---

## Open Questions

1. **What is the canonical "source of truth" branch?** It appears `development` is where active work happens and `master` is production. Is this correct? Does `development` get merged to `master` for releases?

2. **Is the goal to stage the entire `development` branch, or just specific features?** The development branch contains many changes (React 18, dnd-kit, new test framework, etc.) that haven't shipped to production. A true staging env would include all of them.

3. **Should the staging environment use a `staging.exs` config** instead of `prod.exs`? This would allow staging-specific overrides (e.g., different log levels, disabled email sending, looser SSL) without modifying prod config.

4. **What happened to Yarn?** The development branch explicitly migrated to Yarn 4 but the staging work removed it. Was this intentional? The `phoenix` npm package changed from `file:deps/phoenix` to a versioned npm registry package — was this tested?

5. **Does CircleCI need to be updated** to deploy to both staging and production? Currently the deploy job only pushes to one Gigalixir remote (production, on `master` branch merges). A staging pipeline would need a separate remote and trigger.

---

## Reference

- Staging app name: `remote-retro-staged`
- Production app name: `remote-retro` (assumed)
- Gigalixir deploy command: `gigalixir git:remote -a <app-name>`
- Push to staging: `git push gigalixir-staged <branch>:master`
- Gigalixir docs on migrating from Distillery: https://www.gigalixir.com/knowledge/migrate-from-distillery-to-releases/
- `gigalixir config -a remote-retro-staged` — shows currently set env vars
- `gigalixir logs -a remote-retro-staged` — live log stream
- `gigalixir ps -a remote-retro-staged` — pod health status
