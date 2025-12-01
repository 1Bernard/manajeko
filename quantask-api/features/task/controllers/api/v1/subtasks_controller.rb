module Task
  module Controllers
    module Api
      module V1
        class SubtasksController < ::Api::V1::BaseController
          def create
            # Merge task_id from route params into subtask params
            subtask_params_with_task = subtask_params.merge(task_id: params[:task_id])
            result = Task::Commands::CreateSubtask.call(current_user, subtask_params_with_task)
            render_command(result, serializer: Task::Api::V1::SubtaskSerializer, status: :created)
          end

          def update
            result = Task::Commands::UpdateSubtask.call(current_user, params[:id], subtask_params)
            render_command(result, serializer: Task::Api::V1::SubtaskSerializer)
          end

          def destroy
            result = Task::Commands::DeleteSubtask.call(current_user, params[:id])
            render_command(result)
          end

          private

          def subtask_params
            params.require(:subtask).permit(:title, :is_completed, :position)
          end
        end
      end
    end
  end
end
