defmodule RemoteRetro.Emails do
  import Bamboo.Email, except: [from: 2]
  import Ecto.Query
  alias RemoteRetro.Repo

  def action_items_email(retro_id) do
    action_items = retro_action_items(retro_id)

    new_email(
      to: "vanderhoop@me.com",
      from: "do-not-reply@remote_retro.dev",
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
    action_items
    |> Enum.join("<br/>")
  end

  defp retro_action_items(retro_id) do
    q = from i in RemoteRetro.Idea, where: [category: "action-item", retro_id: ^retro_id]
    q
    |> Repo.all
    |> Enum.map(&(&1.body))
  end
end
