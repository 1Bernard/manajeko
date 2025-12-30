module Project
  module Controllers
    module Api
      module V1
        class ProjectsController < ::Api::V1::BaseController
          def index
            projects = ::Project::Services::ProjectService.index(current_user, params[:workspace_id])
            render json: ::Project::Api::V1::ProjectSerializer.new(projects).serializable_hash
          end

          def create
            result = ::Project::Services::ProjectService.create(current_user, project_params.merge(workspace_id: params[:workspace_id]))
            render_command(result, serializer: ::Project::Api::V1::ProjectSerializer, status: :created)
          end

          def update
            result = ::Project::Services::ProjectService.update(current_user, params[:id], project_params)
            if result.success?
              render json: ::Project::Api::V1::ProjectSerializer.new(result.value).serializable_hash
            else
              render json: { error: result.error }, status: result.status
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
