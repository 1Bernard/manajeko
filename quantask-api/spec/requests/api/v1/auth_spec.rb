require 'swagger_helper'

RSpec.describe 'api/v1/auth', type: :request do

  path '/api/v1/auth/register' do
    post('register user') do
      tags 'Authentication'
      consumes 'application/json'
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          password: { type: :string },
          password_confirmation: { type: :string },
          first_name: { type: :string, nullable: true },
          last_name: { type: :string, nullable: true },
          phone_number: { type: :string, nullable: true },
          otp_method: { type: :string, enum: ['email', 'sms'], default: 'email' }
        },
        required: [ 'email', 'password', 'password_confirmation' ]
      }

      response(201, 'created') do
        let(:user) { { email: 'new@example.com', password: 'password', full_name: 'New User' } }
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

  path '/api/v1/auth/verify-otp' do
    post('verify otp') do
      tags 'Authentication'
      consumes 'application/json'
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          otp_code: { type: :string }
        },
        required: [ 'email', 'otp_code' ]
      }

      response(200, 'successful') do
        let(:credentials) { { email: 'user@example.com', otp_code: '123456' } }
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

  path '/api/v1/auth/resend-otp' do
    post('resend otp') do
      tags 'Authentication'
      consumes 'application/json'
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string }
        },
        required: [ 'email' ]
      }

      response(200, 'successful') do
        let(:credentials) { { email: 'user@example.com' } }
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

  path '/api/v1/auth/login' do
    post('login user') do
      tags 'Authentication'
      consumes 'application/json'
      parameter name: :credentials, in: :body, schema: {
        type: :object,
        properties: {
          email: { type: :string },
          password: { type: :string }
        },
        required: [ 'email', 'password' ]
      }

      response(200, 'successful') do
        let(:credentials) { { email: 'user@example.com', password: 'password' } }
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

  path '/api/v1/auth/me' do
    get('get current user profile') do
      tags 'Authentication'
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

    patch('update profile') do
      tags 'Authentication'
      consumes 'application/json'
      security [ bearer_auth: [] ]
      parameter name: :user, in: :body, schema: {
        type: :object,
        properties: {
          first_name: { type: :string, nullable: true },
          last_name: { type: :string, nullable: true },
          job_title: { type: :string, nullable: true },
          bio: { type: :string, nullable: true },
          location: { type: :string, nullable: true },
          avatar: { type: :string, nullable: true } # Base64 string or URL depending on implementation
        }
      }

      response(200, 'successful') do
        let(:user) { { first_name: 'Updated Name' } }
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
