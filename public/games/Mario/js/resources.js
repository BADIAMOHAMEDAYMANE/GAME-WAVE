//simple resource loader
(function() {
    const resourceCache = {};

    const readyCallbacks = [];

    // Load an image url or an array of image urls
    function load(urlOrArr) {
        if(Array.isArray(urlOrArr)) {
            urlOrArr.forEach(function(url) {
                _load(url);
            });
        }
        else {
            _load(urlOrArr);
        }
    }

    function _load(url) {
        if(resourceCache[url]) {
            return resourceCache[url];
        }
        else {
            const img = new Image();
            img.onload = function() {
                resourceCache[url] = img;

                if(isReady()) {
                    readyCallbacks.forEach(function(func) { func(); });
                }
            };
            resourceCache[url] = false;
            img.src = url;
        }
    }

    function get(url) {
        return resourceCache[url];
    }

    function isReady() {
        let ready = true;
        for(const k in resourceCache) {
            if(resourceCache.hasOwnProperty(k) &&
               !resourceCache[k]) {
                ready = false;
            }
        }
        return ready;
    }

    function onReady(func) {
        readyCallbacks.push(func);
    }

    globalThis.resources = {
        load: load,
        get: get,
        onReady: onReady,
        isReady: isReady
    };
})();
