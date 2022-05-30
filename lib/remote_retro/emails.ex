defmodule RemoteRetro.Emails do
  import Bamboo.Email, except: [from: 2]
  alias RemoteRetro.{Repo, Retro}
  alias RemoteRetroWeb.IdeaView

  def welcome_email(user) do
    new_email(
      to: [user.email],
      from: {"RemoteRetro.org", "do-not-reply@remoteretro.org"},
      subject: "#{user.given_name}! Welcome to RemoteRetro!",
      text_body: text_welcome_email_body(user),
      html_body: html_welcome_email_body(user)
    )
  end

  defp text_welcome_email_body(user) do
    """
    #{user.given_name}!\n\n
    We're thrilled that you've chosen RemoteRetro.org to aid your team on a path of continuous improvement. You can now visit your user dashboard at https://remoteretro.org/retros, and we encourage you to forward this email to your team(s) with encouragement to check us out!\n\n
    Looking forward,\n
    The RemoteRetro Team\n
    """
  end

  def action_items_email(retro_id) do
    retro =
      Repo.get!(Retro, retro_id)
      |> Repo.preload([:users, [action_items: :assignee]])

    participant_emails = Enum.map(retro.users, &Map.get(&1, :email))
    action_items = format_retro_action_items(retro)

    new_email(
      to: participant_emails,
      from: {"RemoteRetro.org", "do-not-reply@remoteretro.org"},
      subject: "Action items from Retro",
      text_body: text_retro_action_items(action_items),
      html_body: html_retro_action_items(action_items, retro_id)
    )
  end

  defp html_welcome_email_body(user) do
    """
    <div>
      <p>#{user.given_name}!</p>
      <p>We're thrilled that you've chosen <a href="https://remoteretro.org">RemoteRetro.org</a> to aid your team on a path of continuous improvement. You can now visit your user dashboard at https://remoteretro.org/retros, and we encourage you to forward this email to your team(s) with encouragement to check us out!</p>

      <p>
        Looking forward,<br>
        The RemoteRetro Team
      </p>
    </div>
    """
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

      <p><strong>Note: </strong>If you'd like to review the retro in its entirety, you can always revisit the retro board at its <a href="#{
      retro_link
    }">unique link</a>.</p>
      <hr>
      <p><small>RemoteRetro is open source software, sponsored and maintained by <a href="https://stridenyc.com">Stride Consulting</a>. If you enjoy using it, please take a moment to star the repo at <a href="https://github.com/stride-nyc/remote_retro">https://github.com/stride-nyc/remote_retro</a></small></p>
    </div>
    """
  end

  defp html_action_item_list(action_items) do
    item_tags =
      action_items
      |> Enum.map(fn item -> "<li>#{item}</li>" end)

    "<ul>#{item_tags}</ul>"
  end

  defp format_retro_action_items(retro) do
    retro.action_items
    |> Enum.map(&IdeaView.action_item_to_string/1)
  end
end
