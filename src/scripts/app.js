var ReadMore = require('./modules/ReadMore');
var ReadMore = require('./modules/ReadMore');
var readMore = new ReadMore({ once: true });

var Breakpoints = require('./modules/Breakpoints');

var breakpointsMap = require('../../config/breakpoints.json').map;

var breakPoints = new Breakpoints(breakpointsMap, function (mq) {

    if (mq.matches) {
        console.log('it matches' + mq.media);
    }

});
