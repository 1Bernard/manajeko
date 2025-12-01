module Project
  class Project < ::ApplicationRecord
    self.table_name = 'projects'

    belongs_to :workspace, class_name: '::Workspace::Workspace'
    belongs_to :owner, class_name: '::Identity::User'
    has_many :tasks, class_name: '::Task::Task', dependent: :destroy
    has_many :tags, class_name: '::Task::Tag', dependent: :destroy
    has_one_attached :banner_image

    validates :name, presence: true
    validates :status, presence: true, inclusion: { in: %w[active archived completed] }
    validates :visibility, presence: true, inclusion: { in: %w[private public] }
    validates :name, uniqueness: { scope: :workspace_id, message: "already exists in this workspace" }
  end
end
