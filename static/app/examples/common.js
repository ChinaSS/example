define(["jquery",
        "UtilDir/util",
        "CMDir/codemirror.min",
        "css!CMDir/codemirror",
        "css!CMDir/theme/cobalt",
        "css!CMDir/theme/mdn-like"],function($, Util){

    var exampleInit = function($compile, $scope, sourceUrl, docUrl,slideWidth){
        require([ "text!" + sourceUrl ], function(source) {
            //把source添加到模板中
            document.getElementById("exampleSource").value = source;
            //初始化代码编辑面板
            var editor = CodeMirror.fromTextArea(document.getElementById("exampleSource"), {
                theme:"mdn-like",
                lineWrapping:true,          //是否显示scroll
                lineNumbers: true,          //是否显示number
                styleActiveLine: true,
                matchBrackets: true,
                mode:"htmlmixed",
                viewportMargin: Infinity
            });
            $scope.runJS = function(){
                var link = editor ? $compile(editor.getValue()) : "编辑区域未能正常初始化！";
                $("#exampleInstance").empty().html(link($scope));
            };
            $scope.$digest();
        });

        $scope.showAPI = function() {
            Util.slidebar({
                url : docUrl,
                width : slideWidth || "800px"
            });
        };
    };

    return {
        "exampleInit":exampleInit
    }
});