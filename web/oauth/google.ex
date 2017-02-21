defmodule RemoteRetro.Google do
  use OAuth2.Strategy

  def authorize_url!(params \\ []) do
    OAuth2.Client.authorize_url!(client(), params)
  end

  defp client do
    OAuth2.Client.new([
      client_id: System.get_env("GOOGLE_OAUTH_CLIENT_ID"),
      client_secret: System.get_env("GOOGLE_OAUTH_CLIENT_SECRET"),
      redirect_uri: System.get_env("GOOGLE_OAUTH_REDIRECT_URI"),
      site: "https://accounts.google.com",
      authorize_url: "https://accounts.google.com/o/oauth2/auth",
      token_url: "https://accounts.google.com/o/oauth2/token"
    ])
  end
end
