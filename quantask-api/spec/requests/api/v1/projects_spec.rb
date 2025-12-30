require 'swagger_helper'

RSpec.describe 'api/v1/projects', type: :request do

  path '/api/v1/workspaces/{workspace_id}/projects' do
    parameter name: :workspace_id, in: :path, type: :string, description: 'Workspace ID'

    get('list projects') do
      tags 'Projects'
      produces 'application/json'
      security [ bearer_auth: [] ]

      response(200, 'successful') do
        let(:workspace_id) { '1' }
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

    post('create project') do
      tags 'Projects'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :project, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          description: { type: :string },
          visibility: { type: :string, enum: ['private', 'public'] },
          color: { type: :string },
          icon: { type: :string, nullable: true }, # Emoji or icon name
          banner_image: { type: :string, nullable: true }, # URL or Base64
          status: { type: :string }
        },
        required: [ 'name' ]
      }

      response(201, 'created') do
        let(:workspace_id) { '1' }
        let(:project) { { name: 'New Project', visibility: 'private' } }

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

  path '/api/v1/projects/{id}' do
    parameter name: :id, in: :path, type: :string, description: 'Project ID'

    get('show project') do
      tags 'Projects'
      produces 'application/json'
      security [ bearer_auth: [] ]

      response(200, 'successful') do
        let(:id) { '1' }
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

    patch('update project') do
      tags 'Projects'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :project, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          description: { type: :string },
          status: { type: :string },
          color: { type: :string },
          visibility: { type: :string, enum: ['private', 'public'] },
          icon: { type: :string, nullable: true },
          banner_image: { type: :string, nullable: true }
        }
      }

      response(200, 'successful') do
        let(:id) { '1' }
        let(:project) { { name: 'Updated Project Name' } }
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

    delete('delete project') do
      tags 'Projects'
      security [ bearer_auth: [] ]

      response(204, 'no content') do
        let(:id) { '1' }
        run_test!
      end
    end
  end
end
