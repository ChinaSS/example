/*
 * base.js
 * 基本设置
 */
define(["PDUtilDir/util", 'jquery', "JQuery.validate", "JQuery.validate.message", "JQuery.validate.extra", "Bootstrap"],function(Util){
    /*
     * 对原生$.ajax进行包装（不改变使用方式）
     */
    var cloneAjax = $.ajax;
    $.ajax = function(param){
        var p = $.extend({},param);
        p.callback = p.success;
        delete p.success;
        cloneAjax($.extend({
            type:"POST",
            dataType:"json",
            beforeSend : function(XMLHttpRequest) {
            },
            headers : {
            	"CSRFToken" : getCSRFToken()
            },
            success:function(response){
                var code = response.code;
                //状态码控制
                switch(code){
                    case "200":
                        break;
                    case "401":
                    	//需要认证：登录超时或未登录
                    	Util.alert("登录过期，请重新登录<a href='" + getServer() + "/sword/login'>点此登录</a>")
                    	break;
                    case "400":
                    	//客户端错误：受到攻击或者请求异常
                    	Util.alert("请求异常！");
                    	break;
                    case "403":
                    	//未授权
                    	Util.alert("未授权！");
                    	break;
                    default :
                        p.callback && p.callback(response.model);
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                //console.log("ajax error:"+textStatus);
            }
        },p));
        return cloneAjax;
    };
    /*
     * 全局ajax监听
     */
    $(document).ajaxStart(function(){
    	//开始请求时显示等待信息
    	Util.Loading.show();
    }).ajaxSend(function(evt, request, settings){
    	
    }).ajaxSuccess(function(evt, request, settings){
    	
    }).ajaxComplete(function(evt, request, settings){
    	
    }).ajaxError(function(evt, request, settings){
    	//请求出错时关闭等待信息
//    	Util.Loading.hide();
    }).ajaxStop(function(){
    	//请求结束时关闭等待信息
    	Util.Loading.hide();
    })
    
    /*
     * 全局表单验证
     */
    $.validator.setDefaults({
        errorElement : 'span',
        errorClass : 'cs-help-block',
        highlight : function(target) {
            var fg =  $(target).closest('.form-group');
            //直接是输入框时，修改输入框的边框样式，比如table中的输入框验证
            fg.length ? fg.addClass('has-error') : $(target).addClass('cs-error-border');
        },
        success : function(message) {
            var fg =  message.closest('.form-group');
            fg.length ? fg.removeClass('has-error') : message.prev().removeClass('cs-error-border');
            message.remove();
        }
    });
    
    return {}
});