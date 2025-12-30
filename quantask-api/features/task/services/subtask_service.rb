module Task
  module Services
    class SubtaskService
      def self.create(user, params)
        # Merge task_id from params if present
        subtask_params = params[:task_id] ? params : params.merge(task_id: params[:task_id])
        ::Task::Commands::CreateSubtask.call(user, subtask_params)
      end

      def self.update(user, id, params)
        ::Task::Commands::UpdateSubtask.call(user, id, params)
      end

      def self.delete(user, id)
        ::Task::Commands::DeleteSubtask.call(user, id)
      end
    end
  end
end
