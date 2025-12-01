module Project
  module Commands
    class CreateProject < BaseCommand
      def initialize(user, params)
        @user = user
        @params = params
      end

      def call
        defaults = { 'status' => 'active', 'visibility' => 'private' }
        project = ::Project::Project.new(defaults.merge(@params))
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
