defmodule RemoteRetro.User do
  use RemoteRetroWeb, :model
  alias RemoteRetro.{Participation, Repo}

  @required_fields [
    :email,
    :google_user_info,
    :given_name,
    :name,
    :picture,
    :last_login
  ]

  @optional_fields [
    :family_name,
    :email_opt_in
  ]

  @derive {Jason.Encoder, except: [:__meta__, :participations, :retros, :google_user_info]}
  schema "users" do
    field(:email, :string)
    field(:google_user_info, :map)
    field(:family_name, :string)
    field(:given_name, :string)
    field(:locale, :string, default: "en")
    field(:name, :string)
    field(:picture, :string)
    field(:last_login, :naive_datetime_usec)
    field(:completed_retros_count, :integer)
    field(:email_opt_in, :boolean)

    field(:online_at, :integer, virtual: true)
    field(:token, :string, virtual: true)

    has_many(:participations, Participation)
    has_many(:retros, through: [:participations, :retro])

    timestamps(type: :utc_datetime_usec)
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_fields ++ @optional_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
  end

  def upsert_record_from(oauth_info: oauth_info) do
    user_params = build_from_oauth_data(oauth_info)

    {inserted_or_updated_atom, user_struct} =
      case Repo.get_by(__MODULE__, email: user_params["email"]) do
        nil ->
          {:inserted, %__MODULE__{}}

        user_from_db ->
          {:updated, user_from_db}
      end

    {result_atom, result} =
      user_struct
      |> __MODULE__.changeset(user_params)
      |> Repo.insert_or_update(returning: true)

    {result_atom, result, inserted_or_updated_atom}
  end

  defp build_from_oauth_data(google_user_info) do
    user_params = %{
      "google_user_info" => google_user_info,
      "last_login" => DateTime.utc_now()
    }

    google_user_info = supply_given_name_fallback(google_user_info)

    Map.merge(google_user_info, user_params)
  end

  defp supply_given_name_fallback(google_user_info) do
    case Map.has_key?(google_user_info, "given_name") do
      true ->
        google_user_info

      false ->
        email_address = google_user_info["email"]

        # in theory, an '@' character could appear before the domain, provided it's in quotes
        # however, we'll let that case occur before we add parsing complexity, i.e. YAGNI
        [email_username | _] = String.split(email_address, "@")

        Map.merge(google_user_info, %{"given_name" => email_username})
    end
  end
end
