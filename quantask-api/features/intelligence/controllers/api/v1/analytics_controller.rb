module Intelligence
  module Controllers
    module Api
      module V1
        class AnalyticsController < ::Api::V1::BaseController
          def task_stats
            tasks = ::Task::Task.accessible_by(current_user)
            
            stats = {
              todo: tasks.where(status: 'todo').count,
              inProgress: tasks.where(status: 'in_progress').count,
              inReview: tasks.where(status: 'in_review').count,
              completed: tasks.where(status: 'done').count,
              total: tasks.count,
              highPriority: tasks.where(priority: 'high').count
            }
            
            render json: stats
          end

          def recent_activities
            # Mock activities for now, as we don't have an ActivityLog model yet
            activities = [
              { 
                id: 1, 
                user: { id: 1, name: 'Calum Tyler', avatar: 'https://i.pravatar.cc/150?u=1' }, 
                action: 'completed task', 
                target: 'Design System', 
                time: '10m ago' 
              },
              { 
                id: 2, 
                user: { id: 2, name: 'Dawson Tarman', avatar: 'https://i.pravatar.cc/150?u=2' }, 
                action: 'commented on', 
                target: 'KPI Dashboard', 
                time: '1h ago' 
              },
              { 
                id: 3, 
                user: { id: 3, name: 'Alice Smith', avatar: 'https://i.pravatar.cc/150?u=3' }, 
                action: 'attached file to', 
                target: 'Employee Data', 
                time: '3h ago' 
              },
              { 
                id: 4, 
                user: { id: 1, name: 'Calum Tyler', avatar: 'https://i.pravatar.cc/150?u=1' }, 
                action: 'created new project', 
                target: 'Mobile App V2', 
                time: '5h ago' 
              },
              { 
                id: 5, 
                user: { id: 2, name: 'Dawson Tarman', avatar: 'https://i.pravatar.cc/150?u=2' }, 
                action: 'moved task', 
                target: 'Server Setup', 
                time: 'Yesterday' 
              }
            ]
            
            render json: activities
          end
        end
      end
    end
  end
end
