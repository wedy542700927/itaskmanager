class TasksController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :login_check , only: [:index,:new ,:create ,:delete ,:edit ,:update]


  def index
    @user = User.find(session[:user_id])
  end

  #ajax分页返回分类列表
  def task_list
    @datatables = Datatable.new
    @datatables.start = params[:start]
    @datatables.length = params[:length]
    @datatables.order = params[:order]
    @datatables.search = params[:search]

    column = ["id","id", "title","category_id","content","award","pledge","user_id","taker_id","comments_count","status","created_at","updated_at"][@datatables.order["0"]["column"].to_i]
    @datatables.iTotalRecords = Task.count
    if @datatables.search["value"] != "" 
      sql_like = "title like '%"+@datatables.search["value"]+"%'"
      @datatables.iTotalDisplayRecords = Task.where(sql_like).count
      @tasks = Task.where(sql_like).order(column +" "+@datatables.order["0"]["dir"]).limit(@datatables.length).offset(@datatables.start)
    else
      @datatables.iTotalDisplayRecords = @datatables.iTotalRecords
      @tasks = Task.order(column +" "+@datatables.order["0"]["dir"]).limit(@datatables.length).offset(@datatables.start)
    end
    @datatables.aaData = @tasks
    respond_to do |format|
      format.json  { render :json => @datatables.to_json}
    end
  end

  def create
  end

  def edit
  end

  def update
    if params[:task_id].present?
      @task = Task.find params[:task_id]
    else
      @task = Task.new
      @task.user_id=session[:user_id]
    end
    @task.title=params[:title]
    @task.category_id=params[:category_id]
    @task.content=params[:content]
    @task.award=params[:award]
    @task.pledge=params[:pledge]
    @task.status=params[:status]
    if @task.save(:validate => false)
      respond_to do |format|
        format.json  { render :json => "true" }
      end
    else
      respond_to do |format|
        format.json  { render :json => @task.errors }
      end
    end
  end

  def destroy
    task_ids=params[:task_ids].split(",")
    respond_to do |format|
        format.json  { render :json => Task.destroy(task_ids).length }
    end
  end
end
