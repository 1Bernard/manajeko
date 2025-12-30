module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
    end

    private

    def find_verified_user
      # JWT auth from query param 'token'
      token = request.params[:token]
      
      if token.present?
        decoded = jwt_decode(token)
        if decoded
          user_id = decoded[:user_id]
          user = Identity::User.find_by(id: user_id)
          return user if user
        end
      end

      reject_unauthorized_connection
    end

    def jwt_decode(token)
      decoded = JWT.decode(token, Rails.application.credentials.secret_key_base)[0]
      HashWithIndifferentAccess.new decoded
    rescue
      nil
    end
  end
end
