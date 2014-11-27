var gulp = require('gulp');
var browserSync = require('browser-sync');

var config = require('../config');

gulp.task('browserSync', ['build'], function () {

    browserSync({
        logLevel: 'silent',
        logConnections: false,
        server: {
            baseDir: config.dest,
        }
    });

});
