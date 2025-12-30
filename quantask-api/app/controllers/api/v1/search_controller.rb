module Api
  module V1
    class SearchController < BaseController
      def index
        result = SearchService.search(current_user, params[:q], params[:type])
        
        if result.success?
          render json: result.value
        else
          render json: { error: result.error }, status: result.status
        end
      end
    end
  end
end
