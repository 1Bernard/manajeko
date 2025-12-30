module Task
  module Commands
    class CreateAttachment < BaseCommand
      def initialize(user, task_id, file)
        @user = user
        @task_id = task_id
        @file = file
      end

      def call
        task = ::Task::Task.find_by(id: @task_id)
        return Result.failure('Task not found', status: :not_found) unless task

        # Check authorization (project member)
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        attachment = ::Task::Attachment.new(task: task, user: @user)
        attachment.file.attach(@file)

        if attachment.save
          ::Task::Services::ActivityService.create_activity(@user, task.id, 'attachment_added', { filename: attachment.file.filename.to_s })
          Result.success(attachment, status: :created)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: attachment.errors.as_json)
        end
      rescue ActiveRecord::RecordInvalid => e
        Result.failure('Failed to create attachment', status: :unprocessable_entity, details: e.message)
      end
    end
  end
end
