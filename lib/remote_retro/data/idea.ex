defmodule RemoteRetro.Data.Idea do
  use RemoteRetroWeb, :model
  alias RemoteRetro.Data.{Retro, User, Vote}

  @derive {Jason.Encoder, except: [:__meta__, :retro, :user, :votes, :assignee]}
  schema "ideas" do
    field(:category, :string)
    field(:body, :string)

    belongs_to(:retro, Retro, type: Ecto.UUID)
    belongs_to(:user, User)
    has_many(:votes, Vote)
    belongs_to(:assignee, User)

    timestamps(type: :utc_datetime_usec)
  end

  def action_items do
    from(
      i in __MODULE__,
      where: i.category == "action-item"
    )
  end

  @valid_categories ["happy", "sad", "confused", "action-item"]
  @required_fields [:category, :body, :retro_id, :user_id]
  @mutable_fields [:assignee_id | @required_fields]

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @mutable_fields)
    |> validate_required(@required_fields)
    |> validate_inclusion(:category, @valid_categories)
    |> validate_assignee_required_for_action_items()
  end

  def validate_assignee_required_for_action_items(changeset) do
    category = get_field(changeset, :category)

    case category do
      "action-item" -> validate_required(changeset, :assignee_id)
      _ -> changeset
    end
  end
end
