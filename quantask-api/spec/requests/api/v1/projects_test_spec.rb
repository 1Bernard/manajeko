require 'rails_helper'

RSpec.describe "Api::V1::Projects", type: :request do
  let(:user) { Identity::User.create(email: 'project_test@example.com', password: 'password123') }
  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:headers) { { 'Authorization' => "Bearer #{token}" } }
  let(:workspace) { Workspace::Workspace.create(name: 'Test Workspace', owner_id: user.id) }

  before do
    Workspace::WorkspaceMember.create(workspace: workspace, user: user, role: 'admin')
  end

  describe "POST /api/v1/workspaces/:workspace_id/projects" do
    let(:valid_attributes) { { name: 'New Project', description: 'Test Project', status: 'active', workspace_id: workspace.id } }

    context "with valid parameters" do
      it "creates a new Project" do
        expect {
          post "/api/v1/workspaces/#{workspace.id}/projects", params: { project: valid_attributes }, headers: headers
        }.to change(Project::Project, :count).by(1)
      end

      it "returns created status" do
        post "/api/v1/workspaces/#{workspace.id}/projects", params: { project: valid_attributes }, headers: headers
        expect(response).to have_http_status(:created)
      end
    end

    context "with invalid parameters" do
      it "returns unprocessable entity" do
        post "/api/v1/workspaces/#{workspace.id}/projects", params: { project: { name: '' } }, headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "GET /api/v1/workspaces/:workspace_id/projects" do
    let!(:project1) { Project::Project.create(name: 'Project 1', workspace: workspace) }
    let!(:project2) { Project::Project.create(name: 'Project 2', workspace: workspace) }

    it "returns list of projects in workspace" do
      get "/api/v1/workspaces/#{workspace.id}/projects", headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['data']).to be_an(Array)
      names = json['data'].map { |p| p['attributes']['name'] }
      expect(names).to include('Project 1', 'Project 2')
    end
  end
end
