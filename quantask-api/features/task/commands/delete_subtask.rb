module Task
  module Commands
    class DeleteSubtask < BaseCommand
      def initialize(user, id)
        @user = user
        @id = id
      end

      def call
        subtask = Task::Subtask.find_by(id: @id)
        return Result.failure('Subtask not found', status: :not_found) unless subtask

        # Verify access
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: subtask.task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        subtask.destroy
        Result.success(nil, status: :no_content)
      end
    end
  end
end
