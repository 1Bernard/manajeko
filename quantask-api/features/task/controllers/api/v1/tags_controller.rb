module Task
  module Controllers
    module Api
      module V1
        class TagsController < ::Api::V1::BaseController
          def index
            if params[:project_id]
              tags = ::Task::Tag.where(project_id: params[:project_id]).ordered
              render json: ::Task::Api::V1::TagSerializer.new(tags).serializable_hash
            else
              render json: { error: "Project ID required" }, status: :bad_request
            end
          end

          def create
            project_id = params[:project_id] || params.dig(:tag, :project_id)
            result = ::Task::Commands::CreateTag.call(current_user, tag_params.merge(project_id: project_id))
            render_command(result, serializer: ::Task::Api::V1::TagSerializer, status: :created)
          end

          def update
            result = ::Task::Commands::UpdateTag.call(current_user, params[:id], tag_params)
            render_command(result, serializer: ::Task::Api::V1::TagSerializer)
          end

          def destroy
            result = ::Task::Commands::DeleteTag.call(current_user, params[:id])
            render_command(result)
          end

          def add_to_task
            result = ::Task::Commands::AddTagToTask.call(current_user, params[:task_id], params[:tag_id])
            render_command(result)
          end

          def remove_from_task
            result = ::Task::Commands::RemoveTagFromTask.call(current_user, params[:task_id], params[:tag_id])
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
