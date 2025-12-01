module Identity
  module Services
    class LoginService
      def self.call(email, password)
        # 1. Validate Credentials
        auth_result = Identity::Commands::AuthenticateUser.call(email, password)
        return auth_result if auth_result.failure?

        user = auth_result.value

        # 2. Trigger 2FA
        otp_result = Identity::Commands::GenerateOtp.call(user)
        otp_code = otp_result.value

        # 3. Send Notification (Orchestration)
        Global::Commands::SendNotification.call(user, :otp, otp_code)

        # 4. Return instruction to frontend
        Result.success({ otp_required: true, message: "OTP sent to #{user.otp_method}" })
      end
    end
  end
end
