defmodule RemoteRetro.OAuth.Client.InMemory do
  @mock_google_user_info Application.get_env(:remote_retro, :mock_google_user_info)

  defdelegate new(config), to: OAuth2.Client
  defdelegate authorize_url!(client, scope), to: OAuth2.Client
  defdelegate put_param(client, param_name, param_value), to: OAuth2.Client
  defdelegate put_serializer(client, format, serializer), to: OAuth2.Client

  def get_token!(_client, _code) do
    %OAuth2.Client{
      authorize_url: "https://accounts.google.com/o/oauth2/auth",
      client_id: "herp-derp.apps.googleusercontent.com",
      client_secret: "godblessElizabethWarren-",
      headers: [],
      params: %{},
      redirect_uri: "https://2325e52b.ngrok.io/auth/google/callback",
      ref: nil,
      request_opts: [],
      site: "https://accounts.google.com",
      strategy: OAuth2.Strategy.AuthCode,
      token: %OAuth2.AccessToken{
        access_token:
          "ya29.Glz6Ay8qDIUr208EQFhudXTJLSCu4uUIO1FkfH4uml1Hr1d_-5ZZlJf05pyJvRUQ56met3YPCqIMq6yGIbk0BPXLDlD3eVxK-Un4ipJpeE_rOuyLcoxy4HsDcdj1VQ",
        expires_at: 1_487_810_967,
        other_params: %{"id_token" => "tanner.mctickels"},
        refresh_token: nil,
        token_type: "Bearer"
      },
      token_method: :post,
      token_url: "https://accounts.google.com/o/oauth2/token"
    }
  end

  def get!(_client_with_token, _resource_url) do
    %OAuth2.Response{
      body: @mock_google_user_info,
      headers: [
        {"expires", "Thu, 23 Feb 2017 00:45:51 GMT"},
        {"date", "Thu, 23 Feb 2017 00:45:51 GMT"},
        {"cache-control", "private, max-age=0, must-revalidate, no-transform"},
        {"etag", "\"FT7X6cYw9BSnPtIywEFNNGVVdio/Wjcax47M6XtrzyDF_L-4DQXFNDs\""},
        {"vary", "Origin"},
        {"vary", "X-Origin"},
        {"content-type", "application/json; charset=UTF-8"},
        {"x-content-type-options", "nosniff"},
        {"x-frame-options", "SAMEORIGIN"},
        {"x-xss-protection", "1; mode=block"},
        {"content-length", "438"},
        {"server", "GSE"},
        {"alt-svc", "quic=\":443\"; ma=2592000; v=\"35,34\""}
      ],
      status_code: 200
    }
  end
end
