class AddTaskTypeAndAssignments < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :task_type, :string, default: 'task'
    add_index :tasks, :task_type

    create_table :task_assignments do |t|
      t.references :task, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :role, default: 'assignee'
      t.timestamps
    end

    add_index :task_assignments, [:task_id, :user_id], unique: true
  end
end
