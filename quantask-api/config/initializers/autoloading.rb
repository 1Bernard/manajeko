# Ensure feature modules are loaded
Rails.application.config.after_initialize do
  # Force load the Identity module
  require_dependency Rails.root.join('features/identity/models/user') if defined?(Rails::Server)
end
