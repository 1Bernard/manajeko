module Task
  module Controllers
    module Api
      module V1
        class SubtasksController < ::Api::V1::BaseController
          def create
            result = ::Task::Services::SubtaskService.create(current_user, subtask_params.merge(task_id: params[:task_id]))
            render_command(result, serializer: ::Task::Api::V1::SubtaskSerializer, status: :created)
          end

          def update
            result = ::Task::Services::SubtaskService.update(current_user, params[:id], subtask_params)
            render_command(result, serializer: ::Task::Api::V1::SubtaskSerializer)
          end

          def destroy
            result = ::Task::Services::SubtaskService.delete(current_user, params[:id])
            render_command(result)
          end

          private

          def subtask_params
            permitted = params.require(:subtask).permit(:title, :is_completed, :completed, :position)
            if permitted.key?(:completed)
              permitted[:is_completed] = permitted.delete(:completed)
            end
            permitted
          end
        end
      end
    end
  end
end
