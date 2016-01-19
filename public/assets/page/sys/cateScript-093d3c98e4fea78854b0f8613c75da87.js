$(function() {
	var cate_NamesArray = new jMap();//定义一个Map

	var cateTable = $("#example").DataTable({
		"bProcessing" : true,
		"bServerSide" : true,
		"bAutoWidth" : false,
		"sort" : "position",
		"bStateSave" : false,
		"iDisplayLength" : 10,
		"iDisplayStart" : 0,
		"dom": 'l<\'#topPlugin\'>frti<\'#deleteCate\'>p<"clear">',
		"ajax": {
			"type": "post",
			"url":"/page/categories/cate_list"
		},
		"aoColumns" : [{
						"mData" : "id",
						"orderable" : false, // 禁用排序
						"sDefaultContent" : "",
						"sWidth" : "5%"
					}, {
						"mData" : "cate_name",
						"sDefaultContent" : "",
						"sWidth" : "15%"
					}, {
						"mData" : "cate_image",
						"orderable" : false, // 禁用排序
						"sDefaultContent" : "",
						"sWidth" : "15%",
						"render" : function(data, type, full, meta) {
							if(data.url != ""){
								return '<a href="'+data.url+'"><img src="'+ data.small + '"/></a>';
							}else{
								return '该分类未上传图标......';
							}
						}
					}, {
						"mData" : "cate_super_id",
						"sDefaultContent" : "",
						"sWidth" : "10%",
						"render": function (data, type , full, meta) {
							return cate_NamesArray.get(data);
						}
					}, {
						"mData" : "cate_description",
	                    "orderable" : false, // 禁用排序
	                    "sDefaultContent" : "",
	                    "sWidth" : "25%"
	                }, {
	                	"mData" : "",
						"orderable" : false, // 禁用排序
						"sDefaultContent" : '<button id="show" class="btn btn-info btn-sm"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"> 查看</button>' +
						'<button id="modify" class="btn btn-warning btn-sm"><span class="glyphicon glyphicon-repeat" aria-hidden="true"> 修改</button>' +
						'<button id="deleteOne" class="btn btn-danger btn-sm"><span class="glyphicon glyphicon-trash" aria-hidden="true"> 删除</button>',
						"sWidth" : "30%"
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
	 cateTable.on( 'xhr', function () {
	 	var json = cateTable.ajax.json();
	 	for(var i=0;i<json.aaData.length;i++){
	 		cate_NamesArray.put(json.aaData[i].cate_super_id,json.aaData[i].cate_name);
	 	};
	 });

	/**
     * 表格初始化完成后执行的方法
     * @param data
     */
     function initComplete(data){
     	var topPlugin = '<a data-toggle="modal" data-target="#addCate"><i class="icon-font">&#xe026;</i>新增分类</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
     					'<a id="batchDel"><i class="icon-font">&#xe037;</i>批量删除</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
        				'<a id="updateOrd"><i class="icon-font">&#xe046;</i>刷新表格</a>';//快捷操作的HTML DOM

        var deleteCateHtml='<span name="deleteTips" style="flot:left;color:green;">测试内容</span><div style="clear:left;"></div>';//删除按钮的HTML DOM

		$('#topPlugin').append(topPlugin);//快捷操作的HTML DOM
        $("#deleteCate").append(deleteCateHtml);//表格下方的操作区
        $("#batchDel").on("click",function(){deleteObj($("input[name=cateIds]"),'/cate/categories/delete',cateTable)});//给下方按钮绑定事件
    }
    
	/**
	 * 单行删除按钮点击事件响应
	 */
	 $('#example tbody').on('click', '#deleteOne', function() {
		 $("input[name=cateIds]").val(cateTable.row($(this).closest('tr')).data().logid);//将日志id赋给隐藏的文本框
		 setTimeout(function(){deleteObj($("input[name=cateIds]"),'/cate/categories/delete',cateTable);},10);//调用批量删除的方法(延迟10毫秒是为了能够显示出现选中的操作)
	});

	//多选选中和取消选中,同时选中第一个单元格单选框,并联动全选单选框
	$('#example tbody').on('click', 'tr', function(event) {
		$(this).toggleClass('selected');//放在最前处理，以便给checkbox做检测
		var allChecked=$('input[name=allChecked]')[0];//关联全选单选框
		$($(this).children()[0]).children().each(function(){
			if(this.type=="checkbox" && (!$(event.target).is(":checkbox") && $(":checkbox",this).trigger("click"))){
				if(!this.checked){
					this.checked = true;
					addValue($("input[name=cateIds]"),this);
					var selected = cateTable.rows('.selected').data().length;//被选中的行数
					//全选单选框的状态处理
					var recordsDisplay=cateTable.page.info().recordsDisplay;//搜索条件过滤后的总行数
					var iDisplayStart=cateTable.page.info().start;// 起始行数
					if(selected === cateTable.page.len()||selected === recordsDisplay||selected === (recordsDisplay - iDisplayStart)){
						allChecked.checked = true;
					}
				}else{
					this.checked = false;
					cancelValue($("input[name=cateIds]"),this);
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
    uploadFile($("input[name=cate_image]"),"/page/categories/cate_image_upload",false);
});
