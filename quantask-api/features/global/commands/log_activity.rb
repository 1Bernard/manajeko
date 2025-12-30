module Global
  module Commands
    class LogActivity < BaseCommand
      def initialize(user:, action_type:, resource:, details: {})
        @user = user
        @action_type = action_type
        @resource = resource
        @details = details
      end

      def call
        # Map resource to polymorphic or specific fields if needed
        # Currently Activity model has: task_id, user_id, action_type, details
        # It seems tied to Task. We should probably make it polymorphic later, 
        # but for now, verify if we can only log Task activities.
        
        # Checking schema: create_table "activities" ... t.bigint "task_id", null: false
        # So it's hardcoded to task_id.
        
        if @resource.is_a?(Task::Task)
          activity = Task::Activity.create!(
            user: @user,
            task: @resource,
            action_type: @action_type,
            details: @details
          )
          Result.success(activity)
        else
          # Fallback or error if resource is not a task (until we make it polymorphic)
          Result.failure("LogActivity currently only supports Task resources")
        end
      rescue ActiveRecord::RecordInvalid => e
        Result.failure("Failed to log activity: #{e.message}")
      end
    end
  end
end
