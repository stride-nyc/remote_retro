defmodule RemoteRetro.Data.Vote do
  use RemoteRetroWeb, :model
  alias RemoteRetro.Data.{User, Idea}

  @derive {Jason.Encoder, except: [:__meta__, :user, :idea]}
  schema "votes" do
    belongs_to(:user, User)
    belongs_to(:idea, Idea)

    timestamps(type: :utc_datetime_usec)
  end

  @allowed_fields [:user_id, :idea_id]

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_fields)
    |> validate_required([:user_id, :idea_id])
  end
end
