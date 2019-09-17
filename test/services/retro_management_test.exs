defmodule RemoteRetro.RetroManagementTest do
  use RemoteRetro.UserRetroCase, async: false
  use Bamboo.Test, shared: true

  alias RemoteRetro.{Repo, Retro, User, Idea, Group, Emails, TestHelpers}
  alias RemoteRetroWeb.RetroManagement

  import ShorterMaps
  import TestHelpers


  describe "update!/2" do
    test "updates the retro with the given id with the given params", ~M{retro} do
      assert retro.stage == "idea-generation"

      %{retro: retro} = RetroManagement.update!(retro.id, %{stage: "voting"})

      assert %Retro{stage: "voting"} = retro
    end
  end

  describe "update!/2 when closing the retro" do
    test "closing the retro results in action items email being sent", ~M{retro} do
      RetroManagement.update!(retro.id, %{"stage" => "closed"})
      emails = Emails.action_items_email(retro.id)
      assert_delivered_email(emails)
    end

    test "increments the completed retro count of participants in a retro advancing to closed",
         ~M{facilitator, non_facilitator, retro} do
      [original_count_one, original_count_two] = [
        facilitator.completed_retros_count,
        non_facilitator.completed_retros_count
      ]

      RetroManagement.update!(retro.id, %{"stage" => "closed"})

      %{completed_retros_count: updated_count_one} = Repo.get!(User, facilitator.id)
      %{completed_retros_count: updated_count_two} = Repo.get!(User, non_facilitator.id)

      assert [updated_count_one, updated_count_two] == [original_count_one + 1, original_count_two + 1]
    end

    test "not updating the completed retro counts of users *not* in the closed retro", ~M{retro} do
      just_another_guy = persist_test_user()

      assert just_another_guy.completed_retros_count == 0

      RetroManagement.update!(retro.id, %{"stage" => "closed"})

      just_another_guy = Repo.get!(User, just_another_guy.id)
      assert just_another_guy.completed_retros_count == 0
    end
  end

  describe "update!/2 when *not* closing the retro" do
    test "emails aren't sent out", ~M{retro} do
      RetroManagement.update!(retro.id, %{"stage" => "voting"})
      assert_no_emails_delivered()
    end

    test "not updating the completed retro counts of participants", ~M{facilitator, non_facilitator, retro} do
      assert [original_count_one, original_count_two] = [
               facilitator.completed_retros_count,
               non_facilitator.completed_retros_count
             ]

      RetroManagement.update!(retro.id, %{"stage" => "voting"})

      facilitator = Repo.get!(User, facilitator.id)
      non_facilitator = Repo.get!(User, non_facilitator.id)

      assert [original_count_one, original_count_two] == [
               facilitator.completed_retros_count,
               non_facilitator.completed_retros_count
             ]
    end
  end

  @ideas [
    %Idea{category: "sad", body: "splinters in the codebase"},
    %Idea{category: "sad", body: "death by moonlight"},
  ]

  describe "update!/2 when passing ideas with ephemeral grouping ids" do
    setup [:persist_ideas_for_retro]

    @tag [
      ideas: @ideas,
    ]

    test "the persistence of idea groups for each *unique* ephemeral grouping id", ~M{retro, ideas} do
      [idea_one, idea_two] = ideas

      ideas_with_ephemeral_grouping_ids = [%{
        "id" => idea_one.id,
        "ephemeralGroupingId" => idea_one.id,
      }, %{
        "id" => idea_two.id,
        "ephemeralGroupingId" => idea_one.id,
      }]

      RetroManagement.update!(retro.id, %{
        "stage" => "voting",
        "ideasWithEphemeralGroupingIds" => ideas_with_ephemeral_grouping_ids,
      })

      assert Repo.aggregate(Group, :count, :id) == 1
    end

    @tag [
      ideas: @ideas,
    ]

    test "persistence of a unique group for any ideas *lacking* an ephemeral id", ~M{retro, ideas} do
      [idea_one | _tail] = ideas

      ideas_lacking_ephemeral_grouping_ids = [%{
        "id" => idea_one.id,
      }]

      RetroManagement.update!(retro.id, %{
        "stage" => "voting",
        "ideasWithEphemeralGroupingIds" => ideas_lacking_ephemeral_grouping_ids,
      })

      assert Repo.aggregate(Group, :count, :id) == 1
    end

    @tag [
      ideas: @ideas,
    ]

    test "updates the idea records so that each knows its group", ~M{retro, ideas} do
      [idea_one | _tail] = ideas
      ideas_with_ephemeral_grouping_ids = [%{
        "id" => idea_one.id,
        "ephemeralGroupingId" => idea_one.id,
      }]

      %{groups: [persisted_group], ideas: [updated_idea]} = RetroManagement.update!(retro.id, %{
        "stage" => "voting",
        "ideasWithEphemeralGroupingIds" => ideas_with_ephemeral_grouping_ids,
      })

      assert persisted_group.id == updated_idea.group_id
    end

    @tag [
      ideas: @ideas,
    ]

    test "updates the idea records with the given coordinates, casting integers to floats", ~M{retro, ideas} do
      [idea_one | _tail] = ideas
      ideas_with_ephemeral_grouping_ids = [%{
        "id" => idea_one.id,
        "ephemeralGroupingId" => idea_one.id,
        "x" => 54,
        "y" => 104.98,
      }]

      %{ideas: [updated_idea]} = RetroManagement.update!(retro.id, %{
        "stage" => "voting",
        "ideasWithEphemeralGroupingIds" => ideas_with_ephemeral_grouping_ids,
      })

      assert %{x: 54.0, y: 104.98} = updated_idea
    end

    @tag [
      ideas: @ideas,
    ]
    test "updates the retro record's attributes", ~M{retro, ideas} do
      [idea_one | _tail] = ideas
      ideas_with_ephemeral_grouping_ids = [%{
        "id" => idea_one.id,
        "ephemeralGroupingId" => idea_one.id,
      }]

      RetroManagement.update!(retro.id, %{
        "stage" => "voting",
        "ideasWithEphemeralGroupingIds" => ideas_with_ephemeral_grouping_ids,
      })

      retro = Repo.get!(Retro, retro.id)

      assert retro.stage == "voting"
    end
  end
end
