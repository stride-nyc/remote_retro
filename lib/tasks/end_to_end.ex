defmodule Mix.Tasks.EndToEnd do
  use Mix.Task

  @shortdoc "Runs end-to-end tests"
  def run(_) do
    compile_js()
    IO.puts "\n#{IO.ANSI.green()}Executing end-to-end tests...#{IO.ANSI.reset()}\n"
    System.cmd(
      "mix",
      ["test", "test/features/", "--only", "feature_test", "--color"],
      into: IO.stream(:stdio, :line)
    )
  end

  defp compile_js do
    System.cmd("npm", ["run", "compile-dev", "--", "--hide-modules"], [into: IO.stream(:stdio, :line)])
  end
end
