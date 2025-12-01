module Task
  module Commands
    class CreateComment < BaseCommand
      def initialize(user, params)
        @user = user
        @params = params
      end

      def call
        task = ::Task::Task.find_by(id: @params[:task_id])
        return Result.failure('Task not found', status: :not_found) unless task

        # Verify access via project workspace
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        comment = Task::Comment.new(@params.merge(user: @user))

        if comment.save
          Result.success(comment, status: :created)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: comment.errors.as_json)
        end
      end
    end
  end
end
