var ReadMore = require('./modules/ReadMore');
var Slider   = require('./modules/Slider');

var debounce = require('./utils/debounce');

// Readmore and Slider
var readMore = new ReadMore({ once: true });
var slider   = new Slider(document.querySelector('.Projects'), { hello: 'hello', arr: [1] });

// Side navigation state change
var changeSideNavigationState = debounce((function () {
    var mutedClassName = 'SideNavigationIcon--muted';
    var sideNavigationIcon = document.querySelector('.SideNavigationIcon');
    var lastScrollPoint = 0;
    var muted = false;
    var windowHeight = window.innerHeight;
    var documentHeight = document.documentElement.offsetHeight;
    var topThreshold = 20;
    var bottomThreshold = 50;

    return function () {
        var scrollPoint = window.pageYOffset;
        if (!muted && scrollPoint > topThreshold && scrollPoint> lastScrollPoint) {
            sideNavigationIcon.classList.add(mutedClassName);
            muted = true;
        }
        else if (muted && (windowHeight + scrollPoint) < (documentHeight - bottomThreshold) && scrollPoint < lastScrollPoint){
            sideNavigationIcon.classList.remove(mutedClassName);
            muted = false;
        }
        lastScrollPoint = po;
    };
})(), 10);

window.addEventListener('scroll', changeSideNavigationState);

// Breakpoints Test
var Breakpoints    = require('./modules/Breakpoints');
var breakpointsMap = require('../../config/breakpoints.json').map;

var breakPoints = new Breakpoints(breakpointsMap, function (mq) {

    if (mq.matches) {
        console.log('it matches' + mq.media);
    }

});
