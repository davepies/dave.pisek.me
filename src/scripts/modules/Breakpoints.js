function Breakpoints (breakpointsMap, onMatch) {

    if (!breakpointsMap || typeof onMatch !== 'function') {
        throw Error('provide map and callback');
    }

    this.breakpointsMap = breakpointsMap;
    this.onMatch = onMatch;

    this._addListeners();

}


Breakpoints.prototype._addListeners = function () {

    var self = this;

    Object.keys(self.breakpointsMap).forEach(function (breakpointKey) {
        var breakpoint = self.breakpointsMap[breakpointKey];
        var mq = window.matchMedia(breakpoint);
        mq.addListener(self.onMatch);
    });

};


module.exports = Breakpoints;
