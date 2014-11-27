var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var reload = require('browser-sync').reload;

var config = require('../../config');

gulp.task('build:jade', function () {

    return gulp.src(config.jade.src)
        .pipe($.jade({
            locals: config.jade.locals,
            pretty: true
        }))
        .pipe(gulp.dest(config.jade.dest))
        .pipe(reload({ stream: true }));

});
