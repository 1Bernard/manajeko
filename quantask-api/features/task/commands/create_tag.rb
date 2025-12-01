module Task
  module Commands
    class CreateTag < BaseCommand
      def initialize(user, params)
        @user = user
        @params = params
      end

      def call
        project = Project::Project.find_by(id: @params[:project_id])
        return Result.failure('Project not found', status: :not_found) unless project

        # Verify access via project workspace
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        tag = ::Task::Tag.new(@params)

        if tag.save
          Result.success(tag, status: :created)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: tag.errors.as_json)
        end
      end
    end
  end
end
