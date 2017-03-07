defmodule RemoteRetro.Retro do
  @moduledoc false
  use RemoteRetro.Web, :model

  @primary_key {:id, :binary_id, autogenerate: true}

  schema "retros" do
    timestamps()
  end
end
