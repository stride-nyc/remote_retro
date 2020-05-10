defmodule RemoteRetroWeb.Plugs.SetCurrentUserOnAssignsIfAuthenticated do
  import Plug.Conn

  alias RemoteRetro.{Repo, User}

  def init(options) do
    options
  end

  def call(conn, _) do
    current_user = Repo.get!(User, 1)
    conn = put_session(conn, :current_user_id, 1)
    assign(conn, :current_user, current_user)
  end
end
