defmodule RemoteRetro.ConnCase.Helpers do
  use Phoenix.ConnTest

  @endpoint RemoteRetro.Endpoint

  def authenticate_connection(context) do
    conn = get context[:conn], "/auth/google/callback?code=derp"
    Map.put(context, :conn, conn)
  end
end
