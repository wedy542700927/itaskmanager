/**
 * Map插件
 */

function jMap(){
    //私有变量
    var arr = {};
    //增加
    this.put = function(key,value){
        arr[key] = value;
    }
    //查询
    this.get = function(key){
        if(arr[key]){
            return arr[key]
        }else{
            return null;
        }
    }
    //删除
    this.remove = function(key){
        //delete 是javascript中关键字 作用是删除类中的一些属性
        delete arr[key]
    }
    //遍历
    this.eachMap = function(fn){
        for(var key in arr){
            fn(key,arr[key])
        }
    }
}

/**
* 单选框被选中时将它的value放入隐藏域
*/
function addValue(dom,para) {
    if(dom.val() === ""){
        dom.val($(para).val());
    }else{
        dom.val(dom.val()+","+$(para).val());
    }
}
    
/**
* 单选框取消选中时将它的value移除隐藏域
*/
function cancelValue(dom,para){
    //取消选中checkbox要做的操作
    var array = dom.val().split(",");
    dom.val("");
    for (var i = 0; i < array.length; i++) {
        if (array[i] === $(para).val()) {
            continue;
        }
        if (dom.val() === "") {
            dom.val(array[i]);
        } else {
            dom.val(dom.val() + "," + array[i]);
        }
    }
}

/**
* 通用消息提示函数
* @param {} tipsObj
* @param {} tof
* @param {} massege
*/
function showMassege(tipsObj,tof,massege){
    if(tof){
        tipsObj.removeClass('alert-danger');
        tipsObj.addClass('alert-success');
    }else{
        tipsObj.removeClass('alert-success');
        tipsObj.addClass('alert-danger');
    }
    tipsObj.html(massege);
    setTimeout(function(){tipsObj.html("");}, 1000);//页面刷新
}

/**
* 通用删除按钮事件
*/
function deleteObj(idsDom,url,table){
    var message_tips=$("span[name=deleteTips]");
    if(idsDom.val() !== '' && idsDom.val() !== null){
        if(confirm("确定删除这些记录吗？")){//再次确认
            $.ajax({
                type: "post",
                url:url,
                dataType: "text",
                success:function(data){
                    message_tips.html(data+"条记录被删除!");
                    setTimeout(function(){
                            table.ajax.reload(null,false);
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
//公有ajax文件上传
function uploadFile(hiddenComp,url,multi) { //加载的时候就执行
    var uploadTips = $('span[name=uploadTips]');
    //所有的验证通过，ajax提交图片数据
    $('#pic_upload').uploadify({
        "uploader": url,
        "method": "post",
        "progressData": "percentage",
        "swf": "/assets/uploadify.swf",
        'fileTypeDesc': '图片文件（jpg或png）',
        'fileTypeExts': '*.jpg; *.png',
        "buttonText": "选择需要上传的图片",
        "multi": multi,
        "filesSelected": 1,
        "auto": true,
        "fileSizeLimit": "1536kb",
        'fileObjName': 'image_upload',
        "successTimeout": 600,
        'overrideEvents': ['onDialogClose', 'onUploadSuccess', 'onUploadError', 'onSelectError'], //阻断弹窗 
        "onUploadSuccess": function (file, data, response) {
            if(data != "false"){
                showMassege(uploadTips,true,"上传成功！");
                //把上传的图片显示出来
                var data = eval('(' + data + ')'); //把传回的字符串转换为json
                hiddenComp.val(data['cate_image']['url']); //把返回的url放入隐藏域
                $('div[name=imgDiv]').css("display", "block");
                $('img[name=imgShow]').attr("src", data['cate_image']['url']);
            }else{
                showMassege(uploadTips,false,"上传失败！");
            }
        },
        "onUploadError": function (file, errorCode, errorMsg, errorString) {
            alert("服务端返回状态" + errorMsg + errorString);
        },
        'onSelectError': function (file, errorCode, errorMsg) {
            switch (errorCode) {
            case -100:
                showMassege(uploadTips,false,"一次只允许选择一张图片！");
                break;
            case -110:
                showMassege(uploadTips,false,"上传文件不得超过1.5M!");
                break;
            case -130:
                showMassege(uploadTips,false,"格式只能为jpg或png！");
                break;
            default:
                showMassege(uploadTips,false,"系统错误！");
                break;
            }
            return;
        }
    });
}
;
