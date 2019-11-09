defmodule RemoteRetro.ErrorViewTest do
  use RemoteRetroWeb.ConnCase, async: true

  alias RemoteRetroWeb.ErrorView

  # Bring render/3 and render_to_string/3 for testing custom views
  import Phoenix.View

  test "requests to a page that doesn't exist surfaces a 404" do
    assert render_to_string(ErrorView, "404.html", []) =~ "Page not found"
  end

  test "render 500.html" do
    assert render_to_string(ErrorView, "500.html", []) =~ "Internal server error"
  end

  test "render any other 5xx error as a generic server error" do
    assert render_to_string(ErrorView, "505.html", []) =~ "Internal server error"
  end
end
