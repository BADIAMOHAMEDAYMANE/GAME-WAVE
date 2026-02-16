(function () {
    let pressedKeys = {};

    function setKey(event, status) {
        const code = event.keyCode;
        let key;

        switch (code) {
            case 32:
                key = 'SPACE'; break;
            case 37:
                key = 'LEFT'; break;
            case 38:
                key = 'UP'; break;
            case 39:
                key = 'RIGHT'; break;
            case 40:
                key = 'DOWN'; break;
            case 88:
                key = 'JUMP'; break;
            case 90:
                key = 'RUN'; break;
            default:
                key = String.fromCodePoint(code);
        }

        pressedKeys[key] = status;
    }

    document.addEventListener('keydown', function (e) {
        setKey(e, true);
        if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
        }
    });

    document.addEventListener('keyup', function (e) {
        setKey(e, false);
    });

    globalThis.addEventListener('blur', function () {
        pressedKeys = {};
    });

    globalThis.input = {
        isDown: function (key) {
            return pressedKeys[key.toUpperCase()];
        },
        reset: function () {
            pressedKeys['RUN'] = false;
            pressedKeys['LEFT'] = false;
            pressedKeys['RIGHT'] = false;
            pressedKeys['DOWN'] = false;
            pressedKeys['JUMP'] = false;
        },
        setKeyState: function (key, status) {
            pressedKeys[key.toUpperCase()] = status;
        }
    };
})();
