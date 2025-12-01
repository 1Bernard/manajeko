module Task
  module Api
    module V1
      class SubtaskSerializer < ::Api::V1::BaseSerializer
        attributes :title, :is_completed, :position, :created_at
      end
    end
  end
end
