define(["jquery","ExamplesDir/common"],function($,Common){

    return function($compile,$scope){
        //样例初始化
        Common.exampleInit($compile,$scope,
            "ExamplesDir/util/fileUpload/views/source.html",        //演示代码路径
            "ExamplesDir/util/fileUpload/views/doc.html"            //文档路径
        );
        //附件上传参数
        $scope.upload = {
            searchURL:getServer()+"/caiji/opus/file?opusId=8a9494814a2775db014a28e5206f0007",
            formData:{
                bizType:'10'
            }
        };
    };
});