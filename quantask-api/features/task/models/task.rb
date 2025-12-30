module Task
  class Task < ::ApplicationRecord
    self.table_name = 'tasks'

    belongs_to :project, class_name: '::Project::Project'
    belongs_to :creator, class_name: '::Identity::User'
    belongs_to :assignee, class_name: '::Identity::User', optional: true # Deprecated in favor of task_assignments
    has_many :subtasks, class_name: '::Task::Subtask', dependent: :destroy
    has_many :comments, class_name: '::Task::Comment', dependent: :destroy
    has_many :taggings, class_name: '::Task::Tagging', dependent: :destroy
    has_many :tags, through: :taggings, class_name: '::Task::Tag'
    has_many :attachments, class_name: '::Task::Attachment', dependent: :destroy
    
    has_many :task_assignments, class_name: '::Task::TaskAssignment', dependent: :destroy
    has_many :assignees, through: :task_assignments, source: :user, class_name: '::Identity::User'

    validate :due_date_cannot_be_in_the_past, if: -> { due_date.present? && due_date_changed? }
    validate :start_date_cannot_be_after_due_date, if: -> { start_date.present? && due_date.present? }

    validates :title, presence: true
    validates :status, presence: true
    validates :priority, presence: true
    validates :task_type, presence: true
    validates :priority, presence: true, inclusion: { in: %w[low medium high urgent] }

    private

    def due_date_cannot_be_in_the_past
      if due_date < Time.current
        errors.add(:due_date, "can't be in the past")
      end
    end

    def start_date_cannot_be_after_due_date
      if start_date > due_date
        errors.add(:start_date, "must be before due date")
      end
    end

    # Scopes
    scope :by_status, ->(status) { where(status: status) }
    scope :by_assignee, ->(user_id) { where(assignee_id: user_id) }
    scope :ordered, -> { order(position: :asc, created_at: :desc) }
    scope :accessible_by, ->(user) {
      joins(project: { workspace: :workspace_members })
      .where(workspace_members: { user_id: user.id })
    }
  end
end
