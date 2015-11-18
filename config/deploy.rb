# config valid only for current version of Capistrano
# Default branch is :master
# Default value for :scm is :git

lock '3.4.0'

set :application, 'wayapi'
set :repo_url, 'git@github.com:mywaylearning/waybook-api.git'
set :linked_files, fetch(:linked_files, []).push('.env')
set :keep_releases, 3

namespace :deploy do

  after 'deploy:publishing', 'deploy:restart'
  after 'finishing', 'deploy:cleanup'

  after :restart, :clear_cache do
    on roles(:web), in: :groups, limit: 3, wait: 10 do
      within release_path do
        execute :npm, 'install'
        execute :npm, 'run migrate'
        execute :pm2, 'kill'
        execute :npm, 'start'
      end
    end
  end
end
