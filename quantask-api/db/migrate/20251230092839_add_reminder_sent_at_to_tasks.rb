class AddReminderSentAtToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :reminder_sent_at, :datetime
  end
end
