define(["jquery","UtilDir/util","UtilDir/grid","UserDir/userService"],function($,util,grid,service){
	/*
	 * define的注释:待补充
	   ctrl中的内容:
	*/	
    return function($http,$scope){

        $scope.$apply(function () {
        	
            $scope.user = {//定义user的行为与属性    getStaticPath()请求静态资源    getServer()  ajax请求用这个
                    "template":{
                        "editUser": getStaticPath() + "app/system/user/views/userEdit.html"
                    },
                    "entity":{},
                    
                    "saveEntity":function(){//保存数据
                    	
                        if($("#userFormId").valid()){//先数据校验
                            $.ajax({//发送保存数据请求
                                "url":getServer()+"/user/save",
                                "type":"POST",
                                "data": $scope.user.entity,
                                "dataType":"json",
                                "success":function(data){
                                    if(data.status=="200"){
                                        //保存数据成功后刷新列表
                                        util.alert("保存成功.");
                                        service.userListInit("root",$scope);

                                    }
                                },
                                "error":function(XMLHttpRequest, textStatus, errorThrown ){
                                    util.alert("保存失败.");
                                }
                            });//end ajax
                        }
                    },
                    
                    "delEntity":function(){

                    }
                };
        });

        //用户列表页面初始化
        service.userListInit("root",$scope);
    };
});