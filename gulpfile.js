// gulp
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

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
var myth = require('myth');
var palette = require('rework-palette');
var imprt = require('rework-import');
var pureGrids = require('rework-pure-grids');
var colors = require('rework-plugin-colors');

// data
var projects = require('./data/projects.json');
var companies = require('./data/companies.json');

// buildOptions
var minimist = require('minimist');

var defaultBuildOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};

var buildOptions = minimist(process.argv.slice(2), defaultBuildOptions);

// env
var isProd = buildOptions.env === 'production';

// config
var config = {
    src: './src',
    dest: './dist',
    jsEntry: 'app.js',
    stylesDest: '/styles',
    // on prod we only compile to one css
    cssFiles: isProd ? '/styles/main.css' : '/styles/**/*.css',
};

gulp.task('help', $.taskListing.withFilters(null, function (task) {
    var excludes = ['default', 'help', 'browserSync'];
    return excludes.indexOf(task) > -1;
}));

gulp.task('build:css', function () {

    var reworkPlugins = [palette(), colors(), myth()];

    if (isProd) {
        // we want to only compile to one css file
        reworkPlugins.unshift(imprt());
    }

    return gulp.src(config.src + config.cssFiles)
        .pipe($.plumber())
        .pipe($.rework.apply(null, reworkPlugins))
        .pipe($.if(isProd, $.csso()))
        .pipe(gulp.dest(config.dest + config.stylesDest))
        .pipe($.size({ gzip: true }))
        .pipe(reload({ stream: true }));
});

gulp.task('build:html', function () {
    return gulp.src(config.src + '/*.jade')
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
        .pipe($.if(!isProd, $.plumber()))
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
        .pipe($.minifyHtml({ loose: true }))
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
