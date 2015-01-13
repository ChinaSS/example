define(["LogDir/logFileSupport"],function(support){

    return function($compile,$scope){
        $scope.$apply(function () {
            $scope.logFile = {
                    queryEntity:{}
            };
        });
		support.logFileListInit($scope);
    };
});