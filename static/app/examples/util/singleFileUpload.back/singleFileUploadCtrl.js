define(["jquery","ExamplesDir/common"],function($,Common){

    return function($compile,$scope){
        //样例初始化
        Common.exampleInit($compile,$scope,
            "ExamplesDir/util/singleFileUpload/views/source.html",        //演示代码路径
            "ExamplesDir/util/singleFileUpload/views/doc.html"            //文档路径
        );
        //附件上传参数
        $scope.upload = {

        };
    };
});