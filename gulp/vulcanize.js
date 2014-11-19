'use strict';

var gulp = require('gulp'),
  pak = require('../package.json'),
  vulcanizedDirBase = 'raw',
  vulcanizedDirInline = 'inline',
  vulcanizedDirCsp = 'csp',
  runSequence = require('run-sequence');
// --------------------------------------------------------
// Build Prod files & Vulcanized Polymer
// --------------------------------------------------------

(function (scope) {

  gulp.task('default', ['clean'], function () {
    runSequence(
      ['vulcanize', 'p-copy-bower-to-dist']
    );
  });

  gulp.task('p-copy-bower-to-dist', function () {
    return gulp.src('bower.json')
      .pipe(gulp.dest(pak.distDir + '/'));
  });

  var assetsPackageTasks = [
    'p-styles:package:now',
    'p-app:package:now',
    'images:package',
    'public:package',
    'lib:package'
  ];

  var destDir = pak.distDir + '/' + pak.vulcanizedDir + '/';

  gulp.task('vulcanize', ['clean:vulcanizedDir'], function () {
    return scope.htmlPackage(
      assetsPackageTasks,
      'vulcanize:inline:now',
      'vulcanize:base:now',
      'vulcanize:csp:now'
    );
  });

  // vulcanize in inline mode
  gulp.task('vulcanize:inline', function () {
    return scope.htmlPackage(
      assetsPackageTasks,
      'vulcanize:inline:now'
    );
  });

  gulp.task('vulcanize:inline:now', function () {
    return gulp.src(pak.distDir + '/quizzer.html', {base: pak.distDir + '/'})
      .pipe($.vulcanize({
        dest: destDir + vulcanizedDirInline + '/',
        inline: true
      }));
  });

  // vulcanize in csp mode
  gulp.task('vulcanize:csp', function () {
    return scope.htmlPackage(
      assetsPackageTasks,
      'vulcanize:csp:now'
    );
  });

  gulp.task('vulcanize:csp:now', function () {
    return vulcanizeWithExternalScriptsAndStyles({
      dest: destDir + vulcanizedDirCsp + '/',
      csp: true
    });
  });

  // vulcanize in standard mode
  gulp.task('vulcanize:base', function () {
    return scope.htmlPackage(
      assetsPackageTasks,
      'vulcanize:base:now'
    );
  });

  gulp.task('vulcanize:base:now', function () {
    return vulcanizeWithExternalScriptsAndStyles({
      dest: destDir + vulcanizedDirBase + '/'
    });
  });

  var vulcanizeWithExternalScriptsAndStyles = function (vulcanizeOptions) {
    return gulp.src(pak.tmpDir + '/quizzer.html')
      // add needed css and js
      .pipe($.useref.assets({searchPath: pak.tmpDir}))
      .pipe($.tap(function (file, t) {
        var pathS = file.path.split(new RegExp('/' + pak.tmpDir + '/'));
        var base = pathS[0] + '/' + pak.distDir + '/';
        var path = base + pathS[1];
        return gulp.src(path, {base: base})
          .pipe(gulp.dest(vulcanizeOptions.dest));
      }))
      .pipe($.useref.restore())
      .pipe($.tap(function (file, t) {
        return gulp.src(pak.distDir + '/quizzer.html', {base: pak.distDir + '/'})
          .pipe(gulp.dest(vulcanizeOptions.dest))
          .pipe($.vulcanize(vulcanizeOptions));
      }));
  };

})(this);
