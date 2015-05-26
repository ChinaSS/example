/**
 * 菜单管理JS
 */
define(["PDUtilDir/grid",
        "PDUtilDir/util",
        "PDUtilDir/tool",
         "ZTree","css!ZTreeCss","JQuery.validate","JQuery.validate.extra","JQuery.validate.message"], 
    function(Grid, Util, Tool){
	
    //初始化入口
    function initMenu() {
    	//初始树
    	createMenuTree();
    	//初始化表格
    	createMenuGrid();
    	(function(){
    		//刷新
    		$("#btn_menu_refresh").on("click", on_BtnRefresh_click);
    		//添加分类
    		$("#btn_menu_addSort").on("click", on_BtnMenuAddSort_click);
    		//编辑分类
    		$("#btn_menu_editSort").on("click", on_BtnMenuEditSort_click);
    		//删除分类
    		$("#btn_menu_deleteSort").on("click", on_BtnMenuDeleteSort_click);
    	})();
    }
    /**************************************全局变量***********************************/
    //路径变量
    var path = getStaticPath() + "/core/system/menu";
    //当前选中节点
    var currentNode = null;
    //菜单目录树Id
    var menuDirTreeId = "tree_menuDir";
    //菜单表格Id
    var menuGridId = "grid_menu";
    
    //初始化菜单目录树
    var createMenuTree = function() {
        $.ajax({
            url : getServer() + "/sword/menu/getSort",
            success : function(data) {
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
                    callback : {
                        onClick : function(event, treeId, treeNode, clickFlag) {
                        	currentNode = treeNode;
                        	loadMenuGrid();
                        }
                    }
                }
                //初始化
                $.fn.zTree.init($("#" + menuDirTreeId), setting, data);
                //展开所有
                $.fn.zTree.getZTreeObj(menuDirTreeId).expandAll(true);
            }
        });
    }
    
    //初始化表格
    function createMenuGrid() {
    	Grid(gridBaseConfig);
    }
    
    //菜单表格配置
    var gridBaseConfig = {
		id : "gridMenu",
        placeAt : menuGridId,
        index:"checkbox",
        hidden:false,
        pagination:true,
        layout : [{
            name:"菜单名称",field:"menuName",click:function(e){
            	on_BtnMenuEdit_click(e.data.row);
        	}
        },{
            name:"菜单地址",field:"menuUrl"
        },{
            name:"菜单描述",field:"menuDesc"
        }],
        toolbar:[
            {name:"添加",icon:"fa fa-plus-circle",callback:on_BtnMenuAdd_click},
            {name:"删除",icon:"fa fa-trash-o",callback:on_BtnMenuDelete_click},
            {name:"刷新",icon:"fa fa-refmenuh",callback:on_BtnMenuRefresh_click }
        ],
        data:[]
    }
    
    //加载菜单表格数据
    function loadMenuGrid() {
    	if (currentNode) {
    		$.ajax({
    			url : getServer() + "/sword/menu/getBySort",
    			data : {
    				menuPid : currentNode.menuId
    			},
    			success : function(data) {
    				Grid($.extend(gridBaseConfig, {
    					data:data
    				}));
    			}
    		});
    	}
    }

    /* 校验是否选择目录节点 */
    function validate_opr_menuSort() {
    	if (!currentNode) {
    		showMenuTreeOprTip();
    		return false;
    	} else {
    		hideMenuTreeOprTip();
    		return currentNode;
    	}
    }
    
    //显示提示信息
    function showMenuTreeOprTip() {
    	$("#menu_tree_opr_tip").fadeIn();
    }
    
    //隐藏提示信息
    function hideMenuTreeOprTip() {
    	$("#menu_tree_opr_tip").fadeOut();
    }
    
    //监听【刷新】点击事件
    function on_BtnRefresh_click() {
    	refresh();
    }
    
    function refresh() {
    	//初始树
    	createMenuTree();
    	//初始化表格
    	createMenuGrid();
    }
    
    //监听【添加分类】点击事件
    function on_BtnMenuAddSort_click() {
    	var node = validate_opr_menuSort();
    	if (node) {
    		editMenuSort(false, {
    			menuPid : node.menuId,
    			menuParent : node.menuName
    		});
    	}
    }
    
    //监听【修改分类】点击事件
    function on_BtnMenuEditSort_click() {
    	var node = validate_opr_menuSort();
    	if (node) {
    		editMenuSort(true, node);
    	}
    }
    
    //监听【删除分类】点击事件
    function on_BtnMenuDeleteSort_click() {
		deleteMenuSort();
    }
    
    /** 添加/编辑 菜单分类 */
    function editMenuSort(edit, row) {
    	 Util.slidebar({
	         url:path + "/views/menu_sort.html",
	         width:"500px",
	         cache:false,
	         afterLoad : function() {
	        	//如果是编辑，需要重新从后台获取最新的数据
	        	if (edit) {
	        		$.ajax({
	        			url : getServer() + "/sword/menu/getById",
	        			data : {
	        				menuId : row.menuId
	        			},
	        			success : function(data) {
	        				//setFormData("#form_menuSort", data);
	        				Tool.deserialize("form_menuSort", data);
	        			}
	        		});
	        	} else {
	        		//添加时初始化表单
		        	setFormData("#form_menuSort", row);
	        	}
	        	//初始化表单校验
	    	 	$("#form_menuSort").validate({
	     			rules : {
	     				menuName : "required",
	     				menuOrder : {
	     					minlength:0,
	     					number : true
	     				}
	     			},
	     			messages : {
	     				menuName : "请填写目录名称"
	     			}
	     		});
	    	 	//注册保存按钮事件
	    	 	$("#btn_menuSort_save").on("click", function(){
	    	 		if ($("#form_menuSort").valid()) {
	    	 			//var data = getFormData("#form_menuSort");
	    	 			var data = Tool.serialize("form_menuSort");
	    	 			$.ajax({
	    	 				url : getServer() + "/sword/menu/save",
	    	 				data : data,
	    	 				type : "post",
	    	 				success : function(data) {
	    	 					Util.alert(data.message);
	    	 					if (data.code == "success") {
	    	 						if(edit) {
	    	 							$.extend(row, data.data);
	    	 							editTreeNode(row);
	    	 						} else {
	    	 							addTreeNode(data.data);
	    	 						}
	    	 					}
	    	 				}
	    	 			});
	    	 		}
	    	 	})
	         }
	     });
    }
    
    //添加树节点
    function addTreeNode(node) {
		if (currentNode) {
			$.fn.zTree.getZTreeObj(menuDirTreeId).addNodes(currentNode, node);
		}
    }
    
    //修改树节点
    function editTreeNode(node) {
    	$.fn.zTree.getZTreeObj(menuDirTreeId).updateNode(node);
    }
    
    //删除树节点
    function removeTreeNode(node) {
    	$.fn.zTree.getZTreeObj(menuDirTreeId).removeNode(node, true);
    }
    
    //删除菜单分类
	function deleteMenuSort() {
		if (validate_opr_menuSort()) {
			Util.confirm("确定要删除指定的记录吗？", function() {
				var ids = currentNode.menuId;
				$.ajax({
					url : getServer() + "/sword/menu/deleteSort",
					data : {
						ids : ids
					},
					success : function(data) {
						Util.alert(data.message);
						if (data.code == "success") {
							removeTreeNode(currentNode);
						}
					}
				})
			});
		}
	}
    
	//监听菜单表格【添加】点击事件
    function on_BtnMenuAdd_click() {
    	var node = validate_opr_menuSort();
    	if (node) {
    		editMenu(false, {
    			menuPid : node.menuId,
    			menuParent : node.menuName
    		});
    	}
    }
    
    //监听菜单表格【修改】点击事件
    function on_BtnMenuEdit_click(row) {
    	editMenu(true, row);
    }
    
    //监听菜单表格【删除】点击事件
    function on_BtnMenuDelete_click() {
    	deleteMenu();
    }
    
    //监听菜单表格【刷新】点击事件
    function on_BtnMenuRefresh_click() {
    	loadMenuGrid();
    }
    
    //编辑菜单
    function editMenu(edit, row) {
    	Util.slidebar({
            url:path + "/views/menu.html",
            width:"500px",
            cache:false,
            afterLoad : function() {
            	if (edit) {//edit
            		$.ajax({
            			url:getServer() + "/sword/menu/getById",
						data : {
							menuId : row.menuId
						},
            			success:function(data) {
            				setFormData("#form_menu", data);
            			}
            		});
            	} else { // add
            		setFormData("#form_menu", row);
            	}
            	//监听【保存】按钮事件
            	$("#btn_menu_save").on("click", function() {
            		$("#form_menu").validate({
            			rules : {
            				menuName : "required",
            				menuUrl : "required",
            				menuOrder : {
            					number : true,
            					minlength : 0
            				}
            			},
            			messages : {
            				menuName : "请填写菜单名称",
            				menuUrl : "请填写菜单地址"
            			}
            		})
            		if ($("#form_menu").valid()) {
            			var data = getFormData("#form_menu");
            			$.ajax({
            				url : getServer() + "/sword/menu/save",
            				data : data,
            				type : "post",
            				success : function(data) {
            					Util.alert(data.message);
            					if (data.code == "success") {
            						loadMenuGrid();
            					}
            				}
            			});
            		}
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

    //删除菜单
	function deleteMenu() {
		var rows = Grid.getGrid("gridMenu").getSelectedRow();
		if (rows && rows.length > 0) {
			Util.confirm("确定要删除指定的记录吗？", function() {
				var ids = "";
				$.each(rows, function(i, row){
					ids = ids.concat(row.menuId).concat(",");
				})
				$.ajax({
					url : getServer() + "/sword/menu/delete",
					data : {
						ids : ids
					},
					success : function(data) {
						Util.alert(data.message);
						if (data.code == "success") {
							loadMenuGrid();
						}
					}
				})
			});
		} else {
			Util.alert("请选择要删除的行记录");
		}
	}

	return {
		init : initMenu
	}
});