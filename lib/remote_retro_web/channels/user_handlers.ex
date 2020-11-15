defmodule RemoteRetroWeb.UserHandlers do
  alias RemoteRetro.{Repo, User}

  import ShorterMaps

  @user_edited "user_edited"

  def handle_in(@user_edited, ~m{id, email_opt_in}, socket) do
    user =
      User
      |> Repo.get!(id)
      |> User.changeset(~M{email_opt_in})
      |> Repo.update!()

    {:reply, {:ok, user}, socket}
  rescue
    exception ->
      Honeybadger.notify(exception, metadata: %{handler: @user_edited}, stacktrace: __STACKTRACE__)
      {:reply, :error, socket}
  end
end
