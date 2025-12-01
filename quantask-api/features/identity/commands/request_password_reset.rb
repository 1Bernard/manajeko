module Identity
  module Commands
    class RequestPasswordReset < BaseCommand
      def initialize(email)
        @email = email
      end

      def call
        user = ::Identity::User.find_by(email: @email)
        # Security: Return success even if not found
        return Result.success(true) unless user

        token = SecureRandom.hex(10)
        user.update!(reset_password_token: token, reset_password_sent_at: Time.current)

        # Return the user so the Service knows to send an email
        Result.success(user)
      end
    end
  end
end
