module Task
  module Commands
    class DeleteAttachment < BaseCommand
      def initialize(user, attachment_id)
        @user = user
        @attachment_id = attachment_id
      end

      def call
        attachment = Task::Attachment.find_by(id: @attachment_id)
        return Result.failure('Attachment not found', status: :not_found) unless attachment

        # Check authorization (uploader or project owner)
        is_uploader = attachment.user_id == @user.id
        is_project_owner = attachment.task.project.owner_id == @user.id
        
        unless is_uploader || is_project_owner
          return Result.failure('Unauthorized', status: :forbidden)
        end

        attachment.destroy
        Result.success(nil)
      end
    end
  end
end
