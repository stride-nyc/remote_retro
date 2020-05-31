defmodule RemoteRetro.OAuth.Google do
  @moduledoc """
  Module for Google Oath.
  """

  use OAuth2.Strategy

  @oauth_client Application.get_env(:remote_retro, :oauth_client)

  def authorize_url!(params) do
    @oauth_client.authorize_url!(client(), params)
  end

  def get_user_info!(code) do
    user_info_endpoint = "https://www.googleapis.com/oauth2/v3/userinfo"

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
    @oauth_client.new(
      client_id: System.get_env("REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_ID"),
      client_secret: System.get_env("REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_SECRET"),
      redirect_uri: System.get_env("REMOTE_RETRO_GOOGLE_OAUTH_REDIRECT_URI"),
      site: "https://accounts.google.com",
      authorize_url: "https://accounts.google.com/o/oauth2/auth",
      token_url: "https://accounts.google.com/o/oauth2/token"
    )
    |> @oauth_client.put_serializer("application/json", Jason)
  end
end
