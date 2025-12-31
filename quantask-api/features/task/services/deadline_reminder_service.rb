module Task
  module Services
    class DeadlineReminderService
      def self.process_reminders
        # Find tasks due in the next 24 hours that haven't been reminded yet
        tasks_to_remind = ::Task::Task
          .where('due_date BETWEEN ? AND ?', Time.current, 24.hours.from_now)
          .where(reminder_sent_at: nil)
          .where.not(status: 'completed')

        tasks = tasks_to_remind.to_a
        tasks.each do |task|
          send_reminders_for_task(task)
          task.update!(reminder_sent_at: Time.current)
        end

        tasks.size
      end

      private

      def self.send_reminders_for_task(task)
        task.assignees.each do |user|
          Communication::Services::NotificationService.create_notification(
            user: user,
            type: 'task_deadline',
            content: "Task '#{task.title}' is due within 24 hours!",
            notifiable: task
          )
        end
      end
    end
  end
end
