---
paths:
  - "lib/remote_retro_web/models/**/*.ex"
---

# Ecto schemas (models)

- `use RemoteRetroWeb, :model`, with `@primary_key {:id, :binary_id, autogenerate: true}` (UUID primary keys throughout).
- `@derive {Jason.Encoder, except: [:__meta__, ...]}` above the `schema` block to control JSON serialization — always exclude `:__meta__` and any association fields that shouldn't round-trip to the client.
- List required fields in a module attribute (`@required_fields [:facilitator_id]`) and reference it from the changeset.
- One `changeset/2` function per schema combining `cast/3`, `validate_required/2`, and any `validate_inclusion/3` checks — don't split validation across multiple changeset functions unless the model genuinely has distinct changeset use cases.
- Enumerated string fields (e.g. `stage`, `format`) are validated with `validate_inclusion`, with the allowed values usually sourced from a shared module (e.g. `RetroFormats`) rather than duplicated inline.
