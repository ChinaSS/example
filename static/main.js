require.config({
    baseUrl:"",
    paths:{
        //基础模块配置
        "Bootstrap":"modules/bootstrap/js/bootstrap.min",
        "Ace-extra":"modules/ace/js/ace-extra.min",
        "Ace":"modules/ace/js/ace",
        "Angular":"modules/angular/angular.min",
        "Angular-route":"modules/angular/angular-route.min",
        "JQuery.validate":"modules/jquery/plugins/validate/jquery.validate.min",
        "JQuery.validate.extra":"modules/jquery/plugins/validate/additional-methods",
        "JQuery.validate.message":"modules/jquery/plugins/validate/localization/messages_zh",
        "ZTree":"modules/zTree/js/jquery.ztree.all-3.5.min",
        "WebUploader":"modules/webuploader/webuploader.min",
        "Cropper":"modules/cropper/js/cropper",
        "Date":"modules/bootstrap/plugins/datetimepicker/js/datetimepicker.min",
        "DateCN":"modules/bootstrap/plugins/datetimepicker/js/datetimepicker.cn",
        "Scroll":"modules/jquery/plugins/jquery.slimscroll.min",
        "Util":"modules/util/util",
        "HomeApp":"homeApp",
        /*目录地址映射*/
        "UtilDir":"modules/util",
        "OrgDir":"core/system/org",
        "AclDir":"core/system/acl",
        /*CSS文件路径映射*/
        "ZTreeCss":"modules/zTree/css/zTreeStyle/zTreeStyle",
        "WebUploaderCss":"modules/webuploader/css/webuploader",
        "CropperCss":"modules/cropper/css/cropper.min",
        "DateCss":"modules/bootstrap/plugins/datetimepicker/css/datetimepicker.min"
    },
    shim:{
        "Bootstrap":["jquery"],
        "Ace-extra":{},
        "Angular":{"exports":"angular"},
        "Angular-route":['Angular'],
        "ZTree":["jquery"],
        "DateCN":["Date"],
        "JQuery.validate.extra":["JQuery.validate"],
        "JQuery.validate.message":["JQuery.validate"]
    },
    map:{
        '*':{
            'css': 'modules/requirejs/plugin/css.min',
            'text':'modules/requirejs/plugin/text'
        }
    }
});

/*
 * 首页onload加载项
 */
require(["Ace","UtilDir/util","Bootstrap","JQuery.validate","JQuery.validate.message","JQuery.validate.extra","app/appPath"],function(ace,util){
    require(["HomeApp"], function () {
        angular.element(document).ready(function () {
            angular.bootstrap(document, ['HomeApp']);
            ace.init();
        });
    });


    /*
     * 表单验证公共设置
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

    /*
     * 未登录或session过期时ajax处理
     */
    $(document).ajaxSuccess(function (event,request,settings) {
        var data = request.responseJSON;
        if(request.getResponseHeader('LOGIN-AUTH') === 'login'){
            require(["UtilDir/util"],function(util){
                util.confirm("您没有登录或会话已过期请重新登录，是否立即跳转到登录页？",function(){
                    window.location = getServer();
                })
            });
        }else  if(data.status=="500"){
            alert(data.entity.msg+"\n"+data.entity.cause);
            console.log(data.entity.stackTrace);
        }else if(data.status=="403"){
            alert("权限不足 禁止访问");
        }
    }).ajaxSend(function () {
        require(["UtilDir/util"],function(util){
            //util.progress.start();
        });
    }).ajaxError(function (event, jqxhr, settings, thrownError) {
        require(["UtilDir/util"],function(util){
            //处理没有被服务器捕获的异常, 可能服务器崩溃
        });
    }).ajaxStart(function(){
        util.Loading.show();
    }).ajaxStop(function(){
        util.Loading.hide();
    })
});

(function(w){

    //静态文件目录名称
    var staticDir = "/static";
    var projectName = document.location.pathname.substring(0,document.location.pathname.indexOf(staticDir+"/"));
    /**
     * 得到项目名称
     * 默认为:8080（即origin）与static目录之间的部分
     * https://chinass.github.io/example/static/index.html即项目名称为example
     * @returns {*}
     */
    w.getServer = function(){
        return projectName;
    };

    /*
     * 全局静态资源路径
     * @returns {string}
     */
    w.getStaticPath = function(){
        return getServer()+staticDir;
    }
})(window);