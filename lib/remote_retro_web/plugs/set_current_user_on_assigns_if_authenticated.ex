defmodule RemoteRetroWeb.Plugs.SetCurrentUserOnAssignsIfAuthenticated do
  import Plug.Conn

  alias RemoteRetro.{Repo, User}

  def init(options) do
    options
  end

  def call(conn, _) do
    case get_session(conn, :current_user_id) do
      nil ->
        conn
      current_user_id ->
        current_user = Repo.get!(User, current_user_id)
        assign(conn, :current_user, current_user)
    end
  end
end
