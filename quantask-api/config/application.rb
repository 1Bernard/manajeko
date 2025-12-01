require_relative "boot"

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"

Bundler.require(*Rails.groups)

module QuantaskApi
  class Application < Rails::Application
    config.load_defaults 8.0

    # Use the new Rails 7+ autoloader
    config.autoloader = :zeitwerk

    # Please, add to the `ignore` list any other `lib` subdirectories that do
    # not contain `.rb` files, or that should not be reloaded or eager loaded.
    config.autoload_lib(ignore: %w[assets tasks])

    # Configuration for the application, engines, and railties goes here.
    config.api_only = true

    # Remove the problematic to_prepare block completely
    # Don't add any manual require_dependency calls

    # Add standard autoload paths
    config.autoload_paths << "#{config.root}/app"
    config.autoload_paths << "#{config.root}/features"
    config.autoload_paths << "#{config.root}/core"

    config.eager_load_paths << "#{config.root}/app"
    config.eager_load_paths << "#{config.root}/features"
    config.eager_load_paths << "#{config.root}/core"

    # Enable Rack::Attack for rate limiting
    config.middleware.use Rack::Attack
  end
end
