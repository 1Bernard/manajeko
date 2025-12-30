module Global
  module Commands
    class SendEmail < BaseCommand
      def initialize(to:, subject:, content:)
        @to = to
        @subject = subject
        @content = content
      end

      def call
        # Use the ApplicationMailer to send the email
        # We assume a generic 'notification_email' method exists or we use the existing mechanism.
        # Since we have a 'send_email' in EmailService (which is likely a helper), let's formalize it here.
        
        begin
          # Assuming we have an ApplicationMailer. If not, we should rely on the legacy EmailService for now,
          # or better, use ActionMailer properly.
          # Given SendNotification used `EmailService.send_email`, let's wrap that for now to avoid breaking changes,
          # or if EmailService IS the ActionMailer wrapper.
          
          # Checking SendNotification.rb again:
          # EmailService.send_email(to: @user.email, subject: subject, content: content)
          
          # So we will just wrap that logic here for consistency.
          
          EmailService.send_email(
            to: @to,
            subject: @subject,
            content: @content
          )
          
          Result.success(true)
        rescue StandardError => e
          Result.failure("Failed to send email: #{e.message}", details: e.message)
        end
      end
    end
  end
end
