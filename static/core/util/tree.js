define(["jquery"],function($){

	function treeInit(config){
		return new Tree(config);
	}

	function Tree(config){
		//获取锚点
		this.$wrap = $("#"+config.id);
		//绑定事件
		this.bindEvent(this.$wrap);
		//渲染节点
		try{
			if(!!config.url){
				this.getAjaxData(config.q,config.url,this.renderTree);
			}else if (!!config.data) {
				this.renderTree(config.data);
			}else{
				throw("data sorce undefined!");
			}
		}catch{
			return false;
		}
	}

	Tree.fn = Tree.prototype = {
		bindEvent : function($wrap){
			//bind event
		},
		renderTree : function(data){
			//render tree
			var $frag = $(document.createDocumentFragment());
			this.$wrap.empty().append($frag);
		},
		appendDataList : function($elem,data){
			var $frag = $(document.createDocumentFragment());
			for (var i = 0; i < data.length; i++) {
				$frag.append('<a>'+data[i]+'</a>');
			}
			$elem.empty().append($frag);
		},
		getAjaxData : function(q,url,callback){
			$.ajax({
				url : url+"?q="+q,
				type : "GET",
				success : function(data){
					callback(data);
				},
				error : function(){
					console.log("Ajax request has occured an error!");
				}
			});
			//callback(data);
			//return true;
		},
		refreshTree : function(data){
			this.renderTree(data);
		}
	};
});