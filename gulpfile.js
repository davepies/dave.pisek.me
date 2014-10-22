var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var reload = browserSync.reload;

var projects = require('./config/projects.json');

var config = {
    src: './src',
    dest: './build',
    isProd: process.env.NODE_ENV === 'production'
};

gulp.task('browserSync', ['jade'], function () {
    browserSync({
        server: {
            baseDir: './build'
        }
    });
});

gulp.task('jade', function () {
    return gulp.src(config.src + '/*.jade')
        .pipe($.jade({
            locals: {
                welcome: 'hello',
                projects: projects
            },
            pretty: !config.isProd
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(reload({ stream: true }));
});

gulp.task('default', function () {
    gulp.run('jade');
});

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.src + '/**/*.jade', ['jade']);
});
