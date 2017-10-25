defmodule RemoteRetro.Participation do
  use RemoteRetro.Web, :model

  @derive {Poison.Encoder, except: [:__meta__]}
  schema "participations" do
    belongs_to :user, RemoteRetro.User
    belongs_to :retro, RemoteRetro.Retro, type: Ecto.UUID

    timestamps(type: :utc_datetime)
  end

  @allowed_fields [:user_id, :retro_id]

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_fields)
    |> unique_constraint(:user_id_retro_id, name: :participations_user_id_retro_id_index)
    |> validate_required([:user_id, :retro_id])
  end
end
