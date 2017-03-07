defmodule RemoteRetro.PresenceUtils do
  require Logger
  def give_facilitator_role_to_longest_tenured(presences) do
    {facilitator_token, _facilitator} = earliest_arrival(presences)

    Enum.into presences, %{}, fn({token, presence}) ->
      presence = put_in(presence, [:user, :facilitator], token == facilitator_token)
      {token, presence}
    end
  end

  defp earliest_arrival(presences) when map_size(presences) == 0, do: nil
  defp earliest_arrival(presences) do
    Enum.min_by(presences, fn {_token, presence} ->
      List.first(presence.metas).online_at
    end)
  end
end
