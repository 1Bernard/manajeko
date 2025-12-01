module Task
  module Commands
    class RemoveTagFromTask < BaseCommand
      def initialize(user, task_id, tag_id)
        @user = user
        @task_id = task_id
        @tag_id = tag_id
      end

      def call
        task = ::Task::Task.find_by(id: @task_id)
        return Result.failure('Task not found', status: :not_found) unless task

        # Verify access via project workspace
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        tagging = Task::Tagging.find_by(task_id: @task_id, tag_id: @tag_id)
        return Result.failure('Tag not found on task', status: :not_found) unless tagging

        tagging.destroy
        Result.success(nil, status: :no_content)
      end
    end
  end
end
