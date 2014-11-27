var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var config = require('../../config.js');

gulp.task('deploy:minifyHTML', ['deploy:critical'], function () {

    return gulp.src(config.dest + '/*.html')
        .pipe($.minifyHtml({ loose: true, empty: true }))
        .pipe(gulp.dest(config.dest))
        .pipe($.size({ gzip: true }));

});
