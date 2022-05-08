defmodule RemoteRetro.LayoutViewTest do
  use RemoteRetroWeb.ConnCase, async: true
  alias RemoteRetroWeb.LayoutView

  test "app_js is served by the webpack dev server (at port 5001) in dev" do
    Application.put_env(:remote_retro, :env, :dev)
    conn = get(build_conn(), "/")
    assert LayoutView.app_js(conn) =~ "localhost:5001/js/app.js"
    Application.put_env(:remote_retro, :env, :test)
  end

  test "app_js is served by a default host at path js/app.js in other environments" do
    conn = get(build_conn(), "/")
    assert LayoutView.app_js(conn) =~ "/js/app.js"
    refute LayoutView.app_js(conn) =~ "localhost:5001"
  end

  test "app_css is served by the webpack dev server (at port 5001) in dev" do
    Application.put_env(:remote_retro, :env, :dev)
    conn = get(build_conn(), "/")
    assert LayoutView.app_css(conn) =~ "localhost:5001/css/app.css"
    Application.put_env(:remote_retro, :env, :test)
  end

  test "app_css is served by a default host at path css/app.css in other environments" do
    conn = get(build_conn(), "/")
    assert LayoutView.app_css(conn) =~ "/css/app.css"
    refute LayoutView.app_css(conn) =~ "localhost:5001"
  end
end
