define(["jquery","PDExamplesDir/common"],function($,Common){

    return function($compile,$scope){
        //样例初始化
        Common.exampleInit($compile,$scope,
            "PDExamplesDir/collaboration/uploaderAndGrid/views/uploaderAndGridSource.html",        //演示代码路径
            "PDExamplesDir/collaboration/uploaderAndGrid/views/doc.html",           //文档路径
            "800px");                                           //侧边栏宽度，可为空，默认800px
    };
});