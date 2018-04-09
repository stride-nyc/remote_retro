defmodule RemoteRetro.Emails do
  import Bamboo.Email, except: [from: 2]
  import Ecto.Query
  alias RemoteRetro.{Repo, User}
  alias RemoteRetroWeb.IdeaView

  def action_items_email(retro_id) do
    action_items = retro_action_items(retro_id)

    participant_emails = Repo.all(
      from u in User,
      distinct: u.email,
      join: p in assoc(u, :participations),
      where: p.retro_id == ^retro_id,
      select: u.email
    )

    new_email(
      to: participant_emails,
      from: {"RemoteRetro", "do-not-reply@remoteretro.org"},
      subject: "Action items from Retro",
      text_body: text_retro_action_items(action_items),
      html_body: html_retro_action_items(action_items, retro_id)
    )
  end

  defp text_retro_action_items(action_items) do
    action_items
    |> Enum.join("\n")
  end

  defp html_retro_action_items(action_items, retro_id) do
    retro_link = "https://remoteretro.org/retros/#{retro_id}"

    """
    <div>
      <p>Greetings!</p>
      <p>Please find the action items from your retrospective below:</p>
      #{html_action_item_list(action_items)}

      <p><strong>Note: </strong>If you'd like to review the retro in its entirety, you can always revisit the retro board at its <a href="#{retro_link}">unique link</a>.</p>
      <hr>
      <p><small>RemoteRetro is open source software. If you enjoy using it, please take a moment to star the repo at <a href="https://github.com/stride-nyc/remote_retro">https://github.com/stride-nyc/remote_retro</a></small></p>
    </div>
    """
  end

  defp html_action_item_list(action_items) do
    item_tags = action_items
    |> Enum.map(fn item -> "<li>#{item}</li>" end)
    "<ul>#{item_tags}</ul>"
  end

  defp retro_action_items(retro_id) do
    action_items = Repo.all from i in RemoteRetro.Idea,
      join: a in assoc(i, :assignee),
      where: [category: "action-item", retro_id: ^retro_id],
      preload: [assignee: a]

    action_items
    |> Enum.map(&IdeaView.action_item_to_string/1)
  end
end
