define(["jquery","UtilDir/util","examplesDir/common"],function($,Util,Common){

    return function($compile,$scope){
        //CodeMirror初始化
        Common.codeMirrorInit($compile,$scope);

        $scope.showAPI = function(){
            Util.slidebar({
                url:Common.examplesPath+"/util/dialog/views/doc.html",
                width:"800px"
            });
        };
    };
});