module Identity
  module Services
    class RegistrationService
      def self.call(params)
        # 1. Run Command
        result = ::Identity::Commands::CreateUser.call(params)
        return result if result.failure?

        user = result.value
        
        # 2. Trigger 2FA (Generate OTP)
        otp_result = ::Identity::Commands::GenerateOtp.call(user)
        otp_code = otp_result.value

        # 3. Send Notification
        ::Global::Commands::SendNotification.call(user, :otp, otp_code)

        # 4. Generate Token (optional, or we can force them to verify first)
        # For now, we return the token so they are "logged in" but we also sent the OTP
        # If strict 2FA is required, we might withhold the token until verification
        token = JsonWebToken.encode(user_id: user.id)
        
        # 5. Return Composite Result
        Result.success({ user: user, token: token, message: "Account created. OTP sent.", otp_code: otp_code }, status: :created)
      end
    end
  end
end
