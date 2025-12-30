class NotificationsChannel < ApplicationCable::Channel
  def subscribed
    # Stream for the specific user
    stream_from "notifications_#{current_user.id}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end
end
