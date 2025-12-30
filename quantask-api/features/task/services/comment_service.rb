module Task
  module Services
    class CommentService
      def self.create(user, params)
        # Merge task_id from params if present
        comment_params = params[:task_id] ? params : params.merge(task_id: params[:task_id])
        ::Task::Commands::CreateComment.call(user, comment_params)
      end

      def self.delete(user, id)
        ::Task::Commands::DeleteComment.call(user, id)
      end
    end
  end
end
