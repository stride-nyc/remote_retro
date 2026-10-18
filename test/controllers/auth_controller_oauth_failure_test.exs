defmodule RemoteRetro.AuthControllerOAuthFailureTest do
  # not async: Mock replaces Honeybadger globally
  use RemoteRetroWeb.ConnCase, async: false

  import Mock
  import ShorterMaps

  test "invalid_grant redirects home with a flash and does not notify Honeybadger", ~M{conn} do
    with_mock Honeybadger, [:passthrough], notify: fn _, _ -> :ok end do
      conn = get(conn, "/auth/google/callback?code=invalid_grant_code")

      assert redirected_to(conn) == "/"
      assert get_flash(conn, :error) =~ "couldn't sign you in"
      refute called(Honeybadger.notify(:_, :_))
    end
  end

  for {code, description} <- [closed_code: ":closed", timeout_code: ":timeout"] do
    test "transient #{description} errors redirect home with a flash and do not notify Honeybadger", ~M{conn} do
      with_mock Honeybadger, [:passthrough], notify: fn _, _ -> :ok end do
        conn = get(conn, "/auth/google/callback?code=#{unquote(code)}")

        assert redirected_to(conn) == "/"
        assert get_flash(conn, :error) =~ "couldn't sign you in"
        refute called(Honeybadger.notify(:_, :_))
      end
    end
  end

  test "config errors like invalid_client redirect home with a flash and notify Honeybadger", ~M{conn} do
    with_mock Honeybadger, [:passthrough], notify: fn _, _ -> :ok end do
      conn = get(conn, "/auth/google/callback?code=invalid_client_code")

      assert redirected_to(conn) == "/"
      assert get_flash(conn, :error) =~ "couldn't sign you in"
      assert called(Honeybadger.notify(:_, :_))
    end
  end
end
