defmodule RemoteRetro.PageControllerTest do
  use RemoteRetroWeb.ConnCase, async: true

  describe "authenticated visits to root" do
    setup [:authenticate_connection]

    test "redirect to the dashboard at /retros", %{conn: conn} do
      conn = get(conn, "/")

      assert redirected_to(conn) =~ "/retros"
    end
  end

  describe "unauthenticated visits to root" do
    test "asks users to authenticate", %{conn: conn} do
      conn = get(conn, "/")

      assert html_response(conn, 200) =~ ~r/sign in with google/i
    end

    test "appends a 'landing-page' class to the body element for scoped styling", %{conn: conn} do
      conn = get(conn, "/")

      assert html_response(conn, 200) =~ ~r/body .*class="landing-page".*>/i
    end
  end

  test "has a default title attribute where RemoteRetro comes first", %{conn: conn} do
    conn = get(conn, "/")

    assert html_response(conn, 200) =~ ~r/<title>RemoteRetro\.org \| .*>/i
  end

  test "has a default meta description", %{conn: conn} do
    conn = get(conn, "/")

    assert html_response(conn, 200) =~ ~r/<meta name="description" content=".*remote retrospectives.*"/i
  end

  test "GET /faq", %{conn: conn} do
    conn = get(conn, "/faq")
    assert html_response(conn, 200) =~ "Frequently Asked Questions"
  end

  test "non-root pages can provide a custom custom title attribute", %{conn: conn} do
    conn = get(conn, "/faq")
    assert html_response(conn, 200) =~ ~r/<title>Frequently Asked Questions \| .*<\/title>/i
  end

  test "non-root pages can provide a custom meta description attribute", %{conn: conn} do
    conn = get(conn, "/faq")
    assert html_response(conn, 200) =~ ~r/<meta name="description" content=".*answers.*"/i
  end

  describe "authenticated visits to /faq" do
    setup [:authenticate_connection]

    test "do not prompt the user to sign in", %{conn: conn} do
      conn = get(conn, "/faq")

      refute html_response(conn, 200) =~ "Sign in"
    end
  end

  describe "unauthenticated visits to /faq" do
    test "prompt the user to sign in", %{conn: conn} do
      conn = get(conn, "/faq")

      assert html_response(conn, 200) =~ "Sign in"
    end
  end

  test "GET /privacy", %{conn: conn} do
    conn = get(conn, "/privacy")
    assert html_response(conn, 200) =~ "Privacy Policy"
  end

  describe "authenticated visits to /privacy" do
    setup [:authenticate_connection]

    test "do not prompt the user to sign in", %{conn: conn} do
      conn = get(conn, "/privacy")

      refute html_response(conn, 200) =~ "Sign in"
    end
  end

  describe "unauthenticated visits to /privacy" do
    test "do not prompt the user to sign in", %{conn: conn} do
      conn = get(conn, "/privacy")

      refute html_response(conn, 200) =~ "Sign in"
    end
  end
end
