defmodule RemoteRetroWeb.PresenceUtils do
  @moduledoc """
  Helpers for retro user presence.
  """
  alias RemoteRetroWeb.Presence
  alias RemoteRetro.User
  alias Phoenix.Token

  def track_timestamped(%{assigns: assigns} = socket) do
    case Token.verify(socket, "user", assigns.user_token, max_age: 86_400) do
      {:ok, user} ->
        user = %User{user | online_at: :os.system_time()}
        Presence.track(socket, assigns.user_token, user)
      {:error, _} ->
        IO.puts(:stderr, "Stale or invalid user presence token")
    end
  end
end
