defmodule RemoteRetro.RepoTest do
  use ExUnit.Case, async: false

  alias RemoteRetro.Repo

  setup do
    original = System.get_env("DATABASE_CONNECTION_POOL")

    on_exit(fn ->
      if original,
        do: System.put_env("DATABASE_CONNECTION_POOL", original),
        else: System.delete_env("DATABASE_CONNECTION_POOL")
    end)
  end

  describe "init/2" do
    test "leaves the configured pool size alone when DATABASE_CONNECTION_POOL is unset" do
      System.delete_env("DATABASE_CONNECTION_POOL")

      assert {:ok, [pool_size: 24]} = Repo.init(:supervisor, pool_size: 24)
    end

    test "overrides the pool size with DATABASE_CONNECTION_POOL when set" do
      System.put_env("DATABASE_CONNECTION_POOL", "2")

      assert {:ok, config} = Repo.init(:supervisor, pool_size: 24, ssl: true)
      assert config[:pool_size] == 2
      assert config[:ssl] == true
    end
  end
end
