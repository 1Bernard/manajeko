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

        # Handle assignees if present
        if @params.key?(:assignee_ids)
          task.assignee_ids = @params[:assignee_ids]
        elsif @params.key?(:assignee_id)
          task.assignee_ids = [@params[:assignee_id]] if @params[:assignee_id].present?
          task.assignee_ids = [] if @params[:assignee_id].nil?
        end

        if task.update(@params.except(:assignee_id, :assignee_ids))
          Result.success(task)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: task.errors.as_json)
        end
      rescue ActiveRecord::RecordInvalid => e
        Result.failure('Failed to update task', status: :unprocessable_entity, details: e.message)
      end
    end
  end
end
