defmodule RemoteRetro.Presence do
  @moduledoc """
  Handle users joining and leaving retros.
  """

  use Phoenix.Presence, otp_app: :remote_retro,
                        pubsub_server: RemoteRetro.PubSub

  def fetch(_topic, entries) do
    Enum.into entries, %{}, fn({user_token, presence}) ->
      presence = Map.put(presence, :user, List.first(presence.metas))
      {user_token, presence}
    end
  end
end
