defmodule RemoteRetroWeb.UserManagement do
  alias RemoteRetro.{User, Mailer, Emails}

  def handle_google_oauth(oauth_info) do
    IO.inspect oauth_info

    case User.upsert_record_from(oauth_info: oauth_info) do
      {:ok, user, :inserted} ->
        Emails.welcome_email(user) |> Mailer.deliver_now()
        {:ok, user}

      {:ok, user, :updated} ->
        {:ok, user}
    end
  end
end
