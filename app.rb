require 'sinatra'
require 'active_support/core_ext'

get '/' do
  erb :index
end

get '/data-types' do
  content_type :json

  [
    { :name => 'Accounts' },
    { :name => 'Reports' },
    { :name => 'Blog Posts' }
  ].to_json
end
