module Identity
  module Api
    module V1
      class UserSerializer < ::Api::V1::BaseSerializer
        attributes :email, :first_name, :last_name, :otp_method, :created_at, :job_title, :bio, :location
        
        attribute :avatar_url do |user|
          if user.avatar.attached?
            if Rails.env.development? || Rails.env.test?
              Rails.application.routes.url_helpers.rails_blob_url(user.avatar, host: 'localhost', port: 3001)
            else
              user.avatar.url
            end
          else
            nil
          end
        end

        attribute :full_name do |user|
          user.full_name
        end

        attribute :initials do |user|
          user.initials
        end
      end
    end
  end
end
