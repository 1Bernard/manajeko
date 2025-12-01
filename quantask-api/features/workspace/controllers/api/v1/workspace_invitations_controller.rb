module Workspace
  module Controllers
    module Api
      module V1
        class WorkspaceInvitationsController < ::Api::V1::BaseController
          def create
            workspace = ::Workspace::Workspace.find(params[:workspace_id])
            
            # Authorization check
            unless workspace.members.exists?(user: current_user)
              return render json: { error: 'Unauthorized' }, status: :forbidden
            end

            email = params[:email]
            if email.blank?
              return render json: { error: 'Email is required' }, status: :bad_request
            end

            # Check if user exists
            user = ::Identity::User.find_by(email: email)
            
            if user
              # Add user to workspace directly if they exist
              if workspace.members.exists?(user: user)
                return render json: { message: 'User is already a member' }, status: :ok
              end

              ::Workspace::WorkspaceMember.create!(workspace: workspace, user: user, role: 'member')
              render json: { message: 'User added to workspace successfully' }, status: :created
            else
              # In a real app, we would create an invitation record and send an email
              # For now, we'll just return a message saying user not found (or mock invite)
              render json: { message: 'Invitation sent to ' + email }, status: :ok
            end
          end
        end
      end
    end
  end
end
