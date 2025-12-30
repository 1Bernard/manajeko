

module Workspace
  module Commands
    class CreateWorkspace < BaseCommand
      def initialize(user, params)
        @user = user
        @params = params
      end

      def call
        workspace = ::Workspace::Workspace.new(@params)
        workspace.owner = @user

        ActiveRecord::Base.transaction do
          if workspace.save
            # Add creator as owner member
            Workspace::WorkspaceMember.create!(
              workspace: workspace,
              user: @user,
              role: 'owner'
            )
            Result.success(workspace, status: :created)
          else
            Result.failure('Validation failed', status: :unprocessable_entity, details: workspace.errors.as_json)
          end
        end
      rescue ActiveRecord::RecordInvalid => e
        Result.failure('Failed to create workspace', status: :unprocessable_entity, details: e.message)
      end
    end
  end
end
