class SearchTasksQuery < BaseQuery
  def self.call(user, query)
    # Get accessible workspaces and projects
    workspace_ids = user.workspaces.pluck(:id)
    project_ids = Project::Project.where(workspace_id: workspace_ids).pluck(:id)

    # Sanitize query for LIKE pattern
    sanitized_query = sanitize_sql_like(query)

    # Search tasks
    tasks = Task::Task.left_outer_joins(:tags)
                      .where(project_id: project_ids)
                      .where("tasks.title ILIKE ? OR tasks.description ILIKE ? OR tags.name ILIKE ?", 
                             "%#{sanitized_query}%", "%#{sanitized_query}%", "%#{sanitized_query}%")
                      .distinct
                      .limit(10)

    # Serialize and transform
    serialized = Task::Api::V1::TaskSerializer.new(tasks).serializable_hash[:data] || []
    
    serialized.map do |task|
      {
        id: task[:id],
        type: task[:type],
        title: task.dig(:attributes, :title),
        description: task.dig(:attributes, :description),
        project_id: task.dig(:attributes, :project_id),
        attributes: task[:attributes]
      }
    end
  end

  private

  def self.sanitize_sql_like(string)
    string.gsub(/[\\%_]/) { |x| "\\#{x}" }
  end
end
