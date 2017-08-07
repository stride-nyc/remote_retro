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
    |> unique_constraint(:user_id_retro_id, name: :participations_user_id_retro_id_index)
    |> validate_required(@required_fields)
  end
end
