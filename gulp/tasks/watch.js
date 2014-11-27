var gulp = require('gulp');

var config = require('../config');

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.src + '/**/*.jade', ['build:jade']);
    gulp.watch(config.src + '/**/*.css', ['build:css']);
    gulp.watch(config.src + '/**/*.js', ['build:js']);
});
