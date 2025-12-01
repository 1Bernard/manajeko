module Identity
  module Commands
    class VerifyOtp < BaseCommand
      def initialize(email, code)
        @email = email
        @code = code
      end

      def call
        user = ::Identity::User.find_by(email: @email)
        if user && user.valid_otp?(@code)
          user.clear_otp!
          Result.success(user)
        else
          Result.failure('Invalid or expired OTP', status: :unauthorized)
        end
      end
    end
  end
end
