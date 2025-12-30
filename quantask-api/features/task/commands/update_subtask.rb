module Task
  module Commands
    class UpdateSubtask < BaseCommand
      def initialize(user, id, params)
        @user = user
        @id = id
        @params = params
      end

      def call
        subtask = ::Task::Subtask.find_by(id: @id)
        return Result.failure('Subtask not found', status: :not_found) unless subtask

        # Verify access
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: subtask.task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        previous_completion = subtask.is_completed
        if subtask.update(@params)
          if subtask.is_completed && !previous_completion
             ::Task::Services::ActivityService.create_activity(@user, subtask.task_id, 'subtask_completed', { title: subtask.title })
          end
          Result.success(subtask, status: :ok)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: subtask.errors.as_json)
        end
      end
    end
  end
end
