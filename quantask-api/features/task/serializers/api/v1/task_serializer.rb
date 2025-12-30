module Task
  module Api
    module V1
      class TaskSerializer < ::Api::V1::BaseSerializer
        attributes :title, :description, :status, :priority, :task_type, :start_date, :due_date, :position, :project_id, :creator_id, :created_at, :updated_at

        attribute :creator_name do |task|
          task.creator.full_name
        end

        attribute :assignees do |task|
          colors = ['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-500', 'bg-purple-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500']
          task.assignees.map do |user|
            {
              id: user.id,
              name: user.full_name,
              initials: user.initials,
              color: colors[user.id % colors.length],
              avatar: user.avatar_url,
              avatar_url: user.avatar_url
            }
          end
        end
        
        # Keep legacy assignee_name for backward compatibility if needed, or remove
        attribute :assignee_name do |task|
          task.assignees.first&.full_name
        end

        attribute :tags do |task|
          task.tags.map do |tag|
            {
              id: tag.id,
              name: tag.name,
              color: tag.color
            }
          end
        end

        attribute :attachments do |task|
          task.attachments.map do |attachment|
            size_str = if attachment.file.attached?
              bytes = attachment.file.byte_size
              if bytes < 1024
                "#{bytes} B"
              elsif bytes < 1024 * 1024
                "#{(bytes / 1024.0).round(1)} KB"
              elsif bytes < 1024 * 1024 * 1024
                "#{(bytes / (1024.0 * 1024)).round(1)} MB"
              else
                "#{(bytes / (1024.0 * 1024 * 1024)).round(1)} GB"
              end
            else
              "0 B"
            end

            {
              id: attachment.id,
              name: attachment.file.filename.to_s,
              size: size_str,
              url: Rails.application.routes.url_helpers.rails_blob_url(attachment.file, host: ENV.fetch('API_HOST', 'http://localhost:3001')),
              content_type: attachment.file.content_type,
              byte_size: attachment.file.byte_size,
              created_at: attachment.created_at
            }
          end
        end

        attribute :subtasks do |task|
          ::Task::Api::V1::SubtaskSerializer.new(task.subtasks.ordered).serializable_hash[:data].map { |d| { id: d[:id].to_i }.merge(d[:attributes]) }
        end

        attribute :comments do |task|
          ::Task::Api::V1::CommentSerializer.new(task.comments.order(created_at: :asc)).serializable_hash[:data].map { |d| { id: d[:id].to_i }.merge(d[:attributes]) }
        end
      end
    end
  end
end
