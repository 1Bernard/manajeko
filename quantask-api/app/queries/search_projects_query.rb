class SearchProjectsQuery < BaseQuery
  def self.call(user, query)
    # Get accessible workspaces
    workspace_ids = user.workspaces.pluck(:id)

    # Sanitize query for LIKE pattern
    sanitized_query = sanitize_sql_like(query)

    # Search projects
    projects = Project::Project.where(workspace_id: workspace_ids)
                               .where("name ILIKE ? OR description ILIKE ?", "%#{sanitized_query}%", "%#{sanitized_query}%")
                               .limit(10)

    # Serialize
    Project::Api::V1::ProjectSerializer.new(projects).serializable_hash[:data] || []
  end

  private

  def self.sanitize_sql_like(string)
    string.gsub(/[\\%_]/) { |x| "\\#{x}" }
  end
end
