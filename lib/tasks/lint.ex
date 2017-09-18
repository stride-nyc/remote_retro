defmodule Mix.Tasks.Lint do
  use Mix.Task

  @shortdoc "Runs local eslint"
  def run(_) do
    eslint_path = System.cwd() <> "/node_modules/.bin/eslint"
    System.cmd(eslint_path, [".", "--cache", "--color", "--ext", "js", "--ext", "jsx"], into: IO.stream(:stdio, :line))
  end
end
