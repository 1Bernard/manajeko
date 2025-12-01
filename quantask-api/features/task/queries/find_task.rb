module Task
  module Queries
    class FindTask < BaseQuery
      def initialize(user, task_id)
        @user = user
        @task_id = task_id
      end

      def call
        task = ::Task::Task.find_by(id: @task_id)
        return nil unless task

        # Verify access (project member)
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: task.project.workspace_id)
        return nil unless member

        task
      end
    end
  end
end
