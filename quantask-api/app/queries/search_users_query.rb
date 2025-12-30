class SearchUsersQuery < BaseQuery
  def self.call(user, query)
    # Get accessible workspaces and users
    workspace_ids = user.workspaces.pluck(:id)
    user_ids = Workspace::WorkspaceMember.where(workspace_id: workspace_ids).pluck(:user_id).uniq

    # Sanitize query for LIKE pattern
    sanitized_query = sanitize_sql_like(query)

    # Search users
    users = Identity::User.where(id: user_ids)
                          .where("first_name ILIKE ? OR last_name ILIKE ? OR email ILIKE ?", 
                                 "%#{sanitized_query}%", "%#{sanitized_query}%", "%#{sanitized_query}%")
                          .limit(10)

    # Transform to match expected format
    users.map do |found_user|
      {
        id: found_user.id,
        type: 'user',
        attributes: {
          name: found_user.full_name,
          email: found_user.email,
          avatar_url: found_user.avatar_url,
          job_title: found_user.job_title
        }
      }
    end
  end

  private

  def self.sanitize_sql_like(string)
    string.gsub(/[\\%_]/) { |x| "\\#{x}" }
  end
end
