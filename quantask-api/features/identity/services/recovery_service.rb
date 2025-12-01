module Identity
  module Services
    class RecoveryService
      def self.forgot_password(email)
        # 1. Generate Token
        result = Identity::Commands::RequestPasswordReset.call(email)
        
        # 2. Send Email if user existed (Orchestration)
        if result.success? && result.value.is_a?(::Identity::User)
          user = result.value
          token = user.reset_password_token
          Global::Commands::SendNotification.call(user, :reset_password, token)
        end

        Result.success({ message: 'If this email exists, a code has been sent' })
      end

      def self.reset_password(token, new_password)
        Identity::Commands::ResetPassword.call(token, new_password)
      end
    end
  end
end
