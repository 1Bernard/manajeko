# Preload feature controllers to avoid routing errors on first request
Rails.application.config.after_initialize do
  # In development, eager load the feature controllers
  # This ensures they're available when routes are first matched
  if Rails.env.development?
    Identity::Controllers::Api::V1::AuthController
    Workspace::Controllers::Api::V1::WorkspacesController
    Project::Controllers::Api::V1::ProjectsController
    Task::Controllers::Api::V1::TasksController
  end
end
