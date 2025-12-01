class CreateTasksTable < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :title, null: false
      t.text :description
      t.string :status, default: 'todo', null: false # todo, in_progress, review, done
      t.string :priority, default: 'medium', null: false # low, medium, high, urgent
      t.datetime :due_date
      t.integer :position, default: 0 # for kanban ordering
      
      t.references :project, null: false, foreign_key: true
      t.references :creator, null: false, foreign_key: { to_table: :users }
      t.references :assignee, foreign_key: { to_table: :users }

      t.timestamps
    end
    
    add_index :tasks, [:project_id, :status]
    add_index :tasks, [:project_id, :position]
  end
end
