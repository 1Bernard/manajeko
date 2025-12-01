module Task
  module Api
    module V1
      class CommentSerializer < ::Api::V1::BaseSerializer
        attributes :content, :created_at

        attribute :user_name do |comment|
          comment.user.full_name
        end

        attribute :user_initials do |comment|
          comment.user.initials
        end
      end
    end
  end
end
