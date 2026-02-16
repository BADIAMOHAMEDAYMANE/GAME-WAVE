(function () {
  let lastTime = 0;
  const vendors = ['webkit', 'moz'];
  for (let x = 0; x < vendors.length && !globalThis.requestAnimationFrame; ++x) {
    // feature-detect vendor-prefixed requestAnimationFrame/cancelAnimationFrame
    globalThis.requestAnimationFrame = globalThis[vendors[x] + 'RequestAnimationFrame'];
    globalThis.cancelAnimationFrame = globalThis[vendors[x] + 'CancelAnimationFrame'] ||
      globalThis[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!globalThis.requestAnimationFrame) {
    globalThis.requestAnimationFrame = function (callback) {
      const currTime = Date.now();
      const timeToCall = Math.max(0, 16 - (currTime - lastTime));
      const id = globalThis.setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }

  if (!globalThis.cancelAnimationFrame) {
    globalThis.cancelAnimationFrame = function (id) {
      clearTimeout(id);
    };
  }
}());
