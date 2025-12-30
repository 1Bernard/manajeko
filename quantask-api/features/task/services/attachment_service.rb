module Task
  module Services
    class AttachmentService
      def self.create(user, task_id, file)
        ::Task::Commands::CreateAttachment.call(user, task_id, file)
      end

      def self.delete(user, id)
        ::Task::Commands::DeleteAttachment.call(user, id)
      end

      def self.download(user, id)
        attachment = ::Task::Attachment.find_by(id: id)
        return Result.failure('Attachment not found', status: :not_found) unless attachment

        # TODO: Add authorization check here if needed
        # For now, we'll assume the attachment is accessible
        
        Result.success(attachment)
      end
    end
  end
end
