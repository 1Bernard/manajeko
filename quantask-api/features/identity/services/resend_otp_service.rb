module Identity
  module Services
    class ResendOtpService
      def self.call(email)
        user = Identity::User.find_by(email: email)
        return Result.failure('User not found', :not_found) unless user

        # Generate new OTP
        otp_result = ::Identity::Commands::GenerateOtp.call(user)
        otp_code = otp_result.value

        # Send Notification
        ::Global::Commands::SendNotification.call(user, :otp, otp_code)

        Result.success({ message: "OTP resent successfully." }, status: :ok)
      end
    end
  end
end
