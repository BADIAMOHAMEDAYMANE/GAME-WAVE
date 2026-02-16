(function() {
    if (globalThis.Mario === undefined) {
        globalThis.Mario = {};
    }

    const Util = Mario.Util = {};

    Util.inherits = function(subclass, superclass) {
   

        Surrogate.prototype = superclass.prototype;
        subclass.prototype = new Surrogate();
    }
})()