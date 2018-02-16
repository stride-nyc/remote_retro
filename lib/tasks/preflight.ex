defmodule Mix.Tasks.Preflight do
  use Mix.Task

  @shortdoc "Checks for necessary ENVARS"
  def run(_) do
    check_hex_version()
  end

  defp check_hex_version do
    required_version_num = ~r/0\.17\.\d+/

    {hex_version_output, _} = System.cmd("mix", ["hex", "--version"])
    if !Regex.match?(required_version_num, hex_version_output) do
      IO.puts """

        Greetings Developer,
        Looks like your local Hex is outdated. Please update your local Hex via `mix local.hex` and try again.

        Thanks!
      """
      System.halt(:abort)
    end
  end
end
