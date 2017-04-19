defmodule RemoteRetro.User do
  use RemoteRetro.Web, :model

  schema "users" do
    field :google_user_info, :map
    field :email, :string
    field :last_login, Ecto.DateTime

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:google_user_info, :email, :last_login])
    |> validate_required([:google_user_info, :email, :last_login])
    |> unique_constraint(:email)
  end
end
