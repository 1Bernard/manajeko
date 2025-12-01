module Task
  module Commands
    class AddTagToTask < BaseCommand
      def initialize(user, task_id, tag_id)
        @user = user
        @task_id = task_id
        @tag_id = tag_id
      end

      def call
        task = ::Task::Task.find_by(id: @task_id)
        return Result.failure('Task not found', status: :not_found) unless task

        tag = Task::Tag.find_by(id: @tag_id)
        return Result.failure('Tag not found', status: :not_found) unless tag

        # Verify access via project workspace
        member = Workspace::WorkspaceMember.find_by(user: @user, workspace_id: task.project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        # Verify tag belongs to same project
        if tag.project_id != task.project_id
          return Result.failure('Tag must belong to the same project', status: :unprocessable_entity)
        end

        tagging = Task::Tagging.new(task: task, tag: tag)

        if tagging.save
          Result.success(tagging, status: :created)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: tagging.errors.as_json)
        end
      rescue ActiveRecord::RecordNotUnique
        Result.failure('Tag already added to task', status: :unprocessable_entity)
      end
    end
  end
end
