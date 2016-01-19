Rails.application.routes.draw do

    root 'page#index'

    # def draw(routes_name)
    #     instance_eval(File.read(Rails.root.join("config/routes/#{routes_name}.rb")))
    # end"users/login" => "users#login"
    get "users/login_form" => "users#login_form"
    post "users/login" => "users#login"
    get "users/change_pw_form" => "users#change_pw_form"
    post "users/change_pw" => "users#change_pw"
    get 'users/logout' => 'users#logout'
    # draw :user
    # draw :page
    get "page/index"=>"page#index"

    get "users/" => "users#default"
    get "users/index" => "users#index"
    post "users/user_list" => "users#user_list"
    post "users/user_image_upload"=>"users#user_image_upload"
    post "users/create"=>"users#create"
    get "users/new"=> "users#new"
    get "users/edit"=> "users#edit"
    get "users/show"=> "users#show"
    post "users/update"=> "users#update"
    post "users/destroy"=> "users#destroy" 

    get "categories/index" => "categories#index"
    post "categories/category_list" => "categories#category_list"
    post "categories/update"=> "categories#update"
    post "categories/destroy"=> "categories#destroy" 

    get "tasks/index" => "tasks#index"
    post "tasks/task_list" => "tasks#task_list"
    post "tasks/update"=> "tasks#update"
    post "tasks/destroy"=> "tasks#destroy"

    get "comments/index" => "comments#index"
    post "comments/comment_list" => "comments#comment_list"
    post "comments/update"=> "comments#update"
    post "comments/destroy"=> "comments#destroy"    
end