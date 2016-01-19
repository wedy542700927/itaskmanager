require 'socket'
class PageController < ApplicationController
    before_filter :login_check
  def login_check
    if session[:user_id] == nil
      redirect_to("/users/login_form")
    end
  end
    def index
        @user = User.find(session[:user_id])
        @hostname = Socket.gethostname
        @ip_address = Socket.ip_address_list.find { |ai| ai.ipv4? && !ai.ipv4_loopback? }.ip_address
    end
end