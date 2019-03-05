defmodule RemoteRetroWeb.Presence do
  @moduledoc """
  Handle users joining and leaving retros.
  """
  use Phoenix.Presence,
    otp_app: :remote_retro,
    pubsub_server: RemoteRetro.PubSub

  def fetch(_topic, entries) do
    Enum.into(entries, %{}, fn {user_token, presence} ->
      user_metadata = List.first(presence.metas)
      presence = Map.put(presence, :user, Map.put(user_metadata, :token, user_token))
      {user_token, presence}
    end)
  end
end
