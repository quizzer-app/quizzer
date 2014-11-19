'use strict';

var gulp = require('gulp'),
  pak = require('../package.json'),
  browserSync = require('browser-sync');

var reload = browserSync.reload;
// --------------------------------------------------------
// Send external libs to lib
// --------------------------------------------------------

(function (scope) {

  gulp.task('lib:dev', function () {
    return copyBowerComponentsToLib('dev')
  });

  gulp.task('p-lib:dev:reload', function () {
    return copyBowerComponentsToLib('dev')
      .pipe(reload({stream: true, once: true}));
  });

  gulp.task('lib:package', function () {
    return copyBowerComponentsToLib('prod')
  });

  var copyBowerComponentsToLib = function (env) {
    var src = ['lib/.bower_components/**/*.{css,js,html,swf}*'];
    var dest = env === 'dev' ? pak.tmpDir : pak.distDir;
    return gulp.src(src)
      .pipe(gulp.dest(dest + '/lib'));
  }.bind(scope);

})
(this);

