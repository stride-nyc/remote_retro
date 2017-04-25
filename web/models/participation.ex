defmodule RemoteRetro.Participation do
  use RemoteRetro.Web, :model

  schema "participations" do
    belongs_to :user, RemoteRetro.User
    belongs_to :retro, RemoteRetro.Retro

    timestamps()
  end
end
