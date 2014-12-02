'use strict';

var gulp = require('gulp'),
  pak = require('../package.json'),
  $ = require('gulp-load-plugins')(),
  browserSync = require('browser-sync'),
  path = require('path'),
  glob = require('glob');

var reload = browserSync.reload;

var sizeOf = function (stream, title) {
  return stream
    .pipe($.size({title: title}));
};

// --------------------------------------------------------
// Build JavaScript
// --------------------------------------------------------

(function (scope) {

  gulp.task('app:dev', ['jshint:breaking'], function () {
    return sizeOf(scriptsBrowserify('dev'), 'app:dev');
  });

  gulp.task('p-app:dev:reload', ['jshint'], function () {
    return sizeOf(
      scriptsBrowserify('dev')
        .pipe(reload({stream: true, once: true}))
      , 'app:dev');
  });

  gulp.task('p-app:pre:package', ['jshint:breaking'], function () {
    return sizeOf(scriptsBrowserify('prod'), 'app:pre:package');
  });

  gulp.task('app:package', ['jshint:breaking'], function () {
    return scope.htmlPackage(['p-app:package:now']);
  })

  gulp.task('p-app:package:now', function () {
    var jsBundles = [pak.distDir + '/app/quizzer.min.js'];
    glob(pak.distDir + '/app/**/*-b.js', function (er, filesArray) {
      for (var i = 0; i < filesArray.length; i++) {
        jsBundles.push(filesArray[i]);
      }
    })

    for (var i = 0; i < jsBundles.length; i++) {
      // FIXME
      // inelegant way of returning something
      // for run-sequence - we return the last one
      // as we want to iterate over each found path
      // to retrieve filename and pass it to closure compiler
      if (i < jsBundles - 1) {
        compileJS(jsBundles[i]);
      } else {
        return compileJS(jsBundles[i]);
      }
    }
  });

  var scriptsBrowserify = function (env) {
    var jsBundles = ['app/app/quizzer.js'];
    glob('app/app/**/*-b.js', function (er, filesArray) {
      for (var i = 0; i < filesArray.length; i++) {
        jsBundles.push(filesArray[i]);
      }
    })
    // Single point of entry (make sure not to src ALL your files, browserify will figure it out)
    return gulp.src(jsBundles)
      .pipe($.browserify({
        insertGlobals: env === 'prod' ? false : true,
        debug: false
      }))

      // Preprocess
      .pipe($.preprocess({context: {ENV: env}}))

      // Output it to tmp folder
      .pipe(gulp.dest(pak.tmpDir + '/app'))
  }.bind(scope);

  var compileJS = function (filepath) {
    var currentFilename = path.basename(filepath, path.extname(filepath));
    return gulp.src(filepath)
      .pipe($.stripDebug())
      .pipe($.closureCompiler({
        compilerPath: 'lib/.bower_components/closure-compiler/compiler.jar',
        fileName: currentFilename + '.js',
        compilerFlags: {
          warning_level: 'QUIET'
          //, language_in      : 'ECMASCRIPT5_STRICT'
        }
      }))
      .pipe(gulp.dest(pak.distDir + '/app'))
      .pipe($.zopfli())
      .pipe(gulp.dest(pak.distDir + '/app'))
  }.bind(scope);

})(this);

// --------------------------------------------------------
// Build Images
// --------------------------------------------------------

(function (scope) {

  gulp.task('images:dev', function () {
    return sizeOf(imagesSymlink()
      , 'images:dev');
  });

  gulp.task('p-images:dev:reload', function () {
    return sizeOf(imagesSymlink()
        .pipe(reload({stream: true, once: true}))
      , 'images:dev');
  });

  gulp.task('images:package', function () {
    return sizeOf(imagesPackage()
      , 'images:package');
  });

  var imagesSymlink = function () {
    return gulp.src(['app/images/**/*', '!app/images/*.svg'])
      .pipe($.symlink(pak.tmpDir + '/images'));
  }.bind(scope);

  var imagesPackage = function () {
    return gulp.src('app/images/**/*')
      .pipe($.cache($.imagemin({
        progressive: true,
        interlaced: true
      })))
      .pipe(gulp.dest(pak.distDir + '/images'));
  }.bind(scope);

})(this);

// --------------------------------------------------------
// Build Public folder
// --------------------------------------------------------

(function (scope) {

  gulp.task('public:dev', function () {
    return sizeOf(publicSymlink()
      , 'public:dev');
  });

  gulp.task('p-public:dev:reload', function () {
    return sizeOf(publicSymlink()
        .pipe(reload({stream: true, once: true}))
      , 'public:dev');
  });

  gulp.task('public:package', function () {
    return sizeOf(publicPackage()
      , 'public:package');
  });

  var publicSymlink = function () {
    return gulp.src('app/public/**/*')
      .pipe($.symlink(pak.tmpDir + '/public'));
  }.bind(scope);
  ;

  var publicPackage = function () {
    return gulp.src('app/public/**/*')
      .pipe(gulp.dest(pak.distDir + '/public'));
  }.bind(scope);

})(this);
