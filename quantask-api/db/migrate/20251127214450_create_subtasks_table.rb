class CreateSubtasksTable < ActiveRecord::Migration[8.0]
  def change
    create_table :subtasks do |t|
      t.string :title, null: false
      t.boolean :is_completed, default: false, null: false
      t.integer :position, default: 0
      
      t.references :task, null: false, foreign_key: true

      t.timestamps
    end
    
    add_index :subtasks, [:task_id, :position]
  end
end
