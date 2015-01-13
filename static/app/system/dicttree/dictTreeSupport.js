/**
 * 树形字典管理
 * @author gaodsh@css.com.cn
 */
 define(["UtilDir/util","UtilDir/grid"],function(util,grid){
    //数据列表
    var dictTreeListInit = function($scope){
        var config = {
            id:"dictTreeList",
            placeAt:"dictTreeListId",            //存放Grid的容器ID
            pageSize:10,                         //一页多少条数据
            index:"checkbox",                   //首列为单选[radio]还是多选[checkbox],默认checkbox
            layout:[
                {name:"代码名称",field:"dictName",click:function(e){modifyDictTree($scope,e.data.row.id);}},
                {name:"代码",field:"dictCode"},
                {name:"父代码",field:"dictPcode"},
                {name:"排序",field:"orderNum"}
            ],
            toolbar:[
                {name:"添加",class:"fa fa-plus-circle",callback:function(event){addDictTree($scope);}},
                {name:"删除",class:"fa fa-trash-o",callback:delDictTree}
            ],
            data : {type : "URL",value : getServer() + "/dictTree/list"},
            formData:{
            	pcode : $scope.dictTree.tree.pcode,
            	dictType : $scope.dictTree.tree.checkedDictType
            }
        };
        grid.init(config);
    };
    
    //判断是否是修改
    function isModify($scope){
    	if($scope.dictTree.entity.id){
    		return true;
    	}
    	return false;
    }
    
    //添加
    function addDictTree($scope){
		//清空资源数据
        $scope.$apply(function () {
        	$scope.dictTree.entity = {
        		dictPcode:$scope.dictTree.tree.checkedId,
        		dictType:$scope.dictTree.tree.checkedDictType
        	};
        });
        showSlidebar();
    }
    //修改
    function modifyDictTree($scope,dictId){
    	queryDictTree(dictId,$scope);
    	showSlidebar();
    }
    
    //删除
    function delDictTree(){
    	var selected = grid.getGrid("dictTreeList").getSelectedRow();
        if(selected.length){
        	util.confirm("确定要删除选择的数据吗?",function(){
	            var dto = {entities:selected};
	            $.ajax({
	                url:getServer()+"/dictTree/remove",
	                type:"POST",
	                data: JSON.stringify(dto),
	                dataType:"json",
	                contentType: "application/json",
	                success:function(data){
	                    if(data.status=="200"){
	                        //表格刷新
	                        grid.getGrid("dictTreeList").refresh();
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
    
    
    
    var getDictTreeData = function ($scope) {
        //初始化树数据
        $.ajax({
            url: getServer()+"/dictTree/menu",
            dataType:"json",
            success:function(data) {
            	if("200" == data.status){
	                var arr = [{ "id": "0", "name": "分类代码", "open": true }];
	                for(var i= 0,item; item=data.curPageData[i++];){
	                    arr.push({ "id":item.dictCode, "pId":item.dictPcode, "name":item.dictName});
	                }
	                $scope.$apply(function () {
	                	$scope.dictTree.tree.data = arr;
	                });
            	}
            }
        });
    };
    
     	//数据验证
    var validate = function(){
        $("#dictTreeFormId").validate({
            rules:{
            	dictCode:{required:true,chineseLength:32},
            	dictPcode:{required:true,chineseLength:32},
            	dictName:{required:true,chineseLength:255},
            	dictType:{required:true,chineseLength:100}
            },
            messages: {
            }
        });
        return $("#dictTreeFormId").valid();
    };
    var showSlidebar = function(){
        //弹出侧边栏
        util.slidebar({
            id:"dictTreeEditPanel",
            width:"500px"
        });
    };
    
    //保存后台
    var save = function($scope){
    	if(validate()){
            //验证通过，保存数据
            $.ajax({
                url:getServer()+"/dictTree/save",
                type:"POST",
                data: $scope.dictTree.entity,
                dataType:"json",
                success:function(data){
                    if(data.status == "200"){
                        //表格数据
                    	getDictTreeData($scope);
                        grid.getGrid("dictTreeList").refresh();
                        util.alert("保存成功.");
                    }
                }
            })
        }
    }
    
    function queryDictTree(dictId,$scope){
    	$.ajax({
            url:getServer()+"/dictTree/query?dictId=" + dictId,
            type:'POST',
            dataType:"json",
            success:function(data){
                //设置资源数据
            	if("200" == data.status){
            		$scope.$apply(function () {
                    	$scope.dictTree.entity = data.entity;
                	});
            	}
            }
        });
    }

    return {
        dictTreeListInit:dictTreeListInit,
        getDictTreeData:getDictTreeData,
        isModify:isModify,
        save:save
    };
});