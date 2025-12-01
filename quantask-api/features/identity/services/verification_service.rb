module Identity
  module Services
    class VerificationService
      def self.call(email, code)
        # 1. Verify Code
        result = Identity::Commands::VerifyOtp.call(email, code)
        return result if result.failure?

        user = result.value

        # 2. Issue Token
        token = JsonWebToken.encode(user_id: user.id)

        Result.success({ token: token, user: user })
      end
    end
  end
end
