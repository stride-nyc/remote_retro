defmodule RemoteRetro.Repo do
  use Ecto.Repo,
    otp_app: :remote_retro,
    adapter: Ecto.Adapters.Postgres

  # lets each environment size its connection pool to its database's connection limit
  def init(_type, config) do
    case System.get_env("DATABASE_CONNECTION_POOL") do
      nil -> {:ok, config}
      pool_size -> {:ok, Keyword.put(config, :pool_size, String.to_integer(pool_size))}
    end
  end
end
