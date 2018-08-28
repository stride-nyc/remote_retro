defmodule Mix.Tasks.Preflight do
  use Mix.Task

  @shortdoc "Checks for necessary ENVARS"
  def run(_) do
    check_envars()
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
      IO.puts "The following environment variables need to be defined:\n\t#{Enum.join(missing_envars, "\n\t")}"
      IO.puts "Please refer to the README.md file for detailed instructions on setting this up."
      System.halt(:abort)
    end
  end
end
