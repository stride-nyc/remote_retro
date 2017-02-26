defmodule RemoteRetro.PresenceTest do
  use ExUnit.Case, async: true
  alias RemoteRetro.Presence

  @basic_presence_structure %{
    "9sah2y" => %{
      metas: [%{
        online_at: 1500
      }, %{
        online_at: 300
      }]
    }
  }

  describe "Presence.fetch/2" do
    test "adds a user map to the presence data structure" do
      result = Presence.fetch("retro:some_retro", @basic_presence_structure)

      assert is_map(result["9sah2y"].user)
    end

    test "adds the first online_at within the metas list to the user" do
      result = Presence.fetch("retro:some_retro", @basic_presence_structure)

      assert result["9sah2y"].user.online_at == 1500
    end
  end
end
