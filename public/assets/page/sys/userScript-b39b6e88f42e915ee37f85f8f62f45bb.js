$(function() {
	var user_NamesArray = new jMap();//定义一个Map
	var change_tips = $("span[name='changeTips']");
	var userTable = $("#example").DataTable({
		"bProcessing" : true,
		"bServerSide" : true,
		"bAutoWidth" : true,
		"sort" : "position",
		"bStateSave" : false,
		"iDisplayLength" : 10,
		"iDisplayStart" : 0,
		"dom": 'l<\'#topPlugin\'>frti<\'#message\'>p<"clear">',
		"ajax": {
			"type": "post",
			"url":"/users/user_list"
		},
		"aoColumns" : [{
						"mData" : "id",
						"orderable" : false, // 禁用排序
						"sDefaultContent" : ""
					}, {
						"mData" : "id",
						"orderable" : true,
						"sDefaultContent" : ""
					},{
						"mData" : "username",
						"orderable":true,
						"sDefaultContent" : ""
					}, 
					{
						"mData" : "nickname",
						"orderable":true,
						"sDefaultContent" : ""
					}, 
					{
						"mData" : "student_id",
						"orderable":true,
						"sDefaultContent" : ""
					},{
						"mData" : "name",
						"orderable":true,
						"sDefaultContent" : ""
					},{
						"mData" : "description",
	                    			"orderable" : false, // 禁用排序
	                    			"sDefaultContent" : ""
	               		},{
						"mData" : "credits",
						"orderable":true,
						"sDefaultContent" : ""
					},{
						"mData" : "email",
						"orderable":true,
						"sDefaultContent" : ""
					},{
						"mData" : "admin",
	                    		"orderable" : false, // 禁用排序
	                    		"sDefaultContent" : ""
	               		},
	               		{
						"mData" : "last_login_time",
						"orderable":true,
	                    			"sDefaultContent" : "",
						"render" : function(data, type, full, meta) {
							if(data!=null && data!=""){
								str=data.split(/T|\./);
								data=str[0]+' '+str[1]
								return data;
							}else{
								return '';
							}
						}	                    			

	               		},
	               		{
						"mData" : "activation",
	                    		"orderable" : false, // 禁用排序
	                    		"sDefaultContent" : ""
	               		},{
	                	"mData" : "",
						"orderable" : false, // 禁用排序
						"sDefaultContent" : 
						// '<a id="show" href="#" class="glyphicon glyphicon-info-sign" aria-hidden="true"> </a>&nbsp;&nbsp;&nbsp;&nbsp;' +
						'<a id="modify" href="#" > 编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
						'<a id="deleteOne" href="#">删除</a>',
						"sWidth":'10%' 
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
     	var topPlugin = '<a id="addUser" data-toggle="modal" href="#"><i class="icon-font">&#xe026;</i>新增用户</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
     					'<a id="batchDel" href="#"><i class="icon-font">&#xe037;</i>批量删除</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
        				'<a id="updateOrd" href="#"><i class="icon-font">&#xe046;</i>刷新表格</a>';//快捷操作的HTML DOM

        var messageHtml='&nbsp;&nbsp;&nbsp;&nbsp;<span name="messageTips"></span>';//删除按钮的HTML DOM

	$('#topPlugin').append(topPlugin);//快捷操作的HTML DOM
       $("#message").append(messageHtml);//表格下方的操作区
       $("#addUser").on("click",function(){
       	$("#password").show();
       	$("#passwordSpan").show();
 		$("#user_id").val("");//将日志id赋给隐藏的文本框
		$("#username").val("");
		$("#password").val("");
		$("#nickname").val("");
		$("#student_id").val("");
		$("#name").val("");
		$("#description").val("");
		$("#credits").val("");
		$("#email").val("");
		$("#admin").attr("checked",false);
		$("#activation").attr("checked",false);
        	$('#userInfo').modal('show');
        });//给下方按钮绑定事件
        $("#batchDel").on("click",function(){
        	deleteObj($("input[name=userIds]"),'/users/destroy',userTable)});//给下方按钮绑定事件
        $("#updateOrd").on("click",function(){
        	       userTable.ajax.reload();
        	       $("input[name=userIds]").val("");
        });//给下方按钮绑定事件
    }
	/**
	 * 单行删除按钮点击事件响应
	 */
	 $('#example tbody').on('click', '#modify', function() {
	 	$("#password").hide();
	 	$("#passwordSpan").hide();
	 	$("#password").val("");
		$("#user_id").val(userTable.row($(this).closest('tr')).data().id);//将日志id赋给隐藏的文本框
		$("#username").val($(this).closest('tr').children("td").eq(2).text());
		$("#nickname").val($(this).closest('tr').children("td").eq(3).text());
		$("#student_id").val($(this).closest('tr').children("td").eq(4).text());
		$("#name").val($(this).closest('tr').children("td").eq(5).text());
		$("#description").val($(this).closest('tr').children("td").eq(6).text());
		$("#credits").val($(this).closest('tr').children("td").eq(7).text());
		$("#email").val($(this).closest('tr').children("td").eq(8).text());
		$("#admin").attr("checked",$(this).closest('tr').children("td").eq(9).text());
		$("#activation").attr("checked",$(this).closest('tr').children("td").eq(11).text());
	 	$('#userInfo').modal('show');
		// alert($("#admin").is(':checked'));
	});
	function deleteObj(idsDom,url,table){
	    var message_tips=$("span[name=messageTips]");
	    if(idsDom.val() !== '' && idsDom.val() !== null){
	        if(confirm("确定删除这些记录吗？")){//再次确认
	            $.ajax({
	                type: "post",
	                url:url,
	                data:{user_ids:idsDom.val()},
	                dataType: "text",
	                success:function(data){
	                    message_tips.html(data+"条记录被删除!");
	                    setTimeout(function(){
	                            table.ajax.reload();
	                            idsDom.val("");//将隐藏域清空
	                            $('input[name=allChecked]')[0].checked=false;//取消全选状态
	                            message_tips.html("");
	                    },1000);
	                }
	            });
	        }
	        return false;
	    }else{
	        alert("没有任何数据被选中！");
	        return false;
	    }
	}
    $("#changeUserInfo").on("click",function() {
            $.ajax({
                type: "post",
                url: "/users/update",
                data:{user_id:$("#user_id").val(),username:$("#username").val(),password:$("#password").val(),nickname:$("#nickname").val(),
                student_id:$("#student_id").val(),name:$("#name").val(),description:$("#description").val(),
                credits:$("#credits").val(),email:$("#email").val(),admin:$("#admin").is(':checked'),activation:$("#activation").is(':checked')},
                dataType: "text",
                success: function (data) {
                    if (data == "true") {
        	         $('#userInfo').modal('hide'); 
        	         userTable.ajax.reload();
        	         $("input[name=userIds]").val("");
                    	   var message_tips = $("span[name='messageTips']");
                        showMassege(message_tips,true,"成功！");
                        return false;
                    } else {
                    	   showMassege(change_tips,false,data);
                      return false;
                    }
                },
                error: function (XMLHttpRequest, textStatus,errorThrown) {
                    alert(errorThrown);
                    return false;
                }
            });
        return false;
    });
	 $('#example tbody').on('click', '#deleteOne', function() {
		 $("input[name=userIds]").val(userTable.row($(this).closest('tr')).data().logid);//将日志id赋给隐藏的文本框
		 setTimeout(function(){deleteObj($("input[name=userIds]"),'/users/destroy',userTable);},10);//调用批量删除的方法(延迟10毫秒是为了能够显示出现选中的操作)
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

