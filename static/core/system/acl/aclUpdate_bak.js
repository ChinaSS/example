/**
 * 变更管理JS
 */
define(["PDUtilDir/grid",
        "PDUtilDir/util",
        "PDUtilDir/org/orgSelect",
        "PDUtilDir/org/dataSelect",
        "ZTree","css!ZTreeCss"],  
    function(Grid, Util, OrgUtil, PsnSelect){
	
	//定义一个路径变量
	var sysPath = "core/system";
	
	//初始化
	function initAuthUpdate() {
		//监听用户搜索
		searchUser();
		//设置资源选择树
		createResUpdateCheckTree();
		$("#btn_authUpdate_refresh").on("click", function(){
			refresh();
		})
	}
	
	//刷新
	function refresh() {
		
	}
	
	function searchUser() {
		OrgUtil.CS_SelectPsn({
            id : "input_userSelect",
            callback : function(data){
                //console.log(data);
                //console.log(orgUtil.CS_getSelectPsn("input_userSelect"));
            	//var userid = OrgUtil.CS_getSelectPsn("input_userSelect")[0];
            	var user = data.user && data.user[0];
            	if (user) {
            		//设置用户角色表格
            		$("#input_userSelect").val(user.userName);
            		createRoleUpdateGrid(user.userUuid);
            	}
            }
        });
	}
	
	function createRoleUpdateGrid(userid) {
		$.ajax({
    		url : getServer() + "/sword/org/roleUser/getRoleUserByUserUuid?userUuid=" + userid,
    		success : function(data) {
    			var config = {
					id : "gridRoleUpdate",
    	            placeAt : "grid_role_update",
    	            index:"radio",
    	            hidden:false,
    	            pagination:false,
    	            layout : [ {
                        name: "角色编号", field: "roleCode", click: function (e) {}
                    },
                    {name: "角色名称", field: "roleName"}
                    ],
    	            data:data,
    	            trEvent : {
    	            	"click" : function(e) {
    	            		//设置这个角色下面的资源
    	    	        	setResUpdateTreeCheck(e.data.row.roleUuid);
    	    	        	//查询该角色下的用户
    	    	        	createUserUpdateGrid(e.data.row.roleUuid);
    	            	}
    	            }
    			}
    			var gridObj = Grid.init(config);
    			/*
    	        gridObj.setEvent("tr", "click", function(e){
    	        	//设置这个角色下面的资源
    	        	setResUpdateTreeCheck(e.data.row.uuid);
    	        	//查询该角色下的用户
    	        	createUserUpdateGrid(e.data.row.roleCode);
    	        })
    	        */
    		}
    	});
		/*
		var config = {
            id: "gridRoleUpdate",
            placeAt : "grid_role_update",
            index:"checkbox",
            hidden:false,
            pagination:false,
            layout: [
                {
                    name: "角色编号", field: "roleCode", click: function (e) {}
                },
                {name: "角色名称", field: "roleName"}
            ],
            data: {
                "type": "URL",
                "value": getServer() + "/sword/org/roleUser/getRoleUserByUserCode?user_code=" + userCode
            }
    	};
        var gridObj = grid.init(config);
        //注册行点击事件
        gridObj.setEvent("tr", "click", function(e){
        	setResUpdateTreeCheck(e.data.row.uuid);
        })
        */
	}
	
	function createResUpdateCheckTree() {
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
                $.fn.zTree.init($("#treeCheck_res_update"), setting, data);
                //展开所有
                $.fn.zTree.getZTreeObj("treeCheck_res_update").expandAll(true);
            }
        });
	}
	
	/* 根据所选角色勾选资源 */
	function setResUpdateTreeCheck(roleId) {
		console.log(roleId);
		$.ajax({
			url : getServer() + "/sword/auth/set/getRoleRes",
			data : {
				roleId : roleId
			},
			success : function(data) {
				$.fn.zTree.getZTreeObj("treeCheck_res_update").checkAllNodes(false);
				if (data) {
					$.each(data, function(i, n) {
						var treeObj = $.fn.zTree.getZTreeObj("treeCheck_res_update");
						var node = treeObj.getNodeByParam("resId", n.resId);
						if (node) {
							treeObj.checkNode(node, true);
						}
					})
				}
			}
		})
	}
	
	function createUserUpdateGrid(roleid) {
		$.ajax({
    		url : getServer() + "/sword/org/roleUser/getRoleUserByRoleUuid?roleUuid=" + roleid,
    		success : function(data) {
    			var config = {
					id : "gridUserUpdate",
    	            placeAt : "grid_user_update",
    	            index:"checkbox",
    	            hidden:false,
    	            pagination:false,
    	            layout : [ {
                        name: "用户编号", field: "userCode"
                    },{
                    	name: "用户名称", field: "userName"
                    }],
                    toolbar:[
	                     {id:"aaaa",name:"添加",class:"fa fa-plus-circle",callback:function(event){ addRoleUser(); }},
	                     {name:"删除",class:"fa fa-trash-o",callback:function(event){ deleteRoleUser(); }}
	                 ],
    	            data:data
    			}
    			var gridObj = Grid.init(config);
    		}
    	});
	}	
	
	function addRoleUser() {
		//定义回调
		var callback = function(data) {
			if (data) {
				var ids = [];
				$.each(data, function(i, n){
					ids.push(n.userUuid);
				})
				rows = Grid.getGrid("gridRoleUpdate").getSelectedRow();
				var roleid = "";
				if (rows && rows.length > 0) {
					roleid = rows[0].roleUuid;
				}
				$.ajax({
					url : getServer() + "/sword/org/roleUser/addRolePsns",
					data : {
						roleUuid : roleid,
						userUuid : ids.join(",")
					},
					success : function(data) {
						Util.alert(data.message);
						if (data.code == "success") {
							createUserUpdateGrid(roleid);
						}
					}
				})
			}
		}
		//选择人员
		PsnSelect( {
			id : "addSelect",
			type : "multi",
	        callback : function(data){
	        	callback(data);
	        }
		});
		var psnSelect = PsnSelect.get("addSelect");
		psnSelect.show();
	}
	
	function deleteRoleUser() {
		var rows = Grid.getGrid("gridUserUpdate").getSelectedRow();
		if (rows && rows.length > 0) {
			Util.confirm("确定要删除指定的记录吗？", function() {
				var ids = [];
				$.each(rows, function(i, row){
					ids.push(row.userUuid);
				})
				rows = Grid.getGrid("gridRoleUpdate").getSelectedRow();
				var roleid = "";
				if (rows && rows.length > 0) {
					roleid = rows[0].roleUuid;
				}
				$.ajax({
					url : getServer() + "/sword/org/roleUser/delRoleUser",
					data : {
						roleUuid : roleid,
						userUuid : ids.join(",")
					},
					success : function(data) {
						Util.alert(data.message);
						if (data.code == "success") {
							createUserUpdateGrid(roleid);
						}
					}
				})
			});
		} else {
			Util.alert("请选择要删除的行记录");
		}
	}
	
	return {
		init : initAuthUpdate
	}
});