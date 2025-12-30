class SearchService
  def self.search(user, query, search_type = 'all')
    return Result.failure('Query parameter required', status: :bad_request) if query.blank?

    results = case search_type
              when 'tasks'
                { tasks: SearchTasksQuery.call(user, query), projects: [], users: [] }
              when 'projects'
                { tasks: [], projects: SearchProjectsQuery.call(user, query), users: [] }
              when 'users'
                { tasks: [], projects: [], users: SearchUsersQuery.call(user, query) }
              else
                {
                  tasks: SearchTasksQuery.call(user, query),
                  projects: SearchProjectsQuery.call(user, query),
                  users: SearchUsersQuery.call(user, query)
                }
              end

    results[:total] = results[:tasks].size + results[:projects].size + results[:users].size

    Result.success(results)
  end
end
