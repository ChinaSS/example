/// <reference path="../../../modules/jquery/jquery-2.1.3.js" />
/// <reference path="rsa.js" />
define(["PDLoginDir/js/rsa", "jquery", "JQuery.validate", "JQuery.validate.message", "JQuery.validate.extra"], function (rsa) {
    ///<summary >  login  define </summary>
    ///<param name="rsa" type="login_rsa"></param>

    //配置validate
    var ret = {
        //成员变量
        //登录名录入框选择器
        inputLoginNameSelector: "#pd_web_login_name",
        //密码录入框选择器
        inputPwdSelector: "#pd_web_pwd",
        //验证码录入框选择器
        inputCaptchaSelector: "#pd_web_captcha",
        //记住密码录入框选择器
        inputRememberPsdSelector:"#pd_web_check_pwd",
        //记住用户登录名录入框选择器
        inputRememberLoginNameSelector:"#pd_web_check_login_name",
        //自动登录录入框选择器
        inputAutoLoginSelector: "#pd_web_check_autologin",
        //提交按钮
        btnSubmitSelector: '#pd_web_btn_submit',
        formSelector: "#pd_web_login_form",
        imgCaptchaSelector: "#pd_web_captcha_img",
        captchaWidth: 112,
        captchaHeight:40,
        _captchaUrl:"",
        _tabsLength: 0,
        _curFocus:0,
        _enterSubmit: true,
        validator:undefined
    };
    ret._onfocus = function (evt) {
        ///<summary>焦点事件</summary>
        this._curFocus = parseInt( $(evt.target).attr("tabindex"));
        if (this._curFocus > this._tabsLength - 1 || this._curFocus < 0) {
            this._curFocus = 0;
        }
        this._enterSubmit = true;//可以回车提交
    };
    ret._initFocus=function()
    {
        ///<summary>初始化焦点 </summary>
        var s = this.formSelector + " " + ":input,button";
        var inputs = $(s);
        inputs.focus(this._hitch(this, this._onfocus));
        for (var i = 0; i < inputs.length; i++) {
            var it = inputs[i];
            if ($(it).val().length == 0)
            {
                $(it).focus();
                this._curFocus = i;
                break;
            }
        }
    };
    ret._initTabindex = function () {
        ///<summary>初始化tab键顺序 </summary>
        var s = this.formSelector + " " + ":input,button";
        var inputs = $(s);
        for (var i = 0; i < inputs.length; i++) {
            var it=inputs[i];
            $(it).attr("tabindex", i + 1);
            this._tabsLength++;
        }
    };
    ret._getCurFocusId=function()
    {
        ///<summary>获得现在的焦点element id </summary>
        var s = this.formSelector + " [" + "tabindex=" +"'"+this._curFocus+"'" +"]";
        var r = $(s);
        s=r.attr("id");
        if (s == document.activeElement.id)
        {
            return s;
        }
        
        return "";
    };
    ret._hitch= function (/*Object*/scope, /*Function|String*/method ) {

        //if (!method) {
        //    method = scope;
        //    scope = null;
        //}
        //if (d.isString(method)) {
        //    scope = scope || d.global;
        //    if (!scope[method]) { throw (['dojo.hitch: scope["', method, '"] is null (scope="', scope, '")'].join('')); }
        //    return function () { return scope[method].apply(scope, arguments || []); }; // Function
        //}
        return  function () { return method.apply(scope,arguments||[]); }; // Function
    };
    ret.onkeyUpEvt = function (evt, elm) {
        ///<summary>键盘up键事件</summary>
        ///<param name="evt" type='KeyboardEvent'></param>
        if (evt.keyCode == 13)
        {
            $(this.btnSubmitSelector).trigger("click");
            //var sId = this._getCurFocusId()
        }
    };
    ret.Init = function () {
        ///<summary>初始化函数 </summary>
        this._initFocus();
        this._initTabindex();
        this.initValidate();
        $(this.formSelector).keyup(this._hitch(this, this.onkeyUpEvt));
        //初始化  captcha 验证码地址
        this._captchaUrl = $(this.imgCaptchaSelector).attr("src");
        $(this.imgCaptchaSelector).click(this._hitch(this, this.onRefreshCaptcha));
        $(this.btnSubmitSelector).unbind();
        $(this.btnSubmitSelector).click(this._hitch(this, this.onLoginSubmit));
      
    };

    ret.initValidate = function () {
        ///<summary>初始化校验参数 </summary>
       this.validator= $(this.formSelector).validate({
            rules : {
                name : "required",
                password : "required",
                code : "required"
            },
            messages : {
                name : "请填写登录名",
                password : "请填写密码",
                code : "请填写验证码"
            },
            errorPlacement: this._hitch(this,this.onValidatePlacement),
            Onubmit: false,
            onfocusout: false,
            onkeyup: false,
            onclick: false      
        })
    };
    ret._validateEach=function()
    {
        var s = this.formSelector + " " + ":input,button";
        var inputs = $(s);
        var  b=true;
        for (var i = 0; i < inputs.length; i++) {
            var it = inputs[i];
            b = this.validator.element(it)
            if (!b) {
                $(it).focus();
                break;
            }
        }
        return b;
    }
    ret.onValidatePlacement = function (error, element) {
  
            $(element).closest(".form-group").find(".error").append(error); 
    };
    ret.onRefreshCaptcha=function()
    {
        ///<summary>校验码刷新事件</summary>
        ///String.valueOf(random());
        var s = Math.round(Math.random() * 10000).toString();
        s= this._captchaUrl + "&r=" + s;
        if (this.captchaHeight > 0 && this.captchaWidth > 0)
            s += "&width=" + this.captchaWidth.toString() + "&height=" + this.captchaHeight.toString();
        $(this.imgCaptchaSelector).attr("src", s);
        $(this.inputCaptchaSelector).val("");
    };
    ret.onPostCheckPwdSuccess=function( data)
    {
        if (data.code == "success") {
            window.location.href = getServer() + data.data;
            $(this.btnSubmitSelector).html("验证通过，请等待页面转……");
        } else {
            alert(data.message);
            this.onRefreshCaptcha();
            $(this.btnSubmitSelector).html("登录").removeClass("disabled");
        }
    };
    ret.onPostCheckPwdError = function (data)
    {
        $(this.btnSubmitSelector).html("请求异常");//.removeClass("disabled");
        this._enterSubmit = true;
    };
	//监听登录按钮点击事件
    ret.onLoginSubmit = function () {
        if (this._enterSubmit) {
            this._enterSubmit = false;
            if (this._validateEach()) {
                $(this.btnSubmitSelector).html("请求中……").addClass("disabled");
                var rsaKey = rsa.getKeyPair(rsaKeyExponent, "", rsaKeyModulus);
                var d = {
                    "SwordControllerName": "login",
                    "name": $(this.inputLoginNameSelector).val(),
                    "password": rsa.encryptedString(rsaKey, $(this.inputPwdSelector).val().split("").reverse().join("")),
                    "code": $(this.inputCaptchaSelector).val(),
                    "checkPwd": $(this.inputRememberPsdSelector)[0].checked
                }
                $.ajax({
                    global: false,//禁用全局ajax事件
                    url: getServer() + "/sword/login",
                    data: d,
                    success: this._hitch(this, this.onPostCheckPwdSuccess),
                    error: this._hitch(this, this.onPostCheckPwdError)
                })
            };
        }
    };
	return ret;
})