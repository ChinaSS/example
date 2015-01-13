define(["ResourceDir/resourceSupport","ZTree","css!ZTreeCss"],function(support){
    var Directive = {};

    //资源树
    Directive.resourceTree = function ($scope, element, attrs) {
        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                onClick:function (event, treeId, treeNode) {
                    //查询出该节点下的数据，初始化表格
                    support.resourceListInit(treeNode.id,$scope);
                }
            }
        };
        $.fn.zTree.init(element, setting, $scope.resourceTree);
        //监听resourceTree，如果有变动则重新渲染树
        $scope.$watch('resourceTree',function(){
            $.fn.zTree.init(element, setting, $scope.resourceTree);
        });
    };


    return Directive;
});