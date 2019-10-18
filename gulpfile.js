const gulp = require('gulp');
const browserify = require('gulp-browserify');
const stripCode = require('gulp-strip-code');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

const babelConfig = {
  presets: ['es2015'],
  plugins: ['babel-plugin-transform-object-rest-spread']
};
const src = './src/vec.main.js';
const dest = './dist/';

const buildModuleFn = () => gulp
  .src(src)
  .pipe(rename('vec.module.js'))
  .pipe(
    stripCode({
      start_comment: 'start window exports',
      end_comment: 'end window exports'
    })
  )
  .pipe(babel(babelConfig))
  .pipe(gulp.dest('./dist/'));

const buildWindowFn = () => gulp
  .src(src)
  .pipe(rename('vec.window.js'))
  .pipe(
    stripCode({
      start_comment: 'start exports',
      end_comment: 'end exports'
    })
  )
  .pipe(babel(babelConfig))
  .pipe(browserify())
  .pipe(gulp.dest(dest));

gulp.task('build_module', buildModuleFn);
gulp.task('build_window', buildWindowFn);
gulp.task('build_all', gulp.series([buildModuleFn, buildWindowFn]));
gulp.task('default', gulp.series([buildModuleFn, buildWindowFn]));
