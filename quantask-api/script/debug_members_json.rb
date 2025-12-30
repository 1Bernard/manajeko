
user = Identity::User.find(23)
result = Workspace::Services::MemberService.index(user, 7)
if result.success?
  puts "Service Success"
  json = Identity::Api::V1::UserSerializer.new(result.value).serializable_hash.to_json
  puts "JSON Response:"
  puts json
else
  puts "Service failed: #{result.error}"
end
