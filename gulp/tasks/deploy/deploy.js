var gulp = require('gulp');

gulp.task('deploy', ['deploy:critical',  'deploy:minifyHTML']);
