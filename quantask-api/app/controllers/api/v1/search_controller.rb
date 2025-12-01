module Api
  module V1
    class SearchController < BaseController
      def index
        query = params[:q]
        search_type = params[:type] || 'all'

        return render json: { error: 'Query parameter required' }, status: :bad_request if query.blank?

        results = case search_type
                  when 'tasks'
                    { tasks: search_tasks(query), projects: [], users: [] }
                  when 'projects'
                    { tasks: [], projects: search_projects(query), users: [] }
                  when 'users'
                    { tasks: [], projects: [], users: search_users(query) }
                  else
                    {
                      tasks: search_tasks(query),
                      projects: search_projects(query),
                      users: search_users(query)
                    }
                  end

        results[:total] = results[:tasks].size + results[:projects].size + results[:users].size

        render json: results
      end

      private

      def search_tasks(query)
        # Get all accessible workspaces
        workspace_ids = current_user.workspaces.pluck(:id)
        project_ids = Project::Project.where(workspace_id: workspace_ids).pluck(:id)

        tasks = Task::Task.where(project_id: project_ids)
                          .where("title ILIKE ? OR description ILIKE ?", "%#{query}%", "%#{query}%")
                          .limit(10)

        serialized = Task::Api::V1::TaskSerializer.new(tasks).serializable_hash[:data] || []
        
        # Transform to include project_id and title at root level for frontend
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

      def search_projects(query)
        workspace_ids = current_user.workspaces.pluck(:id)

        projects = Project::Project.where(workspace_id: workspace_ids)
                                   .where("name ILIKE ? OR description ILIKE ?", "%#{query}%", "%#{query}%")
                                   .limit(10)

        Project::Api::V1::ProjectSerializer.new(projects).serializable_hash[:data] || []
      end

      def search_users(query)
        # Search within current user's workspaces
        workspace_ids = current_user.workspaces.pluck(:id)
        user_ids = Workspace::WorkspaceMember.where(workspace_id: workspace_ids).pluck(:user_id).uniq

        users = Identity::User.where(id: user_ids)
                              .where("first_name ILIKE ? OR last_name ILIKE ? OR email ILIKE ?", 
                                     "%#{query}%", "%#{query}%", "%#{query}%")
                              .limit(10)

        users.map do |user|
          {
            id: user.id,
            type: 'user',
            attributes: {
              name: user.full_name,
              email: user.email,
              avatar_url: user.avatar_url,
              job_title: user.job_title
            }
          }
        end
      end
    end
  end
end
