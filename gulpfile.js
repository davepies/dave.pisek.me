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
var pureGrids = require('rework-pure-grids');

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
                pureGrids.units({
                    mediaQueries: {
                        sm  : 'screen and (min-width: 30em)',
                        med : 'screen and (min-width: 48em)',
                        lrg : 'screen and (min-width: 64em)',
                        xlrg: 'screen and (min-width: 75em)'
                    },
                    selectorPrefix: '.dp-'
                }),
                imprt(),
                palette(),
                myth(),
                { sourcemap: !config.isProd }
            )
        )
        .pipe($.if(config.isProd, $.csso()))
        .pipe(gulp.dest(config.dest))
        .pipe($.size({ gzip: true }))
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

gulp.task('build:js', function () {
    return gulp.src(config.src + '/scripts/*.js')
        .pipe(gulp.dest(config.dest));
});

gulp.task('browserSync', ['build'], function () {
    browserSync({
        server: {
            baseDir: config.dest
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
        .pipe($.size({ gzip: true }));
});

gulp.task('default', ['help']);
gulp.task('build', ['build:html', 'build:css', 'build:js']);
gulp.task('deploy', ['deploy:critical', 'deploy:minifyHTML']);

gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.src + '/**/*.jade', ['build:html']);
    gulp.watch(config.src + '/**/*.css', ['build:css']);
    gulp.watch(config.src + '/**/*.js', ['build:js']);
});
