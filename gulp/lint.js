'use strict';

var gulp = require('gulp'),
  pak = require('../package.json'),
  $ = require('gulp-load-plugins')(),
  stylishReporter = require('jshint-stylish');
// --------------------------------------------------------
// Lint JavaScript
// --------------------------------------------------------

(function (scope) {

  gulp.task('jshint', function () {
    return jshint();
  });

  gulp.task('jshint:breaking', function () {
    return true;
    return jshint()
      .pipe($.jshint.reporter('fail'));
  });

  var jshint = function () {
    return gulp.src('app/**/*.js')
    //.pipe($.jshint())
    //.pipe($.jshint.reporter(stylishReporter))
  }.bind(scope);

})(this);
