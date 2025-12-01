class CreateProjectsTable < ActiveRecord::Migration[8.0]
  def change
    create_table :projects do |t|
      t.string :name, null: false
      t.text :description
      t.string :status, default: 'active', null: false # active, archived, completed
      t.string :visibility, default: 'private', null: false # private, public (within workspace)
      t.string :color
      t.string :icon
      t.references :workspace, null: false, foreign_key: true
      t.references :owner, null: false, foreign_key: { to_table: :users }

      t.timestamps
    end
    add_index :projects, [:workspace_id, :name], unique: true
  end
end
