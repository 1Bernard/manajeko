module Task
  module Api
    module V1
      class AttachmentSerializer < ::Api::V1::BaseSerializer
        attribute :id do |attachment|
          attachment.id
        end

        attribute :name do |attachment|
          attachment.file.filename.to_s if attachment.file.attached?
        end

        attribute :url do |attachment|
          if attachment.file.attached?
            Rails.application.routes.url_helpers.rails_blob_url(attachment.file, host: ENV.fetch('API_HOST', 'http://localhost:3001'))
          end
        end

        attribute :content_type do |attachment|
          attachment.file.content_type if attachment.file.attached?
        end

        attribute :byte_size do |attachment|
          attachment.file.byte_size if attachment.file.attached?
        end

        attribute :size do |attachment|
          if attachment.file.attached?
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
          end
        end

        attribute :created_at do |attachment|
          attachment.created_at
        end
      end
    end
  end
end
