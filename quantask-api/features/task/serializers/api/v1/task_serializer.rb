module Task
  module Api
    module V1
      class TaskSerializer < ::Api::V1::BaseSerializer
        attributes :title, :description, :status, :priority, :task_type, :due_date, :position, :project_id, :creator_id, :created_at, :updated_at

        attribute :creator_name do |task|
          task.creator.full_name
        end

        attribute :assignees do |task|
          task.assignees.map do |user|
            {
              id: user.id,
              name: user.full_name,
              avatar_url: user.avatar_url
            }
          end
        end
        
        # Keep legacy assignee_name for backward compatibility if needed, or remove
        attribute :assignee_name do |task|
          task.assignees.first&.full_name
        end

        has_many :subtasks, serializer: ::Task::Api::V1::SubtaskSerializer
        has_many :comments, serializer: ::Task::Api::V1::CommentSerializer
        has_many :attachments, serializer: ::Task::Api::V1::AttachmentSerializer
      end
    end
  end
end
