module Task
  module Commands
    class CreateSubtask < BaseCommand
      def initialize(user, params)
        @user = user
        @params = params
      end

      def call
        task = ::Task::Task.find_by(id: @params[:task_id])
        return Result.failure('Task not found', status: :not_found) unless task

        # Verify access via project workspace
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        subtask = Task::Subtask.new(@params)

        # Set default position
        last_position = Task::Subtask.where(task_id: task.id).maximum(:position) || 0
        subtask.position = last_position + 1000

        if subtask.save
          Result.success(subtask, status: :created)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: subtask.errors.as_json)
        end
      rescue ActiveRecord::RecordInvalid => e
        Result.failure('Failed to create subtask', status: :unprocessable_entity, details: e.message)
      end
    end
  end
end
