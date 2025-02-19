defmodule Mix.Tasks.EndToEnd do
  use Mix.Task

  @shortdoc "Runs end-to-end tests"
  def run(_) do
    chrome_outdated?()
    compile_js()
    IO.puts("\n#{IO.ANSI.green()}Executing end-to-end tests...#{IO.ANSI.reset()}\n")
    IO.puts("\tNote: browser logs will be written to `browser_logs.log`\n")

    System.cmd(
      "mix",
      ["test", "test/features/", "--only", "feature_test", "--color"],
      into: IO.stream(:stdio, :line)
    )
  end

  @npm_chromedriver_package "chromedriver"
  defp chrome_outdated?() do
    with {raw_outdated_modules, _status_code} <- System.cmd("npm", ["outdated", "-g", "--json"]),
         {:ok, parsed_outdated_modules} <- Jason.decode(raw_outdated_modules) do
      if Map.has_key?(parsed_outdated_modules, @npm_chromedriver_package) do
        print_red_line "\n\nYour chromedriver binary is out of date. End-to-end tests may fail due to not having the absolutely latest chromedriver and Chrome installed on your system.\n\n\tYou can update chromedriver via 'npm install -g chromedriver', and update Chrome by visiting chrome://settings/help (in Chrome).\n"
      end
    end
  end

  defp compile_js do
    System.cmd("yarn", ["run", "compile-test"], into: IO.stream(:stdio, :line))
  end

  defp print_red_line(output) do
    IO.warn("#{IO.ANSI.red()}#{output}#{IO.ANSI.reset()}")
  end
end
