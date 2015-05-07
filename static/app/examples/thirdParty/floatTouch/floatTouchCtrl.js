define(["jquery","ExamplesDir/common"],function($,Common){

    return function($compile,$scope){
        //样例初始化
        Common.exampleInit($compile,$scope,
            "ExamplesDir/thirdParty/floatTouch/views/source.html",        //演示代码路径
            "ExamplesDir/thirdParty/floatTouch/views/doc.html",            //文档路径
            "600"
        );
    };
});