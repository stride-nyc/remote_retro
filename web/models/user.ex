defmodule RemoteRetro.User do
  use RemoteRetro.Web, :model
  alias RemoteRetro.{Participation, Repo}

  @required_fields [
    :email,
    :google_user_info,
    :family_name,
    :given_name,
    :locale,
    :name,
    :picture,
    :last_login
  ]

  @derive {Poison.Encoder, except: [:__meta__, :participations, :retros, :google_user_info]}
  schema "users" do
    field :email, :string
    field :google_user_info, :map
    field :family_name, :string
    field :given_name, :string
    field :locale, :string
    field :name, :string
    field :picture, :string
    field :profile, :string
    field :last_login, Ecto.DateTime

    field :online_at, :integer, virtual: true
    field :token, :string, virtual: true

    has_many :participations, Participation
    has_many :retros, through: [:participations, :retro]

    timestamps(type: :utc_datetime)
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
  end

  def upsert_record_from(oauth_info: oauth_info) do
    user_params = build_from_oauth_data(oauth_info)

    case Repo.get_by(__MODULE__, email: user_params["email"]) do
      nil -> %__MODULE__{}
      user_from_db -> user_from_db
    end
    |> __MODULE__.changeset(user_params)
    |> Repo.insert_or_update
  end

  defp build_from_oauth_data(user_info) do
    user_params = %{
      "google_user_info"=> user_info,
      "last_login"=> DateTime.utc_now
    }

    Map.merge(user_params, user_info)
  end
end
