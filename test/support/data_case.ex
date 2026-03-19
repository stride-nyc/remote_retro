defmodule RemoteRetro.DataCase do
  @moduledoc """
  This module defines the test case to be used by
  model tests.

  You may define functions here to be used as helpers in
  your model tests. See `errors_on/2`'s definition as reference.

  Finally, if the test case interacts with the database,
  it cannot be async. For this reason, every test runs
  inside a transaction which is reset at the beginning
  of the test unless the test case is marked as async.
  """

  use ExUnit.CaseTemplate

  using do
    quote do
      alias RemoteRetro.Repo

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
      import RemoteRetro.DataCase
    end
  end

  setup tags do
    # Ensure application is started
    Application.ensure_all_started(:remote_retro)
    
    # Set up sandbox mode
    :ok = Ecto.Adapters.SQL.Sandbox.checkout(RemoteRetro.Repo)

    unless tags[:async] do
      Ecto.Adapters.SQL.Sandbox.mode(RemoteRetro.Repo, {:shared, self()})
    end

    # Verify Repo is started
    case Process.whereis(RemoteRetro.Repo) do
      pid when is_pid(pid) -> 
        IO.puts "Repo started successfully in test"
      nil -> 
        raise "Failed to start Repo in test"
    end

    :ok
  end

  @doc """
  A helper that transforms changeset errors into a map of messages.

      assert {:error, changeset} = Accounts.create_user(%{password: "short"})
      assert "password is too short" in errors_on(changeset).password
      assert %{password: ["password is too short"]} = errors_on(changeset)

  """
  def errors_on(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Regex.replace(~r"%{(\w+)}", message, fn _, key ->
        opts |> Keyword.get(String.to_existing_atom(key), key) |> to_string()
      end)
    end)
  end
end
