module Workspace
  module Controllers
    module Api
      module V1
        class WorkspacesController < ::Api::V1::BaseController
          def index
            workspaces = ::Workspace::Queries::ListUserWorkspaces.call(current_user)
            render json: ::Workspace::Api::V1::WorkspaceSerializer.new(workspaces, { params: { current_user: current_user } }).serializable_hash
          end

          def create
            result = ::Workspace::Commands::CreateWorkspace.call(current_user, workspace_params)
            render_command(result, serializer: ::Workspace::Api::V1::WorkspaceSerializer, status: :created)
          end

          private

          def workspace_params
            params.require(:workspace).permit(:name, :description, :logo_url)
          end
        end
      end
    end
  end
end
