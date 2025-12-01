module Identity
  module Queries
    class FindUser < BaseQuery
      def initialize(id)
        @id = id
      end

      def call
        ::Identity::User.find(@id)
      end
    end
  end
end
