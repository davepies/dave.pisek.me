var classie      = require('classie');
var objectAssign = require('object-assign');
var snap         = require('snapsvg');

var dom      = require('../utils/dom');
var template = require('../utils/template');


/**
 * Slider
 *
 * @constructor
 * @param {String|HTMLElement} el
 * @param {Object} options
 * @return {undefined}
 */
function Slider(el, options) {

    this.el = el instanceof HTMLElement ? el : document.querySelector(el);

    if (!this.el) {
        return false;
    }

    this.options = {};

    objectAssign(this.options, Slider.defaults, options);

    this.itemsList = this.el.querySelector('ul');
    this.items     = Array.prototype.slice.call(this.itemsList.querySelectorAll('li'));
    this.itemsCount = this.items.length;

    this.curr = 0;
    this.prev = 0;

    this.isAnimating = false;

    this._initStyles();

    if (this.itemsCount > 1) {
        this._addNav();
        this._addEventListeners();
    }

    this._addSVGs();


}


Slider.defaults = {

    duration: 400,
    easing: 'cubic-bezier(.8,0,.2,1)',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 80 60" preserveAspectRatio="none"><path d="{path}"/></svg>',
    paths: {
        rect : 'M33,0h41c0,0,0,9.871,0,29.871C74,49.871,74,60,74,60H32.666h-0.125H6c0,0,0-10,0-30S6,0,6,0H33',
        curve : {
            right : 'M33,0h41c0,0,5,9.871,5,29.871C79,49.871,74,60,74,60H32.666h-0.125H6c0,0,5-10,5-30S6,0,6,0H33',
            left : 'M33,0h41c0,0-5,9.871-5,29.871C69,49.871,74,60,74,60H32.666h-0.125H6c0,0-5-10-5-30S6,0,6,0H33'
        }
    }

};


Slider.events = {
    CLICK: 'click',
    TRANSITION_END: dom.transitionEndEventName
};


/**
 * onClick
 *
 * @param e
 * @return {undefined}
 */
Slider.prototype.onClick = function (e) {
    if (e.target === this.navNext) {
        this._navigate('next');
    }

    if (e.target === this.navPrev) {
        this._navigate('prev');
    }
};


/**
 * onTransitionEnd
 *
 * @param e
 * @return {undefined}
 */
Slider.prototype.onTransitionEnd = function (e) {

    this.isAnimating = false;

};



/**
 * handleEvent Interface
 * https://developer.mozilla.org/en-US/docs/Web/API/EventListener
 *
 * @param e
 * @return {undefined}
 */
Slider.prototype.handleEvent = function (e) {

    switch (e.type) {
        case Slider.events.CLICK:
            this.onClick(e);
            break;
        case Slider.events.TRANSITION_END:
            this.onTransitionEnd(e);
            break;
    }

};


/**
 * Adds click and transition end events
 *
 * @return {undefined}
 */
Slider.prototype._addEventListeners = function () {

    this.navPrev.addEventListener(Slider.events.CLICK, this);
    this.navNext.addEventListener(Slider.events.CLICK, this);

    this.itemsList.addEventListener(Slider.events.TRANSITION_END, this);

};


/**
 * Handles the navigation to the desired direction (next | prev)
 *
 * @param {String} dir
 * @return {undefined}
 */
Slider.prototype._navigate = function (dir) {

    if (this.isAnimating ||
            dir === 'next' && this.curr >= this.itemsCount - 1 ||
            dir === 'prev' && this.curr <= 0) {
        return false;
    }

    this.isAnimating = true;
    this.direction = dir;

    this.prev = this.curr;

    if (dir === 'next') {
        this.curr += 1;
    } else {
        this.curr -= 1;
    }

    this._slide();

};


/**
 * Slider transition
 *
 * @return {undefined}
 */
Slider.prototype._startSlider = function () {
    //@TODO: Add navToggle
    var translateVal = -1 * this.curr * 100 / this.itemsCount;
    this.itemsList.style.WebkitTransform = 'translate3d(' + translateVal + '%,0,0)';
    this.itemsList.style.transform = 'translate3d(' + translateVal + '%,0,0)';
};


/**
 * SVG Morphing and sliding
 *
 * @return {undefined}
 */
Slider.prototype._slide = function () {

    var pathCurvedLeft  = this.options.paths.curve.left;
    var pathCurvedRight = this.options.paths.curve.right;
    var pathRect        = this.options.paths.rect;

    var pathPrev = this.direction === 'next' ? pathCurvedLeft : pathCurvedRight;
    var pathCurr = this.direction === 'next' ? pathCurvedRight : pathCurvedLeft;

    var prevItem = this.items[this.prev];
    var currItem = this.items[this.curr];

    var duration = this.options.duration;

    // morph on exiting slide to "curved"
    prevItem.path.stop().animate({
            path: pathPrev
        },
        duration * 0.5,
        mina.easeout);

    // start the slider
    setTimeout(this._startSlider.bind(this), duration * 0.2);

    // change path on entering slide to "curved"
    currItem.querySelector('path').setAttribute('d', pathCurr);

    // morph back to "rectangular"
    setTimeout(function () {
        currItem.path.stop().animate({
            'path': pathRect
        },
        duration * 3,
        mina.elastic);
    }, duration * 0.5);

};


/**
 * Set the widths and transition properties
 *
 * @private
 * @return {undefined}
 */
Slider.prototype._initStyles = function () {

    var itemWidth = 100 / this.itemsCount;

    this.items.forEach(function setItemWidth (item) {
        item.style.width = itemWidth + '%';
    }, this);

    this.itemsList.style.width      = 100 * this.itemsCount + '%';

    this.itemsList.style.WebkitTransition = '-webkit-transform ' + this.options.duration + 'ms ' + this.options.easing;
    this.itemsList.style.transition = 'transform ' + this.options.duration + 'ms ' + this.options.easing;

};


/**
 * Add the nav element and next/prev arrows
 *
 * @return {undefined}
 */
Slider.prototype._addNav = function() {

    var nav = document.createElement('nav');

    this.navPrev = this._addArrow(nav, 'prev', '&lt;', true);
    this.navNext = this._addArrow(nav, 'next', '&gt;');

    this.el.appendChild(nav);

};


/**
 * Creates a span el with an arrow
 *
 * @private
 * @param {String} className
 * @param {String} content
 * @param {Boolean} disabled
 * @return {undefined}
 */
Slider.prototype._addArrow = function (navElem, className, content, disabled) {
    var elem = document.createElement('span');
    elem.className = className;
    elem.innerHTML = content;
    if (disabled) {
        classie.add(elem, 'disabled');
    }
    navElem.appendChild(elem);
    return elem;
};


/**
 * Create a new svg dom fragment
 *
 * @param {String} html
 * @return {DOMFragement}
 */
Slider.prototype._createSVG = function (html) {

    var frag = document.createDocumentFragment();
    var temp = document.createElement('div');
    temp.innerHTML = html;
    while(temp.firstChild) {
        //Note:  If the given child is a reference to an existing node in the document, appendChild() moves it from its current position to the new position
        frag.appendChild(temp.firstChild);
    }
    temp = null;
    return frag;

};


/**
 * Creates an appends SVG to each element
 *
 * @return {undefined}
 */
Slider.prototype._addSVGs = function () {

    this.items.forEach(addSVG, this);

    function addSVG (item) {
        var svg = this._createSVG(template(this.options.svgTemplate, { path: this.options.paths.rect }));
        var s   = null;

        item.insertBefore(svg, item.childNodes[0]);
        s = snap(item.querySelector('svg'));
        item.path = s.select('path');
    }

};


module.exports = Slider;
