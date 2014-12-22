function extend (a, b) {
    var key;
    for (key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

module.exports = extend;
