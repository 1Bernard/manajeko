module Project
  module Controllers
    module Api
      module V1
        class ProjectsController < ::Api::V1::BaseController
          def index
            projects = ::Project::Queries::ListProjects.call(current_user, params[:workspace_id])
            render json: ::Project::Api::V1::ProjectSerializer.new(projects).serializable_hash
          end

          def create
            # Merge workspace_id from route params into project params
            project_params_with_workspace = project_params.merge(workspace_id: params[:workspace_id])
            result = ::Project::Commands::CreateProject.call(current_user, project_params_with_workspace)
            render_command(result, serializer: ::Project::Api::V1::ProjectSerializer, status: :created)
          end

          def update
            project = ::Project::Project.find(params[:id])
            
            # Authorization check (simple owner check for now, can be expanded)
            unless project.workspace.members.exists?(user: current_user)
              return render json: { error: 'Unauthorized' }, status: :forbidden
            end

            if project.update(project_params)
              render json: ::Project::Api::V1::ProjectSerializer.new(project).serializable_hash
            else
              render json: { error: project.errors.full_messages }, status: :unprocessable_entity
            end
          end

          private

          def project_params
            params.require(:project).permit(:name, :description, :status, :visibility, :color, :icon, :banner_image)
          end
        end
      end
    end
  end
end
