defmodule RemoteRetro.Presence do
  @moduledoc """
  Handle users joining and leaving retros.
  """
  alias RemoteRetro.PresenceUtils
  use Phoenix.Presence, otp_app: :remote_retro,
                        pubsub_server: RemoteRetro.PubSub

  def fetch(_topic, entries) do
    entries = Enum.into entries, %{}, fn({user_token, presence}) ->
      user_metadata = List.first(presence.metas)
      presence = Map.put(presence, :user, Map.put(user_metadata, :token, user_token))
      {user_token, presence}
    end

    PresenceUtils.give_facilitator_role_to_longest_tenured(entries)
  end
end
