/**
 * Created by YiYing on 2015/1/15.
 */
define(["jquery","CodeMirror","css!CodeMirrorCSS"],function($){

    var codeMirrorInit = function($compile,$scope){
        //初始化代码编辑面板
        var editor = CodeMirror.fromTextArea(document.getElementById("exampleSource"), {
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
        "codeMirrorInit":codeMirrorInit
    }
});