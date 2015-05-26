define(["jquery","PDExamplesDir/common"],function($,Common){

    return function($compile,$scope,$route,$routeParams){
        console.log($route.current.$$route.originalPath);
        //样例初始化
        Common.exampleInit($compile,$scope,
            "PDExamplesDir/util/grid/views/source.html",        //演示代码路径
            "PDExamplesDir/util/grid/views/doc.html",           //文档路径
            "800px"                                             //侧边栏宽度，可为空，默认800px
        );
    };
});