module Identity
  module Commands
    class ResetPassword < BaseCommand
      def initialize(token, new_password)
        @token = token
        @new_password = new_password
      end

      def call
        user = ::Identity::User.find_by(reset_password_token: @token)
        if user && user.reset_password_sent_at > 2.hours.ago
          user.update!(password: @new_password, reset_password_token: nil, reset_password_sent_at: nil)
          Result.success(true)
        else
          Result.failure('Invalid or expired token', status: :unprocessable_entity)
        end
      end
    end
  end
end
