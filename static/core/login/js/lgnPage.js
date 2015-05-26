/// <reference path="../../../modules/jquery/jquery-2.1.3.js" />
/// <reference path="login.js" />

require(["PDGlobalDir/base", "PDCoreDir/corePath"], function (Base) {
	require(["PDLoginDir/js/login"], function(Login){
		///<summary > require  page</summary>
		///<param name="l"  value=""></param>
		window.lgn = Login;
		Login.Init();
	})
})