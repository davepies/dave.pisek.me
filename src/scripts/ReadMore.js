var merge = require('merge');

var defaults = {
    sel: '[am-read-more]',
    attrShowingValue: 'showing',
    once: true
};


function ReadMore (options) {

    options = options || {};

    this.options = merge(options, defaults);

    this.readMoreContainers = document.querySelectorAll(this.options.sel);

    this._attachListeners();

}


ReadMore.prototype.toggle = function (el) {

    var attr = this._normaliseSel(this.options.sel);
    var newAttrValue = (el.getAttribute(attr) === this.options.attrShowingValue) ? '' : this.options.attrShowingValue;

    el.setAttribute(attr, newAttrValue);

};


ReadMore.prototype._attachListeners = function () {

    Array.prototype.slice.call(this.readMoreContainers).forEach(function (el) {
        this._attachListener(el, 'click', this.toggle.bind(this, el), this, this.options.once);
    }.bind(this));

};


ReadMore.prototype._attachListener = function (el, eventName, eventHandler, context, once) {

    el.addEventListener(eventName, function handler () {
        eventHandler.call(context || null);

        if (once) {
            el.removeEventListener(eventName, handler);
        }
    });

};


ReadMore.prototype._normaliseSel = function (sel) {

    return sel && sel.replace(/(\[|\]|\.|#)/g, '');

};


module.exports = ReadMore;
