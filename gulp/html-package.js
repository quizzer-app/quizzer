'use strict';

var gulp = require('gulp'),
  pak = require('../package.json'),
  path = require('path'),
  runSequence = require('run-sequence');
// --------------------------------------------------------
// Package html and used css / js
// --------------------------------------------------------

(function (scope) {

  scope.htmlPackage = function () {

    // *inelegant*
    // We want to use useref parse html and
    // build only assets (css, js) needed in prod
    // into pak.distDir
    // Useref will basically build/copy assets based
    // on prebuilt assets in pak.tmpDir
    // What if we need to prebuild assets differently
    // for prod and dev (ex with browserify being passed
    // different params in dev and prod).
    // What we do here is prebuilding assets with a prod
    // flag instead of dev
    // Then we execute useref
    // And when we are done we reprebuild everything
    // for dev so that there is no surprise to find prod
    // assets in pak.tmpDir when in development
    // NB: Once we have executed useref, we have the correct
    // in pak.pak.distDir and we are not dependent of files in pak.tmpDir for
    // further build steps
    runSequence(
      'p-assets:prepare:package',
      ['p-html:package:now', 'lib:package'],
      arguments[0] || 'p-dummy-do:nothing',
      arguments[1] || 'p-dummy-do:nothing',
      arguments[2] || 'p-dummy-do:nothing',
      arguments[3] || 'p-dummy-do:nothing',
      function () {
        return gulp.start('p-assets:prepare:dev');
      }
    );
  };

  gulp.task('p-html:package:now', function () {
    return gulp.src(pak.tmpDir + '/**/*.html')
      .pipe($.useref.assets({searchPath: pak.tmpDir}))
      .pipe($.useref.restore())
      .pipe($.useref())
      // Minify HTML
      .pipe($.if(function (file) {
        var ext = path.extname(file.path);
        return ext !== '.js' && ext !== '.css';
      }, $.minifyHtml()))
      // output
      .pipe(gulp.dest(pak.distDir))
      .pipe($.size({title: 'html'}));
  });

  gulp.task('p-assets:prepare:dev', ['html:dev', 'styles:dev', 'images:dev', 'public:dev', 'lib:dev',
      'app:dev'],
    function () {
      return true;
    }
  );

  gulp.task('p-assets:prepare:package', ['html:dev', 'styles:dev', 'images:dev', 'public:dev', 'lib:dev',
    'p-app:pre:package'], function () {
    return gulp.start('p-app:pre:package');
  });

  gulp.task('p-dummy-do:nothing');

})(this);
