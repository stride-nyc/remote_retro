defmodule FirstTimeUserExperienceTest do
  use RemoteRetro.IntegrationCase, async: false
  alias RemoteRetro.{Participation}

  describe "a user with no prior retro experience" do
    setup [:remove_any_prior_participations_in_retros]

    test "is welcomed as a new user who can create a retrospective", %{session: session} do
      visit(session, "/retros")

      assert_has(session, Query.css("body", text: "Welcome, Test!"))
      assert_user_can_create_their_first_retrospective(session)
    end
  end

  defp remove_any_prior_participations_in_retros(%{facilitator: user} = context) do
    user_id = user.id
    from(p in Participation, where: p.user_id == ^user_id) |> Repo.delete_all

    context
  end

  defp assert_user_can_create_their_first_retrospective(session) do
    # Initial delay to ensure page is fully loaded
    Process.sleep(4000)

    # Maximize window
    session
    |> maximize_window()
    |> assert_has(Query.css(".ui.modal.visible.active", count: 1))
    |> find(Query.css(".ui.modal.visible.active"))
    # Scroll to bottom of page
    |> execute_script("""
      window.scrollTo(0, document.body.scrollHeight);
      document.documentElement.scrollTop = document.documentElement.scrollHeight;
    """)
    # Add a delay after scrolling
    |> (fn(session) -> Process.sleep(2000); session end).()
    |> click(Query.button("Let's Create Your First Retrospective!", class: "ui blue right labeled fluid icon button"))

    # Add delay to allow for page transition
    Process.sleep(4000)

    # Wait for URL to change (indicating redirect)
    assert session
           |> current_path() =~ ~r/^\/retros\/[\w-]+$/

    # Wait for share modal
    session
    |> assert_has(Query.css(".ui.modal.visible.active", count: 1))
    |> find(Query.css(".ui.modal.visible.active"))
    |> assert_has(Query.css(".ui.center.aligned.header", text: "Share the retro link below with teammates!"))
  end
end
