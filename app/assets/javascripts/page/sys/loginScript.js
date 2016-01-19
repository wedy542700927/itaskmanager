$(document).ready(function () {
    /**
     * 前端登陆验证
     */
    var message_tips = $("span[name='loginTips']"); // 获得提示文本对象
    //用户登陆前端验证
    var username_input = $("input[name='username']");
    username_input.blur(function () {
        checkUserName();
    });
    username_input.focus(function () {
        message_tips.html("");
    });
 
    //用户名验证的方法
    function checkUserName() {
        var username = username_input.val();
        if (username == "" || username == null) {
           showMassege(message_tips,false,"用户名不能为空！");
            return false;
        }
        if (username.length > 12) {
            showMassege(message_tips,false,"用户名不多于12个字节！");
            return false;
        }
        return true;
    }
 
    // 密码前端检测
    var password_input = $("input[name='password']");
    password_input.blur(function () {
        $("#left_hand").attr("class","initial_left_hand");
        $("#left_hand").attr("style","left:100px;top:-12px;");
        $("#right_hand").attr("class","initial_right_hand");
        $("#right_hand").attr("style","right:-112px;top:-12px");
        checkPassword();
    });
    password_input.focus(function () {
        message_tips.html("");
        $("#left_hand").animate({
            left: "150",
            top: " -38"
        },{step: function(){
            if(parseInt($("#left_hand").css("left"))>140){
                $("#left_hand").attr("class","left_hand");
            }
        }}, 2000);
        $("#right_hand").animate({
            right: "-64",
            top: "-38px"
        },{step: function(){
            if(parseInt($("#right_hand").css("right"))> -70){
                $("#right_hand").attr("class","right_hand");
            }
        }}, 2000);
    });
 
    //登陆的密码验证
    function checkPassword() {
        var password = $("input[name='password']").val();
        if (password == "" || password == null) {
            showMassege(message_tips,false,"密码不能为空！");
            return false;
        }
        // if (password.length < 6 || password.length > 16) {
        //     showMassege(message_tips,false,"密码长度为6到16位！");
        //     return false;
        // }
        return true;
    }
 
    //登陆按钮点击事件
    $(".submit_a").on("click",function () {
        if (checkUserName() && checkPassword()){
            $.ajax({
                type: "post",
                url: "/users/login",
                data:{username:username_input.val(),password:password_input.val()},
                dataType: "text",
                success: function (data) {
                    if (data == "false") {
                        showMassege(message_tips,false,"用户名或密码错误！");
                        return false;
                    } else {
                        showMassege(message_tips,true,"登录成功！正在跳转页面...");
                    	setTimeout(function () {
                    		 window.location="/page/index";
                    	}, 1500); //页面刷新
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