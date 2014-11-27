var gulp = require('gulp');
var browserSync = require('browser-sync');

gulp.task('browserSync', ['build'], function () {

    browserSync({
        logLevel: 'silent',
        logConnections: false,
        server: {
            baseDir: config.dest,
        }
    });

});
