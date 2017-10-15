defmodule Mix.Tasks.EndToEnd do
  use Mix.Task

  @shortdoc "Runs feature tests"
  def run(_) do
    compile_js_if_necessary()
    System.cmd(
      "mix",
      ["test", "test/features/", "--only", "feature_test", "--color"],
      into: IO.stream(:stdio, :line)
    )
  end

  defp compile_js_if_necessary do
    if !File.exists?("priv/static/js/dll.vendor.js") do
      System.cmd("npm", ["run", "deploy", "--", "--hide-modules"], [into: IO.stream(:stdio, :line)])
    end
  end
end
