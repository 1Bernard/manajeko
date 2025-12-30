module Task
  module Controllers
    module Api
      module V1
        class AttachmentsController < ::Api::V1::BaseController
          def create
            result = ::Task::Services::AttachmentService.create(current_user, params[:task_id], params[:file])
            render_command(result, serializer: ::Task::Api::V1::AttachmentSerializer, status: :created)
          end

          def destroy
            result = ::Task::Services::AttachmentService.delete(current_user, params[:id])
            render_command(result, status: :no_content)
          end

          def download
            result = ::Task::Services::AttachmentService.download(current_user, params[:id])
            if result.success?
              redirect_to rails_blob_url(result.value.file, disposition: "attachment")
            else
              render_error(result.error, result.status)
            end
          end
        end
      end
    end
  end
end
