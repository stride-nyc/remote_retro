defmodule RemoteRetro.LayoutViewTest do
  use RemoteRetro.ConnCase, async: false
  alias RemoteRetro.LayoutView

  test "app_js is served by the webpack dev server (at port 5001) in dev" do
    Mix.env(:dev)
    Application.set_env(:remote_retro, :env, :dev)
    conn = get build_conn(), "/"
    assert LayoutView.app_js(conn) =~ "localhost:5001"
    Application.set_env(:remote_retro, :env, :test)
    Mix.env(:test)
  end

  test "app_js is served by a default host at path js/app.js in other environments" do
    conn = get build_conn(), "/"
    assert LayoutView.app_js(conn) =~ "/js/app.js"
  end
end
