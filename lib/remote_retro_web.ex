defmodule RemoteRetroWeb do
  @moduledoc """
  A module that keeps using definitions for controllers,
  views and so on.

  This can be used in your application as:

      use RemoteRetroWeb, :controller
      use RemoteRetroWeb, :view

  The definitions below will be executed for every view,
  controller, etc, so keep them short and clean, focused
  on imports, uses and aliases.

  Do NOT define functions inside the quoted expressions
  below.
  """

  def model do
    quote do
      use Ecto.Schema

      import Ecto
      import Ecto.Changeset
      import Ecto.Query
    end
  end

  def controller do
    quote do
      use Phoenix.Controller, namespace: RemoteRetroWeb

      alias RemoteRetro.Repo
      import Ecto
      import Ecto.Query

      alias RemoteRetroWeb.Router.Helpers, as: Routes
      alias RemoteRetroWeb.Gettext
    end
  end

  def view do
    quote do
      use Phoenix.Template, root: "lib/remote_retro_web/templates", namespace: RemoteRetroWeb

      # Import convenience functions from controllers
      import Phoenix.Controller, only: [get_csrf_token: 0, get_flash: 2, view_module: 1]

      # Use all HTML functionality (forms, tags, etc)
      use Phoenix.HTML

      alias RemoteRetroWeb.Router.Helpers, as: Routes
      import RemoteRetroWeb.ErrorHelpers
      import RemoteRetroWeb.Gettext
    end
  end

  def router do
    quote do
      use Phoenix.Router
    end
  end

  def channel do
    quote do
      use Phoenix.Channel

      alias RemoteRetro.Repo
      import Ecto
      import Ecto.Query
      alias RemoteRetroWeb.Gettext
    end
  end

  @doc """
  When used, dispatch to the appropriate controller/view/etc.
  """
  defmacro __using__(which) when is_atom(which) do
    apply(__MODULE__, which, [])
  end
end
