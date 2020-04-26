defmodule RemoteRetroWeb.ConnCase.Helpers do
  import Phoenix.ConnTest

  @endpoint RemoteRetroWeb.Endpoint

  def authenticate_connection(context) do
    conn = get(context[:conn], "/auth/google/callback?code=derp")
    Map.put(context, :conn, conn)
  end
end
