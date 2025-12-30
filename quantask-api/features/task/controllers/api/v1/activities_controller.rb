module Task
  module Controllers
    module Api
      module V1
        class ActivitiesController < ::Api::V1::BaseController
          def index
            activities = ::Task::Services::ActivityService.list_for_task(params[:task_id])
            render json: ::Task::Api::V1::ActivitySerializer.new(activities).serializable_hash
          end
        end
      end
    end
  end
end
