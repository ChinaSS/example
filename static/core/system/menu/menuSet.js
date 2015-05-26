/**
 * 菜单管理JS
 */
define(["PDUtilDir/grid",
        "PDUtilDir/util",
        "PDUtilDir/tool",
        "PDUtilDir/org/dataSelect",
        "ZTree","css!ZTreeCss","JQuery.validate","JQuery.validate.extra","JQuery.validate.message"], 
    function(Grid, Util, Tool, PsnSelect){
	
    //初始化入口
    function initMenuSet() {
    	//初始化菜单选择树
    	createMenuCheckTree();
    	//初始化人员信息列表
    	createUserGrid();
    	(function(){
    		//刷新
    		$("#btn_menu_refresh").on("click", on_BtnRefresh_click);
    		//保存
    		$("#btn_menuSet_save").on("click", on_BtnSave_click);
    	})();
    	//测试
    	//$("#test").load(getServer() + "/403.html");
    }
    /**************************************全局变量***********************************/
    //路径变量
    var sysPath = "core/system";
    //菜单选择树Id
    var treeCheckMenu = "treeCheck_menu";
    //人员表格Id
    var userGridId = "grid_userSet";
    //人员表格data
    var userGridData = [];
    
    //初始化用户信息列表
    function createUserGrid() {
    	Grid(gridUserConfig);
    } 
    
    //初始化菜单选择树
    function createMenuCheckTree() {
        $.ajax({
            url : getServer() + "/sword/menu/getMenuAll",
            success : function(data) {
            	//适配数据
            	(function(treeData){
            		for (var i=0; i<treeData.length; i++) {
            			//默认展开根
            			if (treeData[i].menuId == "root") {
            				treeData[i].open = true;
            			}
            			//配置菜单分类图标
            			if (treeData[i].menuType == "1") {
            				treeData[i].isParent = true;
            			}
            		}
            	})(data)
            	//配置ztree的属性
                var setting = {
                    data: {
                    	key : {
                    		name:"menuName"
                    	},
                        simpleData: {
                            enable: true,
                            idKey:"menuId",
                            pIdKey:"menuPid",
                            rootPId:null
                        }
                    },
                    check : {
                    	enable : true/*,
                    	chkStyle : "radio"
                    	*/
                    },
                    callback : {
                        onClick : function(event, treeId, treeNode, clickFlag) {
                        },
                        onCheck : function() {
                        }
                    }
                }
                //初始化
                $.fn.zTree.init($("#" + treeCheckMenu), setting, data);
            }
        });
    }
    
    //用户表格配置
    var gridUserConfig = {
		id : "gridUser",
        placeAt : userGridId,
//        index:"checkbox",
        hidden:false,
        pagination:true,
        layout : [{
            name:"编号",field:"code",click:function(e){
        	}
        },{
            name:"名称",field:"name"
        },{
        	name:"类型",field:"type", format:function(data) {
        		if ("user" == data.row.type) {
        			return "人员";
        		} else if ("dept" == data.row.type) {
        			return "部门";
        		} else if ("role" == data.row.type) {
        			return "角色";
        		}
        	}
        },{
        	name:"删除",field:"oper", format:function(){return '<i class="fa fa-trash-o" title="删除"></i>';}, click:function(e){
        		on_BtnUserDelete_click(e.data.row);
        	}
        }],
        toolbar:[{
        	name:"选择用户",icon:"fa fa-plus-circle",callback:on_BtnUserAdd_click
    	}/*,{
    		name:"删除",class:"fa fa-trash-o",callback:on_BtnUserDelete_click
		}*/],
        data:[]	
    }

    //监听【刷新】点击事件
    function on_BtnRefresh_click() {
    	
    }
    
    //监听【保存】点击事件
    function on_BtnSave_click() {
		if (userGridData && userGridData.length > 0) {
			Util.confirm("确定要保存授权吗？", function() {
				var menuId = [],
					user = [];
				var nodes = $.fn.zTree.getZTreeObj(treeCheckMenu).getCheckedNodes(true);
				$.each(nodes, function(i, n) {
					menuId.push(n.menuId);
				})
				for (var i=0; i<userGridData.length; i++) {
					user.push({
						userId:userGridData[i].id,
						userType:userGridData[i].type
					})
				}
				$.ajax({
					url : getServer() + "/sword/menu/auth/saveUserMenu",
					data : { 
						menuId : menuId.join(","),
						user : JSON.stringify(user) 
					},
					success : function(data) {
						Util.alert(data.message);
					}
				})
			});
		} else {
			Util.alert("请添加用户");
		}
    }
    
    //监听【添加】点击事件
    function on_BtnUserAdd_click() {
    	PsnSelect({
    		id : "userSelect",
    		multi : true,
    		tagData:["user","role","dept"],
    		dataRefill:false,
    		callback : function(data) {
    			for (var type in data) {
    				if (data[type] && data[type].length > 0) {
    					for (var i=0; i<data[type].length; i++) {
    						var user = data[type][i];
    						var json = {
								id : user["userUuid"] || user["deptUuid"] || user["roleUuid"],
    							code : user["userCode"] || user["deptCode"] || user["roleCode"],
    							name : user["userName"] || user["deptName"] || user["roleName"],
    							type : type
    						}
    						if (-1 == Tool.indexOfJsonArray(json, userGridData, function(json1, json2){
    							return (json1.id == json2.id && json1.type == json2.type);
    						})) {
    							userGridData.push(json);
    						}
    					}
    				}
    			}
    			Grid($.extend(gridUserConfig, {
					data:userGridData
				}));
    		}
    	});
    }
    
    //监听【删除】点击事件
    function on_BtnUserDelete_click(row) {
    	//删除行
		for (var j=0; j<userGridData.length; j++) {
			if (row.id == userGridData[j].id) {
				userGridData.splice(j, 1);
				break;
			}
		}
		//重新渲染表格
		Grid($.extend(gridUserConfig, {
			data:userGridData
		}));
    } 
    
    //监听【删除】点击事件
    /*
    function on_BtnUserDelete_click() {
    	var rows = Grid.getGrid("gridUser") && Grid.getGrid("gridUser").getSelectedRow();
		if (rows && rows.length > 0) {
			for (var i=0; i<rows.length; i++) {
				for (var j=0; j<userGridData.length; j++) {
					if (rows[i].id == userGridData[j].id) {
						userGridData.splice(j, 1);
					}
				}
			}
			Grid($.extend(gridUserConfig, {
				data:userGridData
			}));
		} else {
			Util.alert("请选择行");
		}
    }
	*/
    
	return {
		init : initMenuSet
	}
});