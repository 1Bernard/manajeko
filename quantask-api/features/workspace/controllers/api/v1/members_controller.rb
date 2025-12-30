module Workspace
  module Controllers
    module Api
      module V1
        class MembersController < ::Api::V1::BaseController
          def index
            result = ::Workspace::Services::MemberService.index(current_user, params[:workspace_id])
            if result.success?
              render json: ::Identity::Api::V1::UserSerializer.new(result.value).serializable_hash
            else
              render json: { error: result.error }, status: result.status
            end
          end
        end
      end
    end
  end
end
