'use strict';

var gulp = require('gulp'),
  pak = require('../package.json'),
  rimraf = require('rimraf');
// --------------------------------------------------------
// Clean Output Directory
// --------------------------------------------------------

(function (scope) {

  gulp.task('clean:vulcanizedDir', function (cb) {
    rimraf(pak.vulcanizedDir, cb);
  });
  gulp.task('clean:distDir', function (cb) {
    rimraf(pak.distDir, cb);
  });
  gulp.task('clean:tmpDir', function (cb) {
    rimraf(pak.tmpDir, cb);
  });
  gulp.task('clean', ['clean:tmpDir', 'clean:distDir', 'clean:vulcanizedDir']);

})(this);
