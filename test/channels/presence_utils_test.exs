defmodule RemoteRetro.PresenceUtilsTest do
  use ExUnit.Case, async: true
  alias RemoteRetro.PresenceUtils

  @presence_structure_with_two_users %{
    "nme999" => %{metas: [%{online_at: 500}], user: %{}},
    "tvh121" => %{metas: [%{online_at: 100}], user: %{}}
  }

  describe "give_facilitator_role_to_longest_tenured/1" do
    test "sets facilitator boolean based on whether user was the earliest arrival" do
      presences = PresenceUtils.give_facilitator_role_to_longest_tenured(
        @presence_structure_with_two_users
      )

      assert presences["tvh121"].user.is_facilitator == true
      assert presences["nme999"].user.is_facilitator == false
    end
  end
end
