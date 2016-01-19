$(function() {
	var user_NamesArray = new jMap();//定义一个Map

	var userTable = $("#example").DataTable({
		"bProcessing" : true,
		"bServerSide" : true,
		"bAutoWidth" : true,
		"sort" : "position",
		"bStateSave" : false,
		"iDisplayLength" : 10,
		"iDisplayStart" : 0,
		"dom": 'l<\'#topPlugin\'>frti<\'#deleteUser\'>p<"clear">',
		"ajax": {
			"type": "post",
			"url":"/users/user_list"
		},
		"aoColumns" : [{
						"mData" : "id",
						"orderable" : false, // 禁用排序
						"sDefaultContent" : ""
					}, {
						"mData" : "username",
						"sDefaultContent" : ""
					}, 
					// {
					// 	"mData" : "password_digest",
					// 	"orderable" : false, // 禁用排序
					// 	"sDefaultContent" : "",
					// 	"sWidth":'15%' 
					// },
					{
						"mData" : "nickname",
						"sDefaultContent" : ""
					}, {
						"mData" : "avatar",
						"orderable" : false, // 禁用排序
						"sDefaultContent" : "",
						"render" : function(data, type, full, meta) {
							if(data!=null && data!=""){
								return '<img src="http://itasknow.herokuapp.com/'+ data+ '" style="width:50px;height:50px;"/>';
							}else{
								return '未上传图像......';
							}
						}
					}, {
						"mData" : "student_id",
						"sDefaultContent" : ""
					},{
						"mData" : "name",
						"sDefaultContent" : ""
					},{
						"mData" : "description",
	                    		"orderable" : false, // 禁用排序
	                    		"sDefaultContent" : ""
	               		},{
						"mData" : "credits",
						"sDefaultContent" : ""
					},{
						"mData" : "email",
						"sDefaultContent" : ""
					},{
						"mData" : "admin",
	                    		"orderable" : false, // 禁用排序
	                    		"sDefaultContent" : ""
	               		},{
						"mData" : "last_login_time",
	                    		"sDefaultContent" : ""
						"render" : function(data, type, full, meta) {
							if(data!=null && data!=""){
								return data.format("yyyy-MM-dd HH:mm:ss");
							}else{
								return "";
							}
						}
	               		},{
						"mData" : "activation",
	                    		"orderable" : false, // 禁用排序
	                    		"sDefaultContent" : ""
	               		},{
	                	"mData" : "",
						"orderable" : false, // 禁用排序
						"sDefaultContent" : '<button id="show" class="btn btn-info btn-sm"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"> </button>' +
						'<button id="modify" class="btn btn-warning btn-sm"><span class="glyphicon glyphicon-repeat" aria-hidden="true"> </button>' +
						'<button id="deleteOne" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-trash" aria-hidden="true"> </button>',
						"sWidth":'13%' 
					}],
		"columnDefs" : [{
			"targets" : [0], // 指定的列
			"data" : "id",
			"render" : function(data, type, full, meta) {
				return '<input type="checkbox" value="'+ data + '" name="checkOne"/>';
			}
		}],
		"language":{
			"url":"/assets/page/sys/datatables_oLanguage.json"
		},
		initComplete:initComplete,
		drawCallback: function( settings ) {
	        $('input[name=allChecked]')[0].checked=false;//取消全选状态
	    }
	});

	/**
	 * ajax加载数据完成后回调json
	 */
	 userTable.on( 'xhr', function () {
	 	var json = userTable.ajax.json();
	 	for(var i=0;i<json.aaData.length;i++){

	 		user_NamesArray.put(json.aaData[i].id,json.aaData[i].username);
	 	};
	 });

	/**
     * 表格初始化完成后执行的方法
     * @param data
     */
     function initComplete(data){
     	var topPlugin = '<a data-toggle="modal" data-target="#addUser"><i class="icon-font">&#xe026;</i>新增用户</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
     					'<a id="batchDel"><i class="icon-font">&#xe037;</i>批量删除</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
        				'<a id="updateOrd"><i class="icon-font">&#xe046;</i>刷新表格</a>';//快捷操作的HTML DOM

        var deleteUserHtml='<span name="deleteTips" style="flot:left;color:green;">测试内容</span><div style="clear:left;"></div>';//删除按钮的HTML DOM

		$('#topPlugin').append(topPlugin);//快捷操作的HTML DOM
        $("#deleteUser").append(deleteUserHtml);//表格下方的操作区
        $("#batchDel").on("click",function(){deleteObj($("input[name=userIds]"),'/users/delete',userTable)});//给下方按钮绑定事件
    }
    
	/**
	 * 单行删除按钮点击事件响应
	 */
	 $('#example tbody').on('click', '#deleteOne', function() {
		 $("input[name=userIds]").val(userTable.row($(this).closest('tr')).data().logid);//将日志id赋给隐藏的文本框
		 setTimeout(function(){deleteObj($("input[name=userIds]"),'/users/delete',userTable);},10);//调用批量删除的方法(延迟10毫秒是为了能够显示出现选中的操作)
	});

	//多选选中和取消选中,同时选中第一个单元格单选框,并联动全选单选框
	$('#example tbody').on('click', 'tr', function(event) {
		$(this).toggleClass('selected');//放在最前处理，以便给checkbox做检测
		var allChecked=$('input[name=allChecked]')[0];//关联全选单选框
		$($(this).children()[0]).children().each(function(){
			if(this.type=="checkbox" && (!$(event.target).is(":checkbox") && $(":checkbox",this).trigger("click"))){
				if(!this.checked){
					this.checked = true;
					addValue($("input[name=userIds]"),this);
					var selected = userTable.rows('.selected').data().length;//被选中的行数
					//全选单选框的状态处理
					var recordsDisplay=userTable.page.info().recordsDisplay;//搜索条件过滤后的总行数
					var iDisplayStart=userTable.page.info().start;// 起始行数
					if(selected === userTable.page.len()||selected === recordsDisplay||selected === (recordsDisplay - iDisplayStart)){
						allChecked.checked = true;
					}
				}else{
					this.checked = false;
					cancelValue($("input[name=userIds]"),this);
					allChecked.checked = false;
				}
			}
		});
	});
	
	/**
	 * 全选按钮被点击事件
	 */
	 $('input[name=allChecked]').click(function(){
	 	if(this.checked){
	 		$('#example tbody tr').each(function(){
	 			if(!$(this).hasClass('selected')){
	 				$(this).click();
	 			}
	 		});
	 	}else{
	 		$('#example tbody tr').click();
	 	}
	});	
});
$(document).ready(function () {
    //ajax分类图片上传
    uploadFile($("input[avatar]"),"/users/user_image_upload",false);
});
