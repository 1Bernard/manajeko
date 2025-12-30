require 'swagger_helper'

RSpec.describe 'api/v1/notifications', type: :request do
  path '/api/v1/notifications' do
    get('list notifications') do
      tags 'Notifications'
      produces 'application/json'
      security [ bearer_auth: [] ]

      response(200, 'successful') do
        run_test!
      end
    end

    patch('mark all as read') do
      tags 'Notifications'
      produces 'application/json'
      security [ bearer_auth: [] ]

      response(200, 'successful') do
        run_test!
      end
    end
  end

  path '/api/v1/notifications/{id}/mark_read' do
    parameter name: :id, in: :path, type: :string

    patch('mark notification as read') do
      tags 'Notifications'
      produces 'application/json'
      security [ bearer_auth: [] ]

      response(200, 'successful') do
        let(:id) { '123' }
        run_test!
      end
    end
  end
end
