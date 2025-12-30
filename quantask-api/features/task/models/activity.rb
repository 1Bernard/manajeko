module Task
  class Activity < ::ApplicationRecord
    self.table_name = 'activities'

    belongs_to :task, class_name: '::Task::Task'
    belongs_to :user, class_name: '::Identity::User'

    validates :action_type, presence: true

    # Scopes
    scope :recent, -> { order(created_at: :desc) }
  end
end
