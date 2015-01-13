define(["jquery","UtilDir/util","UtilDir/grid","RoleDir/roleSupport"],function($,util,grid,service){

    return function($http,$scope){

        $scope.$apply(function () {

            $scope.role = {
                    template:{
                        editRole: getServer()+ "/static/app/system/role/views/roleEdit.html"
                    },
                    entity:{},
                    saveEntity:function(){
                        //数据验证
                        if($("#roleFormId").valid()){
                        	var data={role:$scope.role.entity,rrEntities:service.getRole2RourcesData($scope),urEntities:service.getRole2UserData($scope),notRrEntities:service.getRole2RourcesNotData($scope)};
                        	$.ajax({
                                url:getServer()+"/role/save",
                                type:"POST",
                                data: JSON.stringify(data),
                                dataType:"json",
                                contentType: "application/json",
                                success:function(data){
                                    if(data.status == "200"){
                                        util.alert("保存成功.");
                                        service.roleListInit($scope);
                                    }
                                },
                                error:function(XMLHttpRequest, textStatus, errorThrown ){
                                    util.alert("保存失败.");
                                }
                            })
                        }
                    },
                    delEntity:function(){

                    },
                    refUserInfo:{
                    	userName:"",
                    	queryClick:function(){
                    		service.role2userListInit($scope);
                    	}
                    },
                    isModify:function(roleEntity){
                    	if(roleEntity !=null && (roleEntity.roleId !=null && roleEntity.roleId != "") ){
                    		return true;
                    	}
                    	return false;
                    }
                };
        });
        
        $scope.role4resourceTree={};
        $scope.role4resourceChecked;
        $scope.role4resourceNotChecked=[];
        service.roleListInit($scope);
    }
});