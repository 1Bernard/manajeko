module Identity
  module Commands
    class GenerateOtp < BaseCommand
      def initialize(user)
        @user = user
      end

      def call
        otp = SecureRandom.random_number(100_000..999_999).to_s
        @user.update!(otp_code: otp, otp_expires_at: 10.minutes.from_now)
        Result.success(otp)
      end
    end
  end
end
