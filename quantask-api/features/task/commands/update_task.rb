module Task
  module Commands
    class UpdateTask < BaseCommand
      def initialize(user, task_id, params)
        @user = user
        @task_id = task_id
        @params = params
      end

      def call
        task = ::Task::Task.find_by(id: @task_id)
        return Result.failure('Task not found', status: :not_found) unless task

        # Check authorization (creator or project member)
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        # Capture old assignees BEFORE any changes
        old_assignee_ids = task.assignee_ids.to_a

        # Handle assignees if present
        if @params.key?(:assignee_ids)
          task.assignee_ids = @params[:assignee_ids]
        elsif @params.key?(:assignee_id)
          task.assignee_ids = [@params[:assignee_id]] if @params[:assignee_id].present?
          task.assignee_ids = [] if @params[:assignee_id].nil?
        end

        # Deduplicate tag_ids if present
        if @params.key?(:tag_ids)
          @params[:tag_ids] = @params[:tag_ids].map(&:to_i).uniq
        end



        if task.update(@params.except(:assignee_id, :assignee_ids))
           # Detect and notify new assignees
           new_assignee_ids = task.assignee_ids - old_assignee_ids
           new_assignee_ids.each do |user_id|
             user = ::Identity::User.find(user_id)
             Communication::Services::NotificationService.create_notification(
               user: user,
               type: 'task_assigned',
               content: "You were assigned to task: #{task.title}",
               notifiable: task
             )
           end
           
           # Log Activity
           if task.saved_change_to_status?
             ::Task::Services::ActivityService.create_activity(@user, task.id, 'status_changed', { from: task.status_before_last_save, to: task.status })
           else
             ::Task::Services::ActivityService.create_activity(@user, task.id, 'updated')
           end

          Result.success(task)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: task.errors.as_json)
        end
      rescue ActiveRecord::RecordNotUnique
        retry
      rescue ActiveRecord::RecordInvalid => e
        Result.failure('Failed to update task', status: :unprocessable_entity, details: e.message)
      end
    end
  end
end
