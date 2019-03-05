defmodule RemoteRetro.Idea do
  use RemoteRetroWeb, :model

  @derive {Poison.Encoder, except: [:__meta__, :retro, :user, :votes, :assignee]}
  schema "ideas" do
    field(:category, :string)
    field(:body, :string)

    belongs_to(:retro, RemoteRetro.Retro, type: Ecto.UUID)
    belongs_to(:user, RemoteRetro.User)
    has_many(:votes, RemoteRetro.Vote)
    belongs_to(:assignee, RemoteRetro.User)

    timestamps(type: :utc_datetime)
  end

  def action_items do
    from(
      i in __MODULE__,
      where: i.category == "action-item"
    )
  end

  @required_fields [:category, :body, :retro_id, :user_id]
  @mutable_fields [:assignee_id | @required_fields]

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @mutable_fields)
    |> validate_required(@required_fields)
  end
end
