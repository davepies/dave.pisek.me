function ReadMore (options) {

    this.options = options || {};
    this.sel = options.sel || '[am-read-more]';
    this.attrShowingValue = options.attrShowingValue || 'showing';

    this.readMoreContainers = document.querySelectorAll(this.sel);

    this._addListeners();

}


ReadMore.prototype.toggle = function (el) {

    var attr = this._normaliseSel(this.sel);
    var newAttrValue = (el.getAttribute(attr) === this.attrShowingValue) ? '' : this.attrShowingValue;

    el.setAttribute(attr, newAttrValue);

};


ReadMore.prototype._addListeners = function () {

    Array.prototype.slice.call(this.readMoreContainers).forEach(function (el) {
        this._addListener(el, 'click', this.toggle.bind(this, el), this.options.once);
    }.bind(this));

};


ReadMore.prototype._addListener = function (el, eventName, eventHandler, context, once) {

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
