var minimist = require('minimist');

var src = './src';
var dest = './dist';

var commandLineOptions = {
    string: 'env',
    default: {
        env: process.env.NODE_ENV || 'development'
    }
};

// get command line arguments
var options = minimist(process.argv.slice(2), commandLineOptions);

var isProd = (options.env === 'production');

module.exports = {
    src: src,
    dest: dest,
    js: {
        src: src + '/scripts/**/*.js',
        dest: dest + '/scripts',
        browserifyEntry: 'app.js'
    },
    css: {
        // dev: src all files for debugging; prod: only main file
        src: src + (isProd ? '/styles/main.css' : '/styles/**/*.css'),
        dest: dest + '/styles'
    },
    jade: {
        src: src + '/templates/*.jade',
        dest: dest,
        locals: {
            welcome: 'hello',
            projects: require('../data/projects.json'),
            companies: require('../data/companies.json')
        }
    },
    isProd: isProd
};
