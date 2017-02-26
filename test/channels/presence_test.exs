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

    test "augments the user map with all attributes from the first metas map" do
      presence = %{
        "arbitrary_key" => %{
          metas: [%{
            :online_at => 1500,
            "given_name" => "Hilary",
            "family_name" => "Cassel",
            "email" => "hilly@dilly.com",
            "gender" => "female",
            "name" => "Stub User",
            "picture" => "stub",
          }, %{
            :online_at => 10,
            "given_name" => "other name"
          }]
        }
      }

      result = Presence.fetch("retro:some_retro", presence)
      user = result["arbitrary_key"].user

      assert user.online_at == 1500
      assert user["given_name"] == "Hilary"
      assert user["family_name"] == "Cassel"
      assert user["email"] == "hilly@dilly.com"
      assert user["gender"] == "female"
    end
  end
end
