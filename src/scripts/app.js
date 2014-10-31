(function () {

    var readMoreContainers = document.querySelectorAll('.read-more');

    var showingClass = 'read-more--showing';

    function toggle (el) {
        return function () {
            el.classList[el.classList.contains(showingClass) ? 'remove' : 'add'](showingClass);
        };
    }

    Array.prototype.slice.call(readMoreContainers).forEach(function (el) {
        el.addEventListener('click', toggle(el));
    });

})();
