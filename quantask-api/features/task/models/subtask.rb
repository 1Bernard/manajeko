module Task
  class Subtask < ::ApplicationRecord
    self.table_name = 'subtasks'

    belongs_to :task, class_name: '::Task::Task'

    validates :title, presence: true
    
    scope :ordered, -> { order(position: :asc, created_at: :asc) }
  end
end
