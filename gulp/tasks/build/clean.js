var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var del = require('del');

var config = require('../../config');

gulp.task('build:clean', function (cb) {

    del([
        config.dest
    ], cb);

});
