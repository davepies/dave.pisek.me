///// Requires

// gulp
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
// terminal utils
var gutil = require('gulp-util');


// browsersync
var browserSync = require('browser-sync');
var reload = browserSync.reload;

// jshint
var stylish = require('jshint-stylish');

// browserify
var browserify = require('browserify');
var transform = require('vinyl-transform');

// critical css
var critical = require('critical');

// rework plugins
// var myth = require('myth');
var palette = require('rework-palette');
var inliner = require('rework-npm');
var colors = require('rework-plugin-colors');
var vars = require('rework-vars');
var calc = require('rework-calc');
var customMedia = require('rework-custom-media');
var suitConformance = require('rework-suit-conformance');

// buildOptions
var minimist = require('minimist');

// data
var projects = require('./data/projects.json');
var companies = require('./data/companies.json');


///// config

var defaultBuildOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};

var buildOptions = minimist(process.argv.slice(2), defaultBuildOptions);

// env
var isProd = buildOptions.env === 'production';

var config = {
    src: './src',
    dest: './dist',
    jsEntry: 'app.js',
    stylesDest: '/styles',
    // on prod we only compile to one css
    cssFiles: isProd ? '/styles/main.css' : '/styles/**/*.css',
    templateFiles: '/templates/*.jade'
};


///// Tasks


gulp.task('help', $.taskListing.withFilters(null, function (task) {

    var excludes = ['default', 'help', 'browserSync'];
    return excludes.indexOf(task) > -1;

}));


gulp.task('build:css', function () {

    var breakPoints = require('./config/breakpoints.json');

    var reworkPlugins = [
        inliner(),
        customMedia(breakPoints),
        palette(),
        colors(),
        vars(),
        calc,
        suitConformance,
        { sourcemap: !isProd }
    ];



    return gulp.src(config.src + config.cssFiles)
        .pipe($.plumber())
        .pipe($.rework.apply(null, reworkPlugins))
        .pipe($.if(!isProd, $.sourcemaps.init()))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.if(isProd, $.csso()))
        .pipe($.if(!isProd, $.sourcemaps.write()))
        .pipe(gulp.dest(config.dest + config.stylesDest))
        .pipe($.size({ gzip: true }))
        .pipe(reload({ stream: true }));
});


gulp.task('build:html', function () {

    return gulp.src(config.src + config.templateFiles)
        .pipe($.jade({
            locals: {
                welcome: 'hello',
                projects: projects,
                companies: companies
            },
            pretty: true
        }))
        .pipe(gulp.dest(config.dest))
        .pipe(reload({ stream: true }));

});


gulp.task('build:js', function () {

    var browserified = transform(function (filename) {
        var b = browserify(filename);
        return b.bundle();
    });

    return gulp.src(config.src + '/scripts/**/*.js')
        .pipe($.plumber())
        // run jshint on raw files
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish))
        // only perform browserify on entry point js
        .pipe($.filter([config.jsEntry]))
        .pipe(browserified)
        .pipe($.if(isProd, $.uglify()))
        .pipe(gulp.dest(config.dest))
        .pipe($.size())
        .pipe(reload({ stream: true }));

});


gulp.task('browserSync', ['build'], function () {

    browserSync({
        logLevel: 'silent',
        logConnections: false,
        server: {
            baseDir: config.dest,
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


gulp.task('deploy:minifyHTML', ['deploy:critical', 'deploy:useref'], function () {

    return gulp.src(config.dest + '/*.html')
        .pipe($.minifyHtml({ loose: true, empty: true }))
        .pipe(gulp.dest(config.dest))
        .pipe($.size({ gzip: true }));

});


gulp.task('deploy:useref', ['deploy:critical'], function () {

    var assets = $.useref.assets();
    return gulp.src(config.dest + '/*.html')
        .pipe(assets)
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe(gulp.dest(config.dest))
        .pipe($.size({ gzip: true }));

});


gulp.task('default', ['help']);
gulp.task('build', ['build:html', 'build:css', 'build:js']);
gulp.task('deploy', ['deploy:critical', 'deploy:useref', 'deploy:minifyHTML']);


gulp.task('watch', ['browserSync'], function () {
    gulp.watch(config.src + '/**/*.jade', ['build:html']);
    gulp.watch(config.src + '/**/*.css', ['build:css']);
    gulp.watch(config.src + '/**/*.js', ['build:js']);
});
