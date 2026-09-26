---
paths:
  - "lib/remote_retro_web/views/**/*.ex"
  - "lib/remote_retro_web/templates/**/*"
---

# Phoenix views and templates

- View modules are minimal: `use RemoteRetroWeb, :view` plus any cross-view imports needed by their templates (e.g. `import RemoteRetroWeb.LayoutView, only: [app_js: 1]`). Rendering/formatting logic that's reused across templates belongs in a shared view module, imported with an explicit `only:` list rather than a blanket import.
- Templates stay simple presentational glue around assigns passed in from the controller; non-trivial computation belongs in the controller or a service, not inline in the template.
