defmodule RemoteRetro.PresenceUtils do
  @moduledoc """
  Helpers for retro user presence.
  """
  alias RemoteRetro.Presence
  alias Phoenix.Token

  def track_timestamped(%{assigns: assigns} = socket) do
    {:ok, user} = Token.verify(socket, "user", assigns.user_token)
    user = Map.put(user, :online_at, :os.system_time)
    Presence.track(socket, assigns.user_token, user)
  end

  def give_facilitator_role_to_longest_tenured(presences) do
    {facilitator_token, _facilitator} = earliest_arrival(presences)

    Enum.into presences, %{}, fn({user_token, presence}) ->
      presence = put_in(presence, [:user, :is_facilitator], user_token == facilitator_token)
      {user_token, presence}
    end
  end

  defp earliest_arrival(presences) when map_size(presences) == 0, do: nil
  defp earliest_arrival(presences) do
    Enum.min_by(presences, fn {_user_token, presence} ->
      [first_meta|_] = presence.metas
      first_meta.online_at
    end)
  end
end
