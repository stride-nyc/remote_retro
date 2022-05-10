defmodule RemoteRetroWeb.PageController do
  use RemoteRetroWeb, :controller

  def index(conn, _params) do
    current_user_id = get_session(conn, :current_user_id)

    case current_user_id do
      nil ->
        render(conn, "index.html", %{
          body_class: "landing-page",
          omit_header: true,
        })
      _user ->
        redirect(conn, to: "/retros")
    end
  end

  def faq(conn, _params) do
    render(conn, "faq.html", %{
      body_class: "copy-page",
      title: "Frequently Asked Questions | RemoteRetro.org",
      description: "Answers to Frequently Asked Questions",
    })
  end

  def privacy(conn, _params) do
    render(conn, "privacy.html", %{
      body_class: "copy-page",
      title: "Privacy Policy | RemoteRetro.org",
      description: "Information on how and what data RemoteRetro captures, how to make GDPR 'request-to-be-forgotten' requests, and more",
    })
  end
end
