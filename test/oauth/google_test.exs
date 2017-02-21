defmodule RemoteRetro.GoogleTest do
  use ExUnit.Case
  alias RemoteRetro.Google

  describe "authorize_url!/1" do
    test "returns a google authorization url containing the given scope" do
      result = Google.authorize_url!([scope: "email profile"])

      assert result =~ "https://accounts.google.com/o/oauth2/auth?"
      assert result =~ "scope=email+profile"
    end
  end
end
