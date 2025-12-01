class BaseCommand
  def self.call(*args, **kwargs)
    new(*args, **kwargs).call
  end

  def call
    raise NotImplementedError, "#{self.class} must implement #call"
  end
end
