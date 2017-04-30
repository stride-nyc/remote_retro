defmodule RemoteRetro.RetroTest do
  use RemoteRetro.ModelCase

  alias RemoteRetro.Retro
  describe "JSON encoding of the model struct" do
    test "is enabled" do
      idea = %Retro{id: 5, stage: "idea-generation"}

      encoded = Poison.encode!(idea)

      assert encoded =~ ~r/"id":5/i
      assert encoded =~ ~r/"stage":"idea-generation"/i
    end
  end
end
