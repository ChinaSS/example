define(["RoleDir/roleSupport","ZTree","css!ZTreeCss"],function(service){
     var Directive = {};

    //资源树
    Directive.role4resourceTree = function ($scope, element, attrs) {
		var setting = {
			treeId:"role4resourceTreeId",
            data: {
                simpleData: {
                    enable: true
                }
            },
            check: {
				enable: true
			},
			callback:{
                onCheck:onCheck
            }
        };
        var ztree = $.fn.zTree.init(element, setting, $scope.role4resourceTree);
        //监听role4resourceTree，如果有变动则重新渲染树
        $scope.$watch('role4resourceTree',function(){
            ztree = $.fn.zTree.init(element, setting, $scope.role4resourceTree);
        });
        function onCheck(){
        	var nodes = ztree.getCheckedNodes(true);
        	var notNodes = ztree.getCheckedNodes(false);
        	var resIds=[];
        	var notResIds=[];
			for (var i = 0; i < nodes.length; i++) {
				if ("root" == nodes[i].id) {
					continue;
				}
				resIds.push({resourcesId : nodes[i].id})
			}
			for(var i = 0; i< notNodes.length; i++ ){
				notResIds.push({resourcesId : notNodes[i].id})
			}
        	$scope.$parent.role4resourceChecked = resIds;
        	$scope.$parent.role4resourceNotChecked = notResIds;
        }
    };

    return Directive;
});