module Communication
  module Services
    class NotificationService
      def self.create_notification(user:, type:, content:, notifiable: nil)
        notification = Communication::Notification.create!(
          user: user,
          notification_type: type,
          content: content,
          notifiable: notifiable,
          read: false
        )

        # Broadcast to ActionCable
        ActionCable.server.broadcast("notifications_#{user.id}", {
          type: 'new_notification',
          notification: {
            id: notification.id,
            content: notification.content,
            type: notification.notification_type,
            read: notification.read,
            created_at: notification.created_at,
            notifiable_type: notification.notifiable_type,
            notifiable_id: notification.notifiable_id
          }
        })

        notification
      rescue => e
        Rails.logger.error("Failed to create notification: #{e.message}")
        nil
      end

      def self.mark_as_read(notification_id, user)
        notification = Communication::Notification.find_by(id: notification_id, user: user)
        return false unless notification
        
        notification.mark_as_read!
      end

      def self.mark_all_as_read(user)
        Communication::Notification.where(user: user, read: false).update_all(read: true)
      end
    end
  end
end
