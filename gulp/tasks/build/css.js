var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

var reload = require('browser-sync').reload;

var config = require('../../config');
var breakPoints = require('../../../config/breakpoints.json');

// rework plugins
var palette = require('rework-palette');
var inliner = require('rework-npm');
var colors = require('rework-plugin-colors');
var vars = require('rework-vars');
var calc = require('rework-calc');
var customMedia = require('rework-custom-media');
var suitConformance = require('rework-suit-conformance');
var easeFunctions = require('rework-plugin-ease');

gulp.task('build:css', function () {

    var reworkPlugins = [
        inliner(),
        customMedia(breakPoints),
        easeFunctions(),
        palette(),
        colors(),
        vars(),
        calc,
        suitConformance,
        { sourcemap: !config.isProd }
    ];

    return gulp.src(config.css.src)
        .pipe($.plumber())
        .pipe($.rework.apply(null, reworkPlugins))
        .pipe($.if(!config.isProd, $.sourcemaps.init()))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.if(config.isProd, $.csso()))
        .pipe($.if(!config.isProd, $.sourcemaps.write()))
        .pipe(gulp.dest(config.css.dest))
        .pipe($.size({ gzip: true }))
        .pipe(reload({ stream: true }));
});
