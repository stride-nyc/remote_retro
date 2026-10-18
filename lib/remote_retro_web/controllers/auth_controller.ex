defmodule RemoteRetroWeb.AuthController do
  use RemoteRetroWeb, :controller
  alias RemoteRetro.{OAuth.Google}
  alias RemoteRetroWeb.UserManagement

  def index(conn, _params) do
    redirect(conn, external: authorize_url!())
  end

  def callback(conn, %{"code" => code}) do
    oauth_info = Google.get_user_info!(code)

    {:ok, user} = UserManagement.handle_google_oauth(oauth_info)

    conn =
      conn
      |> put_session("current_user_id", user.id)
      |> put_session("current_user_given_name", user.given_name)

    redirect(conn, to: get_session(conn, "requested_endpoint") || "/retros")
  rescue
    exception in OAuth2.Error -> handle_oauth_error(conn, exception, __STACKTRACE__)
  end

  # user cancelled at Google (`?error=access_denied`) or otherwise arrived without a code
  def callback(conn, _params), do: redirect_with_sign_in_error(conn)

  def logout(conn, _params) do
    conn = clear_session(conn)
    redirect(conn, to: "/")
  end

  # Only config failures that break sign-in for everyone are worth an alert. Replayed/expired codes
  # (invalid_grant), bad tokens (401 invalid_request) and transient network errors (:closed, :timeout)
  # are not actionable.
  @alertable_oauth_errors ~r/invalid_client|redirect_uri_mismatch|unauthorized_client/

  defp handle_oauth_error(conn, exception, stacktrace) do
    if Exception.message(exception) =~ @alertable_oauth_errors do
      Honeybadger.notify(exception, stacktrace: stacktrace)
    end

    redirect_with_sign_in_error(conn)
  end

  defp redirect_with_sign_in_error(conn) do
    conn
    |> put_flash(:error, "We couldn't sign you in. Please try again.")
    |> redirect(to: "/")
  end

  defp authorize_url! do
    Google.authorize_url!(scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile")
  end
end
