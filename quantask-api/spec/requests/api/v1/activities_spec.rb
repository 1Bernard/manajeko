require 'swagger_helper'

RSpec.describe 'api/v1/activities', type: :request do
  path '/api/v1/tasks/{task_id}/activities' do
    parameter name: :task_id, in: :path, type: :string

    get('list task activities') do
      tags 'Activities'
      produces 'application/json'
      security [ bearer_auth: [] ]

      response(200, 'successful') do
        let(:task_id) { '123' }
        run_test!
      end
    end
  end
end
