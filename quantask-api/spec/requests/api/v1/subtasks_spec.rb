require 'swagger_helper'

RSpec.describe 'api/v1/subtasks', type: :request do
  path '/api/v1/tasks/{task_id}/subtasks' do
    parameter name: :task_id, in: :path, type: :string

    post('create subtask') do
      tags 'Subtasks'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :subtask, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          is_completed: { type: :boolean }
        },
        required: [ 'title' ]
      }

      response(201, 'created') do
        let(:task_id) { '123' }
        let(:subtask) { { title: 'New Subtask' } }
        run_test!
      end
    end
  end

  path '/api/v1/subtasks/{id}' do
    parameter name: :id, in: :path, type: :string

    patch('update subtask') do
      tags 'Subtasks'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :subtask, in: :body, schema: {
        type: :object,
        properties: {
          title: { type: :string },
          is_completed: { type: :boolean }
        }
      }

      response(200, 'successful') do
        let(:id) { '123' }
        let(:subtask) { { is_completed: true } }
        run_test!
      end
    end

    delete('delete subtask') do
      tags 'Subtasks'
      security [ bearer_auth: [] ]

      response(204, 'no content') do
        let(:id) { '123' }
        run_test!
      end
    end
  end
end
