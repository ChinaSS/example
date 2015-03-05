define(["jquery"],function($){
	function Data(){};
	Data.prototype = {
		query : function(q,url,callback,type){
			//type未定义,默认为GET
			type==GET?ajax(type:get,url:url+"?q="+q);//q为字符串
			type==POST?ajax(type:post,url:url,data:q);//q为JSON对象
			console.log("abstract function, query function should be overwritten");
		},
		dataFormat : function(data){
			console.log("abstract function, dataFormat function should be overwritten");
		}
	};
	return Data;
});