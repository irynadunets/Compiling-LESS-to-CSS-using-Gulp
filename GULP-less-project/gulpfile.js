const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
let cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var gcmq = require('gulp-group-css-media-queries');
var less = require('gulp-less');

const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;
const isSync = (process.argv.indexOf('--sync') !== -1);
console.log(isDev);
console.log(isProd);
function clear(){
  return del('build/*');
}

function styles(){
  return gulp.src('./src/css/style.less')
  .pipe(gulpif(isDev, sourcemaps.init()))
  .pipe(less())
  //.pipe(concat('style.css'))
  .on('error',console.error.bind(console))
  .pipe(gcmq())
  .pipe(autoprefixer({
       overrideBrowserslist: ['>0.1%'],
       cascade: false
   }))
      .pipe(gulpif(isProd, cleanCSS({
        level: 2
      })))
      .pipe(gulpif(isDev,sourcemaps.write()))
      .pipe(gulp.dest('./build/css'))
      .pipe(gulpif(isSync, browserSync.stream()));
}

function img(){
  return gulp.src('./src/images/**/*')
      .pipe(gulp.dest('./build/images'));
}

function html(){
  return gulp.src('./src/*.html')
      .pipe(gulp.dest('./build'))
      .pipe(gulpif(isSync, browserSync.stream()));
}

function watch(){
  browserSync.init({
      server: {
          baseDir: "./build"
      }
  });

  gulp.watch('./src/css/**/*.less',styles);
  gulp.watch('./src/*.html',html);
}

let build = gulp.series(clear,
  gulp.parallel(styles,img,html)
);

gulp.task('build',build);
gulp.task('watch',gulp.series(build,watch));
