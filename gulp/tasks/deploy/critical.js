var gulp = require('gulp');

var critical = require('critical');

var config = require('../../config');

gulp.task('deploy:critical', ['build'], function (done) {

    critical.generateInline({
        base: config.dest,
        src: 'index.html',
        // styleTarget: 'main.css',
        htmlTarget: 'index.html',
        minify: true
    }, done);

});
