var gulp = require('gulp'),
    rename = require('gulp-rename'),        // 重命名
    minifycss = require('gulp-minify-css'), // CSS压缩
    uglify = require('gulp-uglify'),        //js压缩
    browserSync = require("browser-sync"),  //
    clean = require('gulp-clean');          //清空文件夹

gulp.task('default', function () {

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

// 启动 browser-sync，并绑定代理
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

// 纯前端开发模式，使用mock获取需要的数据
gulp.task("dev", ["server:mock"], function () {

});

// 完整开发模式，使用代理与服务端进行交互
gulp.task("dev-full", ["server:proxy"], function () {

});