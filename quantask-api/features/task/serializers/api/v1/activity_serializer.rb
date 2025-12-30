module Task
  module Api
    module V1
      class ActivitySerializer < ::Api::V1::BaseSerializer
        attributes :id, :action_type, :details, :created_at

        attribute :user do |activity|
          if activity.user
            colors = ['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-500', 'bg-purple-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500']
            {
              id: activity.user.id,
              name: activity.user.full_name,
              first_name: activity.user.first_name,
              last_name: activity.user.last_name,
              initials: activity.user.initials,
              avatar_url: activity.user.avatar_url,
              color: colors[activity.user.id % colors.length]
            }
          end
        end
      end
    end
  end
end
