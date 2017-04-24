defmodule Mix.Tasks.Preflight do
  @moduledoc false
  use Mix.Task

  @shortdoc "Checks for necessary ENVARS"
  def run(_) do
    eslint_path = System.cwd() <> "/node_modules/.bin/eslint"
    System.cmd(eslint_path, [".", "--color", "--ext", "js", "--ext", "jsx"], into: IO.stream(:stdio, :line))
  end
end
