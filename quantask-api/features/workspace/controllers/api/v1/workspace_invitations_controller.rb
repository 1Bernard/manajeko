module Workspace
  module Controllers
    module Api
      module V1
        class WorkspaceInvitationsController < ::Api::V1::BaseController
          def create
            result = ::Workspace::Services::InvitationService.create(current_user, params[:workspace_id], params[:email])
            if result.success?
              render json: result.value, status: result.status
            else
              render json: { error: result.error }, status: result.status
            end
          end
        end
      end
    end
  end
end
