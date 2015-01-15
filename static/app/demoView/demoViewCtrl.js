define(["jquery"],function($){

    return function($compile,$scope,$routeParams){
    	alert($routeParams.id)

        var link = $compile($("dialogSource.html").val());
        $scope.dialogParam = {

        }
        $scope.gridParam = {

        }
        $("#exampleInstance").empty().html(link($scope));

    };
});