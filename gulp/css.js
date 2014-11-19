'use strict';

var gulp = require('gulp'),
  path = require('path'),
  pak = require('../package.json'),
  browserSync = require('browser-sync'),
  $ = require('gulp-load-plugins')();


var reload = browserSync.reload;

var sizeOf = function (stream, title) {
  return stream
    .pipe($.size({title: title}));
};
// --------------------------------------------------------
// Build Css
// --------------------------------------------------------

(function (scope) {

  gulp.task('styles:dev', function () {
    return sizeOf(stylesBuild()
      , 'styles:dev');
  });

  gulp.task('p-styles:dev:reload', function () {
    return sizeOf(stylesBuild()
        .pipe($.filter('**/*.css')) // Filtering stream to only css files
        .pipe(reload({stream: true, once: true}))
      , 'styles:dev');
  });

  gulp.task('styles:package', function () {
    return scope.htmlPackage(['p-styles:package:now']);
  })

  gulp.task('p-styles:package:now', function () {
    var htmlFiles = [];
    glob(pak.tmpDir + '/**/*.html', function (er, filesArray) {
      var file = "";
      for (var i = 0; i < filesArray.length; i++) {
        file = filesArray[i];
        if (!file.match(new RegExp('^' + pak.distDir + '/lib')))
          htmlFiles.push(filesArray[i]);
      }
    })
    // uncss and minify used css in pak.distDir
    return gulp.src(pak.distDir + '/styles/**/*.css', {base: pak.distDir + '/'})
      .pipe($.uncss({html: htmlFiles}))
      .pipe($.csso())
      .pipe(gulp.dest(pak.distDir))
  });

  // Compile all other css && sass Files
  var stylesBuild = function () {
    return gulp.src(['app/styles/**/*.{css,scss,sass}'])
      .pipe($.if(function (file) {
        var ext = path.extname(file.path);
        return ext !== '.css';
      }, $.rubySass({
        style: 'expanded',
        precision: 10,
        loadPath: ['app/styles']
      })))
      .pipe($.autoprefixer('last 1 version'))
      .pipe(gulp.dest(pak.tmpDir + '/styles'))
  }.bind(scope);

})(this);
