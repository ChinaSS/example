define(["jquery","PDUtilDir/base/data","css!PDUtilDir/base/css/tree.css"],function($,Data){

	function Tree(config){
		//获取锚点
		this.$wrap = $("#"+config.id);
		this._root = "root";
		//保存url地址
		this._param = $.extend(true,{
			key : {
				code : "code",
				text : "text",
				data : "data"
			}
		},config);
		//绑定事件
		this.bindEvent();
		//渲染节点
		this.getData(this.renderTree);
	}

	Tree.prototype.$getWrap = function(){
		return this.$wrap;
	};

	Tree.mix(Data);//扩展数据处理API

	Tree.prototype.bindEvent = function(){
		var clickTrigger=null;
		this.$wrap.on("click",".node>a",function(event){
			event.preventDefault();
			event.stopPropagation();
			var _this = this;
			clearTimeout(clickTrigger);
			clickTrigger = setTimeout(function(){
				$(_this).parent(".node").toggleClass("open");
			},200);
		}).on("dblclick",".node>a",function(event){
			clearTimeout(clickTrigger);
		});
	};

	Tree.prototype.renderTree = function(data){
		this.renderNode(this.$wrap,data);
	};

	Tree.prototype.renderNode = function($elem,data,tag){
		if (arguments.length<2||!data||!data.length) {
			console.log("arguments are illegal or data does not exist");
			return false;
		}
		var $list = $elem.children("ul"),
			$frag = $(document.createDocumentFragment()),
			$li;
		var key = this._param.key;
		if (!$list.length) {
			$list = $("<ul></ul>");
			$elem.append($list);
		}
		$list.empty();
		for (var i = 0,cur; i < data.length; i++) {
			cur = data[i];
			$li = this._operaData(cur,key,tag);
			$frag.append($li);
			if(!!cur[key.data]&&cur[key.data].length>0){
				$li.addClass(tag?tag:"node");
				this.renderNode($li,cur[key.data]);
			}else{
				$li.addClass(tag?tag:"leaf");
			}
		}
		$list.append($frag);
	};

	Tree.prototype._operaData = function(data,key,tag){		
		var $li = $('<li><span class="pic"></span><a>'+data[key.text]+'</a></li>');
		$li.data("code",data[key.code]);
		if (data[key.code]==this._root) {$li.addClass("open");}
		return $li;
	};

	Tree.prototype.getData = function(callback){
		var _this = this,
			param = this._param;
		try{
			if(param.url){
				this.query({
					url : param.url,
					data : param.q?param.q:null,
					callback : function(data){
						callback.call(_this,data);
						param.callback?param.callback(data):false;
					}
				});
			}else if (param.data) {
				callback.call(_this,param.data);
				param.callback?param.callback(param.data):false;
			}else{
				throw("data sorce undefined!");
			}
		}catch(e){
			console(e.message);
			return false;
		}
	};

	return Tree;
});