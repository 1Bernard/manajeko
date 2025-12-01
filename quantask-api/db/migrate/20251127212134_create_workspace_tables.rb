class CreateWorkspaceTables < ActiveRecord::Migration[8.0]
  def change
    create_table :workspaces do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.text :description
      t.string :logo_url
      t.references :owner, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
    add_index :workspaces, :slug, unique: true

    create_table :workspace_members do |t|
      t.references :workspace, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role, default: 'member', null: false # owner, admin, member, viewer

      t.timestamps
    end
    add_index :workspace_members, [:workspace_id, :user_id], unique: true
  end
end
