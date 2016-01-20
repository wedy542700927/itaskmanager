$(function() {
  var category_NamesArray = new jMap();//定义一个Map
  var change_tips = $("span[name='changeTips']");
  var categoryTable = $("#example").DataTable({
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
      "url":"/categories/category_list"
    },
    "aoColumns" : [{
            "mData" : "id",
            "orderable" : false, // 禁用排序
            "sDefaultContent" : ""
          }, {
            "mData" : "id",
            "orderable" : true, // 禁用排序
            "sDefaultContent" : ""
          },{
            "mData" : "name",
            "orderable":true,
            "sDefaultContent" : ""
          }, 
          {
            "mData" : "tasks_count",
            "orderable":true,
            "sDefaultContent" : ""
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
            }},{
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
            '<a id="modify" href="#" > 编辑</a>&nbsp;&nbsp;' +
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
   categoryTable.on( 'xhr', function () {
    var json = categoryTable.ajax.json();
    for(var i=0;i<json.aaData.length;i++){
      category_NamesArray.put(json.aaData[i].id,json.aaData[i].name);
    };
   });

  /**
     * 表格初始化完成后执行的方法
     * @param data
     */

     function initComplete(data){
      var topPlugin = '<a id="addCategory" data-toggle="modal" href="#"><i class="icon-font">&#xe026;</i>新增分类</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
              '<a id="batchDel" href="#"><i class="icon-font">&#xe037;</i>批量删除</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
                '<a id="updateOrd" href="#"><i class="icon-font">&#xe046;</i>刷新表格</a>';//快捷操作的HTML DOM

        var messageHtml='&nbsp;&nbsp;&nbsp;&nbsp;<span name="messageTips"></span>';//删除按钮的HTML DOM

  $('#topPlugin').append(topPlugin);//快捷操作的HTML DOM
       $("#message").append(messageHtml);//表格下方的操作区
       $("#addCategory").on("click",function(){
          $("#category_id").val("");//将日志id赋给隐藏的文本框
          $("#name").val("");
          $("#tasks_count").val("");
          $('#categoryInfo').modal('show');
        });//给下方按钮绑定事件
        $("#batchDel").on("click",function(){
          deleteObj($("input[name=categoryIds]"),'/categories/destroy',categoryTable)});//给下方按钮绑定事件
        $("#updateOrd").on("click",function(){
                 categoryTable.ajax.reload();
                 $("input[name=categoryIds]").val("");
        });//给下方按钮绑定事件
    }
  /**
   * 单行删除按钮点击事件响应
   */
   $('#example tbody').on('click', '#modify', function() {

    $("#category_id").val(categoryTable.row($(this).closest('tr')).data().id);//将日志id赋给隐藏的文本框
    $("#name").val($(this).closest('tr').children("td").eq(2).text());
    $("#tasks_count").val($(this).closest('tr').children("td").eq(3).text());
    $('#categoryInfo').modal('show');
    // alert($("#admin").is(':checked'));
  });
  function deleteObj(idsDom,url,table){
      var message_tips=$("span[name=messageTips]");
      if(idsDom.val() !== '' && idsDom.val() !== null){
          if(confirm("确定删除这些记录吗？")){//再次确认
              $.ajax({
                  type: "post",
                  url:url,
                  data:{category_ids:idsDom.val()},
                  dataType: "text",
                  success:function(data){
                      showMassege(message_tips,true,data+"条记录被删除!");
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
    $("#changeCategoryInfo").on("click",function() {
            $.ajax({
                type: "post",
                url: "/categories/update",
                data:{category_id:$("#category_id").val(),name:$("#name").val(),tasks_count:$("#tasks_count").val()},
                dataType: "text",
                success: function (data) {
                    if (data == "true") {
                      $('#categoryInfo').modal('hide'); 
                      categoryTable.ajax.reload();
                      $("input[name=categoryIds]").val("");
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
     $("input[name=categoryIds]").val(categoryTable.row($(this).closest('tr')).data().logid);//将日志id赋给隐藏的文本框
     setTimeout(function(){deleteObj($("input[name=categoryIds]"),'/categories/destroy',categoryTable);},10);//调用批量删除的方法(延迟10毫秒是为了能够显示出现选中的操作)
  });

  //多选选中和取消选中,同时选中第一个单元格单选框,并联动全选单选框
  $('#example tbody').on('click', 'tr', function(event) {
    $(this).toggleClass('selected');//放在最前处理，以便给checkbox做检测
    var allChecked=$('input[name=allChecked]')[0];//关联全选单选框
    $($(this).children()[0]).children().each(function(){
      if(this.type=="checkbox" && (!$(event.target).is(":checkbox") && $(":checkbox",this).trigger("click"))){
        if(!this.checked){
          this.checked = true;
          addValue($("input[name=categoryIds]"),this);
          var selected = categoryTable.rows('.selected').data().length;//被选中的行数
          //全选单选框的状态处理
          var recordsDisplay=categoryTable.page.info().recordsDisplay;//搜索条件过滤后的总行数
          var iDisplayStart=categoryTable.page.info().start;// 起始行数
          if(selected === categoryTable.page.len()||selected === recordsDisplay||selected === (recordsDisplay - iDisplayStart)){
            allChecked.checked = true;
          }
        }else{
          this.checked = false;
          cancelValue($("input[name=categoryIds]"),this);
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
