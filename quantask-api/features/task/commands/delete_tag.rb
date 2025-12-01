module Task
  module Commands
    class DeleteTag < BaseCommand
      def initialize(user, id)
        @user = user
        @id = id
      end

      def call
        tag = ::Task::Tag.find_by(id: @id)
        return Result.failure('Tag not found', status: :not_found) unless tag

        # Verify access via project workspace
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: tag.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        tag.destroy
        Result.success(nil, status: :no_content)
      end
    end
  end
end
