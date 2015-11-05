set :deploy_user, ENV['UIDEV_USER']
set :branch, "master"
set :server_name, "uidev-api"

# used in case we're deploying multiple versions of the same
# app side by side. Also provides quick sanity checks when looking
# at filepaths
set :full_app_name, "#{fetch(:application)}_#{fetch(:stage)}"

server ENV['STAGING'], user: ENV['UIDEV_USER'], roles: %w{app db web}, primary: true

set :deploy_to, "/home/#{fetch(:deploy_user)}/apps/#{fetch(:full_app_name)}"
