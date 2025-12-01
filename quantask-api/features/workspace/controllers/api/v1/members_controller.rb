module Workspace
  module Controllers
    module Api
      module V1
        class MembersController < ::Api::V1::BaseController
          def index
            workspace = ::Workspace::Workspace.find(params[:workspace_id])
            
            # Check if current user is member
            unless ::Workspace::WorkspaceMember.exists?(workspace: workspace, user: current_user)
              return render json: { error: "Unauthorized" }, status: :forbidden
            end

            members = workspace.users
            render json: ::Identity::Api::V1::UserSerializer.new(members).serializable_hash
          end
        end
      end
    end
  end
end
