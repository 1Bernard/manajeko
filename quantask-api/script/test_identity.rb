#!/usr/bin/env ruby
# Test script for Identity feature

require_relative '../config/environment'

puts "=" * 60
puts "Testing Quantask API - Identity Feature"
puts "=" * 60

# Test 1: Create a user
puts "\n1. Testing User Registration..."
result = Identity::Services::RegistrationService.call({
  email: 'test@example.com',
  password: 'password123',
  password_confirmation: 'password123',
  first_name: 'John',
  last_name: 'Doe',
  otp_method: 'email'
})

if result.success?
  puts "✅ User created successfully!"
  user = result.value[:user]
  puts "   Email: #{user.email}"
  puts "   Full Name: #{user.full_name}"
  puts "   Initials: #{user.initials}"
  puts "   Token: #{result.value[:token][0..20]}..."
else
  puts "❌ Failed: #{result.error[:message]}"
end

# Test 2: Login
puts "\n2. Testing Login (with 2FA)..."
result = Identity::Services::LoginService.call('test@example.com', 'password123')

if result.success?
  puts "✅ Login successful! OTP required."
  puts "   Message: #{result.value[:message]}"
else
  puts "❌ Failed: #{result.error[:message]}"
end

# Test 3: Get OTP code from database (simulating what was "sent")
user = Identity::User.find_by(email: 'test@example.com')
otp_code = user.otp_code
puts "\n3. OTP Code (from database): #{otp_code}"

# Test 4: Verify OTP
puts "\n4. Testing OTP Verification..."
result = Identity::Services::VerificationService.call('test@example.com', otp_code)

if result.success?
  puts "✅ OTP verified successfully!"
  puts "   Token: #{result.value[:token][0..20]}..."
else
  puts "❌ Failed: #{result.error[:message]}"
end

# Test 5: Get current user
puts "\n5. Testing JWT Token..."
token = result.value[:token]
decoded = JsonWebToken.decode(token)
if decoded
  puts "✅ Token decoded successfully!"
  puts "   User ID: #{decoded[:user_id]}"
  puts "   Expires: #{Time.at(decoded[:exp])}"
else
  puts "❌ Failed to decode token"
end

# Test 6: Password Reset Request
puts "\n6. Testing Password Reset Request..."
result = Identity::Services::RecoveryService.forgot_password('test@example.com')
if result.success?
  puts "✅ Password reset requested!"
  puts "   Message: #{result.value[:message]}"
  
  # Get reset token
  user.reload
  reset_token = user.reset_password_token
  puts "   Reset Token: #{reset_token}"
  
  # Test 7: Reset Password
  puts "\n7. Testing Password Reset..."
  result = Identity::Services::RecoveryService.reset_password(reset_token, 'newpassword123')
  if result.success?
    puts "✅ Password reset successfully!"
  else
    puts "❌ Failed: #{result.error[:message]}"
  end
else
  puts "❌ Failed: #{result.error[:message]}"
end

puts "\n" + "=" * 60
puts "All tests completed!"
puts "=" * 60
