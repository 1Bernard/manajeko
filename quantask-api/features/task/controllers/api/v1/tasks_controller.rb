module Task
  module Controllers
    module Api
      module V1
        class TasksController < ::Api::V1::BaseController
          def index
            tasks = ::Task::Services::TaskService.index(current_user, params[:project_id], filter_params)
            render json: ::Task::Api::V1::TaskSerializer.new(tasks).serializable_hash
          end

          def create
            result = ::Task::Services::TaskService.create(current_user, task_params.merge(project_id: params[:project_id]))
            render_command(result, serializer: ::Task::Api::V1::TaskSerializer, status: :created)
          end

          def show
            result = ::Task::Services::TaskService.show(current_user, params[:id])
            render_command(result, serializer: ::Task::Api::V1::TaskSerializer)
          end

          def update
            result = ::Task::Services::TaskService.update(current_user, params[:id], task_params)
            render_command(result, serializer: ::Task::Api::V1::TaskSerializer)
          end

          def destroy
            result = ::Task::Services::TaskService.delete(current_user, params[:id])
            render_command(result, status: :no_content)
          end

          def move
            result = ::Task::Services::TaskService.move(current_user, params[:id], params[:status], params[:position])
            render_command(result, serializer: ::Task::Api::V1::TaskSerializer)
          end

          private

          def task_params
            params.require(:task).permit(:title, :description, :status, :priority, :task_type, :start_date, :due_date, :assignee_id, assignee_ids: [], tag_ids: [], attachments: [])
          end

          def filter_params
            params.permit(:q, :status, :priority, :task_type, :assignee_id, :due_date_from, :due_date_to, :sort_by, :project_id)
          end
        end
      end
    end
  end
end
