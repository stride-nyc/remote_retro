defmodule RemoteRetro.Presence do
  use Phoenix.Presence, otp_app: :remote_retro,
                        pubsub_server: RemoteRetro.PubSub

  def fetch(_topic, entries) do
    Enum.into entries, %{}, fn({token, presence}) ->
      presence = Map.put(presence, :user, %{
        online_at: List.first(presence.metas).online_at,
        name: token,
      })
      {token, presence}
    end
  end
end
