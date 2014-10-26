var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// browsersync
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// critical css
var critical = require('critical');

// rework plugins
var myth = require('myth');
var palette = require('rework-palette');
var imprt = require('rework-import');

// data
var projects = require('./config/projects.json');

var config = {
    src: './src',
    dest: './dist',
    mainCssFile: '/styles/main.css',
    isProd: process.env.NODE_ENV === 'production'
};

gulp.task('help', $.taskListing.withFilters(null, function (task) {
    var excludes = ['default', 'help', 'browserSync'];
    return excludes.indexOf(task) > -1;
}));

gulp.task('build:css', function () {
    return gulp.src(config.src + config.mainCssFile)
        .pipe($.rework(
            imprt(),
            palette(),
            myth(),
            { sourcemap: !config.isProd }))
        .pipe(gulp.dest(config.dest))
        .pipe(reload({ stream: true }));
});

gulp.task('build:html', function () {
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

gulp.task('browserSync', ['build'], function () {
    browserSync({
        server: {
            baseDir: './build'
        }
    });
});

gulp.task('deploy:critical', ['build'], function (done) {
    critical.generateInline({
        base: config.dest,
        src: 'index.html',
        styleTarget: 'main.css',
        htmlTarget: 'index.html',
        minify: true
    }, done);
});

gulp.task('deploy:minifyHTML', ['deploy:critical'], function () {
    return gulp.src(config.dest + '/*.html')
        .pipe($.minifyHtml())
        .pipe(gulp.dest(config.dest))
        .pipe($.size());
});

gulp.task('default', ['help']);
gulp.task('build', ['build:html', 'build:css']);
gulp.task('deploy', ['deploy:critical', 'deploy:minifyHTML']);

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.src + '/**/*.jade', ['build:html']);
    gulp.watch(config.src + '/**/*.css', ['build:css']);
});
