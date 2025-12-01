module Task
  class Attachment < ApplicationRecord
    self.table_name = 'task_attachments'

    belongs_to :task, class_name: '::Task::Task'
    belongs_to :user, class_name: '::Identity::User'

    has_one_attached :file

    validates :file, presence: true

    delegate :filename, :content_type, :byte_size, to: :file
  end
end
