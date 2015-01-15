/**
 * Created by YiYing on 2015/1/15.
 */
define(["jquery","CMDir/codemirror.min",
        "css!CMDir/codemirror",
        "css!CMDir/theme/cobalt",
        "css!CMDir/theme/mdn-like"],function($){

    var codeMirrorInit = function($compile,$scope){
        //初始化代码编辑面板
        var editor = CodeMirror.fromTextArea(document.getElementById("exampleSource"), {
            theme:"mdn-like",
        	lineWrapping:true, //是否显示scroll
            lineNumbers: true, //是否显示number
            styleActiveLine: true,
            matchBrackets: true,
            mode:"htmlmixed",
            viewportMargin: Infinity
        });
        $scope.runJS = function(){
            var link = $compile(editor.getValue());
            $("#exampleInstance").empty().html(link($scope));
        };
    };

    return {
        "codeMirrorInit":codeMirrorInit,
        "examplesPath":"app/examples"
    }
});