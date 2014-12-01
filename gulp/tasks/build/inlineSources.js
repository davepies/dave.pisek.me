var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

var config = require('../../config');

gulp.task('build:inlineSources', function () {

    return gulp.src(config.dest + '/*.html')
        .pipe($.if(config.isProd, $.inlineSource()))
        .pipe(gulp.dest(config.dest))
        .pipe($.size({ gzip: true } ));
});
