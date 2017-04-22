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
      email: user_info["email"],
      google_user_info: user_info,
      family_name: user_info["family_name"],
      given_name: user_info["given_name"],
      locale: user_info["locale"],
      name: user_info["name"],
      picture: user_info["picture"],
      profile: user_info["profile"],
      last_login: DateTime.utc_now
    }

    if !user do
      changeset = User.changeset(%User{}, user_params)
      Repo.insert!(changeset)
    else
      changeset = User.changeset(user, user_params)
      Repo.update!(changeset)
    end

    conn = put_session(conn, :current_user, user_info)

    redirect conn, to: get_session(conn, "requested_endpoint") || "/"
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "email profile")
  end
end
