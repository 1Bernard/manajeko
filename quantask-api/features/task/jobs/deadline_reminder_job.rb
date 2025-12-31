module Task
  module Jobs
    class DeadlineReminderJob < ApplicationJob
      queue_as :default

      def perform
        reminders_sent = ::Task::Services::DeadlineReminderService.process_reminders
        Rails.logger.info "DeadlineReminderJob: Sent reminders for #{reminders_sent} tasks."
      end
    end
  end
end
