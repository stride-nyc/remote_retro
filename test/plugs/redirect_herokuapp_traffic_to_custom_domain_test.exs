defmodule RemoteRetro.RedirectHerokuAppTrafficToCustomDomainTest do
  use RemoteRetroWeb.ConnCase

  describe "RedirectHerokuAppTrafficToCustomDomain" do
    test "redirects requests to the herokuapp.com address to the new permanent address" do
      conn = build_conn(:get, "/whatever_path")
      conn = %Plug.Conn{ conn | host: "herokuapp.com"}

      conn = RedirectHerokuappTrafficToCustomDomain.call(conn, %{})

      assert redirected_to(conn, 301) =~ "http://remoteretro.org/whatever_path"
    end

    test "forwards connections that *don't* contain the herokuapp.com host" do
      conn = build_conn(:get, "/whatever_path")
      conn = %Plug.Conn{ conn | host: "remoteretro.org/whatever_path"}

      conn = RedirectHerokuappTrafficToCustomDomain.call(conn, %{})

      assert conn.state == :unset
    end
  end
end
