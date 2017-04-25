defmodule Mix.Tasks.Preflight do
  @moduledoc false
  use Mix.Task

  @shortdoc "Checks for necessary ENVARS"
  def run(_) do
    check_envars()
    check_hex_version()
  end

  defp check_envars do
    required_envars = [
      "REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_ID",
      "REMOTE_RETRO_GOOGLE_OAUTH_CLIENT_SECRET",
      "REMOTE_RETRO_GOOGLE_OAUTH_REDIRECT_URI"
    ]

    missing_envars = Enum.reject(required_envars, &System.get_env/1)

    num_missing = length(missing_envars)
    if num_missing > 0 do
      IO.puts "Please define the following environment variables:\n" <> Enum.join(missing_envars, "\n")
      System.halt(:abort)
    end
  end

  defp check_hex_version do
    required_version_num = "0.16.0"

    { hex_version_output, _ } = System.cmd("mix", ["hex", "--version"])
    if !String.contains?(hex_version_output, required_version_num) do
      IO.puts "Please install Hex #{required_version_num}"
      System.halt(:abort)
    end
  end
end
