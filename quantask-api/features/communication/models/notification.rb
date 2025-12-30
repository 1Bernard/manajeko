module Communication
  class Notification < ApplicationRecord
    self.table_name = 'notifications'

    belongs_to :user, class_name: '::Identity::User'
    belongs_to :notifiable, polymorphic: true

    scope :recent, -> { order(created_at: :desc) }
    scope :unread, -> { where(read: false) }
    scope :read, -> { where(read: true) }

    validates :notification_type, presence: true
    validates :content, presence: true

    def mark_as_read!
      update(read: true)
    end
  end
end
