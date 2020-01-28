defmodule RemoteRetro.Idea do
  use RemoteRetroWeb, :model

  @derive {Jason.Encoder, except: [:__meta__, :retro, :user, :votes, :assignee, :group]}
  schema "ideas" do
    field(:category, :string)
    field(:body, :string)
    field(:x, :float)
    field(:y, :float)

    belongs_to(:retro, RemoteRetro.Retro, type: Ecto.UUID)
    belongs_to(:user, RemoteRetro.User)
    belongs_to(:assignee, RemoteRetro.User)
    belongs_to(:group, RemoteRetro.Group)

    has_many(:votes, RemoteRetro.Vote)

    timestamps(type: :utc_datetime_usec)
  end

  def action_items do
    from(
      i in __MODULE__,
      where: i.category == "action-item"
    )
  end

  @valid_categories ["happy", "sad", "confused", "start", "stop", "continue", "action-item"]
  @required_fields [:category, :body, :retro_id, :user_id]
  @fields [:assignee_id, :x, :y, :group_id | @required_fields]

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @fields)
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
