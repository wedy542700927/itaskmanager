//公有ajax文件上传
function uploadFile(url) { //加载的时候就执行
    var uploadTips = $('span[name=uploadTips]');
    //所有的验证通过，ajax提交图片数据
    $('#pic_upload').uploadify({
        "uploader": "/users/user_image_upload",
        "method": "post",
        "progressData": "percentage",
        "swf": "/assets/uploadify.swf",
        'fileTypeDesc': '图片文件（jpg或png）',
        'fileTypeExts': '*.jpg; *.png',
        "buttonText": "选择需要上传的图片",
        "multi": false,
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
                $("input[name=pImg]").val(data['cate_image']['url']); //把返回的url放入隐藏域
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
