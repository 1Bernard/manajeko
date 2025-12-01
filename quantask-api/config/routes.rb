Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # API Routes
  namespace :api do
    namespace :v1 do
      # Auth Routes (Identity feature) - Identity::Controllers::Api::V1::AuthController
      post 'auth/register', controller: '/identity/controllers/api/v1/auth', action: :register
      post 'auth/login', controller: '/identity/controllers/api/v1/auth', action: :login
      post 'auth/verify-otp', controller: '/identity/controllers/api/v1/auth', action: :verify_otp
      post 'auth/forgot-password', controller: '/identity/controllers/api/v1/auth', action: :forgot_password
      post 'auth/reset-password', controller: '/identity/controllers/api/v1/auth', action: :reset_password
      get 'auth/me', controller: '/identity/controllers/api/v1/auth', action: :me

      # Global Search
      get 'search', to: 'search#index'

      # Analytics - Intelligence::Controllers::Api::V1::AnalyticsController
      get 'analytics/task-stats', controller: '/intelligence/controllers/api/v1/analytics', action: :task_stats
      get 'analytics/recent-activities', controller: '/intelligence/controllers/api/v1/analytics', action: :recent_activities


      # Workspaces - Workspace::Controllers::Api::V1::WorkspacesController
      resources :workspaces, controller: '/workspace/controllers/api/v1/workspaces' do
        resources :projects, only: [:index, :create], controller: '/project/controllers/api/v1/projects'
        resources :members, only: [:index], controller: '/workspace/controllers/api/v1/members'
        resources :invitations, only: [:create], controller: '/workspace/controllers/api/v1/workspace_invitations'
      end

      # Projects - Project::Controllers::Api::V1::ProjectsController
      resources :projects, only: [:show, :update, :destroy], controller: '/project/controllers/api/v1/projects' do
        resources :tasks, only: [:index, :create], controller: '/task/controllers/api/v1/tasks'
        resources :tags, only: [:index, :create], controller: '/task/controllers/api/v1/tags'
      end

      # Tasks - Task::Controllers::Api::V1::TasksController
      resources :tasks, only: [:show, :update, :destroy], controller: '/task/controllers/api/v1/tasks' do
        member do
          patch :move
        end
        resources :subtasks, only: [:create], controller: '/task/controllers/api/v1/subtasks'
        resources :comments, only: [:index, :create], controller: '/task/controllers/api/v1/comments'
        resources :attachments, only: [:create], controller: '/task/controllers/api/v1/attachments'
      end

      # Subtasks - Task::Controllers::Api::V1::SubtasksController
      resources :subtasks, only: [:update, :destroy], controller: '/task/controllers/api/v1/subtasks'

      # Comments - Task::Controllers::Api::V1::CommentsController
      resources :comments, only: [:destroy], controller: '/task/controllers/api/v1/comments'

      # Attachments - Task::Controllers::Api::V1::AttachmentsController
      resources :attachments, only: [:destroy], controller: '/task/controllers/api/v1/attachments' do
        member do
          get :download
        end
      end

      # Tags - Task::Controllers::Api::V1::TagsController
      resources :tags, only: [:index, :create, :update, :destroy], controller: '/task/controllers/api/v1/tags'
      post   'tasks/:task_id/tags',         to: '/task/controllers/api/v1/tags#add_to_task'
      delete 'tasks/:task_id/tags/:tag_id', to: '/task/controllers/api/v1/tags#remove_from_task'
    end
  end

  # Catch-all routes (must be at the very end)
  # Catch-all routes (must be at the very end)
  match '/404', to: 'api/v1/errors#not_found', via: :all
  match '/500', to: 'api/v1/errors#internal_server_error', via: :all
  
  # Exclude Rails internal routes (ActiveStorage, ActionMailbox, etc.) from catch-all
  match '*unmatched', to: 'api/v1/errors#not_found', via: :all, constraints: ->(req) { !req.path.start_with?('/rails/') }

  # Defines the root path route ("/")
  # root "posts#index"
end
