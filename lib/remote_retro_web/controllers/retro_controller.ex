defmodule RemoteRetroWeb.RetroController do
  use RemoteRetroWeb, :controller
  alias RemoteRetro.{Retro, Participation, Idea}
  alias RemoteRetroWeb.ErrorView
  alias Phoenix.Token

  plug :verify_retro_id_param_is_uuid when action in [:show]
  plug RemoteRetroWeb.Plugs.SetCurrentUserOnAssignsIfAuthenticated when action in [:show]

  def index(conn, _params) do
    current_user_id = get_session(conn, "current_user_id")
    current_user_given_name = get_session(conn, "current_user_given_name")

    render(conn, "index.html", %{
      current_user_given_name: current_user_given_name,
      retros: recent_retros_with_action_items_preloaded(current_user_id),
      title: "Dashboard | RemoteRetro.org",
    })
  end

  def show(conn, params) do
    %{current_user: current_user} = conn.assigns

    # TODO: async retrieve the user record and assign the participation, as we already have the current user's id on the session
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

  defp recent_retros_with_action_items_preloaded(current_user_id) do
    action_items_with_assignee =
      from(
        ai in Idea.action_items(),
        preload: [:assignee],
        order_by: [asc: ai.inserted_at]
      )

    subset = from(p in Participation,
      where: p.user_id == ^current_user_id,
      order_by: [desc: p.inserted_at],
      limit: 10
    )

    query =
      from(
        r in Retro,
        join: p in subquery(subset),
        on: p.retro_id == r.id,
        preload: [ideas: ^action_items_with_assignee]
      )

    Repo.all(query)
  end
end
