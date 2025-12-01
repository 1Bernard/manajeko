module Task
  module Commands
    class MoveTask < BaseCommand
      def initialize(user, task_id, status, position)
        @user = user
        @task_id = task_id
        @status = status
        @position = position
      end

      def call
        task = ::Task::Task.find_by(id: @task_id)
        return Result.failure('Task not found', status: :not_found) unless task

        # Check authorization
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        task.status = @status if @status.present?
        task.position = @position if @position.present?

        if task.save
          Result.success(task)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: task.errors.as_json)
        end
      end
    end
  end
end
