defmodule Mix.Tasks.Mocha do
  use Mix.Task

  @shortdoc "Runs javascript unit tests via the mocha executable"

  def run(_args) do
    System.cmd("mocha", [], into: IO.stream(:stdio, :line), env: [{"NODE_ENV", "test"}])
  end
end
