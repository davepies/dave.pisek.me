(function () {

    function Toggler (options) {
        options = options || {};
        this.className = options.className || '.read-more';
        this.classNameShowing = options.classNameShowing || this.className + '--showing';

        this.readMoreContainers = document.querySelectorAll(this.className);
    }

    Toggler.prototype.toggle = function (el) {
        var showingClass = this.classNameShowing.replace('.', '');
        el.classList[el.classList.contains(showingClass) ? 'remove' : 'add'](showingClass);
    };

    Toggler.prototype.bindToggle = function () {
        Array.prototype.slice.call(this.readMoreContainers).forEach(function (el) {
            this.one(el, 'click', this.toggle.bind(this, el));
        }.bind(this));
    };

    Toggler.prototype.one = function (el, eventName, eventHandler, context) {
        el.addEventListener(eventName, function handleOnce () {
            eventHandler.call(context || null);
            el.removeEventListener(eventName, handleOnce);
        });
    }


    var toggler = new Toggler();
    toggler.bindToggle();

})();
