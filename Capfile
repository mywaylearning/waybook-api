# Load DSL and set up stages
require 'capistrano/setup'

# Include default deployment tasks
require 'capistrano/deploy'

##
# Airbrussh is a replacement log formatter for SSHKit that makes your
# Capistrano output much easier on the eyes.
# Just add it to your Capfile and enjoy concise, useful log output
# that is easy to read.
# https://github.com/mattbrictson/airbrussh
require 'airbrussh/capistrano'

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
