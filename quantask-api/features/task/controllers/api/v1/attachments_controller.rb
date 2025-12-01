module Task
  module Controllers
    module Api
      module V1
        class AttachmentsController < ::Api::V1::BaseController
          def create
            # Merge task_id from route params into attachment params
            result = Task::Commands::CreateAttachment.call(current_user, params[:task_id], params[:file])
            render_command(result, serializer: Task::Api::V1::AttachmentSerializer, status: :created)
          end

          def destroy
            result = Task::Commands::DeleteAttachment.call(current_user, params[:id])
            render_command(result, status: :no_content)
          end

          def download
            attachment = Task::Attachment.find_by(id: params[:id])
            if attachment
              redirect_to rails_blob_url(attachment.file, disposition: "attachment")
            else
              render_error('Attachment not found', :not_found)
            end
          end
        end
      end
    end
  end
end
