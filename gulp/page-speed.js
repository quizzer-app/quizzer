'use strict';

var gulp = require('gulp'),
  pagespeed = require('psi');
// --------------------------------------------------------
// PageSpeed
// --------------------------------------------------------

(function (scope) {

  gulp.task('pagespeed', pagespeed.bind(null, {
    // key: 'YOUR_API_KEY' // http://goo.gl/RkN0vE
    url: 'https://please.update.me',
    strategy: 'mobile'
  }));

})(this);
