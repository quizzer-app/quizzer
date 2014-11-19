'use strict';

var gulp = require('gulp'),
  pak = require('../package.json'),
  browserSync = require('browser-sync');

var reload = browserSync.reload;
// --------------------------------------------------------
// Send html to pak.tmpDir
// --------------------------------------------------------

(function (scope) {

  gulp.task('html:dev', function () {
    return htmlDev();
  });

  gulp.task('p-html:dev:reload', ['p-images:dev:reload', 'p-public:dev:reload'], function () {
    return htmlDev()
      .pipe(reload({stream: true, once: true}));
  });

  var htmlDev = function () {
    return gulp.src([
      'app/**/*.html',
      'app/**/*.js',
      'app/**/*.json',
      'app/**/*.css'])
      .pipe(gulp.dest(pak.tmpDir));
  };

})(this);
