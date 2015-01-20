define(["jquery",
        "UtilDir/util",
        "CMDir/lib/codemirror",		
        
        "CMDir/addon/fold/foldcode",
        "CMDir/addon/fold/foldgutter",
        "CMDir/addon/fold/brace-fold",
        "CMDir/addon/fold/xml-fold",
        "CMDir/addon/fold/comment-fold",
        
        "CMDir/addon/selection/active-line",
        "CMDir/addon/selection/mark-selection",
        "CMDir/addon/edit/matchbrackets",
        "CMDir/addon/edit/matchtags",
        
        "CMDir/addon/hint/show-hint",
        "CMDir/addon/hint/javascript-hint",
        "CMDir/addon/hint/html-hint",
        "CMDir/addon/hint/css-hint",
        "CMDir/mode/css/css",
        "CMDir/mode/xml/xml",
        "CMDir/mode/javascript/javascript",
        "CMDir/mode/htmlmixed/htmlmixed",
        
//        "http://ajax.aspnetcdn.com/ajax/jshint/r07/jshint.js",
//        "https://rawgithub.com/zaach/jsonlint/79b553fb65c192add9066da64043458981b3972b/lib/jsonlint.js",
//        "https://rawgithub.com/stubbornella/csslint/master/release/csslint.js",
//        "CMDir/addon/lint/lint",
//        "CMDir/addon/lint/javascript-lint",
//        "CMDir/addon/lint/json-lint",
//        "CMDir/addon/lint/css-lint",
        
        "css!CMDir/lib/codemirror",
        "css!CMDir/theme/cobalt",
        "css!CMDir/theme/eclipse",
        "css!CMDir/theme/mdn-like",
        "css!CMDir/theme/neat",
        "css!CMDir/theme/neo",
        "css!CMDir/theme/rubyblue",
        "css!CMDir/theme/solarized",
        "css!CMDir/addon/hint/show-hint",
        "css!CMDir/addon/fold/foldgutter"
//        ,
//        "css!CMDir/addon/lint/lint"
        ],function($, Util,CodeMirror){     

    var exampleInit = function($compile, $scope, sourceUrl, docUrl,slideWidth){
    	var editor;
    	require([ "text!" + sourceUrl ], function(source) {
            //把source添加到模板中
            document.getElementById("exampleSource").value = source;
            //初始化代码编辑面板
            editor = CodeMirror.fromTextArea(document.getElementById("exampleSource"), {
                theme:"eclipse",
                mode:"htmlmixed",
                lineWrapping:true,          //是否显示scroll
                lineNumbers: true,          //是否显示number
                viewportMargin: Infinity,
                styleActiveLine: true,
                matchBrackets: true,
                matchTags: {bothTags: true},
                foldGutter: true,
//                lint: true,
                gutters: ["CodeMirror-linenumbers", 
                          "CodeMirror-foldgutter",
                          "CodeMirror-lint-markers"],
                extraKeys: {
                	"Alt-/": "autocomplete",
                	"Ctrl-J": "toMatchingTag",
                	"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }
                }
                
            });
            $scope.runJS = function(){
                var link = editor ? $compile(editor.getValue()) : "编辑区域未能正常初始化！";
                $("#exampleInstance").empty().html(link($scope));
            };
            $scope.$digest();
            
            $scope.runJS();
        });
        $scope.showAPI = function() {
            Util.slidebar({
                url : docUrl,
                width : slideWidth || "800px"
            });
        };
        $scope.helpInfo=function(){
        	$("#noticeDiv").css("display","block");
        	showHelpInfo();
        };
        $scope.selectTheme=function(theme){
        	editor ? editor.setOption("theme", theme) : "";
        };

        //自动隐藏提示信息
        (function showHelpInfo(){
            var timeId = setTimeout(function(){
                $("#noticeDiv").css("display","none");
                clearTimeout(timeId);
            },3000);
        })();

        //滚动条美化
        /*require(["Scroll"],function(Scroll){
            $("div[class='cs-example-source']").slimScroll();
        })*/
    };

    return {
        "exampleInit":exampleInit
    }
});