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
    gulp.src(['static/core/hbTest/a.js'])
        .pipe(amdOptimize('a', {
            paths:{
                "hbTestDir":"static/core/hbTest"
            },
            //configFile : "static/main.js",
            findNestedDependencies:true
        }))
        /*.pipe(amdOptimize.src("**//*orgCtrl.js", {
            configFile : "static/main.js"
        }))*/
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest("static/core/hbTest"));

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