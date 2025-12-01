module Task
  class Tagging < ::ApplicationRecord
    self.table_name = 'taggings'

    belongs_to :task, class_name: '::Task::Task'
    belongs_to :tag, class_name: '::Task::Tag'

    validates :tag_id, uniqueness: { scope: :task_id }
  end
end
