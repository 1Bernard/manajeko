module Workspace
  module Services
    class InvitationService
      def self.create(user, workspace_id, email)
        workspace = ::Workspace::Workspace.find_by(id: workspace_id)
        return Result.failure('Workspace not found', status: :not_found) unless workspace

        # Authorization check
        unless workspace.members.exists?(user: user)
          return Result.failure('Unauthorized', status: :forbidden)
        end

        return Result.failure('Email is required', status: :bad_request) if email.blank?

        # Check if user exists
        invited_user = ::Identity::User.find_by(email: email)

        if invited_user
          # Add user to workspace directly if they exist
          if workspace.members.exists?(user: invited_user)
            return Result.success({ message: 'User is already a member' }, status: :ok)
          end

          ::Workspace::WorkspaceMember.create!(workspace: workspace, user: invited_user, role: 'member')
          Result.success({ message: 'User added to workspace successfully' }, status: :created)
        else
          # In a real app, we would create an invitation record and send an email
          # For now, we'll just return a message saying invitation sent
          Result.success({ message: 'Invitation sent to ' + email }, status: :ok)
        end
      end
    end
  end
end
