require 'swagger_helper'

RSpec.describe 'api/v1/tasks', type: :request do

  path '/api/v1/tasks' do

    get('list tasks') do
      tags 'Tasks'
      produces 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :project_id, in: :query, type: :string, description: 'Filter by Project ID', required: false
      parameter name: :q, in: :query, type: :string, description: 'Search term', required: false
      parameter name: :status, in: :query, type: :string, description: 'Filter by status', required: false
      parameter name: :priority, in: :query, type: :string, description: 'Filter by priority', required: false
      parameter name: :task_type, in: :query, type: :string, description: 'Filter by task type', required: false
      parameter name: :assignee_id, in: :query, type: :string, description: 'Filter by assignee', required: false
      parameter name: :due_date_from, in: :query, type: :string, format: 'date', description: 'Due date from', required: false
      parameter name: :due_date_to, in: :query, type: :string, format: 'date', description: 'Due date to', required: false
      parameter name: :sort_by, in: :query, type: :string, description: 'Sort criteria (due_date, priority)', required: false

      response(200, 'successful') do
        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end

    post('create task') do
      tags 'Tasks'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :project_id, in: :query, type: :string, description: 'Project ID', required: true
      parameter name: :task, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          description: { type: :string },
          status: { type: :string },
          priority: { type: :string },
          task_type: { type: :string, nullable: true },
          due_date: { type: :string, format: 'date', nullable: true },
          start_date: { type: :string, format: 'date', nullable: true },
          assignee_id: { type: :string, nullable: true },
          assignee_ids: { type: :array, items: { type: :integer }, nullable: true },
          tag_ids: { type: :array, items: { type: :integer }, nullable: true }
        },
        required: [ 'title', 'status', 'priority' ]
      }

      response(201, 'created') do
        let(:project_id) { '1' }
        let(:task) { { title: 'New Task', status: 'todo', priority: 'medium' } }

        after do |example|
          example.metadata[:response][:content] = {
            'application/json' => {
              example: JSON.parse(response.body, symbolize_names: true)
            }
          }
        end
        run_test!
      end
    end
  end
end
