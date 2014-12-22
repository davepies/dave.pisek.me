module.exports = {
    browserPrefix: getBrowserPrefix(),
    transitionEndEventName: transitionEndEventName()
};

function getBrowserPrefix() {
    var styles = window.getComputedStyle(document.documentElement, '');
    var stylesArr = Array.prototype.slice.call(styles);

    var prefixMatch = stylesArr.join('').match(/-(moz|webkit|ms)-/);

    // no match then we settle with opera
    var prefix = (prefixMatch && prefixMatch[1]) || 'o';
    var dom = ('Webkit|Moz|MS|O').match(new RegExp('(' + prefix + ')', 'i'))[1];

    return {
        dom: dom,
        lowercase: prefix,
        css: '-' + prefix + '-',
        js: prefix[0].toUpperCase() + prefix.substr(1)
    };
}

function transitionEndEventName() {
    var i;
    var el = document.createElement('div');
    var transitions = {
            'transition':'transitionend',
            'OTransition':'otransitionend',  // oTransitionEnd in very old Opera
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

    for (i in transitions) {
        if (transitions.hasOwnProperty(i) && el.style[i] !== undefined) {
            return transitions[i];
        }
    }

    return false;
}
