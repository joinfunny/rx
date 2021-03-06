/** create by jiangfeng */
'use strict';

var del = require('del');
var shell = require('gulp-shell');
var connect = require('gulp-connect');
var Proxy = require('gulp-connect-proxy');
var livereload = require('gulp-livereload');
var replace = require('gulp-replace');
var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var md5 = require("gulp-md5-plus");
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var htmlmin = require('gulp-htmlmin');
var gulpSequence = require('gulp-sequence');
var rename = require("gulp-rename");
var sass = require('gulp-sass');
var clean = require('gulp-clean');
var concat = require('gulp-concat');

var opts = {
    mainVersion: '1.0.0', //主版本号
    allFileSrc: ['**/*.*'],
    srcDir: './public/src',
    rootPath: './public',
    buildDir: './public/dist'
};

/*gulp.task("webpack-dev-server", shell.task(['webpack-dev-server --inline --progress --colors --hot --display-error-details --content-base src/']));
gulp.task("server:dev", function () {
    //开发版80端口
    connect.server({
        root: opts.srcDir,
        port: 80,
        livereload: true,
        middleware: function (connect, opt) {
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });
    //压缩版8088端口
    connect.server({
        root: opts.buildDir,
        port: 8088,
        livereload: true,
        middleware: function (connect, opt) {
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });

});

gulp.task("webpack", shell.task(['webpack -p --progress --colors']));*/

gulp.task("lib", function () {
    return gulp.src([
            opts.srcDir + '/lib/jquery/jquery-3.1.1.js',
            opts.srcDir + '/lib/lodash/lodash.js',
            /*opts.srcDir + '/js/lib/react/react.js',
            opts.srcDir + '/js/lib/react/react-dom.js',
            opts.srcDir + '/js/lib/react/react-with-addons.js',
            opts.srcDir + '/js/lib/react/react-router.js'*/
        ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(opts.srcDir + '/lib/'));
});


gulp.task('sassfile', function () {
    return gulp.src(opts.srcDir + '/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError)).pipe(gulp.dest(opts.srcDir + '/css/'));
});

gulp.task('watchsass', function () {
    gulp.watch(opts.srcDir + '/scss/**/*.scss', ['sassfile']);
});

gulp.task('copy:js', function () {
    gulp.src([
            opts.srcDir + '/libs/*.js',
            //opts.srcDir + '/js/**/plugins/*.js'
        ])
        .pipe(gulp.dest(opts.buildDir + '/libs/'));
});

gulp.task('copy:img', function () {
    return gulp.src([
            opts.srcDir + '/**/img/**/*.*'
        ])
        .pipe(gulp.dest(opts.buildDir));
});

gulp.task('copy:css', function () {
    return gulp.src([
            opts.srcDir + '/css/**/*.css',
            opts.srcDir + '/css/**/*.eot',
            opts.srcDir + '/css/**/*.ttf',
            opts.srcDir + '/css/**/*.woff',
            opts.srcDir + '/css/**/*.woff2',
        ])
        .pipe(gulp.dest(opts.buildDir + '/css'));
});

gulp.task('copy:fonts', function () {
    return gulp.src([
            opts.srcDir + '/fonts/**/*.otf',
            opts.srcDir + '/fonts/**/*.eot',
            opts.srcDir + '/fonts/**/*.svg',
            opts.srcDir + '/fonts/**/*.ttf',
            opts.srcDir + '/fonts/**/*.woff',
            opts.srcDir + '/fonts/**/*.woff2',
        ])
        .pipe(gulp.dest(opts.buildDir + '/fonts'));
});

gulp.task('copy:html', function () {
    return gulp.src(opts.srcDir + '/**/*.html')
        .pipe(gulp.dest(opts.buildDir));
});

gulp.task('watch:html',function(){
    return gulp.src(opts.srcDir+'/**/*.html')
    .pipe(gulp.dest(opts.buildDir));
});

gulp.task("clean", function () {
    return gulp.src(opts.buildDir)
        .pipe(clean({
            read: false
        }));
});


//压缩JS--生产环境应用
gulp.task("webpack-p", shell.task(['set NODE_ENV=production&&webpack -p --progress --colors']));
//不压缩JS--测试环境应用
gulp.task("webpack-u", shell.task(['webpack --progress --colors']));

gulp.task("webpack-w", shell.task(['webpack --display-error-details --progress --colors --watch']));

gulp.task("webpack-dev-server", shell.task(['webpack-dev-server --hot --inline --content-base ./public/src --port 3000']));

gulp.task('default', ['webpack-dev-server', 'sassfile', 'watchsass']);

/**
 * 压缩构建
 */
gulp.task('build-pro', gulpSequence(
    'clean',
    'lib',
    'sassfile', ['copy:css','copy:fonts', 'copy:img', 'copy:js', 'copy:html'],
    'webpack-p'    
));

/**
 * 不压缩构建
 */
gulp.task('build-dev', gulpSequence(
    'clean',
    'lib',
    'sassfile', ['copy:css','copy:fonts', 'copy:img', 'copy:js', 'copy:html'],
    'webpack-u',
    'webpack-dev-server' //此命令式用来本地调试JS的静态服务器
));