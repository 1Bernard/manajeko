module Task
  module Controllers
    module Api
      module V1
        class TasksController < ::Api::V1::BaseController
          def index
            tasks = ::Task::Queries::SearchTasks.call(current_user, params[:project_id], filter_params)
            render json: ::Task::Api::V1::TaskSerializer.new(tasks).serializable_hash
          end

          def create
            # Merge project_id from route params into task params
            task_params_with_project = task_params.merge(project_id: params[:project_id])
            result = ::Task::Commands::CreateTask.call(current_user, task_params_with_project)
            render_command(result, serializer: ::Task::Api::V1::TaskSerializer, status: :created)
          end

          def show
            result = ::Task::Queries::FindTask.call(current_user, params[:id])
            render_command(result, serializer: ::Task::Api::V1::TaskSerializer)
          end

          def update
            result = ::Task::Commands::UpdateTask.call(current_user, params[:id], task_params)
            render_command(result, serializer: ::Task::Api::V1::TaskSerializer)
          end

          def destroy
            result = ::Task::Commands::DeleteTask.call(current_user, params[:id])
            render_command(result, status: :no_content)
          end

          def move
            result = ::Task::Commands::MoveTask.call(current_user, params[:id], params[:status], params[:position])
            render_command(result, serializer: ::Task::Api::V1::TaskSerializer)
          end

          private

          def task_params
            params.require(:task).permit(:title, :description, :status, :priority, :task_type, :due_date, :assignee_id, assignee_ids: [], tag_ids: [], attachments: [])
          end

          def filter_params
            params.permit(:q, :status, :priority, :task_type, :assignee_id, :due_date_from, :due_date_to, :sort_by)
          end
        end
      end
    end
  end
end
