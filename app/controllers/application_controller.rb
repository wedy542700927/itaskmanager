class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  helper_method :get_categories_options,:get_nickname,:get_categoriey_name
  def get_categoriey_name(category_id)
    category=Category.find category_id
    category.name
  end
  def get_nickname(user_id)
    user=User.find user_id
    user.nickname
  end
  def login_check
    if session[:user_id] == nil
      redirect_to("/users/login_form")
    end
  end
  def get_categories_options
    options = []
    Category.order('tasks_count desc').each {|c| options << [c.name, c.id]}
    options
  end
end
