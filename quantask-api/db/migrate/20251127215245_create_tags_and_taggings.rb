class CreateTagsAndTaggings < ActiveRecord::Migration[8.0]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.string :color, null: false, default: '#6366f1' # Default indigo-500
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end

    create_table :taggings do |t|
      t.references :task, null: false, foreign_key: true
      t.references :tag, null: false, foreign_key: true

      t.timestamps
    end

    add_index :tags, [:project_id, :name], unique: true
    add_index :taggings, [:task_id, :tag_id], unique: true
  end
end
