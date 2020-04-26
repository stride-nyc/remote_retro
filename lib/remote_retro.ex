defmodule RemoteRetro do
  use Application
  require Logger
  alias RemoteRetroWeb.Endpoint

  # See http://elixir-lang.org/docs/stable/elixir/Application.html
  # for more information on OTP Applications
  def start(_type, _args) do
    import Supervisor.Spec

    # Define workers and child supervisors to be supervised
    children = [
      {Phoenix.PubSub, name: RemoteRetro.PubSub},
      # Start the Ecto repository
      supervisor(RemoteRetro.Repo, []),
      # Start the endpoint when the application starts
      supervisor(RemoteRetroWeb.Endpoint, []),
      supervisor(RemoteRetroWeb.Presence, []),

      {Cluster.Supervisor, [Application.get_env(:libcluster, :topologies), [name: RemoteRetro.ClusterSupervisor]]},

      # Start your own worker by calling: RemoteRetro.Worker.start_link(arg1, arg2, arg3)
      # worker(RemoteRetro.Worker, [arg1, arg2, arg3]),
    ]

    # See http://elixir-lang.org/docs/stable/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: RemoteRetro.Supervisor]

    result = Supervisor.start_link(children, opts)

    path_to_migrations = Path.join([:code.priv_dir(:remote_retro), "repo/migrations"])

    Logger.info("Running migrations...")
    Ecto.Migrator.run(RemoteRetro.Repo, path_to_migrations, :up, all: true)

    result
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  def config_change(changed, _new, removed) do
    Endpoint.config_change(changed, removed)
    :ok
  end
end
