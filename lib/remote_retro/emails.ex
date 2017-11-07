defmodule RemoteRetro.Emails do
  import Bamboo.Email, except: [from: 2]
  import Ecto.Query
  alias RemoteRetro.Repo
  alias RemoteRetro.User

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
      html_body: html_retro_action_items(action_items)
    )
  end

  defp text_retro_action_items(action_items) do
    action_items
    |> Enum.join("\n")
  end

  defp html_retro_action_items(action_items) do
    """
    <div>
      <p>Greetings!</p>
      <p>Please find the action items from your retrospective below:</p>
      #{html_action_item_list(action_items)}
      <p>Thanks!</p>
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
    q = from i in RemoteRetro.Idea, where: [category: "action-item", retro_id: ^retro_id]
    q
    |> Repo.all
    |> Enum.map(&(&1.body))
  end
end
