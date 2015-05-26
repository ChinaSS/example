/// <reference path="../../../modules/jquery/jquery-2.1.3.js" />
define("PDLoginDir/js/loginout", ["jquery"], function ()
{
    //
    var ret = {
        redirectUrl: undefined,
        loginoutUrl:"/sword/loginout"
    };
    ret._onSucsess=function(data)
    {
        if(this.onSuccess(data))
        {
            var s = (!!this.redirectUrl) ? this.redirectUrl : getServer() + data.data;
            window.location.href = s;
        }
    };
    ret.onSuccess = function (data) {

        return true;
    };
    ret._onError=function (data) {
        if (this.onError(data)) {
            var s = (!!this.redirectUrl) ? this.redirectUrl : data.data.url;
            window.location.href = s;
        }
    };
    ret.onError = function (data) { return true };
    ret.Logout = function () {
        $.ajax(
            {
                global: false,//禁用全局ajax事件
                url: getServer() + this.loginoutUrl,
                data: {
                    "SwordControllerName": "loginout",
                },
                success:this._hitch(this,this._onSucsess),
                error:  this._hitch(this,this._onError)
            }
            )
    };
    ret._hitch = function (/*Object*/scope, /*Function|String*/method) {

        //if (!method) {
        //    method = scope;
        //    scope = null;
        //}
        //if (d.isString(method)) {
        //    scope = scope || d.global;
        //    if (!scope[method]) { throw (['dojo.hitch: scope["', method, '"] is null (scope="', scope, '")'].join('')); }
        //    return function () { return scope[method].apply(scope, arguments || []); }; // Function
        //}
        return function () { return method.apply(scope, arguments || []); }; // Function
    };
    return  ret;
})