module Project
  module Queries
    class ListProjects < BaseQuery
      def initialize(user, workspace_id)
        @user = user
        @workspace_id = workspace_id
      end

      def call
        # Verify user is member of workspace
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: @workspace_id)
        return [] unless member

        # Return all projects for now (later can filter by visibility)
        ::Project::Project.where(workspace_id: @workspace_id)
      end
    end
  end
end
