defmodule Mix.Tasks.Preflight do
  @moduledoc false
  use Mix.Task

  @shortdoc "Checks for necessary ENVARS"
  def run(_) do
    required_envars = [
      "REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_ID",
      "REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_SECRET",
      "REMOTE_RETRO_GOOGLE_OAUTH_REDIRECT_URI"
    ]

    missing_envars = Enum.reduce(required_envars, [], fn x, acc ->
      if !System.get_env(x) do
        acc ++ [x]
      else
        acc
      end
    end)

    num_missing = length(missing_envars)
    if num_missing > 0 do
      IO.puts "You must define the following environment variables:\n" <> Enum.join(missing_envars, "\n")
      System.halt(:abort)
    end
  end
end
