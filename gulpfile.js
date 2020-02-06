var gulp = require('gulp');
var concat = require('gulp-concat'); //合并文件
var rename = require('gulp-rename'); //文件重命名
var uglify = require('gulp-uglify'); //js压缩

/**
 * 压缩js(css压缩原理类同)
 * 解压文件路径： ['./src/index.js'] js多个文件进行压缩
 * 解出文件路径： ./js
 */

let pathList = ['./babel/*.js', './babel/*/*.js', './babel/*/*/*.js']
gulp.task('minifyjs', function() {
  var options = {
    mangle: false
  }
  return gulp.src(pathList) //压缩多个文件
      .pipe(uglify(options))  //压缩
      .pipe(gulp.dest('./minjs')); //输出
});