class ApiError < StandardError
  attr_reader :status, :code

  def initialize(message, status: :bad_request, code: nil)
    @status = status
    @code = code
    super(message)
  end
end
