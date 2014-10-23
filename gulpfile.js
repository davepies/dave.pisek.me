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

gulp.task('help', $.taskListing.withFilters(null, function (task) {
    var excludes = ['default', 'help', 'browserSync'];
    return excludes.indexOf(task) > -1;
}));

gulp.task('browserSync', ['build'], function () {
    browserSync({
        server: {
            baseDir: './build'
        }
    });
});

gulp.task('build:jade', function () {
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

gulp.task('build', ['build:jade']);
gulp.task('default', ['help']);

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.src + '/**/*.jade', ['jade']);
});
