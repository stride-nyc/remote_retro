defmodule RemoteRetro.Group do
  use RemoteRetroWeb, :model

  @derive {Jason.Encoder, except: [:__meta__, :ideas]}
  schema "groups" do
    has_many :ideas, RemoteRetro.Idea

    timestamps(type: :utc_datetime_usec)
  end
end
