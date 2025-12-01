module Task
  class TaskAssignment < ApplicationRecord
    belongs_to :task, class_name: '::Task::Task'
    belongs_to :user, class_name: '::Identity::User'

    validates :task_id, uniqueness: { scope: :user_id }
  end
end
