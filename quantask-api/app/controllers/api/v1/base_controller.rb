module Api
  module V1
    class BaseController < ::ApplicationController
      before_action :authenticate_request
      attr_reader :current_user

      # Error Handling
      rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
      rescue_from ActiveRecord::RecordInvalid, with: :handle_validation_error
      rescue_from ActionController::ParameterMissing, with: :handle_bad_request

      private

      def render_command(result, serializer: nil, status: nil)
        if result.success?
          data = serializer ? serializer.new(result.value).serializable_hash : result.value
          render json: data, status: (status || result.status)
        else
          render_error(result.error[:message], result.status, result.error[:code], result.error[:details])
        end
      end

      def authenticate_request
        header = request.headers['Authorization']
        token = header.split(' ').last if header
        decoded = JsonWebToken.decode(token)

        if decoded
          @current_user = Identity::Queries::FindUser.call(decoded[:user_id])
          unless @current_user
            render_error('Unauthorized access', :unauthorized, 'unauthorized')
          end
        else
          render_error('Unauthorized access', :unauthorized, 'unauthorized')
        end
      rescue ActiveRecord::RecordNotFound
        render_error('Unauthorized access', :unauthorized, 'unauthorized')
      end

      def render_error(message, status, code = nil, details = nil)
        payload = { error: message }
        payload[:code] = code if code.present?
        payload[:details] = details if details.present?
        render json: payload, status: status
      end

      # Handlers
      def handle_not_found
        render_error('Resource not found', :not_found, 'resource_not_found')
      end

      def handle_bad_request(e)
        render_error(e.message, :bad_request, 'bad_request')
      end

      def handle_validation_error(e)
        render_error('Validation failed', :unprocessable_entity, 'validation_error', e.record.errors.as_json)
      end
    end
  end
end
