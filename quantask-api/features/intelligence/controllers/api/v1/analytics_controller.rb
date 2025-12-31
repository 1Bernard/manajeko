module Intelligence
  module Controllers
    module Api
      module V1
        class AnalyticsController < ::Api::V1::BaseController
          def dashboard
            service = ::Intelligence::Services::AnalyticsService.new(current_user, params[:workspace_id])
            render json: { data: service.dashboard_stats }
          end
        end
      end
    end
  end
end
