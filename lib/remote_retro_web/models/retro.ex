defmodule RemoteRetro.Retro do
  use RemoteRetroWeb, :model
  alias RemoteRetro.{Idea, Participation, RetroFormats}

  @primary_key {:id, :binary_id, autogenerate: true}

  @required_fields [:facilitator_id]

  @derive {Jason.Encoder, except: [:__meta__, :participations, :action_items]}
  schema "retros" do
    has_many(:participations, Participation)

    has_many(:ideas, Idea)
    has_many(:action_items, Idea, where: [category: "action-item"])

    has_many(:votes, through: [:ideas, :votes])
    has_many(:groups, through: [:ideas, :group])
    has_many(:users, through: [:participations, :user])

    field(:format, :string, read_after_writes: true, default: RetroFormats.happy_sad_confused)
    field(:stage, :string, read_after_writes: true)
    field(:facilitator_id, :id, read_after_writes: true)

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:stage, :facilitator_id, :format])
    |> validate_required(@required_fields)
    |> validate_inclusion(:format, [
      RetroFormats.happy_sad_confused,
      RetroFormats.start_stop_continue,
    ])
    |> validate_inclusion(:stage, [
      "lobby",
      "prime-directive",
      "idea-generation",
      "grouping",
      "voting",
      "action-items",
      "closed"
    ])
  end
end
