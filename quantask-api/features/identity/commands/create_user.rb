module Identity
  module Commands
    class CreateUser < BaseCommand
      def initialize(params)
        @params = params
      end

      def call
        user = ::Identity::User.new(@params)
        if user.save
          Result.success(user, status: :created)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: user.errors.as_json)
        end
      end
    end
  end
end
