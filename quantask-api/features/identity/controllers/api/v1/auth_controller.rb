module Identity
  module Controllers
    module Api
      module V1
        class AuthController < ::Api::V1::BaseController

          skip_before_action :authenticate_request, only: [:register, :login, :verify_otp, :resend_otp, :forgot_password, :reset_password]

          def register
            result = Identity::Services::RegistrationService.call(register_params)
            render_result(result)
          end

          def login
            result = Identity::Services::LoginService.call(params[:email], params[:password])
            render_command(result)
          end

          def verify_otp
            result = Identity::Services::VerificationService.call(params[:email], params[:otp_code])
            render_result(result)
          end

          def resend_otp
            result = Identity::Services::ResendOtpService.call(params[:email])
            render_command(result)
          end

          def forgot_password
            result = Identity::Services::RecoveryService.forgot_password(params[:email])
            render_command(result)
          end

          def reset_password
            result = Identity::Services::RecoveryService.reset_password(params[:token], params[:new_password])
            render_command(result)
          end

          def me
            render json: ::Identity::Api::V1::UserSerializer.new(@current_user).serializable_hash
          end

          def update_profile
            if @current_user.update(update_params)
              render json: ::Identity::Api::V1::UserSerializer.new(@current_user).serializable_hash
            else
              render json: { error: @current_user.errors.full_messages }, status: :unprocessable_entity
            end
          end

          private

          def render_result(result)
            if result.success?
              # If the result contains a User object, we serialize it
              payload = result.value
              if payload.is_a?(Hash) && payload[:user]
                payload[:user] = ::Identity::Api::V1::UserSerializer.new(payload[:user]).serializable_hash
              end
              render json: payload, status: result.status
            else
              render_command(result)
            end
          end

          def register_params
            params.permit(:email, :password, :password_confirmation, :first_name, :last_name, :phone_number, :otp_method)
          end

          def update_params
            # Allow updating basic info and avatar
            params.permit(:first_name, :last_name, :job_title, :bio, :location, :avatar)
          end
        end
      end
    end
  end
end
