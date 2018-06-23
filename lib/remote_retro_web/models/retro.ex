defmodule RemoteRetro.Retro do
  use RemoteRetroWeb, :model
  alias RemoteRetro.{Idea, Participation, Repo, Vote}
  import ShorterMaps

  @primary_key {:id, :binary_id, autogenerate: true}

  @required_fields [:facilitator_id]

  @derive {Poison.Encoder, except: [:__meta__, :participations]}
  schema "retros" do
    has_many :participations, Participation
    has_many :ideas, Idea
    has_many :votes, through: [:ideas, :votes]
    has_many :users, through: [:participations, :user]

    field :stage, :string, read_after_writes: true
    field :facilitator_id, :id, read_after_writes: true

    timestamps(type: :utc_datetime)
  end

  def user_vote_count(~M(user_id, retro_id)) do
    query = from votes in Vote,
              join: ideas in Idea,
              where: votes.idea_id == ideas.id
              and ideas.retro_id == ^retro_id
              and votes.user_id == ^user_id

    Repo.aggregate(query, :count, :id)
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:stage, :facilitator_id])
    |> validate_required(@required_fields)
    |> validate_inclusion(:stage, ["lobby", "prime-directive", "idea-generation", "voting", "action-items", "closed"])
  end
end
