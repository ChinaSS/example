define(["jquery","ExamplesDir/common"],function($,Common){

    return function($compile,$scope){
        //CodeMirror初始化
        Common.codeMirrorInit($compile,$scope,
            "ExamplesDir/util/dialog/views/source.html",        //演示代码路径
            "ExamplesDir/util/dialog/views/doc.html",           //文档路径
            "800px");                                           //侧边栏宽度，可为空，默认800px
    };
});