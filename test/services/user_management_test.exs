defmodule RemoteRetroWeb.UserManagementTest do
  use ExUnit.Case, async: false

  alias RemoteRetro.{User, Mailer}
  alias RemoteRetroWeb.{UserManagement}

  import Mock

  describe ".handle_google_oauth" do
    test "it calls the user model's insert_or_update/1 func" do
      with_mocks [{Mailer, [], [deliver_now: fn(_) ->
        %{}
      end]}, {User, [], [upsert_record_from: fn(oauth_info: _) ->
        mock_user = %User{email: "grant@me.com", given_name: "John Dillinger"}
        {:ok, mock_user, :inserted}
      end]}] do
        UserManagement.handle_google_oauth(%{})

        assert_called User.upsert_record_from(oauth_info: %{})
      end
    end

    test "triggers an email when the user comes back as inserted" do
      with_mocks [{Mailer, [], [deliver_now: fn(_) ->
        %{}
      end]}, {User, [], [upsert_record_from: fn(oauth_info: _) ->
        mock_user = %User{email: "grant@me.com", given_name: "John Dillinger"}
        {:ok, mock_user, :inserted}
      end]}] do
        {:ok, _user} = UserManagement.handle_google_oauth(%{})

        assert_called Mailer.deliver_now(%{})
      end
    end

    test "does *not* trigger an email when the user comes back as updated" do
      with_mocks [{Mailer, [], [deliver_now: fn(_) ->
        %{}
      end]}, {User, [], [upsert_record_from: fn(oauth_info: _) ->
        mock_user = %User{email: "grant@me.com", given_name: "John Goodman"}
        {:ok, mock_user, :updated}
      end]}] do
        {:ok, _user} = UserManagement.handle_google_oauth(%{
          "email" => "grant@me.com",
          "given_name" => "John Goodman",
        })

        refute called(Mailer.deliver_now(%{}))
      end
    end
  end
end
