module Task
  module Controllers
    module Api
      module V1
        class TagsController < ::Api::V1::BaseController
          def index
            result = ::Task::Services::TagService.index(params[:project_id])
            if result.success?
              render json: ::Task::Api::V1::TagSerializer.new(result.value).serializable_hash
            else
              render json: { error: result.error }, status: result.status
            end
          end

          def create
            # Merge project_id from URL params if present
            create_params = tag_params.merge(project_id: params[:project_id])
            result = ::Task::Services::TagService.create(current_user, create_params)
            render_command(result, serializer: ::Task::Api::V1::TagSerializer, status: :created)
          end

          def update
            result = ::Task::Services::TagService.update(current_user, params[:id], tag_params)
            render_command(result, serializer: ::Task::Api::V1::TagSerializer)
          end

          def destroy
            result = ::Task::Services::TagService.delete(current_user, params[:id])
            render_command(result)
          end

          def add_to_task
            result = ::Task::Services::TagService.add_to_task(current_user, params[:task_id], params[:tag_id])
            render_command(result)
          end

          def remove_from_task
            result = ::Task::Services::TagService.remove_from_task(current_user, params[:task_id], params[:tag_id])
            render_command(result)
          end

          private

          def tag_params
            params.require(:tag).permit(:name, :color, :project_id)
          end
        end
      end
    end
  end
end
