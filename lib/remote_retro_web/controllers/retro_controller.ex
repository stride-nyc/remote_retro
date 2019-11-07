defmodule RemoteRetroWeb.RetroController do
  use RemoteRetroWeb, :controller
  alias RemoteRetro.{Retro, Participation, Idea, User}
  alias Phoenix.Token

  def index(conn, _params) do
    current_user_id = get_session(conn, "current_user_id")
    current_user = Repo.get!(User, current_user_id)

    render(conn, "index.html", %{
      current_user: current_user,
      retros: recent_retros_with_action_items_preloaded(current_user),
    })
  end

  def show(conn, params) do
    current_user_id = get_session(conn, "current_user_id")
    current_user = Repo.get!(User, current_user_id)

    soft_insert_participation_record!(current_user.id, params["id"])

    render(conn, "show.html", %{
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
