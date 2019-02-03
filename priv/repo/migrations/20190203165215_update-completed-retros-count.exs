defmodule :"Elixir.RemoteRetro.Repo.Migrations.Update-completed-retros-count" do
  use Ecto.Migration

  def up do
    execute """
      UPDATE users
      SET completed_retros_count = user_id_completed_retro_count.completed_retros_count
      FROM users u
      INNER JOIN (
        SELECT p.user_id,
               count(p.*) AS completed_retros_count
        FROM participations p
        INNER JOIN retros r ON r.id = p.retro_id
        WHERE r.stage = 'closed'
        GROUP BY p.user_id
      ) AS user_id_completed_retro_count
      ON user_id_completed_retro_count.user_id = u.id
      WHERE users.id = user_id_completed_retro_count.user_id;
    """
  end

  def down do
    execute "UPDATE users SET completed_retros_count = 0;"
  end
end
