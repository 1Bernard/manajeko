# frozen_string_literal: true

class AddFieldsToExistingModels < ActiveRecord::Migration[7.0]
  def change
    # Add user preferences
    add_column :users, :preferences, :jsonb, default: {} unless column_exists?(:users, :preferences)
    add_column :users, :avatar_url, :string unless column_exists?(:users, :avatar_url)
    add_column :users, :job_title, :string unless column_exists?(:users, :job_title)
    
    # Add project banner fields
    add_column :projects, :banner_image_url, :string unless column_exists?(:projects, :banner_image_url)
    add_column :projects, :banner_gradient, :string unless column_exists?(:projects, :banner_gradient)
    add_column :projects, :icon, :string unless column_exists?(:projects, :icon)
    add_column :projects, :color_scheme, :string unless column_exists?(:projects, :color_scheme)
    add_column :projects, :last_updated_at, :datetime unless column_exists?(:projects, :last_updated_at)
    
    # Add task position for Kanban ordering
    add_column :tasks, :position, :integer, default: 0 unless column_exists?(:tasks, :position)
    
    # Add subtask notes
    add_column :subtasks, :blocker_note, :text unless column_exists?(:subtasks, :blocker_note)
    add_column :subtasks, :note, :text unless column_exists?(:subtasks, :note)
    
    # Add indexes
    add_index :users, :preferences, using: :gin unless index_exists?(:users, :preferences)
    add_index :tasks, :position unless index_exists?(:tasks, :position)
  end
end
