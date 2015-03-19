define(["jquery"],function($){
	function Comp(){}
	Comp.prototype = {
		init : function(config){
			console.log("abstract function, Init function should be overwritten");
		},
		reload : function(data){
			console.log("abstract function, Reload function should be overwritten");
		},
		finish : function(data,callback){
			callback(data);
		}
	};
	return Comp;
});