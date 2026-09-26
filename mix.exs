defmodule RemoteRetro.Mixfile do
  use Mix.Project

  def project do
    [
      app: :remote_retro,
      version: app_version(),
      default_task: "defaults",
      elixir: "~> 1.16",
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
      {:phoenix, "~> 1.8"},
      # Phoenix 1.7+ extracted the classic Phoenix.View/.eex-template render
      # style (which our own `view/0` macro in lib/remote_retro_web.ex still
      # uses) into this separate, optional package - it's not pulled in
      # automatically since phoenix/phoenix_live_view only mark it optional.
      {:phoenix_view, "~> 2.0"},
      {:phoenix_pubsub, "~> 2.0"},
      {:phoenix_ecto, "~> 4.4"},
      {:ecto_sql, "~> 3.13"},
      {:ecto_psql_extras, "~> 0.7.4"},
      {:freedom_formatter, "~> 1.1", only: :dev},
      {:distillery, "~> 2.1.1", only: :prod},
      {:excoveralls, "~> 0.13.3", only: :test},
      {:postgrex, "~> 0.19"},
      {:phoenix_html, "~> 3.2"},
      {:phoenix_live_dashboard, "~> 0.9"},
      {:phoenix_live_reload, "~> 1.7", only: :dev},
      {:phoenix_live_view, "~> 1.2"},
      {:plug, "~> 1.15"},
      {:plug_canonical_host, "~> 2.0.1"},
      {:ecto_dev_logger, "~> 0.2"},
      {:plug_cowboy, "~> 2.5"},
      # cowboy 2.12+ pulls a cowlib whose HTTP/3 "capsule" erl source uses
      # syntax OTP 24's compiler can't parse - pin the last cowboy release
      # before that (still well past the OTP 23+ atom_to_binary/1 floor the
      # older locked cowboy/cowlib needed).
      {:cowboy, "2.18.0", override: true},
      {:cowlib, "2.19.0", override: true},
      # ranch 2.x calls :proc_lib.set_label/1, an OTP 27+ stdlib function
      # that doesn't exist on OTP 24.
      {:ranch, "~> 1.8", override: true},
      {:plug_minify_html, "~> 0.1.0"},
      {:mix_test_watch, "~> 1.0.2", [runtime: false, only: :dev]},
      {:mock, "~> 0.3.6", only: :test},
      {:oauth2, "~> 2.0"},
      {:gettext, "~> 0.20"},
      {:wallaby, "~> 0.30.0", [runtime: false, only: :test]},
      {:slender_channel, "~> 1.0"},
      {:libcluster, "~> 3.2"},
      {:bamboo, "~> 1.6"},
      {:brotli, "~> 0.3", only: :prod},
      {:honeybadger, "~> 0.15"},
      {:apex, "~>1.2.1", only: [:dev, :test]},
      {:timex, "~> 3.6"},
      {:telemetry_poller, "~> 0.5.1"},
      {:telemetry_metrics, "~> 0.6"},
      {:jason, "~> 1.3"}
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
