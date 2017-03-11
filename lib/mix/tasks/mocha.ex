defmodule Mix.Tasks.Mocha do
  use Mix.Task

  @shortdoc "Runs javascript unit tests via the mocha executable"

  def run(_args) do
    System.cmd("mocha", [], into: IO.stream(:stdio, :line), env: [{"NODE_ENV", "test"}])
  end

  defmodule Watch do
    @shortdoc "Runs javascript unit tests on file change via the mocha executable"

    def run(_args) do
      System.cmd("mocha", ["--watch"], into: IO.stream(:stdio, :line), env: [{"NODE_ENV", "test"}])
    end
  end
end
