module Task
  module Queries
    class SearchTasks < BaseQuery
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

        tasks = ::Task::Task.where(project_id: @project_id)

        # Text search
        if @filters[:q].present?
          query = "%#{@filters[:q]}%"
          tasks = tasks.where("title ILIKE ? OR description ILIKE ?", query, query)
        end

        # Status filter
        tasks = tasks.by_status(@filters[:status]) if @filters[:status].present?

        # Priority filter
        tasks = tasks.where(priority: @filters[:priority]) if @filters[:priority].present?

        # Task type filter
        tasks = tasks.where(task_type: @filters[:task_type]) if @filters[:task_type].present?

        # Assignee filter
        if @filters[:assignee_id].present?
          tasks = tasks.joins(:task_assignments)
                      .where(task_assignments: { user_id: @filters[:assignee_id] })
        end

        # Due date range filter
        if @filters[:due_date_from].present?
          tasks = tasks.where("due_date >= ?", @filters[:due_date_from])
        end

        if @filters[:due_date_to].present?
          tasks = tasks.where("due_date <= ?", @filters[:due_date_to])
        end

        # Sorting
        case @filters[:sort_by]
        when 'due_date'
          tasks = tasks.order(due_date: :asc, created_at: :desc)
        when 'priority'
          tasks = tasks.order(
            Arel.sql("CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END"),
            created_at: :desc
          )
        when 'created_at'
          tasks = tasks.order(created_at: :desc)
        else
          tasks = tasks.ordered
        end

        tasks.distinct
      end
    end
  end
end
