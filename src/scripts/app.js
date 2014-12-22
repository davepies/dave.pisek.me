var ReadMore = require('./modules/ReadMore');
var Slider = require('./modules/Slider');

var readMore = new ReadMore({ once: true });
var slider = new Slider(document.querySelector('.slider'), { hello: 'hello', arr: [1] });


// Breakpoints Test

var Breakpoints = require('./modules/Breakpoints');

var breakpointsMap = require('../../config/breakpoints.json').map;

var breakPoints = new Breakpoints(breakpointsMap, function (mq) {

    if (mq.matches) {
        console.log('it matches' + mq.media);
    }

});

