module Task
  module Commands
    class DeleteTask < BaseCommand
      def initialize(user, task_id)
        @user = user
        @task_id = task_id
      end

      def call
        task = ::Task::Task.find_by(id: @task_id)
        return Result.failure('Task not found', status: :not_found) unless task

        # Check authorization (creator or project owner)
        is_creator = task.creator_id == @user.id
        is_project_owner = task.project.owner_id == @user.id
        
        unless is_creator || is_project_owner
          return Result.failure('Unauthorized', status: :forbidden)
        end

        task.destroy
        Result.success(nil)
      end
    end
  end
end
