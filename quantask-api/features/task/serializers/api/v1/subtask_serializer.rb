module Task
  module Api
    module V1
      class SubtaskSerializer < ::Api::V1::BaseSerializer
        attributes :title, :position, :created_at, :blocker_note, :note
        
        attribute :completed do |object|
          object.is_completed
        end
      end
    end
  end
end
