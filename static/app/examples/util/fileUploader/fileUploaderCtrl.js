define(["jquery","ExamplesDir/common"],function($,Common){

    return function($compile,$scope){
        //样例初始化
        Common.exampleInit($compile,$scope,
            "ExamplesDir/util/fileUploader/views/source.html",        //演示代码路径
            "ExamplesDir/util/fileUploader/views/doc.html"            //文档路径
        );
    };
});