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

get '/data-fields' do
  content_type :json

  case params['data_type']
  when 'Accounts'
    [
      { :name => 'First Name' },
      { :name => 'Last Name' },
      { :name => 'Email Address' }
    ].to_json
  when 'Reports'
    [
      { :name => 'Name' },
      { :name => 'Published Date' },
      { :name => 'Featured?' }
    ].to_json
  when 'Blog Posts'
    [
      { :name => 'Title' },
      { :name => 'Published At' },
      { :name => 'No. of views' }
    ].to_json
  end
end
