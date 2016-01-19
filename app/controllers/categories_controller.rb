class CategoriesController < ApplicationController
  skip_before_filter :verify_authenticity_token
  before_filter :login_check , only: [:index,:new ,:create ,:delete ,:edit ,:update]


  def index
    @user = User.find(session[:user_id])
  end

  #ajax分页返回分类列表
  def category_list
    @datatables = Datatable.new
    @datatables.start = params[:start]
    @datatables.length = params[:length]
    @datatables.order = params[:order]
    @datatables.search = params[:search]

    column = ["id", "name","tasks_count","created_at","updated_at"][@datatables.order["0"]["column"].to_i]
    @datatables.iTotalRecords = Category.count
    if @datatables.search["value"] != "" 
      sql_like = "name like '%"+@datatables.search["value"]+"%'"
      @datatables.iTotalDisplayRecords = Category.where(sql_like).count
      @categories = Category.where(sql_like).order(column +" "+@datatables.order["0"]["dir"]).limit(@datatables.length).offset(@datatables.start)
    else
      @datatables.iTotalDisplayRecords = @datatables.iTotalRecords
      @categories = Category.order(column +" "+@datatables.order["0"]["dir"]).limit(@datatables.length).offset(@datatables.start)
    end
    @datatables.aaData = @categories
    respond_to do |format|
      format.json  { render :json => @datatables.to_json}
    end
  end

  def create
  end

  def edit
  end

  def update
    if params[:category_id].present?
      @category = Category.find params[:category_id]
    else
      @category = Category.new
    end
    @category.name=params[:name]
    @category.tasks_count=params[:tasks_count]
    if @category.save(:validate => false)
      respond_to do |format|
        format.json  { render :json => "true" }
      end
    else
      respond_to do |format|
        format.json  { render :json => @category.errors }
      end
    end
  end

  def destroy
    category_ids=params[:category_ids].split(",")
    respond_to do |format|
        format.json  { render :json => Category.destroy(category_ids).length }
    end
  end
end
