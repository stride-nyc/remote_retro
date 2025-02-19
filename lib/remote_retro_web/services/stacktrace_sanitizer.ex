defmodule RemoteRetroWeb.StacktraceSanitizer do
  @doc """
  Sanitizes stacktrace entries by removing error_info metadata that Honeybadger cannot handle.
  """
  def sanitize(stacktrace) when is_list(stacktrace) do
    Enum.map(stacktrace, &sanitize_entry/1)
  end

  defp sanitize_entry({mod, fun, arity, opts}) when is_list(opts) do
    sanitized_opts = Keyword.take(opts, [:file, :line])
    {mod, fun, arity, sanitized_opts}
  end

  defp sanitize_entry(entry), do: entry
end
