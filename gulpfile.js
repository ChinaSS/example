var gulp = require('gulp'),
    rename = require('gulp-rename'),        // 重命名
    minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'),        //js压缩
    concat  = require('gulp-concat'),          //合并文件
    clean = require('gulp-clean');          //清空文件夹

var browserSync = require("browser-sync");
var reload = browserSync.reload;

/*gulp.task('default', function () {

 });*/

//压缩合并js文件
gulp.task('js', function () {
    var amdOptimize = require('amd-optimize');
    /*gulp.src(['static/app/examples/util/dialog*//*.js'])
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("static/app/examples/util/dialog"));*/
    gulp.src(['static/core/system/org/orgCtrl.js'])
        .pipe(amdOptimize('orgCtrl', {
            paths:{
                "jquery":"empty:",
                //基础模块配置
                "Bootstrap":"static/modules/bootstrap/js/bootstrap.min",
                "Ace-extra":"static/modules/ace/js/ace-extra.min",
                "Ace":"static/modules/ace/js/ace",
                "Angular":"static/modules/angular/angular.min",
                "Angular-route":"static/modules/angular/angular-route.min",
                "JQuery.validate":"static/modules/jquery/plugins/validate/jquery.validate.min",
                "JQuery.validate.extra":"static/modules/jquery/plugins/validate/additional-methods",
                "JQuery.validate.message":"static/modules/jquery/plugins/validate/localization/messages_zh",
                "ZTree":"static/modules/zTree/js/jquery.ztree.all-3.5.min",
                "WebUploader":"static/modules/webuploader/webuploader.min",
                "Cropper":"static/modules/cropper/js/cropper",
                "Date":"static/modules/bootstrap/plugins/datetimepicker/js/datetimepicker.min",
                "DateCN":"static/modules/bootstrap/plugins/datetimepicker/js/datetimepicker.cn",
                "Util":"static/modules/util/util",
                "HomeApp":"homeApp",
                /*目录地址映射*/
                "UtilDir":"static/modules/util",
                "OrgDir":"static/core/system/org",
                /*CSS文件路径映射*/
                "ZTreeCss":"static/modules/zTree/css/zTreeStyle/zTreeStyle",
                "WebUploaderCss":"static/modules/webuploader/css/webuploader",
                "CropperCss":"static/modules/cropper/css/cropper.min",
                "DateCss":"static/modules/bootstrap/plugins/datetimepicker/css/datetimepicker.min"
            },
            //configFile : "static/main.js",
            findNestedDependencies:true
        }))
        /*.pipe(amdOptimize.src("**//*orgCtrl.js", {
            configFile : "static/main.js"
        }))*/
        .pipe(concat('main-bundle.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("static/core/system/org"));

});

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
        context: "/example/v1",
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