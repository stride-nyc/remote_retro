defmodule RemoteRetro.Repo do
  use Ecto.Repo,
    otp_app: :remote_retro,
    adapter: Ecto.Adapters.Postgres
end
