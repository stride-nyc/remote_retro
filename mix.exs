defmodule RemoteRetro.Mixfile do
  use Mix.Project

  def project do
    [
      app: :remote_retro,
      version: app_version(),
      default_task: "defaults",
      elixir: "1.18.2",
      elixirc_paths: elixirc_paths(Mix.env()),
      compilers: Mix.compilers(),
      build_embedded: Mix.env() == :prod,
      start_permanent: Mix.env() == :prod,
      test_coverage: [tool: ExCoveralls],
      preferred_cli_env: [coveralls: :test],
      aliases: aliases(),
      deps: deps()
    ]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [mod: {RemoteRetro, []}, extra_applications: extra_applications(Mix.env())]
  end

  defp extra_applications(:test), do: extra_applications(:default) -- [:os_mon]
  defp extra_applications(_), do: [:logger, :os_mon]

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_), do: ["lib", "web"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [
      {:phoenix, "~> 1.7.19"},
      {:phoenix_pubsub, "~> 2.1.3"},
      {:phoenix_ecto, "~> 4.6.3"},
      {:ecto_sql, "~> 3.12.1"},
      {:ecto_psql_extras, "~> 0.8.6"},
      {:freedom_formatter, "~> 2.1.1", only: :dev},
      {:distillery, "2.1.1", only: :prod},
      {:excoveralls, "0.18.5", only: :test},
      {:postgrex, "~> 0.20.0"},
      {:phoenix_bakery, "~> 0.1.2", [only: :prod, runtime: false]},
      {:phoenix_html, "~> 4.2.0"},
      {:phoenix_html_helpers, "~> 1.0"},
      {:phoenix_live_dashboard, "~> 0.8.6"},
      {:phoenix_live_reload, "~> 1.5.3", only: :dev},
      {:phoenix_live_view, "~> 1.0.4"},
      {:plug, "~> 1.16.1"},
      {:plug_canonical_host, "~> 2.0.3"},
      {:ecto_dev_logger, "~> 0.14.1"},
      {:plug_cowboy, "~> 2.7.2"},
      {:plug_minify_html, "~> 0.1.0"},
      {:mix_test_watch, "~> 1.2.0", [runtime: false, only: :dev]},
      {:mock, "~> 0.3.9", only: :test},
      {:oauth2, "~> 2.1.0"},
      {:gettext, "~> 0.26.2"},
      {:wallaby, "~> 0.30.10", [runtime: false, only: :test]},
      {:shorter_maps, "~> 2.2.5"},
      {:slender_channel, "~> 1.0.0"},
      {:libcluster, "~> 3.5.0"},
      {:bamboo, "~> 2.3.1"},
      {:brotli, "~> 0.3.2", only: :prod},
      {:honeybadger, "~> 0.22.1"},
      {:apex, "~> 1.2.1", only: [:dev, :test]},
      {:timex, "~> 3.7.11"},
      {:telemetry_poller, "~> 1.1.0"},
      {:telemetry_metrics, "~> 1.1.0"},
      {:jason, "~> 1.4.4"}
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
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test --exclude feature_test"],
      e2e: ["end_to_end"],
      defaults: ["preflight", "phx.server"]
    ]
  end

  # ensure unique app version for deploys of master from CircleCI, as a different
  # version is required by distillery for hot-upgrade deploys
  defp app_version do
    if Mix.env() == :prod do
      sha = System.get_env("SOURCE_VERSION")
      truncated_sha = String.slice(sha, 0, 7)
      "1.0.1-c" <> truncated_sha
    else
      "1.0.1"
    end
  end
end
