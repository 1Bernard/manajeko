module Task
  module Services
    class ActivityService
      # Create a new activity log
      # @param user [Identity::User] The user performing the action
      # @param task_id [Integer] The ID of the task
      # @param action_type [String] The type of action (e.g., 'created', 'updated', 'commented')
      # @param details [Hash] Additional details about the action
      def self.create_activity(user, task_id, action_type, details = {})
        ::Task::Activity.create(
          user: user,
          task_id: task_id,
          action_type: action_type,
          details: details
        )
      rescue => e
        Rails.logger.error("Failed to create activity: #{e.message}")
        nil
      end

      # Retrieve activities for a task
      def self.list_for_task(task_id)
        ::Task::Activity.where(task_id: task_id).includes(:user).recent
      end
    end
  end
end
