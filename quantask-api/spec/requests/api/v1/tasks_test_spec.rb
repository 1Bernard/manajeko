require 'rails_helper'

RSpec.describe "Api::V1::Tasks", type: :request do
  let(:user) { Identity::User.create(email: 'task_test@example.com', password: 'password123') }
  let(:token) { JsonWebToken.encode(user_id: user.id) }
  let(:headers) { { 'Authorization' => "Bearer #{token}" } }
  let(:workspace) { Workspace::Workspace.create(name: 'Test Workspace', owner_id: user.id) }
  let(:project) { Project::Project.create(name: 'Test Project', workspace: workspace) }

  before do
    Workspace::WorkspaceMember.create(workspace: workspace, user: user, role: 'admin')
  end

  describe "POST /api/v1/projects/:project_id/tasks" do
    let(:valid_attributes) do 
      { 
        title: 'New Task', 
        description: 'Do something', 
        status: 'todo', 
        priority: 'Medium',
        due_date: 1.week.from_now.to_s
      } 
    end

    context "with valid parameters" do
      it "creates a new Task" do
        expect {
          post "/api/v1/projects/#{project.id}/tasks", params: { task: valid_attributes }, headers: headers
        }.to change(Task::Task, :count).by(1)
      end

      it "associates the task with the project" do
        post "/api/v1/projects/#{project.id}/tasks", params: { task: valid_attributes }, headers: headers
        task = Task::Task.last
        expect(task.project_id).to eq(project.id)
      end
      
      it "returns created status" do
        post "/api/v1/projects/#{project.id}/tasks", params: { task: valid_attributes }, headers: headers
         expect(response).to have_http_status(:created)
      end
    end

    context "with invalid parameters" do
       it "returns unprocessable entity" do
        post "/api/v1/projects/#{project.id}/tasks", params: { task: { title: '' } }, headers: headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe "GET /api/v1/tasks" do
    let!(:task1) { Task::Task.create(title: 'Task 1', project: project, status: 'todo') }
    let!(:task2) { Task::Task.create(title: 'Task 2', project: project, status: 'done') }

    it "returns list of tasks" do
      get '/api/v1/tasks', headers: headers
      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      titles = json['data'].map { |t| t['attributes']['title'] }
      expect(titles).to include('Task 1', 'Task 2')
    end
    
    it "filters tasks by status" do
      get '/api/v1/tasks', params: { status: 'done' }, headers: headers
      json = JSON.parse(response.body)
      titles = json['data'].map { |t| t['attributes']['title'] }
      expect(titles).to include('Task 2')
      expect(titles).not_to include('Task 1')
    end
  end
end
