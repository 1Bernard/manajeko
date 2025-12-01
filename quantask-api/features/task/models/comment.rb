module Task
  class Comment < ::ApplicationRecord
    self.table_name = 'comments'

    belongs_to :task, class_name: '::Task::Task'
    belongs_to :user, class_name: '::Identity::User'

    validates :content, presence: true
    
    scope :ordered, -> { order(created_at: :asc) }
  end
end
