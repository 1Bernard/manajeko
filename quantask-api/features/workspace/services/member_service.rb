module Workspace
  module Services
    class MemberService
      def self.index(user, workspace_id)
        workspace = ::Workspace::Workspace.find_by(id: workspace_id)
        return Result.failure('Workspace not found', status: :not_found) unless workspace

        # Authorization check
        unless ::Workspace::WorkspaceMember.exists?(workspace: workspace, user: user)
          return Result.failure('Unauthorized', status: :forbidden)
        end

        Result.success(workspace.users)
      end
    end
  end
end
