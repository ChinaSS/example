/**
 * 资源授权JS
 */
define(["PDUtilDir/grid",
        "PDUtilDir/util",
        "ZTree","css!ZTreeCss"],
    function(Grid, Util){    
	
	//定义一个路径变量
	var sysPath = "core/system";
	
	function initAuthSet() {
		//初始化角色选择资源
		initAuthSetRoleRes();
		//初始化资源选择角色
		initAuthSetResRole();
		$("#btn_authSet_refresh").on("click", function(){
			refresh();
		})
		$("#btn_authSet_save").on("click", function(){
			if ($("#tab_roleRes").hasClass("active")) {
				saveRoleRes();
			} else if ($("#tab_resRole").hasClass("active")) {
				saveResRole();
			}
		})
	}
	
	function refresh() {
		
	}
	
	function initAuthSetRoleRes() {
		createRoleTree();
		createResCheckTree();
	}
	
	/* 创建角色目录树 */
	function createRoleTree() {
		$.ajax({
            url: getServer()+"/sword/org/roledir/getAllRoleDir",
            success:function(data) {
                var arr = [];
                for (var i = 0, dir; dir = data[i++];) {
                    if (dir.dirCode == "root") {
                        arr.push({"id": "root", "name": dir.dirName, "open": true});
                    } else {
                        arr.push({"id": dir.dirCode, "pId": dir.pDirCode, "name": dir.dirName});
                    }
                }
                var setting = {
                    data: {
                        simpleData: {
                            enable: true
                        }
                    },
                    callback: {
                        onClick:function (event, treeId, treeNode) {
                        	createRoleGrid();
                        }
                    }
                };
                $.fn.zTree.init($("#tree_roleDir"), setting, arr);
            }
        });
	}
	
	/* 创建角色表格 */
	function createRoleGrid() {
		var nodes = $.fn.zTree.getZTreeObj("tree_roleDir").getSelectedNodes();
		var node = nodes.length && nodes[0];
		var config = {
            id: "gridRole",
            placeAt : "grid_role",
            index:"radio",
            hidden:false,
            pagination:false,
            layout: [
                {
                    name: "角色编号", field: "roleCode", click: function (e) {
                    	//设置角色-资源
                    	//setResTreeCheck(e.data.row.roleCode);
                    }
                },
                {name: "角色名称", field: "roleName"}
            ],
            data: {
                "type": "URL",
                "value": getServer() + "/sword/org/role/getRoleByRoleDirCodeForGrid?dirCode="+node.id
            },
            trEvent : {
            	"click" : function(e) {
            		setResTreeCheck(e.data.row.roleUuid);
            	}
            }
    	};
        var gridObj = Grid.init(config);
        //注册行点击事件
        /*
        gridObj.setEvent("tr", "click", function(e){
        	setResTreeCheck(e.data.row.uuid);
        })
        */
	}
	
	/* 创建资源树 */
	function createResCheckTree() {
		$.ajax({
            url : getServer() + "/sword/auth/res/getAll",
            success : function(data) {
            	//适配ztree的nocheck属性（即目录不带checkbox）
            	(function(treeData){
            		if (treeData) {
            			$.each(treeData, function(i, n){
            				if (n.resType == "1") {
            					n.nocheck = true;
            				}
            			});
            		}
            	})(data);
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
                    },
                    callback : {
                        onClick : function(event, treeId, treeNode, clickFlag) {
                        	
                        },
                        onCheck : function() {
                        }
                    }
                }
                //初始化
                $.fn.zTree.init($("#treeCheck_res"), setting, data);
                //展开所有
                $.fn.zTree.getZTreeObj("treeCheck_res").expandAll(true);
            }
        });
	}
	
	/* 根据所选择角色勾选不同角色的资源 */
	function setResTreeCheck(roleId) {
		$.ajax({
			url : getServer() + "/sword/auth/set/getRoleRes",
			data : {
				roleId : roleId
			},
			success : function(data) {
				$.fn.zTree.getZTreeObj("treeCheck_res").checkAllNodes(false);
				if (data) {
					$.each(data, function(i, n) {
						var treeObj = $.fn.zTree.getZTreeObj("treeCheck_res");
						var node = treeObj.getNodeByParam("resId", n.resId);
						if (node) {
							treeObj.checkNode(node, true);
						}
					})
				}
			}
		})
	}
	
	/* 保存角色资源 */
	function saveRoleRes() {
		var rows = Grid.getGrid("gridRole") && Grid.getGrid("gridRole").getSelectedRow();
		if (rows && rows.length > 0) {
			var row = rows[0];
			Util.confirm("确定要保存角色【" + row.roleName + "】授权吗？", function() {
				var resIds = [];
				var nodes = $.fn.zTree.getZTreeObj("treeCheck_res").getCheckedNodes(true);
				$.each(nodes, function(i, n) {
					resIds.push(n.resId);
				})
				$.ajax({
					url : getServer() + "/sword/auth/set/saveRoleRes",
					data : {
						roleId : row.roleUuid,
						resIds : resIds.join(",") 
					},
					success : function(data) {
						Util.alert(data.message);
					}
				})
			});
		} else {
			Util.alert("请选择角色");
		}
	}
	
	function initAuthSetResRole() {
		createSetResDirTree();
		createRoleCheckTree();
	}
	
	/* 创建资源目录树 */
	function createSetResDirTree() {
		$.ajax({
            url: getServer()+"/sword/auth/res/getSort",
            success:function(data) {
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
                        	createSetResGrid();
                        }
                    }
                }
                //初始化
                $.fn.zTree.init($("#tree_roleDir_set"), setting, data);
                //展开所有
                $.fn.zTree.getZTreeObj("tree_roleDir_set").expandAll(true);
            }
        });
	}
	
	/* 创建角色表格 */
	function createSetResGrid() {
		var nodes = $.fn.zTree.getZTreeObj("tree_roleDir_set").getSelectedNodes();
		var node = nodes.length && nodes[0];
    	$.ajax({
    		url : getServer() + "/sword/auth/res/getBySort",
    		data : {
    			resPid : node.resId
    		},
    		success : function(data) {
    			var config = {
					id : "gridResSet",
    	            placeAt : "grid_res_set",
    	            index:"radio",
    	            hidden:false,
    	            pagination:false,
    	            layout : [{
    	                name:"资源名称",field:"resName",click:function(e){
    	                	setRoleTreeCheck(e.data.row.resId);
    	            	}
    	            }],
    	            data:data,
    	            trEvent : {
    	            	"click" : function(e) {
    	            		setRoleTreeCheck(e.data.row.resId);
    	            	}
    	            }
    			}
    			var gridObj = Grid.init(config);
    			/*
    	        gridObj.setEvent("tr", "click", function(e){
    	        	setRoleTreeCheck(e.data.row.resId);
    	        })
    	        */
    		}
    	});
	}
	
	/* 创建角色树 */
	function createRoleCheckTree() {
		$.ajax({
            url : getServer() + "/sword/org/role/getRoleTree",
            success : function(data) {
            	//适配ztree的nocheck属性（即目录不带checkbox）
            	(function(treeData){
            		$.each(treeData, function(i, n){
            			if (n.type == "dir") {
            				n.nocheck = true;
            			}
            		});
            	})(data);
            	//配置ztree的属性
                var setting = {
                    data: {
                    	key : {
                    		name:"name"
                    	},
                        simpleData: {
                            enable: true
                        }
                    },
                    check : {
                    	enable : true
                    },
                    callback : {
                        onClick : function(event, treeId, treeNode, clickFlag) {
                        },
                        onCheck : function() {
                        }
                    }
                }
                //初始化
                $.fn.zTree.init($("#treeCheck_role"), setting, data);
                //展开所有
                $.fn.zTree.getZTreeObj("treeCheck_role").expandAll(true);
            }
        });
	}
	
	/* 根据所选择资源勾选不同资源的角色 */
	function setRoleTreeCheck(resId) {
		$.ajax({
			url : getServer() + "/sword/auth/set/getResRole",
			data : {
				resId : resId
			},
			success : function(data) {
				$.fn.zTree.getZTreeObj("treeCheck_role").checkAllNodes(false);
				if (data) {
					$.each(data, function(i, n) {
						var treeObj = $.fn.zTree.getZTreeObj("treeCheck_role");
						var node = treeObj.getNodeByParam("id", n.roleId);
						if (node) {
							treeObj.checkNode(node, true);
						}
					})
				}
			}
		})
	}
	
	/* 保存资源角色 */
	function saveResRole() {
		var rows = Grid.getGrid("gridResSet") && Grid.getGrid("gridResSet").getSelectedRow();
		if (rows && rows.length > 0) {
			var row = rows[0];
			Util.confirm("确定要保存资源【" + row.resName + "】授权吗？", function() {
				var roleIds = [];
				var nodes = $.fn.zTree.getZTreeObj("treeCheck_role").getCheckedNodes(true);
				$.each(nodes, function(i, n) {
					roleIds.push(n.id);
				})
				$.ajax({
					url : getServer() + "/sword/auth/set/saveResRole",
					data : {
						resId : row.resId,
						roleIds : roleIds.join(",") 
					},
					success : function(data) {
						Util.alert(data.message);
					}
				})
			});
		} else {
			Util.alert("请选择角色");
		}
	}
	
	return {
		init : initAuthSet
	}
});