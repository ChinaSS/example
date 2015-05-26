define(["jquery","PDExamplesDir/common"],function($,Common){

    return function($compile,$scope){
    	//样例初始化
        Common.exampleInit($compile,$scope,
            "PDExamplesDir/thirdParty/mCustomScrollbar/views/source.html",        //演示代码路径
            "PDExamplesDir/thirdParty/mCustomScrollbar/views/doc.html",           //文档路径
            "800px");                                           //侧边栏宽度，可为空，默认800px
    };
});