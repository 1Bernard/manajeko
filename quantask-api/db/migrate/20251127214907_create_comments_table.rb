class CreateCommentsTable < ActiveRecord::Migration[8.0]
  def change
    create_table :comments do |t|
      t.text :content, null: false
      
      t.references :task, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
