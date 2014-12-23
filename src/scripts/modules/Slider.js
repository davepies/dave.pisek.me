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

    this.curr = 0;
    this.prev = 0;

    this.isAnimating = false;

    this._initStyles();

    if (this.items.length > 1) {
        this._addNav();
    }

    this._addSVGs();

    // this._addEventListeners();

}


Slider.defaults = {

    speed: 500,
    easing: 'ease',
    svgTemplate: '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 80 60" preserveAspectRatio="none"><path d="{path}"/></svg>',
    paths: {
        rect : 'M33,0h41c0,0,0,9.871,0,29.871C74,49.871,74,60,74,60H32.666h-0.125H6c0,0,0-10,0-30S6,0,6,0H33',
        curve : {
            right : 'M33,0h41c0,0,5,9.871,5,29.871C79,49.871,74,60,74,60H32.666h-0.125H6c0,0,5-10,5-30S6,0,6,0H33',
            left : 'M33,0h41c0,0-5,9.871-5,29.871C69,49.871,74,60,74,60H32.666h-0.125H6c0,0-5-10-5-30S6,0,6,0H33'
        }
    }

};


/**
 * _initStyles
 *
 * @private
 * @return {undefined}
 */
Slider.prototype._initStyles = function () {

    this.itemsList.style.width      = 100 * this.items.length + '%';
    this.itemsList.style.transition = 'transform ' + this.options.speed + 'ms ' + this.options.easing;

    var itemWidth = 100 / this.items.length;
    this.items.forEach(function (item) {
        item.style.width = itemWidth + '%';
    }, this);

};


/**
 * _addNav
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
 * _addArrow
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
 * _createSVG
 *
 * @param {String} html
 * @return {undefined}
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
 * _addSVGs
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
