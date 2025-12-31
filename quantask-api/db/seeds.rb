# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "🌱 Starting seed process..."

# Clear existing data
puts "🗑️  Clearing existing data..."
Task::TaskAssignment.destroy_all
Task::Tagging.destroy_all
Task::Tag.destroy_all
Task::Subtask.destroy_all
Task::Comment.destroy_all
Task::Attachment.destroy_all
Task::Task.destroy_all
Project::Project.destroy_all
Workspace::WorkspaceMember.destroy_all
Workspace::Workspace.destroy_all
Identity::User.destroy_all

puts "✅ Existing data cleared"

# Create Users
puts "👤 Creating users..."
users = []

user1 = Identity::User.create!(
  email: 'demo@manajeko.com',
  password: 'password123',
  first_name: 'Demo',
  last_name: 'User',
  otp_method: 'email'
)
users << user1

user2 = Identity::User.create!(
  email: 'john@manajeko.com',
  password: 'password123',
  first_name: 'John',
  last_name: 'Doe',
  otp_method: 'email'
)
users << user2

user3 = Identity::User.create!(
  email: 'jane@manajeko.com',
  password: 'password123',
  first_name: 'Jane',
  last_name: 'Smith',
  otp_method: 'email'
)
users << user3

puts "✅ Created #{users.count} users"

# Create Workspace
puts "🏢 Creating workspace..."
workspace = Workspace::Workspace.create!(
  name: 'Demo Workspace',
  owner: user1
)

# Add members to workspace
[user1, user2, user3].each do |user|
  Workspace::WorkspaceMember.create!(
    workspace: workspace,
    user: user,
    role: user == user1 ? 'owner' : 'member'
  )
end

puts "✅ Created workspace with #{workspace.workspace_members.count} members"

# Create Projects
puts "📁 Creating projects..."
projects = []

project1 = Project::Project.create!(
  workspace: workspace,
  owner: user1,
  name: 'Website Redesign',
  description: 'Complete redesign of the company website with modern UI/UX',
  status: 'active',
  visibility: 'public'
)
projects << project1

project2 = Project::Project.create!(
  workspace: workspace,
  owner: user1,
  name: 'Mobile App Development',
  description: 'Build iOS and Android mobile applications',
  status: 'active',
  visibility: 'public'
)
projects << project2

project3 = Project::Project.create!(
  workspace: workspace,
  owner: user2,
  name: 'Marketing Campaign Q1',
  description: 'Q1 2024 marketing campaign planning and execution',
  status: 'active',
  visibility: 'public'
)
projects << project3

puts "✅ Created #{projects.count} projects"

# Create Tags
puts "🏷️  Creating tags..."
tags = []

tag_bug = Task::Tag.create!(
  project: project1,
  name: 'Bug',
  color: '#ef4444'
)
tags << tag_bug

tag_feature = Task::Tag.create!(
  project: project1,
  name: 'Feature',
  color: '#3b82f6'
)
tags << tag_feature

tag_urgent = Task::Tag.create!(
  project: project1,
  name: 'Urgent',
  color: '#f97316'
)
tags << tag_urgent

tag_design = Task::Tag.create!(
  project: project1,
  name: 'Design',
  color: '#8b5cf6'
)
tags << tag_design

puts "✅ Created #{tags.count} tags"

# Create Tasks for Project 1 (Website Redesign)
puts "📝 Creating tasks..."
tasks = []

# Todo tasks
task1 = Task::Task.create!(
  project: project1,
  creator: user1,
  title: 'Design Homepage Mockup',
  description: 'Create high-fidelity mockup for the new homepage design',
  status: 'todo',
  priority: 'high',
  due_date: 7.days.from_now
)
task1.tags << tag_design
task1.assignees << user3
tasks << task1

task2 = Task::Task.create!(
  project: project1,
  creator: user1,
  title: 'Setup Development Environment',
  description: 'Configure local development environment with all necessary tools',
  status: 'todo',
  priority: 'medium',
  due_date: 5.days.from_now
)
task2.tags << tag_feature
task2.assignees << user2
tasks << task2

# In Progress tasks
task3 = Task::Task.create!(
  project: project1,
  creator: user2,
  title: 'Implement Navigation Component',
  description: 'Build responsive navigation bar with mobile menu',
  status: 'in_progress',
  priority: 'high',
  due_date: 3.days.from_now
)
task3.tags << tag_feature
task3.assignees << user2
tasks << task3

# Add subtasks to task3
Task::Subtask.create!(
  task: task3,
  title: 'Create desktop navigation',
  is_completed: true
)
Task::Subtask.create!(
  task: task3,
  title: 'Create mobile hamburger menu',
  is_completed: false
)
Task::Subtask.create!(
  task: task3,
  title: 'Add smooth scroll animations',
  is_completed: false
)

