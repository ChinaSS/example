/**
 * 树形字典管理
 * @author gaodsh@css.com.cn
 */
 define(["jquery","UtilDir/grid","dictTreeDir/dictTreeSupport"],function($,grid,support){

    return function($compile,$scope){
        $scope.$apply(function () {
            $scope.dictTree = {
                    template:{
                        dictTreeEdit: getStaticPath()+ "app/system/dicttree/views/dictTreeEdit.html"
                    },
                    entity:{},
                    saveEntity:function(){support.save($scope);},
                    validate:function(){},
                    delEntity:function(){},
                    isModify:function(){
                    	return support.isModify($scope);
                    },
                    tree:{
                    	data:[],
                    	pcode:'0',
                    	checkedId:'0',
                    	checkedDictType:''
                    }
  
            };
        });
        
       //列表初始化
       support.dictTreeListInit($scope);
       //树数据
       support.getDictTreeData($scope);
    };
    

});
 