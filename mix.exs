defmodule RemoteRetro.Mixfile do
  use Mix.Project

  def project do
    [app: :remote_retro,
     version: "0.0.1",
     default_task: "defaults",
     elixir: "~> 1.5",
     elixirc_paths: elixirc_paths(Mix.env),
     compilers: [:phoenix, :gettext] ++ Mix.compilers,
     build_embedded: Mix.env == :prod,
     start_permanent: Mix.env == :prod,
     test_coverage: [tool: ExCoveralls],
     preferred_cli_env: [coveralls: :test],
     aliases: aliases(),
     deps: deps()]
  end

  # Configuration for the OTP application.
  #
  # Type `mix help compile.app` for more information.
  def application do
    [mod: {RemoteRetro, []},
     applications: [:phoenix, :phoenix_pubsub, :phoenix_html, :cowboy, :logger, :gettext,
                    :phoenix_ecto, :postgrex, :oauth2, :bamboo, :slender_channel, :honeybadger, :timex, :libcluster]]
  end

  # Specifies which paths to compile per environment.
  defp elixirc_paths(:test), do: ["lib", "web", "test/support"]
  defp elixirc_paths(_),     do: ["lib", "web"]

  # Specifies your project dependencies.
  #
  # Type `mix help deps` for examples and options.
  defp deps do
    [{:phoenix, "~> 1.2.1"},
     {:phoenix_pubsub, "~> 1.0.2"},
     {:phoenix_ecto, "~> 3.2.2"},
     {:distillery, "~> 1.0.0"},
     {:excoveralls, "~> 0.7.5", only: :test},
     {:postgrex, ">= 0.0.0"},
     {:phoenix_html, "~> 2.6"},
     {:phoenix_live_reload, "~> 1.0", only: :dev},
     {:mix_test_watch, "~> 0.2", only: :dev},
     {:oauth2, "~> 0.9"},
     {:gettext, "~> 0.11"},
     {:wallaby, "~> 0.19.2"},
     {:slender_channel, "~> 0.1.1"},
     {:libcluster, "~> 2.0.3"},
     {:cowboy, "~> 1.0"},
     {:bamboo, "~> 0.8"},
     {:honeybadger, "~> 0.7.0"},
     {:credo, "~> 0.3", only: [:dev, :test]},
     {:apex, "~>1.2.0", only: [:dev, :test]},
     {:timex, "~> 3.1"},
     {:quick_alias, "~> 0.1.0", only: :dev}]
  end

  # Aliases are shortcuts or tasks specific to the current project.
  # For example, to create, migrate and run the seeds file at once:
  #
  #     $ mix ecto.setup
  #
  # See the documentation for `Mix` for more info on aliases.
  defp aliases do
    ["ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
     "ecto.reset": ["ecto.drop", "ecto.setup"],
     "test": ["ecto.create --quiet", "ecto.migrate", "test --exclude feature_test"],
     "e2e": ["end_to_end"],
     "defaults": ["preflight", "phoenix.server"],
    ]
  end
end
