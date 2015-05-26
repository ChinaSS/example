/**
 * 资源管理JS
 */
define(["PDUtilDir/grid",
        "PDUtilDir/util",
        "PDUtilDir/tool",
        "PDUtilDir/dialog",
        "ZTree","css!ZTreeCss","JQuery.validate","JQuery.validate.extra","JQuery.validate.message"], 
    function(Grid, Util, Tool, Dialog){
	
	//定义一个路径变量
	var path = getStaticPath() + "/core/system/acl";
	
    //初始化入口
    function initAuthRes() {
    	createResTree();
    	(function(){
    		$("#btn_authRes_refresh").on("click", on_BtnAuthResRefresh_click);
    		$("#btn_authRes_addSort").on("click", on_BtnAuthResAddSort_click);
    		$("#btn_authRes_editSort").on("click", on_BtnAuthResEditSort_click)
    		$("#btn_authRes_deleteSort").on("click", on_BtnAuthResDeleteSort_click);
    		$("#btn_authRes_test").on("click", on_BtnAuthResTest_click);
    	})();
    }
    
    //创建资源目录树
    var createResTree = function() {
        $.ajax({
            url : getServer() + "/sword/auth/res/getSort",
            success : function(data) {
            	//没有数据
            	if (!data || data.length == 0) {
            		showResTreeTip();
            	} else {
            		//配置ztree的属性
                    var setting = {
                        data: {
                        	key : {
                        		name:"resName"
                        	},
                            simpleData: {
                                enable: true,
                                idKey:"resId",
                                pIdKey:"resPid",
                                rootPId:null
                            }
                        },
                        callback : {
                            onClick : function(event, treeId, treeNode, clickFlag) {
                            	createResGrid();
                            },
                            onRemove : function() {
                            	var treeObj = $.fn.zTree.getZTreeObj("tree_resDir");
	 							if (!treeObj) {
	 								createResTree();
	 							} else {
	 								var nodes = $.fn.zTree.getZTreeObj("tree_resDir").getNodes();
	 								if (!nodes || nodes.length == 0) {
	 									showResTreeTip();
	 								}
	 							}
                            }
                        }
                    }
                    //初始化
                    $.fn.zTree.init($("#tree_resDir"), setting, data);
                    //展开所有
                    $.fn.zTree.getZTreeObj("tree_resDir").expandAll(true);
            	}
            }
        });
    }
    
    function showResTreeTip() {
    	$("#authRes_tree_tip").fadeIn();
		$("#btn_authRes_addRoot").on("click", function(){
			editResSort();
		});
    }
    
    function hideResTreeTip() {
    	$("#authRes_tree_tip").fadeOut();
		$("#btn_authRes_addRoot").off("click");
    }
    
    //创建资源表格
    var createResGrid = function() {
    	var treeNode = $.fn.zTree.getZTreeObj("tree_resDir").getSelectedNodes()[0];
    	$.ajax({
    		url : getServer() + "/sword/auth/res/getBySort",
    		data : {
    			resPid : treeNode.resId
    		},
    		success : function(data) {
    			Grid({
    	            id : "gridRes",
    	            placeAt : "grid_res",
    	            index:"checkbox",
    	            hidden:false,
    	            pagination:true,
    	            formData : {
    	            	resPid : treeNode.resId
    	            },
    	            layout : [{
    	                name:"资源名称",field:"resName",click:function(e){
    	                	on_BtnAuthResEdit_click(e.data.row);
    	            	}
    	            },{
    	                name:"资源地址",field:"resUrl"
    	            },{
    	                name:"资源描述",field:"resDesc"
    	            }],
    	            toolbar:[
    	                {name:"添加",icon:"fa fa-plus-circle",callback:on_BtnAuthResAdd_click},
    	                {name:"删除",icon:"fa fa-trash-o",callback:function(event){ deleteRes(); }},
    	                {name:"刷新",icon:"fa fa-refresh",callback:function(event){ createResGrid(); }}
    	            ],
    	            data:data
    	        })
    		}
    	});
    }

    /* 校验是否选择目录节点 */
    function validate_opr_resSort() {
    	var nodes = $.fn.zTree.getZTreeObj("tree_resDir").getSelectedNodes();
    	if (!nodes || nodes.length == 0) {
    		showResTreeOprTip();
    		return false;
    	} else {
    		hideResTreeOprTip();
    		return nodes;
    	}
    }

    function showResTreeOprTip() {
    	$("#authRes_tree_opr_tip").fadeIn();
    }
    
    function hideResTreeOprTip() {
    	$("#authRes_tree_opr_tip").fadeOut();
    }
    
    function on_BtnAuthResRefresh_click() {
    	refresh();
    }
    
    function on_BtnAuthResTest_click() {
    	require(["text!PDAclDir/views/res_service.html"], function(text) {
    		var dialog = Dialog({
    			id:"BaseDialog",
    			cache:false,                 //是否缓存，默认为true
    			title:"服务扫描",
    			width:"600px",
    			height:"500px",
    			buttons:[{
    				name : "确定",
    				callback : function() {
    					var treeObj = $.fn.zTree.getZTreeObj("tree_resService");
    					if (treeObj) {
    						var nodes = treeObj.getCheckedNodes(true);
    						if (nodes && nodes.length > 0) {
    							var result = [];
    							$.each(nodes, function(i, n){
    								var json = {};
    								json.resId = n.resId;
    								json.resName = n.resName;
    								json.resUrl = n.resUrl;
    								json.resType = n.resType;
    								json.resPid = n.resPid;
    								result.push(json);
    							})
    							$.ajax({
    								url : getServer() + "/sword/auth/res/saveResByService",
    								data : {
    									resList : JSON.stringify(result) 
    								},
    								success : function(data) {
    									Util.alert("success");
    								}
    							});
    						} else {
    							Util.alert("请选择要添加的服务！");
    						}
    					}
    					var nodes = $.fn.zTree.getZTreeObj("tree_resService").getCheckedNodes(true);
    					console.log(nodes);
//    					dialog.hide();
    				}
    			}]
    		});
    		//可以通过返回的dialog对象调用相关方法
    		dialog.setBody(text);
    		dialog.show();
    		
    		$("#btn_authService_checkAll").on("click", function() {
    			var treeObj = $.fn.zTree.getZTreeObj("tree_resService");
				if (treeObj) {
					var nodes = treeObj.transformToArray(treeObj.getNodes());
					if (nodes && nodes.length > 0) {
						$.each(nodes, function(i, n){
							if (!n.checked) {
								treeObj.checkNode(n, true, true);
							}
						})
					}
				}
    		})
    		
    		//远程请求
    		$.ajax({
                url : getServer() + "/sword/auth/res/getResByService",
                success : function(data) {
            		//配置ztree的属性
                    var setting = {
                        data: {
                        	key : {
                        		name:"resName"
                        	},
                            simpleData: {
                                enable: true,
                                idKey:"resId",
                                pIdKey:"resPid",
                                rootPId:null
                            }
                        },
                        check : {
                        	enable : true
                        }
                    }
                    //初始化
                    $.fn.zTree.init($("#tree_resService"), setting, data);
                    //展开所有
                    $.fn.zTree.getZTreeObj("tree_resService").expandAll(true);
            	}
            });
    	})
    }
    
    function refresh() {
    	
    }
    
    function on_BtnAuthResAddSort_click() {
    	var nodes = validate_opr_resSort();
    	if (nodes) {
    		editResSort(false, {
    			resPid : nodes[0].resId,
    			resParent : nodes[0].resName
    		});
    	}
    }
    
    function on_BtnAuthResEditSort_click() {
    	var nodes = validate_opr_resSort();
    	if (nodes) {
    		editResSort(true, nodes[0]);
    	}
    }
    
    function on_BtnAuthResDeleteSort_click() {
		deleteResSort();
    }
    
    /** 添加/编辑 资源分类 */
    function editResSort(edit, row) {
    	 Util.slidebar({
	         url:path + "/views/res_sort.html",
	         width:"500px",
	         cache:false,
	         afterLoad : function() {
	        	//如果是编辑，需要重新从后台获取最新的数据
	        	if (edit) {
	        		$.ajax({
	        			url : getServer() + "/sword/auth/res/getById",
	        			data : {
	        				resId : row.resId
	        			},
	        			success : function(data) {
	        				Tool.deserialize("form_resSort", data);
	        			}
	        		});
	        	} else {
	        		//添加时初始化表单
		        	setFormData("#form_resSort", row);
	        	}
	        	//初始化表单校验
	    	 	$("#form_resSort").validate({
	     			rules : {
	     				resName : "required"
	     			},
	     			messages : {
	     				resName : "请填写目录名称"
	     			}
	     		});
	    	 	//注册保存按钮事件
	    	 	$("#btn_resSort_save").on("click", function(){
	    	 		if ($("#form_resSort").valid()) {
	    	 			var data = getFormData("#form_resSort");
	    	 			$.ajax({
	    	 				url : getServer() + "/sword/auth/res/save",
	    	 				data : data,
	    	 				type : "post",
	    	 				success : function(data) {
	    	 					Util.alert(data.message);
	    	 					if (data.code == "success") {
	    	 						hideResTreeTip();
	    	 						if(!edit) {
	    	 							var treeObj = $.fn.zTree.getZTreeObj("tree_resDir");
	    	 							if (!treeObj) {
	    	 								createResTree();
	    	 							} else {
	    	 								var nodes = $.fn.zTree.getZTreeObj("tree_resDir").getSelectedNodes();
	    	 								var node = nodes.length > 0 ? nodes[0] : null;
	    	 								$.fn.zTree.getZTreeObj("tree_resDir").addNodes(node, data.data);
	    	 							}
	    	 						} else {
	    	 							$.extend(row, data.data);
	    	 							$.fn.zTree.getZTreeObj("tree_resDir").updateNode(row);
	    	 						}
	    	 					}
	    	 				}
	    	 			});
	    	 		}
	    	 	})
	         }
	     });
    }
    
  //删除资源
	function deleteResSort() {
		var nodes = $.fn.zTree.getZTreeObj("tree_resDir").getSelectedNodes();
		if (nodes && nodes.length > 0) {
			Util.confirm("确定要删除指定的记录吗？", function() {
				var ids = "";
				$.each(nodes, function(i, node){
					ids = ids.concat(node.resId).concat(",");
				})
				$.ajax({
					url : getServer() + "/sword/auth/res/delete",
					data : {
						ids : ids
					},
					success : function(data) {
						Util.alert(data.message);
						if (data.code == "success") {
							$.each(nodes, function(i, node){
								$.fn.zTree.getZTreeObj("tree_resDir").removeNode(node, true);
							})
						}
					}
				})
			});
		} else {
			Util.alert("请选择要删除的行记录");
		}
	}
    
    function on_BtnAuthResAdd_click() {
    	var nodes = validate_opr_resSort();
    	if (nodes) {
    		editRes(false, {
    			resPid : nodes[0].resId,
    			resParent : nodes[0].resName
    		});
    	}
    }
    
    function on_BtnAuthResEdit_click(row) {
		editRes(true, row);
    }
    
    function on_BtnAuthResDelete_click() {
    	
    }
    
    //编辑资源
    function editRes(edit, row) {
    	Util.slidebar({
            url:path + "/views/res.html",
            width:"500px",
            cache:false,
            afterLoad : function() {
            	if (edit) {//edit
            		$.ajax({
            			url:getServer() + "/sword/auth/res/getById",
						data : {
							resId : row.resId
						},
            			success:function(data) {
            				setFormData("#form_res", data);
            			}
            		});
            	} else { // add
            		setFormData("#form_res", row);
            	}
            	//监听【保存】按钮事件
            	$("#btn_res_save").on("click", function() {
            		$("#form_res").validate({
            			rules : {
            				resName : "required",
            				resUrl : "required",
            			},
            			messages : {
            				resName : "请填写资源名称",
            				resUrl : "请填写资源地址"
            			}
            		})
            		if ($("#form_res").valid()) {
            			var data = Tool.serialize("form_res");
            			$.ajax({
            				url : getServer() + "/sword/auth/res/save",
            				data : data,
            				type : "post",
            				success : function(data) {
            					Util.alert(data.message);
            					if (data.code == "success") {
            						createResGrid();
            					}
            				}
            			});
            		}
            		/*
            		*/
            	})
            }
        });
    }

    //设置表单信息
    function setFormData(formSelector, data) {
    	var aEle = $(formSelector + " input," + formSelector + " select");
    	for (var name in data) {
    		aEle.each(function(){
    			var eleName = $(this).attr("name") || $(this).attr("id");
    			if (eleName == name) {
    				$(this).val(data[name]);
    			}
    		})
    	}
    }
    
    //获取表单信息
    function getFormData(formSelector) {
    	var aEle = $(formSelector + " input," + formSelector + " select");
    	var data = {};
    	aEle.each(function(i, value){
    		var eleName = $(this).attr("name") || $(this).attr("id");
    		if (eleName) {
    			data[eleName] = $(this).val();
    		}
    	})
    	return data;
    }

    //删除资源
	function deleteRes() {
		var rows = Grid.getGrid("gridRes").getSelectedRow();
		if (rows && rows.length > 0) {
			Util.confirm("确定要删除指定的记录吗？", function() {
				var ids = "";
				$.each(rows, function(i, row){
					ids = ids.concat(row.resId).concat(",");
				})
				$.ajax({
					url : getServer() + "/sword/auth/res/delete",
					data : {
						ids : ids
					},
					success : function(data) {
						Util.alert(data.message);
						if (data.code == "success") {
							createResGrid();
						}
					}
				})
			});
		} else {
			Util.alert("请选择要删除的行记录");
		}
	}

	return {
		init : initAuthRes
	}
});