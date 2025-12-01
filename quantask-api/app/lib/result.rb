class Result
  attr_reader :value, :error, :status

  def initialize(success, value: nil, error: nil, status: nil)
    @success = success
    @value = value
    @error = error
    @status = status || (success ? :ok : :unprocessable_entity)
  end

  def success?
    @success
  end

  def failure?
    !@success
  end

  def self.success(value, status: :ok)
    new(true, value: value, status: status)
  end

  def self.failure(error_message, status: :unprocessable_entity, code: nil, details: nil)
    new(false, error: { message: error_message, code: code, details: details }, status: status)
  end
end
