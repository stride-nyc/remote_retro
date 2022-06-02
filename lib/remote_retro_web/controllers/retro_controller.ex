defmodule RemoteRetroWeb.RetroController do
  use RemoteRetroWeb, :controller
  alias RemoteRetro.{Retro, Participation, Idea}
  alias RemoteRetroWeb.ErrorView
  alias Phoenix.Token

  plug :verify_retro_id_param_is_uuid when action in [:show]
  plug RemoteRetroWeb.Plugs.SetCurrentUserOnAssignsIfAuthenticated

  def index(conn, _params) do
    %{current_user: current_user} = conn.assigns

    render(conn, "index.html", %{
      current_user: current_user,
      retros: recent_retros_with_action_items_preloaded(current_user),
      title: "Dashboard | RemoteRetro.org",
    })
  end

  def show(conn, params) do
    %{current_user: current_user} = conn.assigns

    soft_insert_participation_record!(current_user.id, params["id"])

    render(conn, "show.html", %{
      body_class: "retro-show-page",
      user_token: Token.sign(conn, "user", current_user),
      retro_uuid: params["id"],
      include_js: true,
    })
  end

  def create(conn, params) do
    current_user_id = get_session(conn, "current_user_id")

    {:ok, retro} =
      %Retro{facilitator_id: current_user_id, format: params["format"]}
      |> Retro.changeset()
      |> Repo.insert()

    redirect(conn, to: "/retros/" <> retro.id)
  end

  def verify_retro_id_param_is_uuid(conn, _options) do
    %{"id" => id } = conn.path_params

    case Ecto.UUID.cast(id) do
      {:ok, _} ->
        conn
      _ ->
        conn
        |> put_status(:not_found)
        |> put_view(ErrorView)
        |> put_layout(false)
        |> render("404.html", [
          message: "There's no retro here. Make sure you have the correct URL!",
        ])
        |> halt()
    end
  end

  defp soft_insert_participation_record!(current_user_id, retro_id) do
    %Participation{user_id: current_user_id, retro_id: retro_id}
    |> Participation.changeset()
    |> Repo.insert!(on_conflict: :nothing)
  end

  defp recent_retros_with_action_items_preloaded(current_user) do
    action_items_with_assignee =
      from(
        ai in Idea.action_items(),
        preload: [:assignee],
        order_by: [asc: ai.inserted_at]
      )

    query =
      from(
        r in assoc(current_user, :retros),
        limit: 10,
        preload: [ideas: ^action_items_with_assignee],
        order_by: [desc: r.inserted_at]
      )

    Repo.all(query)
  end
end
