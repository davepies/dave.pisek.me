var classie = require('classie');

var dom = require('../utils/dom');
var objectAssign = require('object-assign');


/**
 * Slider
 *
 * @constructor
 * @param el
 * @param options
 * @return {undefined}
 */
function Slider(el, options) {

    this.el = el instanceof HTMLElement ? el : document.querySelector(el);

    if (!this.el) {
        return false;
    }

    this.options = {};

    objectAssign(this.options, Slider.defaults, options);

    this._init();
    this._addEventListeners();

}


Slider.defaults = {
};


/**
 * _init
 *
 * @private
 * @return {undefined}
 */
Slider.prototype._init = function () {

};

module.exports = Slider;
