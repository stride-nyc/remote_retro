defmodule RemoteRetro.LayoutViewTest do
  use RemoteRetro.ConnCase, async: true
  alias RemoteRetro.LayoutView

  test "app_js is served by the webpack dev server (at port 5001) in dev" do
    Mix.env(:dev)
    conn = get build_conn(), "/"
    assert LayoutView.app_js(conn) =~ "localhost:5001"
    Mix.env(:test)
  end

  test "app_js is served by a default host at path js/app.js in other environments" do
    conn = get build_conn(), "/"
    assert LayoutView.app_js(conn) =~ "/js/app.js"
  end
end
