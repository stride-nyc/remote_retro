defmodule RemoteRetro.Retro do
  use RemoteRetroWeb, :model

  @primary_key {:id, :binary_id, autogenerate: true}

  @required_fields [:facilitator_id]

  @derive {Poison.Encoder, except: [:__meta__, :participations]}
  schema "retros" do
    has_many :participations, RemoteRetro.Participation
    has_many :ideas, RemoteRetro.Idea
    has_many :votes, through: [:ideas, :votes]
    has_many :users, through: [:participations, :user]

    field :stage, :string, read_after_writes: true
    field :facilitator_id, :id, read_after_writes: true

    timestamps(type: :utc_datetime)
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:stage, :facilitator_id])
    |> validate_required(@required_fields)
    |> validate_inclusion(:stage, ["lobby", "prime-directive", "idea-generation", "voting", "action-items", "closed"])
  end
end
