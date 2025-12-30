module Project
  module Services
    class ProjectService
      def self.index(user, workspace_id)
        ::Project::Queries::ListProjects.call(user, workspace_id)
      end

      def self.create(user, params)
        # Merge workspace_id from params if present
        project_params = params[:workspace_id] ? params : params.merge(workspace_id: params[:workspace_id])
        ::Project::Commands::CreateProject.call(user, project_params)
      end

      def self.update(user, id, params)
        project = ::Project::Project.find_by(id: id)
        return Result.failure('Project not found', status: :not_found) unless project

        # Authorization check
        unless project.workspace.members.exists?(user: user)
          return Result.failure('Unauthorized', status: :forbidden)
        end

        if project.update(params)
          Result.success(project)
        else
          Result.failure(project.errors.full_messages, status: :unprocessable_entity)
        end
      end

      def self.delete(user, id)
        # TODO: Implement delete command if needed
        Result.failure('Not implemented', status: :not_implemented)
      end
    end
  end
end
