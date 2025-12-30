
# Find the main workspace
workspace = Workspace::Workspace.find(7)
puts "Seeding users for Workspace: #{workspace.name} (ID: #{workspace.id})"

users_data = [
  { first_name: 'Alice', last_name: 'Engineer', email: 'alice@quantask.com' },
  { first_name: 'Bob', last_name: 'Designer', email: 'bob@quantask.com' },
  { first_name: 'Charlie', last_name: 'Product', email: 'charlie@quantask.com' },
  { first_name: 'David', last_name: 'DevOps', email: 'david@quantask.com' },
  { first_name: 'Eve', last_name: 'Manager', email: 'eve@quantask.com' }
]

users_data.each do |data|
  user = Identity::User.find_or_initialize_by(email: data[:email])
  if user.new_record?
    user.first_name = data[:first_name]
    user.last_name = data[:last_name]
    user.password = 'password123'
    user.password_confirmation = 'password123'
    user.otp_method = 'email'
    if user.save
      puts "✅ Created user: #{user.full_name} (#{user.email})"
    else
      puts "❌ Failed to create user #{data[:email]}: #{user.errors.full_messages.join(', ')}"
      next
    end
  else
    puts "ℹ️ User already exists: #{user.full_name}"
  end

  # Add to workspace
  unless Workspace::WorkspaceMember.exists?(workspace: workspace, user: user)
    member = Workspace::WorkspaceMember.create!(workspace: workspace, user: user, role: 'member')
    puts "   -> Added to workspace"
  else
    puts "   -> Already in workspace"
  end
end

puts "\nDone! Refresh your browser to see the new members."
