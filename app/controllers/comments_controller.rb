class CommentsController < ApplicationController
 skip_before_filter :verify_authenticity_token
  before_filter :login_check , only: [:index,:new ,:create ,:delete ,:edit ,:update]


  def index
    @user = User.find(session[:user_id])
  end

  #ajax分页返回分类列表
  def comment_list
    @datatables = Datatable.new
    @datatables.start = params[:start]
    @datatables.length = params[:length]
    @datatables.order = params[:order]
    @datatables.search = params[:search]
    column = ["id", "task_id","user_id","to_user_id","kind","status","content","created_at"][@datatables.order["0"]["column"].to_i]
    @datatables.iTotalRecords = TaskComment.count
    if @datatables.search["value"] != "" 
      sql_like = "content like '%"+@datatables.search["value"]+"%'"
      @datatables.iTotalDisplayRecords = TaskComment.where(sql_like).count
      @comments = TaskComment.where(sql_like).order(column +" "+@datatables.order["0"]["dir"]).limit(@datatables.length).offset(@datatables.start)
    else
      @datatables.iTotalDisplayRecords = @datatables.iTotalRecords
      @comments = TaskComment.order(column +" "+@datatables.order["0"]["dir"]).limit(@datatables.length).offset(@datatables.start)
    end
    @datatables.aaData = @comments
    respond_to do |format|
      format.json  { render :json => @datatables.to_json}
    end
  end

  def create
  end

  def edit
  end

  def update
    if params[:comment_id].present?
      @comment = TaskComment.find params[:comment_id]
    else
      @comment = TaskComment.new
    end
    @comment.kind=params[:kind]
    @comment.status=params[:status]
    @comment.content=params[:content]
    if @comment.save(:validate => false)
      respond_to do |format|
        format.json  { render :json => "true" }
      end
    else
      respond_to do |format|
        format.json  { render :json => @comment.errors }
      end
    end
  end

  def destroy
    comment_ids=params[:comment_ids].split(",")
    respond_to do |format|
        format.json  { render :json => TaskComment.destroy(comment_ids).length }
    end
  end
end
