define(["jquery","PDExamplesDir/common"],function($,Common){

    return function($compile,$scope){
        //样例初始化
        Common.exampleInit($compile,$scope,
            "PDExamplesDir/thirdParty/floatTouch/views/source.html",        //演示代码路径
            "PDExamplesDir/thirdParty/floatTouch/views/doc.html",            //文档路径
            "600"
        );
    };
});