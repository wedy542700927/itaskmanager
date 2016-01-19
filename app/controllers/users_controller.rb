#用户管理类
class UsersController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :login_check , only: [:index,:new ,:create ,:delete ,:edit ,:update,:change_pw]

  def default
    render nothing: true
  end

  def index
    @user = User.find(session[:user_id])
  end

  #ajax分页返回分类列表
  def user_list
    @datatables = Datatable.new

    @datatables.start = params[:start]
    @datatables.length = params[:length]
    @datatables.order = params[:order]
    @datatables.search = params[:search]
# "password_digest"
#"last_login_time"
#{}"avatar"
    column = ["id","id", "username","nickname","student_id","name","description","credits","email","admin","last_login_time","activation"][@datatables.order["0"]["column"].to_i]
    @datatables.iTotalRecords = User.count
    if @datatables.search["value"] != "" 
      sql_like = "name like '%"+@datatables.search["value"]+"%'"
      @datatables.iTotalDisplayRecords = User.where(sql_like).count
      @users = User.where(sql_like).order(column +" "+@datatables.order["0"]["dir"]).limit(@datatables.length).offset(@datatables.start)
    else
      @datatables.iTotalDisplayRecords = @datatables.iTotalRecords
      @users = User.order(column +" "+@datatables.order["0"]["dir"]).limit(@datatables.length).offset(@datatables.start)
    end

    @datatables.aaData = @users
    respond_to do |format|
      format.json  { render :json => @datatables.to_json}
    end
  end

  def create
  end

  def edit
  end

  def update
    if params[:user_id].present?
      @user = User.find params[:user_id]
    else
      @user = User.new
      @user.password=params[:password]
    end
    @user.username=params[:username]
    @user.nickname=params[:nickname]
    @user.student_id=params[:student_id]
    @user.name=params[:name]
    @user.description=params[:description]
    @user.credits=params[:credits]
    @user.email=params[:email]
    @user.admin=params[:admin]
    @user.activation=params[:activation]
    if @user.save(:validate => false)
      respond_to do |format|
        format.json  { render :json => "true" }
      end
    else
      respond_to do |format|
        format.json  { render :json => @user.errors }
      end
    end
  end

  def destroy
    user_ids=params[:user_ids].split(",")
    respond_to do |format|
        format.json  { render :json => User.destroy(user_ids).length }
    end
  end

  def login_form
    render 'login_form'
  end

  #用户登录
  def login
    # @user = User.authentiuser(params[:username], params[:password])
    @user = User.find_by username: params[:username]
    if @user && @user.check_password(params[:password]) && @user.admin
      init_logon_session(@user)
      @user.update_attributes(:last_login_time=>DateTime.now)
      respond_to do |format|
        format.json  { render :json => "true" }
      end
    else
      respond_to do |format|
        format.json  { render :json => "false" }
      end
    end
  end
  def change_pw_form
    @user = User.find(session[:user_id])
  end
  def change_pw
    @user = User.find_by username: session[:username]
    if @user && @user.check_password(params[:oldPassword]) && @user.admin 
      @user.update_attributes(:password=>params[:newPassword]);
      respond_to do |format|
        format.json  { render :json => "true" }
      end
    else
      respond_to do |format|
        format.json  { render :json => "false" }
      end
    end
  end
  def logout
    clear_logon_session
    redirect_to root_path
  end

  def init_logon_session(user)
    session[:user_id] = user.id
    session[:username] = user.username
  end

  def clear_logon_session
    session[:user_id] = nil
    session[:username] = nil
  end

  private
  def user_params
      params.require(:user).permit(:username, :password)
  end
end