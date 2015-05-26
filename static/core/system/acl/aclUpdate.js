/**
 * 菜单查询变更
 */
define(["PDUtilDir/grid",
        "PDUtilDir/util",
        "PDUtilDir/tool",
        //"PDUtilDir/org/dataSelect",
        "PDUtilDir/org/orgSelect",
        "ZTree","css!ZTreeCss"],
    function(Grid, Util, Tool, PsnSelect){
	
	//初始化入口
    function initMenuUpdate() {
    	//初始化监听用户搜索
    	initSearchUser();
    	//初始化用户表格
    	initUserGrid();
    	//初始化菜单树-all
    	initMenuTreeCheckAll();
    	//初始化事件
    	(function(){
    		//刷新
    		$("#btn_menuUpdate_refresh").on("click", on_BtnRefresh_click);
    		//变更保存
    		$("#" + btn_menuUpdate_userRelationMenuSave_id).on("click", function() {
    			on_BtnSave_click();
    		})
    	})();
    }
    
    /**************************************全局变量***********************************/
    //菜单选择树Id-all
    var treeCheckMenuAll = "treeCheck_menuUpdate_all";
    //菜单选择树Id
    var treeCheckMenu = "treeCheck_menuUpdate";
    //人员表格Id
    var userGridId = "grid_userUpdate";
    //人员表格data
    var userGridData = [];
    //用户关系名称Id
    var text_menuUpdate_userRelationName_id = "text_menuUpdate_userRelationName";
    //用户关系保存按钮Id
    var btn_menuUpdate_userRelationMenuSave_id = "btn_menuUpdate_userRelationMenuSave";
    //当前用户
    var cUser;
    //当前用户关系
    var cUserRelation;
    
    /**
     * 初始化监听搜索用户
     */
    function initSearchUser() {
    	PsnSelect.CS_SelectPsn({
            id : "input_userSelect",
            multi : false,
            tagData:["user","role","dept"],
            dataRefill:false,
            simpleReturnData : true,
            callback : function(simpleData, data){
            	var user = simpleData && simpleData[0];
            	if (user) {
            		cUser = user;
            		$("#input_userSelect").val(user.name);
            		//设置用户所拥有的全部菜单
            		setMenuTreeAllCheck();
            		//设置用户角色表格
            		loadUserGrid();
            	}
            }
        });
	}
    
    /**
     * 创建用户关系表格
     */
    function initUserGrid() {
    	Grid(gridUserConfig);
    } 
    
    /**
     * 加载用户关系表格
     */
    function loadUserGrid() {
    	if (cUser) {
			$.ajax({
				url : getServer() + "/sword/org/user/getUserRelation",
				data : {
					userUuid : cUser.id,
					userType : cUser.type
				},
				success : function(data) {
					Grid($.extend(gridUserConfig, {
						data : data,
						trEvent : {
							"click" : function(e) {
								//设置这个用户关系的菜单
								setMenuTreeCheck(e.data.row);
							}
						}
					}));
				}
			});
    	}
    }
    
    /**
     * 表格配置
     */
    var gridUserConfig = {
		id : "gridUser",
        placeAt : userGridId,
        index:"checkbox",
        hidden:false,
        index:"radio",
        pagination:true,
        layout : [{
            name:"编号",field:"userCode",click:function(e){
        	}
        },{
            name:"名称",field:"userName"
        },{
        	name:"类型",field:"userType",format:function(data){
        		if ("user" == data.row.userType) {
        			return "人员";
        		} else if ("dept" == data.row.userType) {
        			return "部门";
        		} else if ("role" == data.row.userType) {
        			return "角色";
        		}
        	}
        }],
        /*
        toolbar:[{
        	name:"添加",class:"fa fa-plus-circle",callback:on_BtnUserAdd_click
    	},{
    		name:"删除",class:"fa fa-trash-o",callback:on_BtnUserDelete_click
		}],
		*/
        data:[]
    }
    
    /**
     * 初始化菜单树
     */
    function initMenuTreeCheckAll(userUuid) {
    	$.ajax({
    		 url : getServer() + "/sword/auth/res/getAll",
			 success : function(data) {
				//适配ztree的nocheck属性（即目录不带checkbox）
            	(function(treeData){
            		if (treeData) {
            			$.each(treeData, function(i, n){
            				//默认展开根
                			if (n.resId == "root") {
                				n.open = true;
                			}
                			//将分类的checkbox去掉
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
                    }
                }
                //初始化菜单树-all
                $.fn.zTree.init($("#" + treeCheckMenuAll), setting, data);
            	//初始化菜单树
                $.fn.zTree.init($("#" + treeCheckMenu), setting, data);
			 }
   	 	});
    }
    
    /**
     * 根据用户id初始化用户菜单选择树
     */
    function setMenuTreeAllCheck() {
    	if (cUser) {
    		$.ajax({
    			url : getServer() + "/sword/auth/set/getResByUser",
    			data : {
    				userUuid : cUser.id,
    				userType : cUser.type
    			},
    			success : function(data) {
    				$.fn.zTree.getZTreeObj(treeCheckMenuAll).checkAllNodes(false);
    				if (data) {
    					$.each(data, function(i, n) {
    						var treeObj = $.fn.zTree.getZTreeObj(treeCheckMenuAll);
    						var node = treeObj.getNodeByParam("resId", n.resId);
    						if (node) {
    							treeObj.checkNode(node, true);
    						}
    					})
    				}
    			}
    		});
    	}
    }
    
    /**
     * 根据某一个用户关系id初始化菜单选择树
     */
    function setMenuTreeCheck(userRelationRow) {
    	cUserRelation = userRelationRow;
    	$("#" + text_menuUpdate_userRelationName_id).text("【" + userRelationRow.userName + "】");
    	$("#" + btn_menuUpdate_userRelationMenuSave_id).html('【<i class="fa fa-save"></i>保存】');
    	$.ajax({
    		url : getServer() + "/sword/auth/set/getResByUserIds",
    		data : {
    			userUuids : userRelationRow.userUuid 
    		},
    		success : function(data) {
    			$.fn.zTree.getZTreeObj(treeCheckMenu).checkAllNodes(false);
    			if (data) {
    				$.each(data, function(i, n) {
    					var treeObj = $.fn.zTree.getZTreeObj(treeCheckMenu);
    					var node = treeObj.getNodeByParam("resId", n.resId);
    					if (node) {
    						treeObj.checkNode(node, true);
    					}
    				})
    			}
    		}
    	});
    }
    
    //刷新
    function on_BtnRefresh_click() {
    	if (cUser) {
    		//设置用户所拥有的全部菜单
    		setMenuTreeAllCheck();
    		//设置用户角色表格
    		loadUserGrid();
    	}
    }
    
    //保存变更
    function on_BtnSave_click() {
    	if (cUserRelation) {
    		Util.confirm("确定要保存变更授权吗？", function() {
				var menuId = [],
					user = [];
				var nodes = $.fn.zTree.getZTreeObj(treeCheckMenu).getCheckedNodes(true);
				$.each(nodes, function(i, n) {
					menuId.push(n.resId);
				})
				user.push({
					userId:cUserRelation.userUuid,
					userType:cUserRelation.userType
				})
				$.ajax({
					url : getServer() + "/sword/auth/set/saveUserRes",
					data : { 
						resId : menuId.join(","),
						user : JSON.stringify(user) 
					},
					success : function(data) {
						Util.alert(data.message);
					}
				})
			});
    	}
    }
    
    return {
		init : initMenuUpdate
	}
})
