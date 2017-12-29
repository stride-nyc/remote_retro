defmodule RemoteRetro.LayoutViewTest do
  use RemoteRetro.ConnCase, async: false
  alias RemoteRetro.LayoutView

  test "app_js is served by the webpack dev server (at port 5001) in dev" do
    Application.put_env(:remote_retro, :env, :dev)
    conn = get build_conn(), "/"
    assert LayoutView.app_js(conn) =~ "localhost:5001/js/app.js"
    Application.put_env(:remote_retro, :env, :test)
  end

  test "app_js is served by a default host at path js/app.js in other environments" do
    conn = get build_conn(), "/"
    assert LayoutView.app_js(conn) == "/js/app.js"
  end
end
