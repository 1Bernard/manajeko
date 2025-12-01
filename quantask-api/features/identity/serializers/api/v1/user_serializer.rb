module Identity
  module Api
    module V1
      class UserSerializer < ::Api::V1::BaseSerializer
        attributes :email, :first_name, :last_name, :otp_method, :created_at

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
