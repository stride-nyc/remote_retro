defmodule RemoteRetro.PageControllerTest do
  use RemoteRetro.ConnCase

  describe "authenticated visits to root" do
    setup [:authenticate_connection]

    test "invite users to create a retrospective", %{conn: conn} do
      conn = get conn, "/"

      assert Regex.match?(~r/create a retrospective/i, conn.resp_body)
    end
  end

  describe "unauthenticated visits to root" do
    test "asks users to authenticate", %{conn: conn} do
      conn = get conn, "/"

      refute conn.resp_body =~ ~r/create a retrospective/i
      assert conn.resp_body =~ ~r/sign in with google/i
    end
  end

  defp authenticate_connection(context) do
    conn = get context[:conn], "/auth/google/callback?code=derp"
    Map.put(context, :conn, conn)
  end
end
