function Toggler (options) {
    this.options = options || {};
    this.className = options.className || 'read-more';
    this.classNameShowing = options.classNameShowing || (this.className + '--showing');

    this.readMoreContainers = document.querySelectorAll('.' + this.className);

    this.addListeners();
}

Toggler.prototype.toggle = function (el) {
    el.classList[el.classList.contains(this.classNameShowing) ? 'remove' : 'add'](this.classNameShowing);
};

Toggler.prototype.addListeners = function () {
    Array.prototype.slice.call(this.readMoreContainers).forEach(function (el) {
        this.addListener(el, 'click', this.toggle.bind(this, el), this.options.once);
    }.bind(this));
};

Toggler.prototype.addListener = function (el, eventName, eventHandler, context, once) {
    el.addEventListener(eventName, function handler () {
        eventHandler.call(context || null);

        if (once) {
            el.removeEventListener(eventName, handler);
        }
    });
};

module.exports = Toggler;
