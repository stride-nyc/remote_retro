defmodule RemoteRetro.AuthController do
  use RemoteRetro.Web, :controller
  alias RemoteRetro.OAuth.Google
  alias RemoteRetro.User

  def index(conn, _params) do
    redirect conn, external: authorize_url!()
  end

  def callback(conn, %{"code" => code}) do
    user_info = Google.get_user_info!(code)
    user = Repo.get_by(User, email: user_info["email"])

    user_params = %{
      "email" => user_info["email"],
      "google_user_info"=> user_info,
      "last_login"=> DateTime.utc_now,
    }

    user_params = Map.merge(user_params, user_info)

    user = if !user do
      changeset = User.changeset(%User{}, user_params)
      Repo.insert!(changeset)
    else
      changeset = User.changeset(user, user_params)
      Repo.update!(changeset)
    end

    user = Map.delete(user, :__meta__)
    user = Map.delete(user, :__struct__)

    conn = put_session(conn, :current_user, user)

    redirect conn, to: get_session(conn, "requested_endpoint") || "/"
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "email profile")
  end
end
