module Task
  module Api
    module V1
      class AttachmentSerializer < ::Api::V1::BaseSerializer
        attributes :filename, :content_type, :byte_size, :created_at

        attribute :url do |attachment|
          if attachment.file.attached?
            Rails.application.routes.url_helpers.rails_blob_url(attachment.file, only_path: true)
          end
        end

        attribute :file_name do |attachment|
          attachment.filename.to_s
        end

        attribute :file_size do |attachment|
          attachment.byte_size
        end
      end
    end
  end
end
