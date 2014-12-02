'use strict';

var gulp = require('gulp'),
  pak = require('../package.json'),
  inject = require('gulp-inject');
// inject bower components
gulp.task('inject', function () {
// It's not necessary to read the files (will speed up things), we're only after their paths:
  return gulp.src('app/app/quizzer.html')
    .pipe(inject(gulp.src(['app/styles/**/*.css'], {read: false}), {relative: true}))
    .pipe(gulp.dest('app/app/'));
});
