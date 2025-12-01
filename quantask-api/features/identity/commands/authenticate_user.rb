module Identity
  module Commands
    class AuthenticateUser < BaseCommand
      def initialize(email, password)
        @email = email
        @password = password
      end

      def call
        user = ::Identity::User.find_by(email: @email)
        if user && user.authenticate(@password)
          Result.success(user)
        else
          Result.failure('Invalid credentials', status: :unauthorized)
        end
      end
    end
  end
end
