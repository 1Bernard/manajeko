require 'swagger_helper'

RSpec.describe 'api/v1/workspaces', type: :request do

  path '/api/v1/workspaces' do

    get('list workspaces') do
      tags 'Workspaces'
      produces 'application/json'
      security [ bearer_auth: [] ]

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

    post('create workspace') do
      tags 'Workspaces'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :workspace, in: :body, schema: {
        type: :object,
        properties: {
          name: { type: :string },
          description: { type: :string, nullable: true },
          logo_url: { type: :string, nullable: true }
        },
        required: [ 'name' ]
      }

      response(201, 'created') do
        let(:workspace) { { name: 'My New Workspace' } }

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

  path '/api/v1/workspaces/{id}/members' do
    get('list workspace members') do
      tags 'Workspaces'
      produces 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :id, in: :path, type: :string, description: 'Workspace ID'

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
  end
end
