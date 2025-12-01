# Configure Rack::Attack for rate limiting
class Rack::Attack
  # Throttle all requests by IP (60rpm)
  throttle('req/ip', limit: 60, period: 1.minute) do |req|
    req.ip
  end

  # Throttle login attempts by IP address
  throttle('logins/ip', limit: 5, period: 20.seconds) do |req|
    if req.path == '/api/v1/auth/login' && req.post?
      req.ip
    end
  end

  # Throttle login attempts by email address
  throttle('logins/email', limit: 5, period: 20.seconds) do |req|
    if req.path == '/api/v1/auth/login' && req.post?
      req.params['email'].to_s.downcase.gsub(/\s+/, "")
    end
  end
end
