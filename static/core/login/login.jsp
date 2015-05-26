<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions"%>
<c:set var="ctx" value="${pageContext.request.contextPath}"/>
<jsp:useBean id="rsa" class="com.css.sword.common.login.security.loginBean" ></jsp:useBean>
<jsp:setProperty property="pageContext" name="rsa" value="<%=pageContext %>"/>
<%  %>
<!DOCTYPE html>
<html lang="en">
<head>
 	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>sword-login</title>

    <link rel="stylesheet" href="${ctx }/static/modules/bootstrap/css/bootstrap.min.css" />
    <link rel="stylesheet" href="${ctx }/static/modules/Font-Awesome/css/font-awesome.min.css" />
    <!-- login css -->
    <link rel="stylesheet" href="${ctx }/static/core/login/css/login.css">
    <link rel="stylesheet" href="${ctx }/static/core/home/home.css" />
    
    <!-- IE8响应式布局 兼容性js文件 -->
    <!--[if lte IE 8]>
    <script src="${ctx }/static/modules/ace/js/html5shiv.js"></script>
    <script src="${ctx }/static/modules/ace/js/respond.min.js"></script>
    <![endif]-->
</head>

<body>

	<div class="login_wrap">
        <h2 class="login_title">Sword</h2>
        <form id=pd_web_login_form action="" class="form-horizontal">
            <div class="form-group mb20">
                <label for="name" class="sr-only">Name</label>
                <div class="col-sm-12">
                    <div class="input-group">
                        <div class="input-group-addon"><i class="fa fa-user fs20 w20"></i></div>
                        <input type="text" class="form-control h42" id="pd_web_login_name" name="name" placeholder="登录名" value="${rsa.user}">
                    </div>
                    <div class="error"></div>
                </div>
            </div>
            <div class="form-group mb20">
                <label for="password" class="sr-only">Password</label>
                <div class="col-sm-12">
                    <div class="input-group">
                        <div class="input-group-addon"><i class="fa fa-lock fs20 w20"></i></div>
                        <input type="password" class="form-control h42" id="pd_web_pwd" name="password" placeholder="密码" value="${rsa.sPwd}">
                    </div>
                    <div class="error"></div>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-7">
                    <div class="input-group">
                        <div class="input-group-addon"><i class="fa fa-check fs20 w20"></i></div>
                        <input class="form-control h42" id="pd_web_captcha" name="code" placeholder="验证码  " >
                    </div>
                    <div class="error"></div>
                </div>
                <div class="col-sm-5">
                    <img src="${ctx }/sword/login/captcha?SwordControllerName=captcha" id="pd_web_captcha_img" />
                </div>
            </div>
            <div class="form-group mb20">
                <div class=" col-sm-12">
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" ${rsa.checkPwd?"checked='checked'":""} id="pd_web_check_pwd">记住我
                        </label>
                    </div>
                </div>
            </div>
            <div class="form-group">
                <div class="col-sm-12">
                    <button type="button" id="pd_web_btn_submit" class="btn btn-success btn-block" role="button">登&nbsp;录</button>
                </div>
            </div>
        </form>
	</div>
	<!-- js -->
	<!-- requireJS -->
	<script src="${ctx }/static/modules/requirejs/require.js" type="text/javascript"></script>
    <!-- config.js -->
    <script type="text/javascript" src="${ctx }/static/global/config.js"></script>

	<!-- 全局js设置 -->
	<script type="text/javascript">
	var rsaKeyExponent="${rsa.publicKeyExponent}";
	var rsaKeyModulus="${rsa.publicKeyModulus}";  
	//function p(){document.getElementById("pwd").value = "${rsa.sPwd}";
	//	};
	//	p();
		function getServer() {
			var contextPath = '${ctx }';
		    return contextPath;
		}
		function getStaticPath() {
			return getServer() + "/static";
		}
		function getCSRFToken() {
			var token = "${sessionScope.CSRFToken}";
			return token;
		}
		require.config({
			baseUrl : getServer()+"/",
			paths : {
				"jquery":"static/modules/jquery/jquery.min"
			}
		})
	</script>
	
	<!-- jquery IE版本 -->
	<!--[if IE]>
	<script type="text/javascript">
	    require.config({
	    	paths:{
	    		"jquery":"static/modules/jquery/jquery1x.min"
	   		}
		});
	</script>
	<![endif]-->
	
	<!-- 程序入口 -->
	<script  type="text/javascript" src="${ctx }/static/core/login/js/lgnPage.js">
	</script>
</body>
</html>
