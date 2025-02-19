# DANGER: this module allows end-to-end tests to authenticate as a particular user,
#         as we cannot authenticate from Google in an automated fashion. While there
#         are multiple guards in place, any attempts to change this module should be
#         met with suspicion and possibly malice.
defmodule RemoteRetroWeb.MockAuthController do
  use RemoteRetroWeb, :controller
  alias RemoteRetro.{User}

  @allow_user_masquerade Application.compile_env(:remote_retro, :allow_user_masquerade)

  def callback(conn, %{"code" => test_user_email, "test_override" => "true"}) do
    if @allow_user_masquerade do
      user = Repo.get_by(User, email: test_user_email)
      conn = put_session(conn, :current_user_id, user.id)
      conn = put_session(conn, :current_user_given_name, user.given_name)

      redirect(conn, to: get_session(conn, "requested_endpoint") || "/")
    else
      send_resp(conn, 401, "Nice try.")
    end
  end

  defdelegate callback(conn, payload), to: RemoteRetroWeb.AuthController
end
