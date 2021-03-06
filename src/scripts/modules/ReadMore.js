var objectAssign = require('object-assign');


function ReadMore (options) {

    options = options || {};

    this.options = {};

    objectAssign(this.options, ReadMore.defaults, options);

    this.readMoreContainers = document.querySelectorAll(this.options.sel);

    this.startListening();

}


ReadMore.defaults = {
    sel: '.ReadMore',
    showingClassName: 'is-showing',
    once: true
};


ReadMore.events = {
    CLICK: 'ontouchstart' in window ? 'touchstart' : 'click'
};


ReadMore.prototype.toggleClassName = function (el, className) {

    if (typeof el !== 'object' && !el.classList) {
        console.error('Element passed in does not support classList');
        return;
    }

    return el.classList.toggle(className);

};


ReadMore.prototype.handleEvent = function (e) {

    var hasTriggeredEvent = false;

    switch (e.type) {
        case ReadMore.events.CLICK:
            this.onClick(e);
            hasTriggeredEvent = true;
            break;

    }

    if (this.once && hasTriggeredEvent) {
        e.target.removeEventListener(e.type, this);
    }

};


ReadMore.prototype.onClick = function (e) {


    this.toggleClassName(e.target, this.options.showingClassName);

};


ReadMore.prototype.startListening = function () {

    [].slice.call(this.readMoreContainers).forEach(function (el) {
        el.addEventListener(ReadMore.events.CLICK, this);
    }, this);

};


module.exports = ReadMore;
