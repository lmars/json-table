require 'sinatra'
require 'active_support/core_ext'
require 'faker'

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
      { :attribute => 'first_name',    :name => 'First Name' },
      { :attribute => 'last_name',     :name => 'Last Name' },
      { :attribute => 'email_address', :name => 'Email Address' }
    ].to_json
  when 'Reports'
    [
      { :attribute => 'name',         :name => 'Name' },
      { :attribute => 'published_at', :name => 'Published At' },
      { :attribute => 'featured',     :name => 'Featured?' }
    ].to_json
  when 'Blog Posts'
    [
      { :attribute => 'title',        :name => 'Title' },
      { :attribute => 'published_at', :name => 'Published At' },
      { :attribute => 'no_of_views',  :name => 'No. of views' }
    ].to_json
  end
end

get '/data' do
  content_type :json

  data = case params['data_type']
         when 'Accounts'
           50.times.map {
             {
               :first_name    => Faker::Name.first_name,
               :last_name     => Faker::Name.last_name,
               :email_address => Faker::Internet.email
             }
           }
         when 'Reports'
           50.times.map {
             {
               :name         => Faker::Lorem.sentence,
               :published_at => (rand 365).days.ago,
               :featured     => rand(5) != 0
             }
           }
         when 'Blog Posts'
           50.times.map {
             {
               :title        => Faker::Lorem.sentence,
               :published_at => (rand 365).days.ago,
               :no_of_views  => rand(10000)
             }
           }
         end

  if params['filters'] && order = params['filters']['order']
    attribute, direction = order.split(',')
    data = data.sort_by { |e| e[attribute.to_sym] }
    data = data.reverse if direction == 'Desc'
  end

  data.to_json
end
