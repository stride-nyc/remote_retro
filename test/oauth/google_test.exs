defmodule RemoteRetro.GoogleTest do
  use ExUnit.Case, async: true
  alias RemoteRetro.OAuth.Google

  describe "authorize_url!/1" do
    test "returns a google authorization url containing the given scope" do
      result = Google.authorize_url!(scope: "email profile")

      assert result =~ "https://accounts.google.com/o/oauth2/auth?"
      assert result =~ "scope=email+profile"
    end
  end

  describe "get_user_info!/1" do
    test "returns the test user's info" do
      _result = Google.get_user_info!(%{})

      assert _result = %{"email" => "mistertestuser@gmail.com"}
    end
  end
end
