require 'swagger_helper'

RSpec.describe 'api/v1/attachments', type: :request do
  path '/api/v1/tasks/{task_id}/attachments' do
    parameter name: :task_id, in: :path, type: :string

    post('upload attachment') do
      tags 'Attachments'
      consumes 'multipart/form-data'
      security [ bearer_auth: [] ]
      parameter name: :files, in: :formData, schema: {
        type: :object,
        properties: {
          files: { type: :array, items: { type: :string, format: :binary } }
        }
      }

      response(201, 'created') do
        let(:task_id) { '123' }
        let(:files) { [] }
        run_test!
      end
    end
  end

  path '/api/v1/attachments/{id}' do
    parameter name: :id, in: :path, type: :string

    delete('delete attachment') do
      tags 'Attachments'
      security [ bearer_auth: [] ]

      response(204, 'no content') do
        let(:id) { '123' }
        run_test!
      end
    end
  end

  path '/api/v1/attachments/{id}/download' do
    parameter name: :id, in: :path, type: :string

    get('download attachment') do
      tags 'Attachments'
      security [ bearer_auth: [] ]

      response(302, 'found') do
        let(:id) { '123' }
        run_test!
      end
    end
  end
end
