define(["HomeApp","UtilDir/util","UtilDir/grid"],function(HomeApp,util,grid){

    var validate = function(){
        //数据验证
        $("#roleFormId").validate({
            rules:{
            	roleName:"required"
            },
            messages: {
            	roleName: "请填写角色名称！"
            }
        });
    };
    var showSlidebar = function(){
        //弹出侧边栏
        util.slidebar({
            id:"roleEditPanel",
            width:"550px",
            afterLoad:function(){
                validate();
            }
        });
    };

    var  roleListInit = function($scope){
        var config = {
            id:"roleList",
            placeAt:"roleListId",            //存放Grid的容器ID
            pageSize:10,                         //一页多少条数据
            index:"checkbox",                   //首列为单选[radio]还是多选[checkbox],默认checkbox
            layout:[
                {name:"角色名称",field:"roleName",click:function(e){
                    //console.log(e.data);
                    var id = e.data.row.roleId;
                    $.ajax({
                        url:getServer()+"/role/query?roleId="+id,
                        async:false,
                        dataType:"json",
                        success:function(d){
                            //设置资源数据
                            $scope.$apply(function () {
                                $scope.role.entity = d.entity;
                                $scope.role4resourceTree = queryResourceByRoleId(d.entity.roleId);
                            });
                            role2userListInit($scope);
                            showSlidebar();
                        }
                    });
                }},
                {name:"角色描述",field:"roleDesc"}
            ],
            toolbar:[
                {name:"添加",class:"fa fa-plus-circle",callback:function(event){
                    //清空资源数据
                    $scope.$apply(function () {
                        $scope.role.entity = {};
                        $scope.role.refUserInfo.userName="";
                    });
                    showSlidebar();
                }},
                {name:"删除",class:"fa fa-trash-o",callback:function(event){
                    var selected = gridInstance.getSelectedRow();
                    if(selected.length){
                        var roleIds = [];
                        for(var i= 0,item;item=selected[i++];){
                        	roleIds.push(item.roleId);
                        }
                        $.ajax({
                            "url":getServer()+"/role/remove",
                            "type":"POST",
                            "data":"roleIds="+roleIds.join(","),
                            "dataType":"json",
                            "success":function(data){
                                if(data.status=="200"){
                                    //表格刷新
//                                    resourceListInit("root",$scope);
//                                    roleListInit("root",$scope);
                                    grid.getGrid("roleList").refresh();
                                    util.alert("删除成功.");
                                }
                            },
                            "error":function(XMLHttpRequest, textStatus, errorThrown ){
                                util.alert("删除失败.");
                            }
                        });
                    }else{
                        util.alert("请选择要删除的数据.");
                    }
                }}
            ],
            data: {type:"URL",value:getServer()+"/role/page"} 
        };
        gridInstance = grid.init(config);
    };
    
    //根据角色ID查询资源树
    function queryResourceByRoleId (roleId) {
        var result;
        $.ajax({
            url: getServer()+"/role/rrlist",
            type:"POST",
            data : "roleId="+roleId,
            dataType:"json",
            async:false,
            success:function(data) {
            	if(data.status !="200"){
            		util.alert("查询角色下所有资源树失败。");
            	}else{
	                var arr = { id: "root", name: "资源目录", open:true ,pId:0};
	                result = data.curPageData;
	                result.push(arr);
            	}
            }
        });
        return result;
    };
    
    var  role2userListInit = function($scope){
        var config = {
            id:"role2userList",
            placeAt:"role2userListId",            //存放Grid的容器ID
            pageSize:10,                         //一页多少条数据
            index:"checkbox",                   //首列为单选[radio]还是多选[checkbox],默认checkbox
            layout:[
            	{name:"姓名",field:"username"},
                {name:"登录名",field:"loginname"}
                
            ],
            data: {type:"URL",value:getServer()+"/user/page"} ,
            formData:{
            	userName : $scope.role.refUserInfo.userName
            }
        };
        gridInstance = grid.init(config);
    };
    
//    获取角色的资源数据列表
    var getRole2RourcesData = function($scope){
    	var entities=[];
    	if($scope.role.isModify($scope.role.entity)){
    		var roleId = $scope.role.entity.roleId;
    		var r2rRows = $scope.role4resourceChecked;
	    	if(roleId && r2rRows != null){
		    	for(i=0;i<r2rRows.length;i++){
		    		entities.push({id:{resourcesId:r2rRows[i].resourcesId,roleId:roleId}});
		    	}
	    	}
    	}
    	
    	return entities;
    } 
//    //获取角色的资源数据列表(未选中)
    var getRole2RourcesNotData = function($scope){
		var entities=[];
		if($scope.role.isModify($scope.role.entity)){
			var roleId = $scope.role.entity.roleId;
			var r2rRows = $scope.role4resourceNotChecked;
			if(roleId && r2rRows != null){
	    		for(i=0;i<r2rRows.length;i++){
	    			entities.push({id:{resourcesId:r2rRows[i].resourcesId,roleId:roleId}});
	    		}
			}
		}
		return entities;
    }
    
//  获取角色的用户数据列表
    var getRole2UserData = function($scope){
    	var entities=[];
    	if($scope.role.isModify($scope.role.entity)){
    		var roleId = $scope.role.entity.roleId;
    		var r2uRows = grid.getGrid("role2userList").getSelectedRow();
	    	if(roleId && r2uRows.length){
		    	for(i=0;i<r2uRows.length;i++){
		    		entities.push({id:{userId:r2uRows[i].userId,roleId:roleId}});
		    	}
	    	}
    	}
    	return entities;
    }
    
    return {
        roleListInit : roleListInit,
		role2userListInit : role2userListInit,
		getRole2RourcesData : getRole2RourcesData,
		getRole2RourcesNotData : getRole2RourcesNotData,
		getRole2UserData : getRole2UserData
    };
});