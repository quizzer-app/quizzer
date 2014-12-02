'use strict';

var gulp = require('gulp'),
  pak = require('../package.json'),
  browserSync = require('browser-sync');

var reload = browserSync.reload;

// --------------------------------------------------------
// Create server, Watch Files For Changes & Reload
// --------------------------------------------------------

(function (scope) {

  gulp.task('serve', ['p-assets:prepare:dev'], function () {
    browserSync.init(null, {
      startPath: '/quizzer.html?offline=1&test=1',
      server: {
        baseDir: [pak.tmpDir]
      },
      notify: false
    });

    gulp.watch(['app/**/*.html'], ['p-html:dev:reload']);
    gulp.watch(['app/**/*.{css,scss,sass}'], ['p-styles:dev:reload', 'p-assets:prepare:dev']);
    gulp.watch(['app/**/*.js'], ['p-app:dev:reload']);
    gulp.watch(['app/**/*.json'], ['p-app:dev:reload']);
    gulp.watch(['app/images/**/*.*'], ['p-images:dev:reload']);
    gulp.watch(['app/public/**/*.*'], ['p-public:dev:reload']);
    gulp.watch(['lib/.bower_components/**/*.{css,js,html}'], ['p-lib:dev:reload']);
  });

})(this);
