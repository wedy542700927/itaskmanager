$(function() {
  var task_NamesArray = new jMap();//定义一个Map
  var change_tips = $("span[name='changeTips']");
  var taskTable = $("#example").DataTable({
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
      "url":"/tasks/task_list"
    },
    "aoColumns" : [{
            "mData" : "id",
            "orderable" : false, // 禁用排序
            "sDefaultContent" : ""
          },{
            "mData" : "id",
            "orderable" : true, // 禁用排序
            "sDefaultContent" : ""
          }, {
            "mData" : "title",
            "orderable":true,
            "sDefaultContent" : ""
          }, 
          {
            "mData" : "category_id",
            "orderable":false,
            "sDefaultContent" : ""
          },{
            "mData" : "content",
            "orderable":false,
              "sDefaultContent" : ""
            },{
            "mData" : "award",
            "orderable":true,
              "sDefaultContent" : ""
            },{
            "mData" : "pledge",
            "orderable":true,
              "sDefaultContent" : ""
            },{
            "mData" : "user_id",
            "orderable":true,
              "sDefaultContent" : ""
            },{
            "mData" : "taker_id",
            "orderable":true,
              "sDefaultContent" : ""
            },{
            "mData" : "comments_count",
            "orderable":true,
              "sDefaultContent" : ""
            },{
            "mData" : "status",
            "orderable":true,
              "sDefaultContent" : "",
              "render" : function(data, type, full, meta) {
                      if(data=="0"){
                          return "待接受";
                        }
                      if(data=="1"){
                          return "进行中";
                        }
                        if(data=="2"){
                          return "已完成";
                        }
                        if(data=="3"){
                          return "已关闭";
                        }
                        if (data==null || data==""){
                          return "";
                        }
            } 
            },{
            "mData" : "created_at",
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
            },{
            "mData" : "updated_at",
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
            } },{
                    "mData" : "",
            "orderable" : false, // 禁用排序
            "sDefaultContent" : 
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
   taskTable.on( 'xhr', function () {
    var json = taskTable.ajax.json();
    for(var i=0;i<json.aaData.length;i++){
      task_NamesArray.put(json.aaData[i].id,json.aaData[i].title);
    };
   });

  /**
     * 表格初始化完成后执行的方法
     * @param data
     */

     function initComplete(data){
      var topPlugin = '<a id="addTask" data-toggle="modal" href="#"><i class="icon-font">&#xe026;</i>新增任务</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
              '<a id="batchDel" href="#"><i class="icon-font">&#xe037;</i>批量删除</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                '<a id="updateOrd" href="#"><i class="icon-font">&#xe046;</i>刷新表格</a>';//快捷操作的HTML DOM

        var messageHtml='&nbsp;&nbsp;&nbsp;&nbsp;<span name="messageTips"></span>';//删除按钮的HTML DOM

  $('#topPlugin').append(topPlugin);//快捷操作的HTML DOM
       $("#message").append(messageHtml);//表格下方的操作区
       $("#addTask").on("click",function(){
          $("#task_id").val("");//将日志id赋给隐藏的文本框
          $("#title").val("");
          $("#category_id").val("");
          $("#content").val("");
          $("#award").val("");
          $("#pledge").val("");
          $("#status").val("");
          $('#taskInfo').modal('show');
        });//给下方按钮绑定事件
        $("#batchDel").on("click",function(){
          deleteObj($("input[name=taskIds]"),'/tasks/destroy',taskTable)});//给下方按钮绑定事件
        $("#updateOrd").on("click",function(){
                 taskTable.ajax.reload();
                 $("input[name=taskIds]").val("");
        });//给下方按钮绑定事件
    }
  /**
   * 单行删除按钮点击事件响应
   */
   $('#example tbody').on('click', '#modify', function() {
    $("#task_id").val(taskTable.row($(this).closest('tr')).data().id);//将日志id赋给隐藏的文本框
    $("#title").val($(this).closest('tr').children("td").eq(2).text());
    $("#category_id").val($(this).closest('tr').children("td").eq(3).text());
    $("#content").val($(this).closest('tr').children("td").eq(4).text());
    $("#award").val($(this).closest('tr').children("td").eq(5).text());
    $("#pledge").val($(this).closest('tr').children("td").eq(6).text());
    if($(this).closest('tr').children("td").eq(10).text()=="待接受"){
          $("#status").val("0");
    }
    if($(this).closest('tr').children("td").eq(10).text()=="进行中"){
          $("#status").val("1");
    }
    if($(this).closest('tr').children("td").eq(10).text()=="已完成"){
          $("#status").val("2");
    }
    if($(this).closest('tr').children("td").eq(10).text()=="已关闭"){
          $("#status").val("3");
    }
    if($(this).closest('tr').children("td").eq(10).text()==""||$(this).closest('tr').children("td").eq(10).text()==null){
        $("#status").val("");
    }
    $('#taskInfo').modal('show');
    // alert($("#admin").is(':checked'));
  });
  function deleteObj(idsDom,url,table){
      var message_tips=$("span[name=messageTips]");
      if(idsDom.val() !== '' && idsDom.val() !== null){
          if(confirm("确定删除这些记录吗？")){//再次确认
              $.ajax({
                  type: "post",
                  url:url,
                  data:{task_ids:idsDom.val()},
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
    $("#changeTaskInfo").on("click",function() {
            $.ajax({
                type: "post",
                url: "/tasks/update",
                data:{task_id:$("#task_id").val(),title:$("#title").val(),category_id:$("#category_id").val(),content:$("#content").val(),award:$("#award").val(),pledge:$("#pledge").val(),status:$("#status").val()},
                dataType: "text",
                success: function (data) {
                    if (data == "true") {
                      $('#taskInfo').modal('hide'); 
                      taskTable.ajax.reload();
                      $("input[name=taskIds]").val("");
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
     $("input[name=taskIds]").val(taskTable.row($(this).closest('tr')).data().logid);//将日志id赋给隐藏的文本框
     setTimeout(function(){deleteObj($("input[name=taskIds]"),'/tasks/destroy',taskTable);},10);//调用批量删除的方法(延迟10毫秒是为了能够显示出现选中的操作)
  });

  //多选选中和取消选中,同时选中第一个单元格单选框,并联动全选单选框
  $('#example tbody').on('click', 'tr', function(event) {
    $(this).toggleClass('selected');//放在最前处理，以便给checkbox做检测
    var allChecked=$('input[name=allChecked]')[0];//关联全选单选框
    $($(this).children()[0]).children().each(function(){
      if(this.type=="checkbox" && (!$(event.target).is(":checkbox") && $(":checkbox",this).trigger("click"))){
        if(!this.checked){
          this.checked = true;
          addValue($("input[name=taskIds]"),this);
          var selected = taskTable.rows('.selected').data().length;//被选中的行数
          //全选单选框的状态处理
          var recordsDisplay=taskTable.page.info().recordsDisplay;//搜索条件过滤后的总行数
          var iDisplayStart=taskTable.page.info().start;// 起始行数
          if(selected === taskTable.page.len()||selected === recordsDisplay||selected === (recordsDisplay - iDisplayStart)){
            allChecked.checked = true;
          }
        }else{
          this.checked = false;
          cancelValue($("input[name=taskIds]"),this);
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

