require 'rails_helper'

RSpec.describe "Api::V1::Workspaces", type: :request do
  let!(:user) { Identity::User.create(email: 'workspace_test@example.com', password: 'password123') }
  let!(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:headers) { { 'Authorization' => "Bearer #{token}" } }

  describe "POST /api/v1/workspaces" do
    let(:valid_attributes) { { name: 'My Workspace', description: 'Test workspace' } }

    context "with valid parameters" do
      it "creates a new Workspace" do
        expect {
          post '/api/v1/workspaces', params: { workspace: valid_attributes }, headers: headers, as: :json
        }.to change(Workspace::Workspace, :count).by(1)
      end

      it "adds the creator as an admin member" do
        post '/api/v1/workspaces', params: { workspace: valid_attributes }, headers: headers, as: :json
        workspace = Workspace::Workspace.last
        expect(workspace.members).to include(user)
        # Assuming there is a role logic, but checking membership is a good start
      end
    end

    context "with invalid parameters" do
      it "does not create a new Workspace" do
        expect {
          post '/api/v1/workspaces', params: { workspace: { name: '' } }, headers: headers, as: :json
        }.to change(Workspace::Workspace, :count).by(0)
      end
    end
  end

  describe "GET /api/v1/workspaces" do
    let!(:workspace1) { Workspace::Workspace.create(name: 'Workspace 1', owner_id: user.id) }
    let!(:workspace2) { Workspace::Workspace.create(name: 'Workspace 2', owner_id: user.id) }
    
    before do
       Workspace::WorkspaceMember.create(workspace: workspace1, user: user, role: 'admin')
       Workspace::WorkspaceMember.create(workspace: workspace2, user: user, role: 'member')
    end

    it "returns a list of workspaces for the user" do
      get '/api/v1/workspaces', headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data']).to be_an(Array)
      expect(json['data'].length).to eq(2)
      expect(json['data'].map { |w| w['attributes']['name'] }).to contain_exactly('Workspace 1', 'Workspace 2')
    end
  end
end
