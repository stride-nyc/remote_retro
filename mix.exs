defmodule RemoteRetro.Mixfile do
  use Mix.Project

  def project do
    [
      app: :remote_retro,
      version: app_version(),
      default_task: "defaults",
      elixir: "1.8.2",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: [:phoenix, :gettext] ++ Mix.compilers(),
      build_embedded: Mix.env() == :prod,
      start_permanent: Mix.env() == :prod,
      test_coverage: [tool: ExCoveralls],
      preferred_cli_env: [coveralls: :test],
      aliases: aliases(),
      deps: deps(),
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [mod: {RemoteRetro, []}, extra_applications: [:logger]]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_), do: ["lib", "web"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.4.9"},
      {:phoenix_pubsub, "~> 1.1.2"},
      {:phoenix_ecto, "~> 4.0.0"},
      {:ecto_sql, "~> 3.1.6"},
      {:freedom_formatter, "~> 1.0.0", only: :dev},
      {:distillery, "~> 2.0.12", only: :prod},
      {:excoveralls, "~> 0.10.6", only: :test},
      {:postgrex, ">= 0.0.0"},
      {:phoenix_html, "~> 2.13"},
      {:phoenix_live_reload, "~> 1.2.1", only: :dev},
      {:plug_cowboy, "~> 2.1"},
      {:plug, "~> 1.8.3"},
      {:mix_test_watch, "~> 0.9", [runtime: false, only: :dev]},
      {:mock, "~> 0.3.3", only: :test},
      {:oauth2, "~> 0.9.4"},
      {:gettext, "~> 0.17.1"},
      {:wallaby, "~> 0.22.0", [runtime: false, only: :test]},
      {:shorter_maps, "~> 2.0"},
      {:slender_channel, "~> 0.2.0"},
      {:libcluster, "~> 3.1.1"},
      {:bamboo, "~> 1.3"},
      {:honeybadger, "~> 0.13.0"},
      {:apex, "~>1.2.1", only: [:dev, :test]},
      {:timex, "~> 3.6"},
      {:jason, "~> 1.1.2"},
    ]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    [
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate", "test --exclude feature_test"],
      e2e: ["end_to_end"],
      defaults: ["preflight", "phx.server"],
    ]
  end

  # ensure unique app version for deploys of master from CircleCI, as a different
  # version is required by distillery for hot-upgrade deploys
  defp app_version do
    if Mix.env() == :prod do
      {commit_count, 0} = System.cmd("git", ~w[rev-list --count HEAD], stderr_to_stdout: true)
      "1.0." <> String.trim(commit_count)
    else
      "1.0.1"
    end
  end
end
