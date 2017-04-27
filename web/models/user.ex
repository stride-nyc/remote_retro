defmodule RemoteRetro.User do
  use RemoteRetro.Web, :model

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

  @derive {Poison.Encoder, only: @required_fields }
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

    has_many :participations, RemoteRetro.Participation

    timestamps()
  end

  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @required_fields)
    |> validate_required(@required_fields)
    |> unique_constraint(:email)
    |> validate_format(:email, ~r/@/)
  end
end
