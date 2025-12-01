module Workspace
  module Queries
    class ListUserWorkspaces < BaseQuery
      def initialize(user)
        @user = user
      end

      def call
        @user.workspaces
      end
    end
  end
end
