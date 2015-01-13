/**
 * 组织机构
 * @author gaodsh@css.com.cn
 */
 define(["UtilDir/util","UtilDir/grid",'CommonDir/dictTree',"ZTree","css!ZTreeCss"],function(util,grid,dictTree){
    //数据列表
    var orgListInit = function($scope){
        var config = {
            id:"orgList",
            placeAt:"orgListId",            //存放Grid的容器ID
            pageSize:10,                         //一页多少条数据
            index:"checkbox",                   //首列为单选[radio]还是多选[checkbox],默认checkbox
            layout:[
                {name:"组织名称",field:"orgName",click:function(e){modifyOrganization($scope,e.data.row.orgId);}},
                {name:"组织代码",field:"orgCode"},
                {name:"组织类型",field:"dictOrgTypeName"},
                {name:"地区名称",field:"regionName"}
            ],
            toolbar:[
                {name:"添加",class:"fa fa-plus-circle",callback:function(event){addOrganization($scope);}},
                {name:"删除",class:"fa fa-trash-o",callback:delOrganization}
            ],
            data : {type : "URL",value : getServer() + "/org/page"},
            formData:{
				orgName : $scope.org.query.dto.orgName,
				orgType : $scope.org.query.dto.orgType
            }
        };
        grid.init(config);
    };
    
    //判断是否是修改
    function isModify($scope){
    	if($scope.org.entity.orgId){
    		return true;
    	}
    	return false;
    }
    
    //添加
    function addOrganization($scope){
		//清空资源数据
        $scope.$apply(function () {
        	$scope.org.entity = {};
        });
        queryOrgType($scope);
        queryOrgRegion($scope);
        showSlidebar($scope);
    }
    
    //修改
    function modifyOrganization($scope,orgId){
    	queryOrganization($scope,orgId);
    	queryOrgType($scope);
    	queryOrgRegion($scope);
    	showSlidebar($scope);
    }
    
    //删除
    function delOrganization(){
    	var selected = grid.getGrid("orgList").getSelectedRow();
        if(selected.length){
        	util.confirm("确定要删除选择的数据吗?",function(){
        		var orgIds = [];
                for (var i = 0, item; item = selected[i++];) {
                    orgIds.push(item.orgId);
                }
	            $.ajax({
	                url : getServer() + "/org/remove",
	                type : "POST",
	                data : "orgIds=" + orgIds.join(","),
	                dataType : "json",
	                success:function(data){
	                    if(data.status=="200"){
	                        //表格刷新
	                        grid.getGrid("orgList").refresh();
	                        initTree();
	                        util.alert("删除成功.");
	                    }else{
	                    	util.alert("删除失败.");
	                    }
	                }
	            });
        	});
        }else{
            util.alert("请选择要删除的数据.");
        }
    }
    
    //数据验证
    var validate = function(){
    	 $("#orgFormId").validate({
            rules:{
            },
            messages: {
            }
        });
        return $("#orgFormId").valid();
    };
    var showSlidebar = function($scope){
        //弹出侧边栏
        util.slidebar({
            id:"orgEditPanel",
            width:"500px",
            afterLoad:function(){
            	validate();
            }
        });
    };
    
    //保存后台
    var save = function($scope){
    	if(validate()){
            //验证通过，保存数据
            $.ajax({
                url : getServer() + "/org/save",
                type : "POST",
                data : $scope.org.entity,
                dataType : "json",
                success:function(data){
                    if(data.status == "200"){
                        //表格数据
                        grid.getGrid("orgList").refresh();
                        initTree();
                        util.alert("保存成功.");
                    }
                }
            });
        }
    }
    //查询作品对象
    function queryOrganization($scope,orgId){
    	$.ajax({
            url : getServer() + "/org/query?orgId=" + orgId,
            type : 'POST',
            dataType : "json",
            success:function(data){
                //设置资源数据
            	if("200" == data.status){
            		$scope.$apply(function() {
                    	$scope.org.entity = data.entity;
                	});
            	}
            }
        });
    }  
	//查询组织类型
	function queryOrgType($scope){
		$.ajax({
	        url: dictTree.queryUrl.orgType,
	        type:'POST',
	        dataType:"json",
	        success:function(data){
				//设置资源数据
	        	if("200" == data.status){
	        		$scope.$apply(function () {
	                	$scope.org.type.data = data.curPageData;
	            	});
	        	}	        	
	        }
	    });  
	} 
	
	//查询地区
	function queryOrgRegion($scope){
		$.ajax({
	        url: dictTree.queryUrl.region,
	        type:'POST',
	        dataType:"json",
	        success:function(data){
				//设置资源数据
	        	if ("200" == data.status) {
	        		$scope.$apply(function () {
	                	$scope.org.region.data = data.curPageData;
	            	});
	        	}	        	
	        }
	    });  
	} 
	//实例组织机构树
	function initTree(){
 		var setting = {
            data: {
                simpleData: {
                    enable : true ,
                    idKey : "orgCode",
                    pIdKey : "orgPcode",
					rootPId:"0"
                },
                key:{
                	name:"orgName"
                }
            },
            edit: {
            	enable: true ,
				showRemoveBtn: false,
				showRenameBtn: false,
            	drag: {
					isCopy :true,
					isMove :true,
					prev: true,
					next: true,
					inner: true
            	}
			},            
            callback: {
            }
        };		
		$.ajax({
	        url: getServer() + '/org/tree',
	        type:'POST',
	        dataType:"json",
	        success:function(data){
				//设置资源数据
	        	if ("200" == data.status) {
	                $.fn.zTree.init($("#orgTree"), setting,data.curPageData);
	        	}	        	
	        }
	    });		
	}
	
	//保存组织机构树
	function saveOrgTree(){
		var zTree = $.fn.zTree.getZTreeObj("orgTree");
		var nodes = zTree.transformToArray(zTree.getNodes());
		var data = [];
		for (var i = 0; i < nodes.length; i++) {
			var node = nodes[i];
			console.log(node);
			data.push({dictOrgType: node.dictOrgType, dictRegion: node.dictRegion, orgCode: node.orgCode, orgId: node.orgId, orgName: node.orgName,orgPcode:node.orgPcode,orgNum:i});
		}
		$.ajax({
            url : getServer() + "/org/saveTree",
            type : "POST",
            data: JSON.stringify({entities:data}),
            dataType:"json",
            contentType: 'application/json', 
            success:function(data){
                if(data.status == "200"){
                    util.alert("保存成功.");
                }
            }
        });		
	}

    return {
        orgListInit:orgListInit,
        isModify:isModify,
        save:save ,
        initTree:initTree,
        saveOrgTree:saveOrgTree
    };
});