define(["jquery","UtilDir/util","examplesDir/common"],function($,Util,Common){

    return function($compile,$scope){
        var path = "app/examples/util";
        //CodeMirror初始化
        Common.codeMirrorInit($compile,$scope);

        $scope.showAPI = function(){
            Util.slidebar({
                url:path+"/dialog/views/doc.html",
                width:"800px"
            });
        };
    };
});