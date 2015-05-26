define(["jquery"],function($){
	function Data(){};
	Data.prototype = {
		query : function(config){
			var config = $.extend({},config),
				type;
			if (!config.url||!config.callback) {
				console.log("required params undefined!");
				return false;
			}
			type = config.type?config.type.toUpperCase():(function(){
					if (!config.data) {
						return "GET";
					}else if ((typeof config.data == "string")&&config.data.length<100) {
						return "GET";
					}else if (typeof config.data == "object"){
						return "POST";
					}else{
						return "";
					}
				})();
			//type未定义,默认为GET
			if(type=="GET"){
				$.ajax({
					type:"GET",
					url:config.url+"?q="+config.data,
					dataType:config.dataType?config.dataType:"",
					success:function(data){
						if (!data) {
							console.log("response with no data");
							return false;
						}
						config.callback(data);
					},
					error:function(xhr){
						console.log("ajax request to url("+config.url+") has failed");
					}
				});
			}else if (type=="POST") {
				$.ajax({
					type:"POST",
					url:config.url,
					data:config.data,
					dataType:config.dataType?config.dataType:"",
					success:function(data){
						config.callback(data);
					},
					error:function(xhr){
						console.log("ajax request to url("+config.url+") has failed");
					}
				});
			}else{
				console.log("ajax type is incorrect!");
				return false;
			}
		},
		listToTree : function(data,key){
			var pCodeObj = {},rootObj=null;
			for (var i = 0,pcode; i < data.length; i++) {
				pcode = data[i][key.pcode];
				if (!pcode) {
					rootObj = data[i];
				}else{
					if(!pCodeObj[pcode]){
						pCodeObj[pcode] = [];
					}
					pCodeObj[pcode].push(data[i]);
				}
			}
			dataArr = rootObj?[rootObj]:pCodeObj[rootCode];
			appendData(dataArr,key,pCodeObj);
			return dataArr;
		},
		format : function(data){
			console.log("abstract function, format function should be overwritten");
		},
		sort : function(data){
			console.log("abstract function, sort function should be overwritten");
		}
	};
	function appendData(dataArr,key,pCodeObj){
		var tempDataArr=[],curDataArr;
		for (var i = 0; i < dataArr.length; i++) {
			curDataArr = pCodeObj[dataArr[i][key.code]];
			if (curDataArr&&curDataArr.length>0) {
				dataArr[i][key.data] = curDataArr;
				tempDataArr = tempDataArr.concat(curDataArr);
			}
		}
		if (tempDataArr.length>0) {
			appendData(tempDataArr,key,pCodeObj);
		}	
	}
	return Data;
});