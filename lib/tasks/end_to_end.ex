defmodule Mix.Tasks.EndToEnd do
  @moduledoc false
  use Mix.Task

  @shortdoc "Runs feature tests"
  def run(_) do
    System.cmd(
      "mix",
      ["test", "--only", "feature_test", "--color"],
      into: IO.stream(:stdio, :line)
    )
  end
end
