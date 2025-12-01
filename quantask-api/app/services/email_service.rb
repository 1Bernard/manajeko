require "faraday"

class EmailService
  # Change to HTTP instead of HTTPS
  API_URL = "http://159.8.237.34:7042/send-email"

  def self.send_email(to:, subject:, content:, from: "mis-no-reply@appsnmobilesolutions.com",
                     sender_name: "Automation", attachments: [])
    to_array = to.is_a?(Array) ? to : [ to ]

    payload = {
      from: from,
      sender_name: sender_name,
      to: to_array,
      attachment: attachments,
      subject: subject,
      html_content: content
    }

    conn = Faraday.new do |f|
      f.options.timeout = 10
      f.options.open_timeout = 5
    end

    begin
      response = conn.post(API_URL) do |req|
        req.headers["Content-Type"] = "application/json"
        req.body = payload.to_json
      end

      Rails.logger.info "Email API Response: #{response.status} - #{response.body}"

      # Check if the response indicates success
      if response.success?
        # Parse the JSON response to verify the resp_code
        json_response = JSON.parse(response.body)
        json_response["resp_code"] == "000"
      else
        false
      end
    rescue Faraday::Error, JSON::ParserError => e
      Rails.logger.error "Email sending failed: #{e.message}"
      false
    end
  end
end
