module Api
  module V1
    class ErrorsController < BaseController
      def not_found
        render json: { error: 'Resource not found', code: 'resource_not_found' }, status: :not_found
      end

      def internal_server_error
        render json: { error: 'Internal server error', code: 'internal_server_error' }, status: :internal_server_error
      end
    end
  end
end
