defmodule RemoteRetro.OAuth.Google do
  @moduledoc """
  Module for Google Oath.
  """

  use OAuth2.Strategy
  alias RemoteRetro.User
  alias RemoteRetro.Repo

  @oauth_client Application.get_env(:remote_retro, :oauth_client)

  def retrieve_internal_user(code) do
    user_info = get_user_info!(code)
    user_params = build_user_from_oauth(user_info)

    {:ok, user} =
      case Repo.get_by(User, email: user_info["email"]) do
        nil -> %User{}
        user_from_db -> user_from_db
      end
      |> User.changeset(user_params)
      |> Repo.insert_or_update

    user
    |> Map.delete(:__meta__)
    |> Map.delete(:__struct__)
  end

  def authorize_url!(params) do
    @oauth_client.authorize_url!(client(), params)
  end

  def get_user_info!(code) do
    user_info_endpoint = "https://www.googleapis.com/plus/v1/people/me/openIdConnect"

    code
    |> retrieve_token!
    |> @oauth_client.get!(user_info_endpoint)
    |> Map.get(:body)
  end

  defp retrieve_token!(code) do
    client()
    |> @oauth_client.put_param(:client_secret, client().client_secret)
    |> @oauth_client.get_token!(code: code)
  end

  defp client do
    @oauth_client.new([
      client_id: System.get_env("REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_ID"),
      client_secret: System.get_env("REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_SECRET"),
      redirect_uri: System.get_env("REMOTE_RETRO_GOOGLE_OAUTH_REDIRECT_URI"),
      site: "https://accounts.google.com",
      authorize_url: "https://accounts.google.com/o/oauth2/auth",
      token_url: "https://accounts.google.com/o/oauth2/token"
    ])
  end

  defp build_user_from_oauth(user_info) do
    user_params = %{
      "email" => user_info["email"],
      "google_user_info"=> user_info,
      "last_login"=> DateTime.utc_now
    }

    Map.merge(user_params, user_info)
  end
end
