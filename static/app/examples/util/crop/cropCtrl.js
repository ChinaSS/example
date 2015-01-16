define(["jquery","UtilDir/util","ExamplesDir/common"],function($,Util,Common){

    return function($compile,$scope){
        //CodeMirror初始化
        Common.codeMirrorInit($compile,$scope);

        $scope.showAPI = function(){
            Util.slidebar({
                url:Common.examplesPath+"/util/crop/views/doc.html",
                width:"800px"
            });
        };
    };
});