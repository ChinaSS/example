define(["UtilDir/util","UtilDir/grid","UtilDir/dialog","CommonDir/dict"],function(util,grid,Dialog,dict){

    var validate = function(){
        //数据验证
        $("#resourceFormId").validate({
            rules:{
                resourcesName:{required:true,chineseLength:256,dateNL:true},
                resourcesType:{required:true},
                resourcesId:{required:true,chineseLength:40},
                resourcesPid:{required:true,chineseLength:40},
                resourcesValue:{chineseLength:1000},
                resourcesIcon:{chineseLength:100}
            },
            messages: {
            }
        });
    };
    var showSlidebar = function(){
        //弹出侧边栏
        util.slidebar({
            id:"resourceEditPanel",
            width:"500px",
            afterLoad:function(){
                validate();
            }
        });
    };
    
    
    function showDialog(){
    	if(!isChecked()){
    		util.alert("请先选择资源。");
    		return false;
    	}
        require(['text!'+getStaticPath()+'app/system/resource/views/role4resource.html'],function(html){
    		var dialog = Dialog({
                id:"role4resourceDialog",
                title:"授予角色",
                body:html,
                buttons:[{name:"保存",callback:function(){
                	savaRoleResource();
                    //dialog.hide();
                }}]
            });
            role4resourceInit();
            $("#role4resourceBtn").bind("click",function(){
            	role4resourceInit();
            });
            dialog.show();
        });
    }

    var resourceListInit = function(id,$scope){
        var data =[],gridInstance ;
        $.ajax({
            "url":getServer()+"/permission/list?pid="+id,
            async:false,
            dataType:"json",
            "success":function(d){
                data = d.curPageData;
            }
        });
        var config = {
            id:"resourceList",
            placeAt:"resourceListId",            //存放Grid的容器ID
            pageSize:10,                         //一页多少条数据
            index:"checkbox",                   //首列为单选[radio]还是多选[checkbox],默认checkbox
            layout:[
                {name:"资源名称",field:"resourcesName",click:function(e){
                    //console.log(e.data);
                    var id = e.data.row.resourcesId;
                    $.ajax({
                        "url":getServer()+"/permission/query?resId="+id,
                        async:false,
                        dataType:"json",
                        "success":function(d){
                            //设置资源数据
                            $scope.$apply(function () {
                                $scope.resource.entity = d.entity;
                                $scope.resource.type = dict.resourceType();
                            });
                            showSlidebar();
                        }
                    });
                }},
                {name:"资源编号",field:"resourcesId"},
                {name:"父节点编号",field:"resourcesPid"},
                {name:"功能URL",field:"resourcesValue"}
            ],
            toolbar:[
                {name:"添加",class:"fa fa-plus-circle",callback:function(event){
                    //清空资源数据
                    $scope.$apply(function () {
                        $scope.resource.entity = {};
                        $scope.resource.type = dict.resourceType();
                    });
                    showSlidebar();
                }},
                /*{name:"编辑",class:"fa fa-edit",callback:function(event){
                 console.log('编辑')
                 }},*/
                {name:"删除",class:"fa fa-trash-o",callback:function(event){
                    var selected = gridInstance.getSelectedRow();
                    if(selected.length){
                        var resIds = [];
                        for(var i= 0,item;item=selected[i++];){
                            resIds.push(item.resourcesId);
                        }
                        $.ajax({
                            "url":getServer()+"/permission/remove",
                            "type":"POST",
                            "data":"resIds="+resIds.join(","),
                            "dataType":"json",
                            "success":function(data){
                                //console.log(data);
                                if(data.status=="200"){
                                    //表格刷新
                                    grid.getGrid("resourceList").refresh();
                                    util.alert("删除成功.");
                                }
                            },
                            "error":function(XMLHttpRequest, textStatus, errorThrown ){
                                //console.log(textStatus);
                                util.alert("删除失败.");
                            }
                        });
                    }else{
                        util.alert("请选择要删除的数据.");
                    }
                }},
                {name:'授予角色',class:"fa fa-anchor",callback:function(event){
                	showDialog();
                }}
            ],
            data:data
        };
        gridInstance = grid.init(config);
    };
    
    var role4resourceInit = function(){
        var config = {
            id:"role4resourceList",
            placeAt:"role4resourceList",            
            pageSize:10,                         
            index:"radio",                   
            layout:[
                {name:"角色名称",field:"roleName"}, 
                {name:"角色描述",field:"roleDesc"}
            ],
            data:{type:"URL",value:getServer()+"/role/page"},
            formData:{
            	roleName : $("#role3resourceRoleName").val()
            }
        };
        grid.init(config);
    };

    var getResourceTree = function ($scope) {
        //初始化树数据
        $.ajax({
            "url": getServer()+"/permission/menu",
            "dataType":"json",
            "success":function(data) {
            	if("200" == data.status){
	                var arr = [{ "id": "root", "name": "资源目录", "open": true }];
	                for(var i= 0,item; item=data.curPageData[i++];){
	                    arr.push({ "id":item.resourcesId, "pId":item.resourcesPid, "name":item.resourcesName});
	                }
	                $scope.$apply(function () {
	                	$scope.resourceTree = arr;
	                });
            	}
            }
        });
    };
    
    //是否选中行
    function isChecked(){
    	return grid.getGrid("resourceList").getSelectedRow().length;
    }
    
    //保存角色和资源的对应关系
    function savaRoleResource(){
    	var roleRows = grid.getGrid("resourceList").getSelectedRow();
    	var resRows = grid.getGrid("role4resourceList").getSelectedRow();
    	if(resRows.length){
    		var entities={};
	    	for(var i=0;i<roleRows.length;i++){
	    		entities['entities['+i+'].id.resourcesId'] = roleRows[i].resourcesId;
	    		entities['entities['+i+'].id.roleId'] = resRows[0].roleId;
	    	}
	    	$.ajax({
                url : getServer() + "/permission/forRole",
				type : "POST",
				data : entities,
				dataType : "json",
				success : function(data) {
					if (data.status == "200") {
						util.alert("保存成功.");
					}
				},
				error : function(XMLHttpRequest, textStatus,errorThrown) {
					util.alert("保存失败.");
				}
            });
    	}else{
    		util.alert("请先选择角色。");
    	}
    }
    

    return {
        resourceListInit:resourceListInit,
        getResourceTree:getResourceTree
    };
});