module Identity
  class User < ::ApplicationRecord
    self.table_name = 'users'
    has_secure_password

    has_many :owned_workspaces, class_name: '::Workspace::Workspace', foreign_key: 'owner_id', dependent: :destroy
    has_many :workspace_members, class_name: '::Workspace::WorkspaceMember', dependent: :destroy
    has_many :workspaces, through: :workspace_members, class_name: '::Workspace::Workspace'
    
    has_many :owned_projects, class_name: '::Project::Project', foreign_key: 'owner_id', dependent: :destroy
    has_many :created_tasks, class_name: '::Task::Task', foreign_key: 'creator_id', dependent: :destroy
    has_many :assigned_tasks_legacy, class_name: '::Task::Task', foreign_key: 'assignee_id' # Deprecated
    
    has_many :task_assignments, class_name: '::Task::TaskAssignment', dependent: :destroy
    has_many :assigned_tasks, through: :task_assignments, source: :task, class_name: '::Task::Task'
    has_many :comments, class_name: '::Task::Comment'

    validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
    validates :phone_number, presence: true, if: -> { otp_method == 'sms' }

    enum :otp_method, { email: 'email', sms: 'sms' }

    def valid_otp?(code)
      otp_code == code && otp_expires_at > Time.current
    end

    def clear_otp!
      update!(otp_code: nil, otp_expires_at: nil)
    end

    def initials
      return '?' if first_name.blank? && last_name.blank?
      "#{first_name&.first}#{last_name&.first}".upcase
    end

    def full_name
      "#{first_name} #{last_name}".strip.presence || email
    end
  end
end
