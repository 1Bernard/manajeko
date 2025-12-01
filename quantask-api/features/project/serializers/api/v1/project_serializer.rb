module Project
  module Api
    module V1
      class ProjectSerializer < ::Api::V1::BaseSerializer
        attributes :name, :description, :status, :visibility, :color, :icon, :banner_gradient, :color_scheme, :last_updated_at, :created_at

        attribute :workspace_id do |project|
          project.workspace_id
        end

        attribute :owner_id do |project|
          project.owner_id
        end

        attribute :banner_image_url do |project|
          if project.banner_image.attached?
            Rails.application.routes.url_helpers.rails_blob_url(project.banner_image, host: ENV.fetch('API_HOST', 'http://localhost:3001'))
          end
        end
      end
    end
  end
end
