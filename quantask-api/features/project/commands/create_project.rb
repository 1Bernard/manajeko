module Project
  module Commands
    class CreateProject < BaseCommand
      def initialize(user, params)
        @user = user
        @params = params
      end

      def call
        # Find workspace
        workspace = ::Workspace::Workspace.find_by(id: @params[:workspace_id] || @params['workspace_id'])
        return Result.failure('Workspace not found', status: :not_found) unless workspace

        # Verify user has access to workspace
        unless workspace.members.exists?(user: @user)
          return Result.failure('Unauthorized', status: :forbidden)
        end

        # Create project with defaults
        defaults = { 'status' => 'active', 'visibility' => 'private' }
        project_params = defaults.merge(@params.except(:workspace_id, 'workspace_id'))
        
        project = ::Project::Project.new(project_params)
        project.workspace = workspace
        project.owner = @user

        if project.save
          Result.success(project, status: :created)
        else
          Rails.logger.error("Project creation failed: #{project.errors.full_messages}")
          Result.failure('Validation failed', status: :unprocessable_entity, details: project.errors.as_json)
        end
      rescue ActiveRecord::RecordInvalid => e
        Result.failure('Failed to create project', status: :unprocessable_entity, details: e.message)
      end
    end
  end
end
