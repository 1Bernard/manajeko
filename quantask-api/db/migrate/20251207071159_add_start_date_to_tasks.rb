class AddStartDateToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :start_date, :datetime
  end
end
