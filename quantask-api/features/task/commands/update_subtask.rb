module Task
  module Commands
    class UpdateSubtask < BaseCommand
      def initialize(user, id, params)
        @user = user
        @id = id
        @params = params
      end

      def call
        subtask = Task::Subtask.find_by(id: @id)
        return Result.failure('Subtask not found', status: :not_found) unless subtask

        # Verify access
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: subtask.task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        if subtask.update(@params)
          Result.success(subtask, status: :ok)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: subtask.errors.as_json)
        end
      end
    end
  end
end
