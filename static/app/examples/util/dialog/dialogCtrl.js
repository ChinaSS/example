define(["jquery","UtilDir/util","CodeMirror","css!CodeMirrorCSS"],function($,Util){

    return function($compile,$scope){
        var path = "app/examples/util";
        $scope.runJS = function(){
            var link = $compile($("#exampleSource").val());
            $("#exampleInstance").empty().html(link($scope));
        };

        $scope.showAPI = function(){
            Util.slidebar({
                url:path+"/dialog/views/doc.html",
                width:"800px"
            });
        };

        CodeMirror.fromTextArea(document.getElementById("exampleSource"), {
            lineWrapping:true, //是否显示scroll
            lineNumbers: false, //是否显示number
            styleActiveLine: true,
            matchBrackets: true,
            mode:"htmlmixed",
            viewportMargin: Infinity
        });

    };
});