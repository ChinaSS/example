/**
 * 树形字典管理
 * @author gaodsh@css.com.cn
 */
define(["dictTreeDir/dictTreeSupport","ZTree","css!ZTreeCss"],function(support){
    var Directive = {};
   
    Directive.treeDict = function ($scope, element, attrs) {
        var setting = {
            data: {
                simpleData: {
                    enable : true
                }
            },
            async: {
				enable: true,
				url: getServer() + "/dictTree/tree",
				dataType : 'json',
				autoParam:["id","name=n","level=lv","dictType"]
			},
            callback: {
                onClick:function (event, treeId, treeNode) {
                	$scope.$apply(function () {
			        	$scope.dictTree.tree.checkedId = treeNode.id;
			        	$scope.dictTree.tree.checkedDictType = treeNode.dictType;
			        	$scope.dictTree.tree.pcode = treeNode.id;
			        });
                    //查询出该节点下的数据，初始化表格
                    support.dictTreeListInit($scope);
                }
                
            }
        };
        $.fn.zTree.init(element, setting);
        //监听，如果有变动则重新渲染树
        $scope.$watch('dictTree.treeData',function(){
            $.fn.zTree.init(element, setting);
        });
    };


    return Directive;
});
