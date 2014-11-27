var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

// exclude tasks from help message
var excludes = ['default', 'help', 'browserSync'];

gulp.task('help', $.taskListing.withFilters(null, function (task) {

    return excludes.indexOf(task) > -1;

}));
