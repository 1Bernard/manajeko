require 'rails_helper'

RSpec.describe "Api::V1::Auth", type: :request do
  describe "POST /api/v1/auth/register" do
    let(:valid_attributes) do
      {
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123',
        first_name: 'Test',
        last_name: 'User',
        otp_method: 'email'
      }
    end

    context "with valid parameters" do
      it "creates a new User" do
        expect {
          post '/api/v1/auth/register', params: valid_attributes
        }.to change(Identity::User, :count).by(1)
      end

      it "returns a created status and sends OTP" do
        post '/api/v1/auth/register', params: valid_attributes
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)['message']).to include('OTP sent')
      end
    end

    context "with invalid parameters" do
      it "does not create a new User" do
        expect {
          post '/api/v1/auth/register', params: valid_attributes.merge(password: 'short')
        }.to change(Identity::User, :count).by(0)
      end

      it "returns an unprocessable entity status" do
        post '/api/v1/auth/register', params: valid_attributes.merge(email: '')
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "POST /api/v1/auth/login" do
    let!(:user) { Identity::User.create(email: 'login@example.com', password: 'password123', otp_method: 'email') }

    context "with valid credentials" do
      it "returns success and triggers OTP" do
        post '/api/v1/auth/login', params: { email: 'login@example.com', password: 'password123' }
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)['message']).to include('OTP sent')
      end
    end

    context "with invalid credentials" do
      it "returns unauthorized status" do
        post '/api/v1/auth/login', params: { email: 'login@example.com', password: 'wrongpassword' }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "POST /api/v1/auth/verify-otp" do
    let!(:user) { Identity::User.create(email: 'verify@example.com', password: 'password123', otp_code: '123456', otp_expires_at: 10.minutes.from_now) }

    context "with valid code" do
      it "returns token and user data" do
        post '/api/v1/auth/verify-otp', params: { email: 'verify@example.com', otp_code: '123456' }
        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['data']['attributes']['email']).to eq('verify@example.com')
      end
    end

    context "with invalid code" do
      it "returns unauthorized status" do
        post '/api/v1/auth/verify-otp', params: { email: 'verify@example.com', otp_code: '000000' }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context "with expired code" do
      before { user.update(otp_expires_at: 1.minute.ago) }

      it "returns unauthorized status" do
        post '/api/v1/auth/verify-otp', params: { email: 'verify@example.com', otp_code: '123456' }
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
end
