$(document).ready(function () {
    /**
     * 前端登陆验证
     */
    var message_tips = $("span[name='changeTips']"); // 获得提示文本对象
    //用户登陆前端验证
    var oldPassword_input = $("input[name='oldPassword']");

    var newPassword_input = $("input[name='newPassword']");
 
    //登陆的密码验证
    function checkNewPassword() {
        var newPassword = $("input[name='newPassword']").val();
        if (newPassword == "" || newPassword == null) {
            showMassege(message_tips,false,"新密码不能为空！");
            return false;
        }
        if (newPassword.length < 6 || newPassword.length > 16) {
            showMassege(message_tips,false,"新密码长度必须6到16位！");
            return false;
        }
        return true;
    }
    var newPasswordConfirm_input = $("input[name='newPasswordConfirm']");
    function checkNewPasswordConfirm() {
        var newPasswordConfirm = $("input[name='newPasswordConfirm']").val();
        if (newPasswordConfirm != $("input[name='newPassword']").val()) {
            showMassege(message_tips,false,"两次输入密码不一致！");
            return false;
        }
        return true;
    }
    //登陆按钮点击事件
    $("#changePassword").on("click",function() {
        if (checkNewPassword() && checkNewPasswordConfirm()){
            $.ajax({
                type: "post",
                url: "/users/change_pw",
                data:{oldPassword:oldPassword_input.val(),newPassword:newPassword_input.val(),newPasswordConfirm:newPasswordConfirm_input.val()},
                dataType: "text",
                success: function (data) {
                    if (data == "false") {
                        showMassege(message_tips,false,"原密码错误！");
                        return false;
                    } else {
                        showMassege(message_tips,true,"修改成功！");
                      // setTimeout(function () {
                      //    window.location="/page/index";
                      // }, 1500); //页面刷新
                      return false;
                    }
                },
                error: function (XMLHttpRequest, textStatus,errorThrown) {
                    alert(errorThrown);
                    return false;
                }
            });
          }
        return false;
    });
});
