module Task
  module Commands
    class DeleteComment < BaseCommand
      def initialize(user, id)
        @user = user
        @id = id
      end

      def call
        comment = Task::Comment.find_by(id: @id)
        return Result.failure('Comment not found', status: :not_found) unless comment

        # Verify access - only author can delete
        if comment.user_id != @user.id
          return Result.failure('Unauthorized', status: :forbidden)
        end

        comment.destroy
        Result.success(nil, status: :no_content)
      end
    end
  end
end
