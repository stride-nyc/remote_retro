defmodule RemoteRetroWeb.UserHandlers do
  alias RemoteRetro.{Repo, User}

  @user_edited "user_edited"

  def handle_in(@user_edited, %{id: id, email_opt_in: email_opt_in}, socket) do
    user =
      User
      |> Repo.get!(id)
      |> User.changeset(%{email_opt_in: email_opt_in})
      |> Repo.update!()

    {:reply, {:ok, user}, socket}
  rescue
    exception ->
      Honeybadger.notify(exception, metadata: %{handler: @user_edited}, stacktrace: __STACKTRACE__)
      {:reply, :error, socket}
  end
end
