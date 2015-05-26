/*
参数列表
config = {
	id : id, //用于缓存数据的id,通常为当前触发元素id
	multi : false, //单选or多选
	title : "数据选择",
	height : "320px", //默认值320px
	width : "800px", //默认值800px
	tagData : ["user","role","group","post"], //控制显示的数据类型
	hideTag : false, //当tagData只有一条数据时,选择是否隐藏标签
	realTimeData : false, //强制刷新层级树
	dataRefill : true, //数据回填
	simpleReturnData : false, //是否返回简单数据数组,和一个简单数据映射集
	callback : function(data){}, //处理数据的回调函数
}
*/
define(["PDUtilDir/dialog","text!PDUtilDir/org/template/dataSelect.html","css!PDUtilDir/css/dataSelect.css","ZTree","css!ZTreeCss"],function(Dialog,template){
	var dataCacheObj = {},
		hasParentData = {
			group : true,
			dept : true
		},
		typeList = {
			user : {
				key : {
					tree : {
						id : "deptUuid",
						name : "deptName",
						code : "deptCode",
						pcode : "pDeptTreeId"
					},
					data : {
						id : "userUuid",
						code : "userCode",
						name : "userName",
						pname : "deptName"
					}
				},
				name : "人员",
				all : "/sword/org/dept/getAllDept",
				id : "/sword/org/user/getUserByDeptUuid",
				mh : "/sword/org/user/getUserMh"
			},
			role : {
				key : {
					tree : {
						id : "dirCode",
						name : "dirName",
						code : "dirCode",
						pcode : "pDirCode"
					},
					data : {
						id : "roleUuid",
						code : "roleCode",
						name : "roleName",
						pname : "dirName"
					}
				},
				name : "角色",
				all : "/sword/org/roledir/getAllRoleDir",
				id : "/sword/org/role/getRoleByRoleDirCode",
				mh : "/sword/org/role/getRoleMh"
			},
			group : {
				key : {
					tree : {
						id : "deptTreeId",
						name : "deptName",
						code : "deptCode",
						pcode : "pDeptTreeId"
					},
					data : {
						id : "deptUuid",
						code : "deptCode",
						name : "deptName",
						pname : "pDeptTreeId"
					}
				},
				name : "群组",
				all : "/sword/org/dept/getAllDept",
				id : "/sword/org/dept/getAllChildDeptByDeptTreeId",
				mh : "/sword/org/dept/getDeptMh"
			},
			post : {
				key : {
					tree : {
						id : "deptUuid",
						name : "deptName",
						code : "deptCode",
						pcode : "pDeptTreeId"
					},
					data : {
						id : "gwUuid",
						code : "gwCode",
						name : "gwName",
						pname : "pDeptTreeId"
					}
				},
				name : "岗位",
				all : "/sword/org/dept/getAllDept",
				id : "/sword/org/dept/getGwByDeptUuid",
				mh : null
			},
			dept : {
				key : {
					tree : {
						id : "deptTreeId",
						name : "deptName",
						code : "deptCode",
						pcode : "pDeptTreeId"
					},
					data : {
						id : "deptUuid",
						code : "deptCode",
						name : "deptName",
						pname : "pDeptTreeId"
					}
				},
				name : "部门",
				all : "/sword/org/dept/getAllDept",
				id : "/sword/org/dept/getAllChildDeptByDeptTreeId",
				mh : "/sword/org/dept/getDeptMh"
			}
		};

	function getDataByAll(type,callback){
		$.ajax({
			type:"GET",
			url:getServer()+typeList[type].all,
			success:function(data){
				if(!data){data=[];console.log("ajax数据不存在");}
				callback(data);
			},
			error:function(xhr){
				console.log(xhr);
				callback([]);
			}
		});
	}

	function getDataById(id,type,callback){
		var data={};
		data[typeList[type].key.tree.id]=id;
		$.ajax({
			type:"GET",
			url:getServer()+typeList[type].id,
			data:data,
			success:function(data){
				if(!data){data=[];console.log("ajax数据不存在");}
				callback(data);
			},
			error:function(xhr){
				console.log(xhr);
				callback([]);
			}
		});
	}

	function getDataByMh(text,id,type,callback){
		if (!typeList[type].mh) {
			console.log(typeList[type].name+"类型数据不支持模糊查询");
			return false;
		}
		var data={};
		/*
		data[typeList[type].key.data.code]=text;
		data[typeList[type].key.data.name]=text;
		*/
		data.param = text;
		data[typeList[type].key.tree.id]=id;
		$.ajax({
			type:"GET",
			url:getServer()+typeList[type].mh,
			data:data,
			success:function(data){
				if(!data){data=[];console.log("ajax数据不存在");}
				callback(data);
			},
			error:function(xhr){
				console.log(xhr);
				callback([]);
			}
		});
	}

	function toggleInputStatus($input,flag){
		var status;
		if (!$input.length) {return;}
		if (typeof flag == "boolean") {
			flag?($input[0].checked=true):$input.removeAttr("checked");
			status = flag;
		} else {
			if($input.is(":checked")){
	            $input.removeAttr("checked");
	            status = false;
	        }else{
	            $input[0].checked = true;
	            status = true;
	        }
		}
        return status;
	}

	function getInputStatus($input){
		return $input.is(":checked");
	}

    function transformation(string){
        return string.replace(/[\.\[\]\s]/,"\\\\$&");
    }
	//ZTree辅助函数

	function resetZTreeStatus(id){
		var treeObj = $.fn.zTree.getZTreeObj(id),
			$nodes = $("#"+id).children();
		if (!treeObj) { return false;}
		treeObj.expandAll(false);
		if ($nodes.length==1) {
			treeObj.expandNode(treeObj.getNodeByTId($nodes.first().attr("id")),true);
		}
		clearZTreeSelectedStatus(id);//清除节点选中状态
	}

	function clearZTreeSelectedStatus(id){
		var treeObj = $.fn.zTree.getZTreeObj(id);
		if (!treeObj) { return false;}
		treeObj.cancelSelectedNode();
	}

	function getZTreeSelectedNode(id){
		return $.fn.zTree.getZTreeObj(id).getSelectedNodes();
	}

	//人员选择类
	function DataSelect(config){
		this.config = $.extend({
			dataRefill : true,
			realTimeData : false
		},config);
		this.selectData = {};
		//init Dialog
        this.dialog = this.initDialog();
		var $dialog = this.dialog.$getDialog();
		this.$dataTree = $dialog.find(".dataTree");
		this.$dataList = $dialog.find(".dataList");
		this.$selectList = $dialog.find(".selectList");

		//init DataTree
		this.initDataTree(this.$dataTree);

		//bind event
		this.bindEvent();
	}

	DataSelect.prototype.bindEvent = function(){
		var _this = this;
		//bind dataType event
		this.$dataTree.children(".type").on("click","li",function(event){
			var curType = $(this).data("type"),$curTree,selectedNode;
			if ($(this).is(".on")) {return false;}
			$(this).addClass("on").siblings().removeClass("on");
			$curTree = _this.$dataTree.find("#tree_"+curType);
			if(!$curTree.length){
				$curTree = _this.initTree(_this.$dataTree.children(".tree"),curType);
			}
			$curTree.addClass("on").siblings().removeClass("on");
			_this.setInfo(curType,{id:null,name:"全部"});
			_this.clearDataList();
			clearZTreeSelectedStatus("tree_"+curType);
		});

		//bind dataList event
		this.$dataList.children(".list").on("click","li",function(event){
			var elem = event.target,
				$selectAllData = _this.$dataList.find(".list #selectAllData");
			_this.toggleSelectData($(this).data("data"),$(this).closest(".list").data("type"));
			_this.setSelectAllData();
		}).on("click","#selectAllData",function(event){
			var $inputs = _this.$dataList.find(".list .data input"),
				type = _this.$dataList.find(".list").data("type");
			if (getInputStatus($(this))) {
				$inputs.not(":checked").each(function(){
					//toggleInputStatus($(this),true);
					_this.toggleSelectData($(this).closest("li").data("data"),type);
				});
			} else {
				$inputs.filter(":checked").each(function(){
					//toggleInputStatus($(this),false);
					_this.toggleSelectData($(this).closest("li").data("data"),type);
				});
			}
		});

		//bind selectList event
		this.$selectList.children(".list").on("dblclick","li",function(event){
			var type = $(this).parent().attr("class"),
				id = $(this).data("id");
			_this.delSelectData(_this.selectData[type][id],type);
			_this.setSelectAllData();
		}).on("click","li",function(event){
			$(this).closest(".list").find("li").removeClass("cur");
			$(this).addClass("cur");
		});
		this.$selectList.children(".tool").on("click","a.btn",function(event){
			var className = $(this).attr("class"),
				$li = _this.$selectList.find(".list li.cur"),
				type = $li.parent().attr("class");
			if (!$li.length) {return false;}
			if (className.indexOf("remove")>-1) {
				_this.delSelectData(_this.selectData[type][$li.data("id")],type);
				_this.setSelectAllData();
			} else {
				if (className.indexOf("up")>-1) {
					$li.prev().before($li);
				} else if (className.indexOf("down")>-1) {
					$li.next().after($li);
				}
			}
		});

		//bind search event
		var searchTrigger=null; //lazySearch
		this.$dataList.find(".search input").on("keyup",function(event){
			var text = $.trim($(this).val());
			clearTimeout(searchTrigger);
			searchTrigger = setTimeout(function(){
				_this.search(text);
			},300);
		})
	};

	DataSelect.prototype.search = function(text){
		var _this = this,
			type = this.$dataTree.find(".info .curType").data("type"),
			id = this.$dataTree.find(".info .curPos").data("pos");
		if (!text) {
			getDataById(id,type,function(data){
				_this.initDataList(data,type);
			});
		} else {
			getDataByMh(text,id,type,function(data){
				_this.initDataList(data,type);
			});
		}
	};

	DataSelect.prototype.initDialog = function(){
		var _this = this;
		var dialog = Dialog({
            id:"DataSelectDialog",
            cache:true,
            title:"数据选择",
            width:"800px",
            height:"320px",
            modal:"hide",              //modal-lg或modal-sm
            body:template,
            buttons:[{
            	name : "确定",
            	close : true,
            	callback : function(){
            		_this.save();
            		_this.config.callback?(function(){
            			if(_this.config.simpleReturnData){
            				var simpleReturnData = _this.getSimpleReturnData();
            				_this.config.callback(simpleReturnData.data,simpleReturnData.set);
            			}else{
            				_this.config.callback($.extend({},dataCacheObj[_this.config.id]));
            			}
            		})():null;
            	}
            }]
        });
        dialog.$getDialog().on('hidden.bs.modal', function (e) {
		  _this.clear();
		});
        return dialog;
	};

	DataSelect.prototype.initDataTree = function($wrap){
		this.initType($wrap.children(".type"));
	};

	DataSelect.prototype.initType = function($wrap){
		var _this = this;
		//init urlList
		var $frag = $(document.createDocumentFragment()),
			$li;
		$wrap.append('<ul class="nav"></ul>');
		for(var type in typeList){
			$li = $('<li id="type_'+type+'"><a>'+typeList[type].name+'</a></li>');
			$li.data("type",type);
			$frag.append($li);
		}
		$wrap.children('ul').append($frag);
	};

	DataSelect.prototype.initTree = function($wrap,type){
		var _this = this;
		var setting,data,
			$tree = $wrap.find("#tree_"+type);
		
		if ($tree.length>0||!type) {
			console.log("tree init is cancelled!");
			return $tree;
		}

		$tree = $('<div id="tree_'+type+'" class="ztree"></div>');
		$wrap.append($tree);
		setting = {
			data : {
				key : {
					name : typeList[type].key.tree.name
				},
				simpleData : {
					enable : true,
					idKey : typeList[type].key.tree.code,
					pIdKey : typeList[type].key.tree.pcode
				}
			},
			callback : {
				beforeClick : function(treeId,treeNode){
					var selectedNode = getZTreeSelectedNode(treeId)[0],
						dataArr = [],
						key = typeList[type].key.tree;
					//已选中则不进行数据查询
					if(selectedNode&&selectedNode[key.id]==treeNode[key.id]){console.log("数据查询终止,请求数据为当前数据");return false;}
					//是否添加当前节点数据到结果集中
					hasParentData[type]?dataArr.push(treeNode):false;
					//设置提示信息
					_this.setInfo(null,{id:treeNode[key.id],name:treeNode[key.name]});
					//请求数据
					getDataById(treeNode[key.id],type,function(data){
						_this.initDataList(dataArr.concat(data),type);
					});
					return true;
				}
			}
		};
		getDataByAll(type,function(data){
			if (!data||!data.length) {$tree.remove();return;}
			$.fn.zTree.init($tree,setting,data),
			resetZTreeStatus($tree.attr("id"));
		});
		return $tree;
	};

	DataSelect.prototype.initDataList = function(dataArr,type){
		var $list = this.$dataList.children(".list");

		this.clearDataList();

		if (!dataArr||!dataArr.length) {
			console.log("数据列表为空");
			return false;
		}

		var	$wrap = $('<ul class="data"></ul>'),
			$title = $('<div class="title">'+
							'<span class="type">'+(this.config.multi?'<input type="checkbox" id="selectAllData">':'')+'</span>'+
							'<span class="name">名称</span><span class="code">代码</span><span class="pname">部门</span>'+
						'</div>'),
			$frag = $(document.createDocumentFragment()),
			$li;
		for(var i=0,cur;i<dataArr.length;i++){
			curData = dataArr[i];
			$li = $('<li id="data_'+(curData[typeList[type].key.data.id]||'')+'">'+
					'<span class="name">'+(curData[typeList[type].key.data.name]||'')+'</span>'+
					'<span class="code">'+(curData[typeList[type].key.data.code]||'')+'</span>'+
					'<span class="pname">'+(curData[typeList[type].key.data.pname]||'')+'</span>'+
					'</li>');
			$li.prepend('<span class="type"><input type="'+(this.config.multi?'checkbox':'radio')+'" name="listItem"></span>');
			$li.data("data",curData);
			if (this.selectData[type][curData[typeList[type].key.data.id]]) {
				toggleInputStatus($li.find("input"),true);
			}
			$frag.append($li);
		}
		$wrap.append($frag);
		$list.append($title).append($wrap).data("type",type);
		this.setSelectAllData();
	};

	DataSelect.prototype.setSelectAllData = function(){
		var $selectAllData = this.$dataList.find(".list #selectAllData");
		$selectAllData.length?toggleInputStatus($selectAllData,!this.$dataList.find(".list .data input").not(":checked").length):false;
	}

	DataSelect.prototype.clearDataList = function(){
		this.$dataList.children(".list").empty();
	};

	DataSelect.prototype.initSelectList = function(dataListObj){
		if (!dataListObj) {console.log("数据初始化终止,缓存数据为空");return false;}
		var $list = this.$selectList.children(".list");
		$list.empty();
		for(var type in dataListObj){
            if(!dataListObj.hasOwnProperty(type)||!dataListObj[type].length){continue}
			$list.append('<ul class="'+type+'"></ul>');
			this.addSelectData(dataListObj[type],type);
		}
	};

	DataSelect.prototype.clearSelectList = function(){
		this.$selectList.children(".list").empty();
	};

	DataSelect.prototype.initTypeTag = function(tagData){
		var $wrap = this.$dataTree.find(".type .nav"),
			$tree = this.$dataTree.children(".tree"),
			$tag,curType;
		//重置数据显示状态
		$wrap.children().removeClass("on");
		//是否强制刷新tree
		this.config.realTimeData?$tree.empty():$tree.children().removeClass("on");
		//是否隐藏tag标签
		if(tagData.length==1&&this.config.hideTag){
			!this.$dataTree.hasClass("hideTag")?this.$dataTree.addClass("hideTag"):null;
		}else{
			this.$dataTree.removeClass("hideTag");
		}
		//初始化当前可用数据类型
		for (var i = 0,type; i < tagData.length; i++) {
			type = tagData[i];
			$tag = $wrap.children("#type_"+type);
			if (!$tag.length) {
				$tag = $('<li id="type_'+type+'"><a>'+typeList[type].name+'</a></li>');
				$tag.data("type",type);
			} else {
				resetZTreeStatus("tree_"+type);
			}
			$tag.addClass("init");
			$wrap.append($tag);
		}
		$wrap.children().not(".init").each(function(){
			var type = $(this).data("type");
			$(this).closest(".type").siblings(".tree").find("#tree_"+type).remove();
			$(this).remove();
		});
		//初始化数据显示状态
		curType = $wrap.children().removeClass("init").first().addClass("on").data("type");
		this.initTree($tree,curType).addClass("on");
	};

	DataSelect.prototype.initSelectData = function(tagData,initData){
		this.selectData = {};
        var curDataCacheObj = dataCacheObj[this.config.id]||{};
		//清空selectData数据,合并初始化选中数据
		for (var i = 0,type; i < tagData.length; i++) {
            type = tagData[i];
			this.selectData[type] = {};
            if(initData&&initData[type]){
                curDataCacheObj[type] = curDataCacheObj[type]||[];
                curDataCacheObj[type] = curDataCacheObj[type].concat(initData[type]);
            }
		}
		//初始化selectList
		this.config.dataRefill?this.initSelectList(curDataCacheObj):false;
	};

	DataSelect.prototype.clearSelectData = function(){
		this.selectData = {};
	};

	DataSelect.prototype.cacheSelectData = function(){
		var dataListObj={},selectData=this.selectData,
			dataList,type,id;
		for(type in selectData){
            if(!selectData.hasOwnProperty(type)){continue}
			dataList = [];
			for(id in selectData[type]){
                if(selectData[type].hasOwnProperty(id)){
                    selectData[type][id]?dataList.push(selectData[type][id]):null;
                }
			}
			dataListObj[type]=dataList;
		}
		dataCacheObj[this.config.id] = dataListObj;
	};


	DataSelect.prototype.toggleSelectData = function(data,type){
		var key = typeList[type].key.data;
		if(!this.selectData[type]||!this.selectData[type][data[key.id]]){
			this.addSelectData(data,type);
		}else{
			this.delSelectData(data,type);
		}
	};

	DataSelect.prototype.addSelectData = function(dataArr,type){
		var key = typeList[type].key.data,
			$target = this.$dataList.find(".list .data"),
			$wrap = this.$selectList.find(".list ."+type),
			$li;

		if (!dataArr||!type) {console.log("参数有误,数据添加失败");return false;}
		if (dataArr.constructor==Object) {dataArr=[dataArr];}

		if (!$wrap.length) {
			$wrap = $('<ul class="'+type+'"></ul>');
			this.$selectList.children(".list").append($wrap);
		}

		if (!this.config.multi) {
			if (dataArr.length!=1) {
				console.log("添加失败,数据不存在或数据有误");
				return false;
			}
			$wrap.empty().siblings().remove();
			for(var tag in this.selectData){
                if(!this.selectData.hasOwnProperty(tag)){continue}
				this.selectData[tag]={};
			}
		}
		for (var i = 0,curData; i < dataArr.length; i++) {
			curData = dataArr[i];
            if(!!this.selectData[type][curData[key.id]]){continue}
			$li = $('<li id="select_'+(curData[key.id]||'')+'"><span class="text">'+(curData[key.name]||'null')+'/'+(curData[key.code]||'null')+'/'+(curData[key.pname]||'null')+'</span></li>');
			$li.data("id",curData[key.id]);
			$wrap.append($li);
			toggleInputStatus($target.find("#data_"+transformation(curData[key.id])+" input"),true);
			this.selectData[type][curData[key.id]]=curData;
		}
	};

	DataSelect.prototype.delSelectData = function(dataArr,type){
		var key = typeList[type].key.data,
			$wrap = this.$selectList.find(".list ."+type),
			$target = this.$dataList.find(".list .data");
		if (!dataArr||!type) {console.log("参数有误,数据删除失败");return false;}
		if (dataArr.constructor==Object) {dataArr=[dataArr];}

		for (var i = 0,curData; i < dataArr.length; i++) {
			curData = dataArr[i];
            if(!this.selectData[type][curData[key.id]]){continue}
			delete this.selectData[type][curData[key.id]];
			$wrap.children("#select_"+transformation(curData[key.id])).remove();
			toggleInputStatus($target.find("#data_"+transformation(curData[key.id])+" input"),false);
		}
		if (!$wrap.children().length) {
			$wrap.remove();
		}
	};

	DataSelect.prototype.getSimpleReturnData = function(){
		var selectData = this.selectData,
			simpleReturnData = {
				data : [],
				set : {}
			},
			key=null,data=null;
		simpleReturnData.set = selectData;
		for(var type in selectData){
            if(!selectData.hasOwnProperty(type)){continue}
			key = typeList[type].key.data;
			for(var id in selectData[type]){
                if(!selectData[type].hasOwnProperty(id)){continue}
				data = selectData[type][id];
				simpleReturnData.data.push({
					id : data[key.id],
					code : data[key.code],
					name : data[key.name],
					type : type
				});
			}
		}
		return simpleReturnData;
	};

	DataSelect.prototype.setInfo = function(type,pos){
		if (!!type) {
			this.$dataTree.find(".curType span").text(typeList[type].name).attr("title",typeList[type].name).
						   parent().data("type",type);
		}
		this.$dataTree.find(".curPos span").text(pos.name).attr("title",pos.name).parent().data("pos",pos.id);
	};

	DataSelect.prototype.setCss = function(){
		this.dialog.$getDialog().
				find(".modal-dialog").css("width",this.config.width).
				find(".modal-body").css("height",this.config.height);
	};

	DataSelect.prototype.init = function(config){
		if (!config||!config.id) {console.log("参数错误");return false;}
		//初始化配置参数
		$.extend(this.config,{
			multi : false,
			tagData : [],
			width : "800px",
			height : "320px",
			hideTag : false,
			dataRefill : true,
			realTimeData : false,
			simpleReturnData : false
		},config);
		this.dialog.setTitle(config.title||"数据选择");
		this.setCss();//设置当前配置样式
		this.setInfo(config.tagData[0],{id:null,name:"全部"});
		this.initTypeTag(config.tagData);
		this.initSelectData(config.tagData,config.initData);
	};

	DataSelect.prototype.save = function(){
		this.cacheSelectData();
		this.hide();
	};

	DataSelect.prototype.clear = function(){
		this.clearDataList();
		this.clearSelectList();
		this.clearSelectData();
	};

	DataSelect.prototype.show = function(){
		this.dialog.show();
	};

	DataSelect.prototype.hide = function(){
		this.dialog.hide();
	};

	var dataSelect = new DataSelect({
		callback : function(data){
			console.log(data);
		}
	});

	function Init(config){
		dataSelect.init(config);
		dataSelect.show();
	}

	Init.getData = function(dataId,type,id){
		var resul=null;
		switch(arguments.length){
			case 1 : 
				result = dataCacheObj[dataId];break;
			case 2 : 
				result = dataCacheObj[dataId]?dataCacheObj[dataId][type]:result;break;
			case 3 : 
				var key=typeList[type].key.data,
					dataArr = dataCacheObj[dataId]?dataCacheObj[dataId][type]:null;
				if (dataArr&&dataArr.length) {
					for (var i = 0; i < dataArr.length; i++) {
						if(dataArr[i][key.id]==id){
							result = dataArr[i];
							break;
						}
					}
				}
				break;
			default : console.log("getData 参数错误");
		}
		//创建新数据副本
		if (result) {
			if (result.constructor===Object) {
				result = $.extend({},result);
			} else if (result.constructor===Array) {
				result = result.concat([]);
			}
		}
		return result;
	};
	
	return Init;
});