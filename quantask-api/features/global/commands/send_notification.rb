module Global
  module Commands
    class SendNotification < BaseCommand
      def initialize(user, type, code)
        @user = user
        @type = type # :otp or :reset_password
        @code = code
      end

      def call
        if @user.otp_method == 'sms'
          # Example: SmsService.send(@user.phone_number, @code)
          puts "📱 SMS SENT to #{@user.phone_number}: Your #{@type} code is #{@code}"
        else
          subject = @type == :otp ? "Your Verification Code" : "Password Reset Request"
          content = "
            <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
              <h2>#{subject}</h2>
              <p>Hello #{@user.first_name || 'User'},</p>
              <p>Your verification code is:</p>
              <h1 style='color: #4F46E5; letter-spacing: 5px;'>#{@code}</h1>
              <p>This code will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
          "

          # Use the centralized SendEmail command
          Global::Commands::SendEmail.call(
            to: @user.email,
            subject: subject,
            content: content
          )

          puts "📧 EMAIL SENT to #{@user.email}: Your #{@type} code is #{@code}"
        end
        Result.success(true)
      end
    end
  end
end
