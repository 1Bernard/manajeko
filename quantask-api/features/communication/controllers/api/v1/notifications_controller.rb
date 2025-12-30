module Communication
  module Controllers
    module Api
      module V1
        class NotificationsController < ::Api::V1::BaseController
          def index
            notifications = Communication::Notification.where(user: @current_user)
                                                     .order(created_at: :desc)
                                                     .page(params[:page]).per(20)
            
            # Simple manual serialization for now
            serialized = notifications.map do |n|
              {
                id: n.id,
                content: n.content,
                type: n.notification_type,
                read: n.read,
                created_at: n.created_at,
                notifiable_type: n.notifiable_type,
                notifiable_id: n.notifiable_id
              }
            end

            render json: {
              data: serialized,
              meta: {
                total_pages: notifications.total_pages,
                current_page: notifications.current_page,
                unread_count: Communication::Notification.where(user: @current_user, read: false).count
              }
            }
          end

          def mark_read
            result = Communication::Services::NotificationService.mark_as_read(params[:id], @current_user)
            if result
              render json: { success: true }
            else
              render json: { error: 'Notification not found' }, status: :not_found
            end
          end

          def mark_all_read
            Communication::Services::NotificationService.mark_all_as_read(@current_user)
            render json: { success: true }
          end
        end
      end
    end
  end
end
