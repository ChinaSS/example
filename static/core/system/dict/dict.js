define(["PDUtilDir/grid","PDUtilDir/util","PDUtilDir/tool","ZTree","css!ZTreeCss"],function(Grid,Util,Tool){
	var dictGrid,dictTree;
	var  DefaultRoot="ROOT";		//  默认root值
	//配置ztree的属性
    var treeSetting = {
        data: {
        	key : {
        		name:"name"
        	},
            simpleData: {
                enable: true,
                idKey:"id",
                pIdKey:"parentId",
                rootPId:"ROOT"		//  默认以ROOT作为根
            }
        },
        callback : {
            onClick : function(event, treeId, treeNode, clickFlag) {
            	loadDictItems(treeNode); 
            	dictTree.expandNode(treeNode);
            }
        }
    };
    
    function loadDictItems(currentNode){
//    	console.log("展开下一级~");
    	var currentSubItems=dictTree.getNodesByParam("parentId",currentNode.id);
    	reflushDataGrid(currentSubItems);
    }
    
    //   创建表格
    function createGrid(parentId){
	    var dictList=new Grid({
			id:"sys_dict_List",                       //用于缓存的ID
	        placeAt:parentId,            //存放Grid的容器ID
	        pageSize:20,                         //一页多少条数据
	        hidden:false,                       //表格是否可隐藏，只显示标题
		    index:"checkbox",                   //首列为单选[radio]还是多选[checkbox],默认checkbox
	        pagination : true,                  //默认分页,
	        cache:false,
	        layout:[
//	            {name:"id",field:"id",hidden:true},
	            {name:"名称",field:"name",click:function(e){
	            		var item=e.data.row;
	            		callSliderBar(item.id,null,null);
			        }
	            },
	            {name:"代码",field:"code"},
//	            {name:"parentId",field:"parentId",hidden:true},
	            {name:"别名",field:"shortName"},
	            {name:"排序",field:"codeSequence"}//,
//	            {name:"rootCode",field:"rootCode",hidden:true}
	        ],
	        toolbar:[
	            {
	            	name:"添加",
	            	class:"fa fa-plus-circle",
	            	callback:function(event){
	//	            		console.log('添加')
	            		var selected=getTreeSelectedNode();
	            		var parentId,rootCode;
	            		if(selected){
	            			parentId=selected.id;
	            			rootCode=selected.rootCode;
	            			//  非根节点的rootCode都是根节点Id
	            			if(rootCode==DefaultRoot){
	            				rootCode=parentId;
	            			}
	            		}
	            		callSliderBar(null,parentId,rootCode);
	            	}
	            },
	            {
	            	name:"删除",
	            	class:"fa fa-trash-o",
	            	callback:function(event){
//	            		console.log('删除');
	            		var rows=event.data.getSelectedRow();
	            		if(rows&&rows.length>0){
	            			Util.confirm("请确认是否删除?（<span class=\"text-danger\">存在子节点的字典项无法批量删除</span>）",function(){
		            			// yes
		            			
			            		var ids="",parentId;
			            		$(rows).each(function(i,row){
			            			if(!row.children||row.children.length==0){
			            				ids+=","+row.id;
			            			}else{
			            				console.log("未删除项"+row.id+" | "+row.name+" | "+row.code);
			            			}
			            		});
			            		ids=ids.substring(1);
			            		var selected=getTreeSelectedNode();
			            		parentId=selected  ? selected.id : (rows[0]?rows[0].parentId:DefaultRoot);
			            		$.ajax({
			            			url:window.getServer()+"/sword/sys/dict/deleteDictItems",
			            			data:{"ids":ids,"parentId":parentId},
			            			type:"post",
			            			success:function(data){
//			            				console.log("delete dictitems over");
			            				initDictManager(function(){
			            					expendParent(parentId);
			            				});
			            			}
			            		});
		            		});
	            		}else{
	            			Util.alert("请选择要删除的字典项！");
	            		}
	            		
	            		
	            	}
	            }
	        ],
	        data:[]
	    });
	    return dictList;
    }
    
	var slideconfig = {
		url : window.getServer()+"/static/core/system/dict/views/saveOrUpdate.html",
		width : "600px",
		cache : false,
		close : true
	};
	/**
	 * 调用侧边栏
	 * 1、添加根节点:什么都不传
	 * 2、添加子节点：传入parentid，rootCode
	 * 3、修改：传入id
	 */
	function callSliderBar(id,parentid,rootCode){
		
		slideconfig.afterLoad=function(){
			$("#name").bind("change",function(){
				var text=$("#name").val();
				$("#name").val(toTxt(text));
			});
			//  保存
			$("#dictItemSaveBtn").bind("click",function(){
				//  校验通过
				var $dictItemForm=$("#dictItemForm");
				if($dictItemForm.valid()){
					$("#dictItemSaveBtn").attr("disabled","disabled");
					var data=Tool.serialize($dictItemForm);
					$.ajax({
						url:window.getServer()+"/sword/sys/dict/saveOrUpdateDictItem",
						type:"post",
						data:data,
						success:function(data){
							console.log("save dict success");
							var pid=$("#parentId").val();
							initDictManager(function(){
            					expendParent(pid);
            				});
							
							//  重置
							Util.slidebar(slideconfig);
						}
					});
				}
			});
			if(id){
				//  查询数据
				$.ajax({
					url:window.getServer()+"/sword/sys/dict/queryDictItemById",
					type:"post",
					data:{"id":id},
					success:function(result){
//						console.log(data);
						var item=result.data;
						Tool.deserialize($("#dictItemForm"),item);
					}
				});
			}else if(parentid&&rootCode){
				$("#parentId").val(parentid);
				$("#rootCode").val(rootCode);
			}else{
				var node=getTreeSelectedNode();
				//  没有选中节点时
				if(!node){
					$("#parentId").val(DefaultRoot);
					$("#rootCode").val(DefaultRoot);
				}
			}
			validateDictItem();
		};
		
		Util.slidebar(slideconfig);
	}
	
	function validateDictItem(){
        //数据验证
        $("#dictItemForm").validate({
            rules:{
            	name:{
            		required:true,
            		stringMaxLength:40,
            		remote:{
                        type:"POST",  //请求方式
                        url: getServer()+"/sword/sys/dict/validateDictItem", //请求的服务
                        data:{  //要传递的参数
                        	id:function(){
                        		return $("#id").val();
                        	},
                            dictName:function(){return toTxt($("#name").val());},
                            parentId:function(){return $("#parentId").val();}
                        }
                    }
            	},
        		code:{
        			required:true,
        			stringMaxLength:200,
        			regex: "^\\w+$",
        			remote:{
                        type:"POST",  //请求方式
                        url: getServer()+"/sword/sys/dict/validateDictItem", //请求的服务
                        data:{  //要传递的参数
                        	id:function(){return $("#id").val();},
                            dictCode:function(){return $("#code").val();},
                            parentId:function(){return $("#parentId").val();}
                        }
                    }
            	}
            },
            messages: {
            	name:{
                    remote:"同一级下不允许相同名称，请修改！"
                },
            	code:{
            		regex: "请填写数字、字母或下划线",
                    remote:"同一级下不允许相同代码，请修改！"
                }
            }
        });
    };
    /*正则表达式 替换括号,尖括号等*/
    function toTxt(str) {
    	var RexStr = /\<|\>|\"|\'|\&/g;
    	str = str.replace(RexStr, function(MatchStr) {
    		switch (MatchStr) {
    		case "<":
    			return "&lt;";
    			break;
    		case ">":
    			return "&gt;";
    			break;
    		case "\"":
    			return "&quot;";
    			break;
    		case "'":
    			return "&#39;";
    			break;
    		case "&":
    			return "&amp;";
    			break;
    		default:
    			break;
    		}
    	})
    	return str;
    }
    /**
     * 重设dictGrid的数据
     */
    function reflushDataGrid(dataArr){
    	dictGrid.setData(function(data){
			data=dataArr;
			return data;
		});
    }
    /**
     * 展开指定父节点
     */
    function expendParent(pid){
    	// 展开当前节点
    	dictTree=$.fn.zTree.getZTreeObj("dictMgrTree");
		var curParentNode=dictTree.getNodesByParam("id",pid)[0];
		dictTree.expandNode(curParentNode);
		//  表格联动
		if(pid!=DefaultRoot){
			loadDictItems(curParentNode);
		}
    }
    
    function renderTreeToobar(){
    	var $container=$("#dictMgrTreeToolBar");
    	if($container.children().length==0){
    		var dictTree=$.fn.zTree.getZTreeObj("dictMgrTree");
    		var $toolBar=$("<ul></ul>");
    		var $refresh=$("<li><a title=\"刷新\"><i class=\"fa fa-refresh\"></i></a></li>").bind("click",function(){
    			initDictManager();
    		}).bind("mouseenter mouseleave",function(){
    			$(this).find("i").toggleClass("fa-spin");
    		});
    		var $compressSelectNode=$("<li><a title=\"收缩全部\"><i class=\"fa fa-compress\"></i></a></li>").bind("click",function(){
    			dictTree.expandAll(false);
    		});
    		var $expandSelectNode=$("<li><a title=\"展开全部\"><i class=\"fa fa-expand\"></i></a></li>").bind("click",function(){
    			dictTree.expandAll(true);
    		});;
    		var $compressAll=$("<li><a title=\"收缩所选\"><i class=\"fa fa-angle-up\"></i></a></li>").bind("click",function(){
        		var curNode=getTreeSelectedNode();
    			if(curNode){
    				dictTree.expandNode(curNode,false,true);
    			}else{
    				Util.alert("请选择需要收缩的节点！");
    			}
    		});;
    		var $expandAll=$("<li><a title=\"展开所选\"><i class=\"fa fa-angle-down\"></i></a></li>").bind("click",function(){
    			var curNode=getTreeSelectedNode();
    			if(curNode){
    				dictTree.expandNode(curNode,true,true);
    			}else{
    				Util.alert("请选择需要展开的节点！");
    			}
    		});;
    		$toolBar.append($refresh).append($expandSelectNode).append($compressSelectNode)
    			    .append($expandAll).append($compressAll);
    		$container.append($toolBar).append("<hr width=\"98%\" style=\"border-top-color:#ccc;\">");
    	}
    }
    /**
     * 获取选择的单个节点
     */
    function getTreeSelectedNode(){
    	var dictTree=$.fn.zTree.getZTreeObj("dictMgrTree");
    	var nodes=dictTree.getSelectedNodes();
		var curNode=nodes.length>0?nodes[0]:undefined;
		return curNode;
    }
    /**
     * 初始化函数
     */
    var initDictManager=function(callback){
    	dictGrid=createGrid("dictMgrGrid");
		$.ajax({
			url:getServer()+"/sword/sys/dict/queryDictTree",
			type:"post",
			success:function(result){
				dictTree=$.fn.zTree.init($("#dictMgrTree"),treeSetting,result.data);
				renderTreeToobar();
				var rootArr=dictTree.getNodesByParam("parentId",DefaultRoot);
				reflushDataGrid(rootArr);
				if(callback){
					callback();
				}
			}
		});
		
	};
    
	return {
		initDictManager:initDictManager
	};
});