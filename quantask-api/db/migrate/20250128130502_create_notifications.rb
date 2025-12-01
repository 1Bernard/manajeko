# frozen_string_literal: true

class CreateNotifications < ActiveRecord::Migration[7.0]
  def change
    create_table :notifications do |t|
      t.references :user, null: false, foreign_key: true
      t.string :notifiable_type
      t.bigint :notifiable_id
      t.string :notification_type, null: false
      t.boolean :read, default: false
      t.text :content
      
      t.timestamps
    end

    add_index :notifications, [:notifiable_type, :notifiable_id]
    add_index :notifications, :notification_type
    add_index :notifications, :read
    add_index :notifications, :created_at
  end
end
