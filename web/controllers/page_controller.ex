defmodule RemoteRetro.PageController do
  use RemoteRetro.Web, :controller

  def index(conn, _params) do
    if Mix.env == :dev do
      current_user = %{ "given_name" => "Todd", "family_name" => "Grundy" }
    else
      current_user = get_session(conn, :current_user)
    end

    conn = assign(conn, :current_user, current_user)
    render conn, "index.html"
  end
end