task4 = Task::Task.create!(
  project: project1,
  creator: user1,
  title: 'Fix Responsive Layout Issues',
  description: 'Address layout breaking on tablet and mobile devices',
  status: 'in_progress',
  priority: 'high',
  due_date: 2.days.from_now
)
task4.tags << [tag_bug, tag_urgent]
task4.assignees << user3
tasks << task4

# In Review tasks
task5 = Task::Task.create!(
  project: project1,
  creator: user3,
  title: 'Update Color Scheme',
  description: 'Apply new brand colors across all pages',
  status: 'in_review',
  priority: 'medium',
  due_date: 1.day.from_now
)
task5.tags << tag_design
task5.assignees << user3
tasks << task5

# Add comments to task5
Task::Comment.create!(
  task: task5,
  user: user1,
  content: 'Looks great! Just need to adjust the primary button color.'
)
Task::Comment.create!(
  task: task5,
  user: user3,
  content: 'Updated the button color. Please review again.'
)

# Done tasks
task6 = Task::Task.create!(
  project: project1,
  creator: user2,
  title: 'Create Design System Documentation',
  description: 'Document all design tokens, components, and patterns',
  status: 'done',
  priority: 'medium',
  due_date: 5.days.ago
)
task6.tags << tag_design
task6.assignees << user3
tasks << task6

task7 = Task::Task.create!(
  project: project1,
  creator: user1,
  title: 'Setup CI/CD Pipeline',
  description: 'Configure automated testing and deployment',
  status: 'done',
  priority: 'high',
  due_date: 10.days.ago
)
task7.tags << tag_feature
task7.assignees << user2
tasks << task7

# Create Tasks for Project 2 (Mobile App)
task8 = Task::Task.create!(
  project: project2,
  creator: user1,
  title: 'Design App Icon and Splash Screen',
  description: 'Create app icon for iOS and Android, plus splash screen',
  status: 'todo',
  priority: 'high',
  due_date: 14.days.from_now
)
task8.tags << tag_design
task8.assignees << user3
tasks << task8

task9 = Task::Task.create!(
  project: project2,
  creator: user2,
  title: 'Implement User Authentication',
  description: 'Add login, signup, and password reset functionality',
  status: 'in_progress',
  priority: 'high',
  due_date: 7.days.from_now
)
task9.tags << [tag_feature, tag_urgent]
task9.assignees << user2
tasks << task9

task10 = Task::Task.create!(
  project: project2,
  creator: user1,
  title: 'Setup Push Notifications',
  description: 'Configure Firebase Cloud Messaging for push notifications',
  status: 'todo',
  priority: 'medium',
  due_date: 21.days.from_now
)
task10.tags << tag_feature
task10.assignees << user2
tasks << task10

# Create Tasks for Project 3 (Marketing Campaign)
task11 = Task::Task.create!(
  project: project3,
  creator: user2,
  title: 'Plan Social Media Content Calendar',
  description: 'Create content calendar for Q1 social media posts',
  status: 'in_progress',
  priority: 'high',
  due_date: 5.days.from_now
)
task11.assignees << user2
tasks << task11

task12 = Task::Task.create!(
  project: project3,
  creator: user2,
  title: 'Design Email Templates',
  description: 'Create responsive email templates for campaign',
  status: 'todo',
  priority: 'medium',
  due_date: 10.days.from_now
)
task12.tags << tag_design
task12.assignees << user3
tasks << task12

puts "✅ Created #{tasks.count} tasks"

# Summary
puts "\n🎉 Seed completed successfully!"
puts "=" * 50
puts "📊 Summary:"
puts "  Users: #{Identity::User.count}"
puts "  Workspaces: #{Workspace::Workspace.count}"
puts "  Projects: #{Project::Project.count}"
puts "  Tasks: #{Task::Task.count}"
puts "    - Todo: #{Task::Task.where(status: 'todo').count}"
puts "    - In Progress: #{Task::Task.where(status: 'in_progress').count}"
puts "    - In Review: #{Task::Task.where(status: 'in_review').count}"
puts "    - Done: #{Task::Task.where(status: 'done').count}"
puts "  Tags: #{Task::Tag.count}"
puts "  Subtasks: #{Task::Subtask.count}"
puts "  Comments: #{Task::Comment.count}"
puts "=" * 50
puts "\n🔑 Login credentials:"
puts "  Email: demo@manajeko.com"
puts "  Password: password123"
puts "\n  Other users: john@manajeko.com, jane@manajeko.com"
puts "  Password: password123"
puts "=" * 50
