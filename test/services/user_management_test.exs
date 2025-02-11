defmodule RemoteRetroWeb.UserManagementTest do
  use ExUnit.Case, async: false
  use Bamboo.Test, shared: true

  alias RemoteRetro.{User}
  alias RemoteRetroWeb.{UserManagement}

  import Mock

  @mock_google_user_info Application.compile_env(:remote_retro, :mock_google_user_info)

  # The syntax for with_mocks gets very bracey/bracketey, so we break the mock declarations
  # out into private helper methods, allowing us to spy on the stubbed functions within the test
  defp mock_upsert_record_from(inserted_or_updated \\ :inserted) do
    {User, [],
     [
       upsert_record_from: fn oauth_info: _ ->
         mock_user = %User{email: "grant@me.com", given_name: "John Dillinger"}
         {:ok, mock_user, inserted_or_updated}
       end
     ]}
  end

  describe ".handle_google_oauth" do
    test "it calls the user model's insert_or_update/1 func" do
      with_mocks [mock_upsert_record_from()] do
        UserManagement.handle_google_oauth(@mock_google_user_info)

        assert_called(User.upsert_record_from(oauth_info: %{}))
      end
    end

    test "triggers an email when the user comes back as inserted" do
      with_mocks [mock_upsert_record_from(:inserted)] do
        {:ok, _user} = UserManagement.handle_google_oauth(@mock_google_user_info)

        assert_email_delivered_with(%{to: [nil: "grant@me.com"]})
      end
    end

    test "does *not* trigger an email when the user comes back as updated" do
      with_mocks [mock_upsert_record_from(:updated)] do
        {:ok, _user} = UserManagement.handle_google_oauth(@mock_google_user_info)

        assert_no_emails_delivered()
      end
    end
  end
end
