defmodule RemoteRetro.OAuth.Client.InMemory do

  defdelegate new(config), to: OAuth2.Client
  defdelegate authorize_url!(client, scope), to: OAuth2.Client
end
