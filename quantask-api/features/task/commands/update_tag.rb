module Task
  module Commands
    class UpdateTag < BaseCommand
      def initialize(user, id, params)
        @user = user
        @id = id
        @params = params
      end

      def call
        tag = ::Task::Tag.find_by(id: @id)
        return Result.failure('Tag not found', status: :not_found) unless tag

        # Verify access via project workspace
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: tag.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        if tag.update(@params)
          Result.success(tag)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: tag.errors.as_json)
        end
      end
    end
  end
end
