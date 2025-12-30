require 'swagger_helper'

RSpec.describe 'api/v1/tags', type: :request do
  path '/api/v1/projects/{project_id}/tags' do
    parameter name: :project_id, in: :path, type: :string

    get('list tags') do
      tags 'Tags'
      produces 'application/json'
      security [ bearer_auth: [] ]

      response(200, 'successful') do
        let(:project_id) { '123' }
        run_test!
      end
    end

    post('create tag') do
      tags 'Tags'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :tag, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          color: { type: :string }
        },
        required: [ 'name', 'color' ]
      }

      response(201, 'created') do
        let(:project_id) { '123' }
        let(:tag) { { name: 'Bug', color: '#ff0000' } }
        run_test!
      end
    end
  end

  path '/api/v1/tags/{id}' do
    parameter name: :id, in: :path, type: :string

    patch('update tag') do
      tags 'Tags'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :tag, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          color: { type: :string }
        }
      }

      response(200, 'successful') do
        let(:id) { '123' }
        let(:tag) { { name: 'Feature' } }
        run_test!
      end
    end

    delete('delete tag') do
      tags 'Tags'
      security [ bearer_auth: [] ]

      response(204, 'no content') do
        let(:id) { '123' }
        run_test!
      end
    end
  end

  path '/api/v1/tasks/{task_id}/tags' do
    parameter name: :task_id, in: :path, type: :string

    post('add tag to task') do
      tags 'Tags'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :payload, in: :body, schema: {
        type: :object,
        properties: {
          tag_id: { type: :integer }
        },
        required: [ 'tag_id' ]
      }

      response(200, 'successful') do
        let(:task_id) { '123' }
        let(:payload) { { tag_id: 1 } }
        run_test!
      end
    end
  end

  path '/api/v1/tasks/{task_id}/tags/{tag_id}' do
    parameter name: :task_id, in: :path, type: :string
    parameter name: :tag_id, in: :path, type: :string

    delete('remove tag from task') do
      tags 'Tags'
      security [ bearer_auth: [] ]

      response(200, 'successful') do
        let(:task_id) { '123' }
        let(:tag_id) { '1' }
        run_test!
      end
    end
  end
end
