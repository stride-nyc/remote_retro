defmodule RemoteRetro.Participation do
  use RemoteRetro.Web, :model

  schema "participations" do
    belongs_to :user, RemoteRetro.User
    belongs_to :retro, RemoteRetro.Retro, type: Ecto.UUID

    timestamps(type: :utc_datetime)
  end

  @required_fields [:user_id, :retro_id]

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_fields)
    |> validate_required(@required_fields)
  end
end
