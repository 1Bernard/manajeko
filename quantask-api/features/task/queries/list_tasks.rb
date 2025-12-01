module Task
  module Queries
    class ListTasks < BaseQuery
      def initialize(user, project_id, filters = {})
        @user = user
        @project_id = project_id
        @filters = filters
      end

      def call
        # Verify access
        project = Project::Project.find_by(id: @project_id)
        return [] unless project

        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: project.workspace_id)
        return [] unless member

        tasks = ::Task::Task.where(project_id: @project_id).ordered

        # Apply filters
        tasks = tasks.by_status(@filters[:status]) if @filters[:status].present?
        tasks = tasks.by_assignee(@filters[:assignee_id]) if @filters[:assignee_id].present?

        tasks
      end
    end
  end
end
