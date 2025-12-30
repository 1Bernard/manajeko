module Api
  module V1
    class BaseSerializer
      include JSONAPI::Serializer
      set_key_transform :underscore
    end
  end
end
