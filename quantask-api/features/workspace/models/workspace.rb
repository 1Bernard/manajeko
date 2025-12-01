module Workspace
  class Workspace < ::ApplicationRecord
    self.table_name = 'workspaces'

    # Use string class names
    belongs_to :owner, class_name: '::Identity::User'
    has_many :workspace_members, class_name: '::Workspace::WorkspaceMember', dependent: :destroy
    has_many :members, class_name: '::Workspace::WorkspaceMember', dependent: :destroy
    has_many :users, through: :workspace_members

    # Comment out Project association for now
    has_many :projects, class_name: '::Project::Project', dependent: :destroy

    validates :name, presence: true
    validates :slug, presence: true, uniqueness: true

    before_validation :generate_slug, on: :create

    private

    def generate_slug
      return if slug.present?
      self.slug = name.parameterize

      # Handle duplicate slugs
      count = 2
      while ::Workspace::Workspace.exists?(slug: self.slug)
        self.slug = "#{name.parameterize}-#{count}"
        count += 1
      end
    end
  end
end
