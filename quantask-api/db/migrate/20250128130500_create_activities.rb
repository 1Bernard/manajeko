# frozen_string_literal: true

class CreateActivities < ActiveRecord::Migration[7.0]
  def change
    create_table :activities do |t|
      t.references :task, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string :action_type, null: false
      t.jsonb :details, default: {}
      
      t.timestamps
    end

    add_index :activities, :action_type
    add_index :activities, :created_at
  end
end
