module Workspace
  module Api
    module V1
      class WorkspaceSerializer < ::Api::V1::BaseSerializer
        attributes :name, :slug, :description, :logo_url, :created_at

        attribute :role do |workspace, params|
          if params[:current_user]
            member = workspace.workspace_members.find_by(user: params[:current_user])
            member&.role
          else
            nil
          end
        end
      end
    end
  end
end
