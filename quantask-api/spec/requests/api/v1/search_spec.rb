require 'swagger_helper'

RSpec.describe 'api/v1/search', type: :request do
  path '/api/v1/search' do
    get('global search') do
      tags 'Search'
      produces 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :q, in: :query, type: :string, description: 'Search term', required: true

      response(200, 'successful') do
        let(:q) { 'test' }
        run_test!
      end
    end
  end
end
