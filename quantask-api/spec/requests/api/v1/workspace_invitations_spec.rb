require 'swagger_helper'

RSpec.describe 'api/v1/workspace_invitations', type: :request do
  path '/api/v1/workspaces/{workspace_id}/invitations' do
    parameter name: :workspace_id, in: :path, type: :string

    post('invite member') do
      tags 'Workspace Invitations'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :invitation, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          role: { type: :string, enum: ['member', 'admin'] }
        },
        required: [ 'email' ]
      }

      response(201, 'created') do
        let(:workspace_id) { '123' }
        let(:invitation) { { email: 'user@example.com' } }
        run_test!
      end
    end
  end
end
