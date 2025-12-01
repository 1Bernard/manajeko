module Task
  class Tag < ::ApplicationRecord
    self.table_name = 'tags'

    belongs_to :project, class_name: '::Project::Project'
    has_many :taggings, class_name: '::Task::Tagging', dependent: :destroy
    has_many :tasks, through: :taggings

    validates :name, presence: true, uniqueness: { scope: :project_id }
    validates :color, presence: true, format: { with: /\A#[0-9a-fA-F]{6}\z/, message: "must be a valid hex color code" }
    
    scope :ordered, -> { order(name: :asc) }
  end
end
