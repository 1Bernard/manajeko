module Task
  module Services
    class TaskService
      def self.index(user, project_id, filter_params)
        ::Task::Queries::SearchTasks.call(user, project_id, filter_params)
      end

      def self.show(user, id)
        ::Task::Queries::FindTask.call(user, id)
      end

      def self.create(user, params)
        # Merge project_id from params if present
        task_params = params[:project_id] ? params : params.merge(project_id: params[:project_id])
        ::Task::Commands::CreateTask.call(user, task_params)
      end

      def self.update(user, id, params)
        ::Task::Commands::UpdateTask.call(user, id, params)
      end

      def self.delete(user, id)
        ::Task::Commands::DeleteTask.call(user, id)
      end

      def self.move(user, id, status, position)
        ::Task::Commands::MoveTask.call(user, id, status, position)
      end
    end
  end
end
