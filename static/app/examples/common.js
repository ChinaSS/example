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
        "CMDir/addon/scroll/simplescrollbars",
        
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
        "css!CMDir/addon/fold/foldgutter",
        "css!CMDir/addon/scroll/simplescrollbars"
//        ,
//        "css!CMDir/addon/lint/lint"
        ],function($, Util,CodeMirror){     

    var exampleInit = function($compile, $scope, sourceUrl, docUrl,slideWidth){
    	var editor;
    	var $noticeDiv=$("#noticeDiv");
    	var flag=true;  //  初始化加载
    	//  默认提示信息
    	var defaultInfo="<strong>Notice!</strong>" +
						"<p>Try \"<strong>Alt+/</strong>\" to Auto Complete, " +
						"support CSS\Javascript\Html! " +
						"(支持Css、Javascript、Html的代码提示和自动补全)<br/>  	" +
						"Try \"<strong>Ctrl+J</strong>\" to Jump to the tag " +
						"mathing the one under the cursor! (寻找匹配标签中另一半标签的位置。)<br/>  	" +
						"Try \"<strong>Ctrl+Q</strong>\" to Toggle folding code! " +
						"(可以快速切换是否收缩代码。)<br/></p>";
    	//  提交成功提示信息
    	var successInfo="<strong>Submit Successful!</strong>";
    	
    	//  增加对well样式的横排支持
    	var wellUpdateCss="<!-- 下面的样式请勿修改！ -->" +
    			"<script type=\"text/javascript\">" +
    			"require([\"jquery\"], function($) {" +
    			"$(\".well\").attr(\"style\", \"display: inline-flex; width: 100%;\");" +
    			"});</script>";
    	
    	require([ "text!" + sourceUrl ], function(source) {
            //把source添加到模板中
            document.getElementById("exampleSource").value = source;
            //初始化代码编辑面板
            editor = CodeMirror.fromTextArea(document.getElementById("exampleSource"), {
                theme:"eclipse",
                mode:"htmlmixed",
                lineWrapping:true,          //	是否显示scroll
                lineNumbers: true,          //	是否显示number
                maxHighlightLength:Infinity,//  最大化代码高亮行长度，默认是10000
                viewportMargin: Infinity,   //	视窗最大化
                styleActiveLine: true,      //	是否开启活动行高亮
                matchBrackets: true,		//	是否开启括号匹配
                matchTags: {bothTags: true},//	开启全标签匹配
                foldGutter: true,			//	开启代码收缩
//                lint: true,				//	开启代码查错，但是不支持html、css、javascript混编
                scrollbarStyle:"overlay",    //  替换滚动条样式 overlay、simple
                //	行号集成显示的类型
                gutters: ["CodeMirror-linenumbers", 
                          "CodeMirror-foldgutter",
                          "CodeMirror-lint-markers"],	
                //	扩展支持的快捷键
                extraKeys: {
                	"Alt-/": "autocomplete",
                	"Ctrl-J": "toMatchingTag",
                	"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }
                }
                
            });
            $scope.runJS = function(){
            	if(!flag){
            		showHelpInfo($noticeDiv,successInfo,"alert-success",3000);
            	}
                var link = editor ? $compile(editor.getValue()+wellUpdateCss) : "编辑区域未能正常初始化！";
                $("#exampleInstance").empty().html(link($scope));
            };
            $scope.$digest();
            
            $scope.runJS();
            flag=false;   //  关闭初始化加载的flag
        });
    	//  加载api
        $scope.showAPI = function() {
            Util.slidebar({
                url : docUrl,
                width : slideWidth || "800px"
            });
        };
        //   默认提示信息
        $scope.helpInfo=function(){
        	showHelpInfo($noticeDiv,defaultInfo,"alert-info");
        	$noticeDiv.mouseenter(function(){
        		$noticeDiv.clearQueue();
        	});
        	$noticeDiv.mouseleave(function(){
        		$noticeDiv.fadeOut("normal");
        	});
        	
        }
        //   选择主题
        $scope.selectTheme=function(theme){
        	editor ? editor.setOption("theme", theme) : "";
        }
        
        showHelpInfo($noticeDiv,defaultInfo,"alert-info",3500);
        
        //   显示提示信息，并自动隐藏
        function showHelpInfo($div,info,cssClass,delay){
        	var delayint=delay?delay:3500;
        	$div.clearQueue();
        	$div.empty().html(function(i,text){
        		$div.removeClass();
        		$div.addClass("alert");
        		$div.addClass(cssClass);
        		$div.fadeIn("normal");
        		return info;
    		});
        	$div.delay(delayint).fadeOut("normal");
        }

    };

    return {
        "exampleInit":exampleInit
    }
});

