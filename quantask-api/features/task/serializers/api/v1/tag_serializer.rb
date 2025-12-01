module Task
  module Api
    module V1
      class TagSerializer < ::Api::V1::BaseSerializer
        attributes :name, :color, :created_at
      end
    end
  end
end
