defmodule ForbidNonStridersTest do
  use RemoteRetroWeb.ConnCase, async: true

  alias RemoteRetro.User
  alias RemoteRetroWeb.Plugs.ForbidNonStriders

  @stub_options %{}

  test "user is passed through when they have a stride email address", %{conn: conn} do
    stride_user = %User{email: "travis@stridenyc.com"}

    conn_before =
      conn
      |> assign(:current_user, stride_user)

    conn_after = ForbidNonStriders.call(conn_before, @stub_options)

    assert conn_before == conn_after
  end

  test "user is passed through when they have a stride build email address", %{conn: conn} do
    stride_user = %User{email: "travis@stride.build"}

    conn_before =
      conn
      |> assign(:current_user, stride_user)

    conn_after = ForbidNonStriders.call(conn_before, @stub_options)

    assert conn_before == conn_after
  end

  test "current user is presented with a 403 when they *lack* a stride email address", %{conn: conn} do
    non_stride_user = %User{email: "travis@linkedin.com"}

    conn_before =
      conn
      |> assign(:current_user, non_stride_user)

    conn_after = ForbidNonStriders.call(conn_before, @stub_options)

    assert %Plug.Conn{
      state: :sent,
      status: 403,
    } = conn_after
  end
end
