module Workspace
  module Services
    class WorkspaceService
      def self.index(user)
        ::Workspace::Queries::ListUserWorkspaces.call(user)
      end

      def self.create(user, params)
        ::Workspace::Commands::CreateWorkspace.call(user, params)
      end
    end
  end
end
