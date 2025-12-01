module Workspace
  class WorkspaceMember < ::ApplicationRecord
    self.table_name = 'workspace_members'

    # Use string class names
    belongs_to :workspace, class_name: '::Workspace::Workspace'
    belongs_to :user, class_name: '::Identity::User'

    validates :role, presence: true, inclusion: { in: %w[owner admin member viewer] }
    validates :user_id, uniqueness: { scope: :workspace_id, message: "is already a member of this workspace" }
  end
end
