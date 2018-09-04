var gulp = require('gulp'),

    clean = require('gulp-clean'),
    runSequence = require('run-sequence'), // 任务顺序执行

    htmlmin = require('gulp-htmlmin'), // 压缩html

    autoprefix = require('gulp-autoprefixer'), // css3前缀
    minifyCSS = require('gulp-minify-css'), // 压缩css

    uglify = require('gulp-uglify'), // 压缩js

    imagemin = require('gulp-imagemin'), // 压缩图片

    rev = require('gulp-rev'), // 生成MD5戳
    revCollector = require('gulp-rev-collector') // 将html文件中的js、css替换成带有MD5戳的文件

//当前任务存在任务依赖，必须将任务return 返回一个标记，才好控制异步流程


// 删除掉上一次构建时创建的资源
gulp.task('clean', function() {
    return gulp.src(['./dist/pages/*.html', './dist/css/*.css', './dist/js/*.js', './dist/images/*', './rev/*'])
        .pipe(clean())
})

gulp.task('htmlmin', function() {
    var options = {
        removeComments: true, //清除HTML注释
        collapseWhitespace: true, //压缩HTML
        collapseBooleanAttributes: true, //省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };
    gulp.src('./webapp/pages/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest('./dist/pages'));
});

// 压缩js,生成时间戳
gulp.task('js', function() {
    return gulp.src('./webapp/js/*.js')
        .pipe(uglify()) // 压缩js
        .pipe(rev()) // 生成MD5
        .pipe(gulp.dest('./dist/js')) //输出压缩生成时间戳后的js文件
        .pipe(rev.manifest({ merge: true })) //生成rev.json文件
        .pipe(gulp.dest('./rev/js')) //输出json文件
})

// 压缩css，生成时间戳
gulp.task('style', function() {
    return gulp.src('./webapp/css/*.css')
        // .pipe(autoprefix())
        .pipe(minifyCSS()) //压缩css
        .pipe(rev()) //生成MD5戳
        .pipe(gulp.dest('./dist/css')) //输出压缩生成时间戳后的css文件
        .pipe(rev.manifest({ merge: true })) //生成rev.json文件
        .pipe(gulp.dest('./rev/css')) //输出json文件
})

// 压缩图片
gulp.task('image', function() {
    return gulp.src('./webapp/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'))
});

// 不需要改变的文件
gulp.task('static', function() {
    return gulp.src(["./webapp/META-INF", "./webapp/resource", "./webapp/WEB-INF","./webapp/index.html"])
        .pipe(gulp.dest('./dist/'))
})

// 替换文件
gulp.task('pagePath', function() {
    return gulp.src(["./rev/**/*.json", "./dist/pages/*.html"])
        .pipe(revCollector()) //将html文件中的js，css文件替换成压缩生成MD5戳的js、css文件
        .pipe(gulp.dest('./dist/pages'))
})




gulp.task('default', function() {
    runSequence('clean', ['htmlmin', 'js', 'style', 'image'], 'static', 'pagePath');
})