var merge = require('merge');

var defaults = {
    sel: '.ReadMore',
    showingClassName: 'is-showing',
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
    var newAttrValue = (el.getAttribute(attr) === this.options.showingClassName) ? '' : this.options.attrShowingValue;

    el.setAttribute(attr, newAttrValue);

};


ReadMore.prototype.toggleClassName = function (el, className) {

    if (typeof el !== 'object' && !el.classList) {
        console.error('Element passed in does not support classList');
        return;
    }

    return el.classList.toggle(className);

};

ReadMore.prototype._attachListeners = function () {

    function attachListener (el) {
        this._attachListener(
            el,
            'click',
            this.toggleClassName.bind(this, el, this.options.showingClassName),
            this,
            this.options.once
        );
    }

    [].slice.call(this.readMoreContainers).forEach(attachListener, this);

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
