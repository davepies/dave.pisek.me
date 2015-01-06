var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserify = require('browserify');
var transform = require('vinyl-transform');

// hint reporter
var stylish = require('jshint-stylish');
var reload = require('browser-sync').reload;
var config = require('../../config');

gulp.task('build:js', function () {

    // main browserify bundle
    var browserifyEntryFilter = $.filter([config.js.browserifyEntry]);
    // js that needs to be inlined
    var inlineJsFilter = $.filter([config.js.inlineFolder]);

    var browserified = transform(function (filename) {
        var b = browserify(filename, { debug: !config.isProd });
        return b.bundle();
    });

    return gulp.src(config.js.src)
        .pipe($.plumber())
        // run jshint on raw files
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish))
        // only perform browserify on entry point js
        // .pipe($.filter([config.js.browserifyEntry]))
        .pipe(browserifyEntryFilter)
        .pipe(browserified)
        .pipe($.if(config.isProd, $.uglify()))
        .pipe(gulp.dest(config.js.dest))
        .pipe(reload({ stream: true }))
        .pipe($.size())
        .pipe(browserifyEntryFilter.restore())
        .pipe(inlineJsFilter)
        .pipe($.if(config.isProd, $.uglify()))
        .pipe(gulp.dest(config.js.dest));

});
