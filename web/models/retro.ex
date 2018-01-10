defmodule RemoteRetro.Retro do
  use RemoteRetro.Web, :model

  @primary_key {:id, :binary_id, autogenerate: true}
  @derive {Poison.Encoder, except: [:__meta__]}

  schema "retros" do
    has_many :participations, RemoteRetro.Participation
    has_many :ideas, RemoteRetro.Idea
    has_many :votes, through: [:ideas, :votes]
    has_many :users, through: [:participations, :user]
    field :stage, :string, read_after_writes: true

    timestamps(type: :utc_datetime)
  end

  def changeset(struct, %{stage: _stage} = params \\ %{}) do
    struct
    |> cast(params, [:stage])
    |> validate_inclusion(:stage, ["lobby", "prime-directive", "idea-generation", "voting", "action-items", "closed"])
  end
end
