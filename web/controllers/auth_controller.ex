defmodule RemoteRetro.AuthController do
  use RemoteRetro.Web, :controller
  alias RemoteRetro.OAuth.Google
  alias RemoteRetro.User

  def index(conn, _params) do
    redirect conn, external: authorize_url!()
  end

  def callback(conn, %{"code" => code}) do
    user_info = Google.get_user_info!(code)
    user_params = User.build_user_from_oauth(user_info)

    {:ok, user} =
      case Repo.get_by(User, email: user_info["email"]) do
        nil -> %User{}
        user_from_db -> user_from_db
      end
      |> User.changeset(user_params)
      |> Repo.insert_or_update

    conn = put_session(conn, :current_user, user)

    redirect conn, to: get_session(conn, "requested_endpoint") || "/"
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "email profile")
  end
end
