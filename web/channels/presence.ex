defmodule RemoteRetro.Presence do
  use Phoenix.Presence, otp_app: :remote_retro,
                        pubsub_server: RemoteRetro.PubSub

  def fetch(_topic, entries) do
    Enum.into entries, %{}, fn({token, presence}) ->
      presence = Map.put(presence, :user, List.first(presence.metas))
      {token, presence}
    end
  end
end
