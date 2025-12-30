module Intelligence
  module Services
    class AnalyticsService
      def initialize(user)
        @user = user
      end

      def dashboard_stats
        {
          total_tasks: scope.count,
          completed_tasks: completed_scope.count,
          overdue_tasks_count: overdue_scope.count,
          tasks_by_status: tasks_by_status,
          tasks_by_priority: tasks_by_priority,
          completion_trend: completion_trend,
          upcoming_deadlines: upcoming_deadlines,
          recent_activities: recent_activities
        }
      end

      private

      def scope
        # Scope to tasks assigned to the user OR created by the user
        # interacting with the tasks table directly to avoid INNER JOIN exclusion
        ::Task::Task.left_outer_joins(:task_assignments)
                    .where('task_assignments.user_id = ? OR tasks.creator_id = ?', @user.id, @user.id)
                    .distinct
      end

      def completed_scope
        scope.where(status: 'done')
      end

      def overdue_scope
        scope.where.not(status: 'done').where('due_date < ?', Time.current)
      end

      def tasks_by_status
        # Return hash: { 'todo' => 5, 'in_progress' => 2, ... }
        scope.group(:status).count
      end

      def tasks_by_priority
        scope.group(:priority).count
      end

      def completion_trend
        # Last 7 days completion counts
        (0..6).map do |i|
          date = i.days.ago.to_date
          count = scope.where(status: 'done')
                       .where(updated_at: date.beginning_of_day..date.end_of_day)
                       .count
          { date: date.to_s, count: count }
        end.reverse
      end

      def upcoming_deadlines
        # Top 5 tasks due soon (excluding done)
        # We need tasks that are NOT done, and sorted by due_date ascending (nearest first)
        # Also ensure due_date is in the future or today
        scope.where.not(status: 'done')
             .where('due_date >= ?', Time.current.beginning_of_day)
             .order(due_date: :asc)
             .limit(5)
             .as_json(
               only: [:id, :title, :due_date, :priority, :status],
               include: {
                 assignees: { 
                   only: [:id, :first_name, :last_name, :email], 
                   methods: [:initials, :full_name] # Ensure we have initials and full name
                 }
               }
             )
             .map do |task| 
                # Enhance with frontend-friendly assignees format if needed, 
                # ActiveModelSerializers usually handles this but we are doing raw json here for speed/custom structure
                task.merge('assignees' => task['assignees'] || [])
             end
      end

      def recent_activities
        # Get activities related to the user's tasks
        # Or unrelated activities in projects where user is a member? 
        # For layout simplicity, let's show activities on tasks visible to the user.
        
        task_ids = scope.pluck(:id)
        
        ::Task::Activity.where(task_id: task_ids)
                        .includes(:user, :task)
                        .order(created_at: :desc)
                        .limit(10)
                        .map do |activity|
                          {
                            id: activity.id,
                            user: {
                              id: activity.user.id,
                              name: activity.user.full_name,
                              avatar: (activity.user.avatar_url rescue nil) # Handle missing avatar method safely
                            },
                            action: activity.action_type,
                            target: activity.task.title,
                            time: activity.created_at.strftime("%b %d, %H:%M") # Format: Dec 15, 09:30
                          }
                        end
      end
    end
  end
end
