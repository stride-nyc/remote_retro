defmodule Mix.Tasks.Mocha do
  use Mix.Task

  @shortdoc "Runs javascript unit tests via the mocha executable"

  def run(_args) do
    Mix.shell.info "#{IO.ANSI.green}\nExecuting JS unit tests via Mocha#{IO.ANSI.reset}"
    exit_code = Mix.shell.cmd "mocha"

    if exit_code == 0 do
      Mix.shell.info "#{IO.ANSI.green}\nJS unit tests complete. Carrying on...\n#{IO.ANSI.reset}"
    else
      Mix.raise "JS unit tests failed. Aborting task."
    end
  end
end
