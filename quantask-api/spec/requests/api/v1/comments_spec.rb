require 'swagger_helper'

RSpec.describe 'api/v1/comments', type: :request do
  path '/api/v1/tasks/{task_id}/comments' do
    parameter name: :task_id, in: :path, type: :string

    get('list comments') do
      tags 'Comments'
      produces 'application/json'
      security [ bearer_auth: [] ]

      response(200, 'successful') do
        let(:task_id) { '123' }
        run_test!
      end
    end

    post('create comment') do
      tags 'Comments'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :comment, in: :body, schema: {
        type: :object,
        properties: {
          content: { type: :string }
        },
        required: [ 'content' ]
      }

      response(201, 'created') do
        let(:task_id) { '123' }
        let(:comment) { { content: 'This is a comment' } }
        run_test!
      end
    end
  end

  path '/api/v1/comments/{id}' do
    parameter name: :id, in: :path, type: :string

    delete('delete comment') do
      tags 'Comments'
      security [ bearer_auth: [] ]

      response(204, 'no content') do
        let(:id) { '123' }
        run_test!
      end
    end
  end
end
