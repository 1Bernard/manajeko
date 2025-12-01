module Task
  module Controllers
    module Api
      module V1
        class CommentsController < ::Api::V1::BaseController
          def index
            # We can implement a query for listing comments if needed, or just return empty for now
            # For now, let's assume comments are included in task details or fetched separately
            render json: { message: "Comments list not implemented yet" }
          end

          def create
            # Merge task_id from route params into comment params
            comment_params_with_task = comment_params.merge(task_id: params[:task_id])
            result = Task::Commands::CreateComment.call(current_user, comment_params_with_task)
            render_command(result, serializer: Task::Api::V1::CommentSerializer, status: :created)
          end

          def destroy
            result = Task::Commands::DeleteComment.call(current_user, params[:id])
            render_command(result)
          end

          private

          def comment_params
            params.require(:comment).permit(:content)
          end
        end
      end
    end
  end
end
