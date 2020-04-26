defmodule RemoteRetroWeb.ChannelCase do
  @moduledoc """
  This module defines the test case to be used by
  channel tests.

  Such tests rely on `Phoenix.ChannelTest` and also
  import other functionality to make it easier
  to build and query models.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate

  alias RemoteRetro.{Repo}

  using do
    quote do
      # Import conveniences for testing with channels
      import Phoenix.ChannelTest
      use RemoteRetro.UserRetroCase

      alias RemoteRetro.Repo
      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import RemoteRetro.TestHelpers

      # The default endpoint for testing
      @endpoint RemoteRetroWeb.Endpoint

      # these assertions require macros so that we can pass a pattern to match
      defmacro assert_broadcast_to_other_clients_only(message, match) do
        quote do
          assert_broadcast(unquote(message), unquote(match))
          refute_push(unquote(message), unquote(match))
        end
      end

      defmacro assert_broadcast_to_all_clients_including_initiator(message, match) do
        quote do
          assert_broadcast(unquote(message), unquote(match))
          assert_push(unquote(message), unquote(match))
        end
      end
    end
  end

  setup tags do
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(Repo)

    Ecto.Adapters.SQL.Sandbox.mode(Repo, {:shared, self()})

    {:ok, tags}
  end
end
