defmodule RemoteRetro.OAuth.Client.InMemory do

  defdelegate new(config), to: OAuth2.Client
  defdelegate authorize_url!(client, scope), to: OAuth2.Client
  defdelegate put_param(client, param_name, param_value), to: OAuth2.Client

  def get_token!(_client, _code) do
    %OAuth2.Client{
      authorize_url: "https://accounts.google.com/o/oauth2/auth",
      client_id: "herp-derp.apps.googleusercontent.com",
      client_secret: "godblessElizabethWarren-", headers: [], params: %{},
      redirect_uri: "https://2325e52b.ngrok.io/auth/google/callback", ref: nil,
      request_opts: [], site: "https://accounts.google.com",
      strategy: OAuth2.Strategy.AuthCode,
      token: %OAuth2.AccessToken{
        access_token: "ya29.Glz6Ay8qDIUr208EQFhudXTJLSCu4uUIO1FkfH4uml1Hr1d_-5ZZlJf05pyJvRUQ56met3YPCqIMq6yGIbk0BPXLDlD3eVxK-Un4ipJpeE_rOuyLcoxy4HsDcdj1VQ",
        expires_at: 1487810967,
        other_params: %{"id_token" => "tanner.mctickels"},
        refresh_token: nil,
        token_type: "Bearer"
      }, token_method: :post,
      token_url: "https://accounts.google.com/o/oauth2/token"
    }
  end
end
