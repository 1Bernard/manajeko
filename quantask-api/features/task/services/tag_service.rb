module Task
  module Services
    class TagService
      def self.index(project_id)
        if project_id
          tags = ::Task::Tag.where(project_id: project_id).ordered
          Result.success(tags)
        else
          Result.failure("Project ID required", status: :bad_request)
        end
      end

      def self.create(user, params)
        project_id = params[:project_id] || params.dig(:tag, :project_id)
        ::Task::Commands::CreateTag.call(user, params.merge(project_id: project_id))
      end

      def self.update(user, id, params)
        ::Task::Commands::UpdateTag.call(user, id, params)
      end

      def self.delete(user, id)
        ::Task::Commands::DeleteTag.call(user, id)
      end

      def self.add_to_task(user, task_id, tag_id)
        ::Task::Commands::AddTagToTask.call(user, task_id, tag_id)
      end

      def self.remove_from_task(user, task_id, tag_id)
        ::Task::Commands::RemoveTagFromTask.call(user, task_id, tag_id)
      end
    end
  end
end
