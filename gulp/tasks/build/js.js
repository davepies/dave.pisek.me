var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserify = require('browserify');
var transform = require('vinyl-transform');

// hint reporter
var stylish = require('jshint-stylish');

var reload = require('browser-sync').reload;

var config = require('../../config');

gulp.task('build:js', function () {

    var browserified = transform(function (filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src(config.js.src)
        .pipe($.plumber())
        // run jshint on raw files
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish))
        // only perform browserify on entry point js
        .pipe($.filter([config.js.browserifyEntry]))
        .pipe(browserified)
        .pipe($.if(config.isProd, $.uglify()))
        .pipe(gulp.dest(config.js.dest))
        .pipe($.size())
        .pipe(reload({ stream: true }));

});
