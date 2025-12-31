module Task
  module Commands
    class CreateTask < BaseCommand
      def initialize(user, params)
        @user = user
        @params = params
      end

      def call
        # Verify user has access to project
        project = ::Project::Project.find_by(id: @params[:project_id].to_i)
        return Result.failure('Project not found', status: :not_found) unless project

        # Check workspace membership
        member = ::Workspace::WorkspaceMember.find_by(user: @user, workspace_id: project.workspace_id)
        return Result.failure('Unauthorized', status: :forbidden) unless member

        # Normalize status and priority to lowercase/snake_case
        normalized_params = @params.except(:assignee_id, :assignee_ids, :attachments)
        normalized_params[:status] = normalized_params[:status]&.downcase&.gsub(/[\s-]/, '_') || 'todo'
        normalized_params[:priority] = normalized_params[:priority]&.downcase || 'medium'

        task = ::Task::Task.new(normalized_params)
        task.creator = @user

        # Handle assignees
        if @params[:assignee_ids].present?
          task.assignee_ids = @params[:assignee_ids]
        elsif @params[:assignee_id].present?
          task.assignee_ids = [@params[:assignee_id]]
        end

        # Set default position (last in list)
        last_position = ::Task::Task.where(project_id: project.id, status: task.status).maximum(:position) || 0
        task.position = last_position + 1000

        if task.save
          # Handle tags
          if @params[:tag_ids].present?
            @params[:tag_ids].each do |tag_id|
              ::Task::Tagging.create(task: task, tag_id: tag_id)
            end
          end

          # Handle attachments
          if @params[:attachments].present?
            @params[:attachments].each do |file|
              attachment = ::Task::Attachment.new(task: task, user: @user)
              attachment.file.attach(file)
              attachment.save
            end
          end

          # Notify assignees
          task.assignee_ids.each do |user_id|
             user = ::Identity::User.find(user_id)
             Communication::Services::NotificationService.create_notification(
               user: user,
               type: 'task_assigned',
               content: "You were assigned to task: #{task.title}",
               notifiable: task
             )
          end


          # Log Activity
          ::Task::Services::ActivityService.create_activity(@user, task.id, 'created')

          Result.success(task, status: :created)
        else
          Result.failure('Validation failed', status: :unprocessable_entity, details: task.errors.as_json)
        end
      rescue ActiveRecord::RecordInvalid => e
        Result.failure('Failed to create task', status: :unprocessable_entity, details: e.message)
      end
    end
  end
end
