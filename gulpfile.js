var gulp = require('gulp');
var rjs = require('requirejs');
gulp.task('build', function(cb){
    rjs.optimize({
        appDir: 'static',
        baseUrl: './',
        paths: {
            "OrgDir":"core/system/org",
            "jquery":"modules/jquery/jquery-2.1.3.min",
            "UtilDir":"modules/util",
            "WebUploader":"modules/webuploader/webuploader.min",
            "WebUploaderCss":"modules/webuploader/css/webuploader",
            "ZTree":"modules/zTree/js/jquery.ztree.all-3.5.min",
            "ZTreeCss":"modules/zTree/css/zTreeStyle/zTreeStyle"
        },
        shim:{
            "Bootstrap":["jquery"],
            "Ace-extra":{},
            "Angular":{"exports":"angular"},
            "Angular-route":['Angular'],
            "ZTree":["jquery"],
            "DateCN":["Date"],
            "JQuery.validate.extra":["JQuery.validate"],
            "JQuery.validate.message":["JQuery.validate"],
            "Uploader":["WebUploader"],
            "FloatTouch":["jquery"]
        },
        map:{
            '*':{
                'css': 'modules/requirejs/plugin/require-css/css.min',
                'text':'modules/requirejs/plugin/text'
            }
        },
        dir: 'dist',
        modules: [
            {
                name: 'PDOrgDir/orgCtrl',
                exclude: [
                    "jquery",
                    "PDUtilDir/util",
                    "PDUtilDir/grid",
                    "PDUtilDir/dialog",
                    "PDUtilDir/org/orgSelect",
                    "ZTree",
                    "css!ZTreeCss",
                    "WebUploader",
                    "css!WebUploaderCss"
                ]
            }
        ],
        findNestedDependencies:true,
        fileExclusionRegExp: /^(r|build)\.js$/,
        removeCombined: true
    }, function(buildResponse){
        // console.log('build response', buildResponse);
        cb();
    }, cb);
});




//静态模板开发

var browserSync = require("browser-sync");
var reload = browserSync.reload;
function browerInit(prism){
    browserSync({
        server: {
            baseDir: "../",
            middleware: [
                prism.middleware
            ]
        }
    });
}

gulp.task("server:mock", function () {
    var prism = require("connect-prism");

    prism.create({
        name: "APIServer",
        mode: "mock",
        context: "/sword",
        host: "127.0.0.1",
        port: "8080",
        mockFilenameGenerator: "humanReadable"
    });
    browerInit(prism)
});

//启动browser-sync,并绑定代理
gulp.task("server:proxy", function () {
    var prism = require("connect-prism");

    prism.create({
        name: "APIServer",
        context: "/",
        host: "127.0.0.1",
        port: "8080"
    });
    browerInit(prism)
});

gulp.task("reload",function(){
    gulp.src('**/*.html')
        .pipe(reload({stream:true}));
});

// 纯前端开发模式，使用mock获取需要的数据
gulp.task("dev", ["server:mock"], function () {
    gulp.watch("**/*.html",["reload"])
});


// 完整开发模式，使用代理与服务端进行交互
gulp.task("dev-full", ["server:proxy"], function () {

});