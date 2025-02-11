defmodule RemoteRetro.ErrorViewTest do
  use RemoteRetroWeb.ConnCase, async: true

  # When testing helpers, you may want to import Phoenix.HTML and
  # use functions such as safe_to_string() to convert the helper
  # result into an HTML string.
  # import Phoenix.HTML

  alias RemoteRetroWeb.ErrorView

  test "requests to a page that doesn't exist surfaces a 404" do
    assert Phoenix.View.render_to_string(ErrorView, "404.html", []) =~ "Page not found"
  end

  test "render 500.html" do
    assert Phoenix.View.render_to_string(ErrorView, "500.html", []) =~ "Internal server error"
  end

  test "render any other 5xx error as a generic server error" do
    assert Phoenix.View.render_to_string(ErrorView, "505.html", []) =~ "Internal server error"
  end
end
