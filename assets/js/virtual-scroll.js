var VirtualScroll = (function (document) {
  var vs = {};
  var numListeners,
    listeners = [],
    initialized = !1;
  var touchStartX, touchStartY;
  var touchMult = 2;
  var firefoxMult = 15;
  var keyStep = 120;
  var mouseMult = 1;
  var bodyTouchAction;
  var hasWheelEvent = "onwheel" in document;
  var hasMouseWheelEvent = "onmousewheel" in document;
  var hasTouch = "ontouchstart" in document;
  var hasTouchWin =
    navigator.msMaxTouchPoints && navigator.msMaxTouchPoints > 1;
  var hasPointer = !!window.navigator.msPointerEnabled;
  var hasKeyDown = "onkeydown" in document;
  var isFirefox = navigator.userAgent.indexOf("Firefox") > -1;
  var event = { y: 0, x: 0, deltaX: 0, deltaY: 0, originalEvent: null };
  vs.on = function (f) {
    if (!initialized) initListeners();
    listeners.push(f);
    numListeners = listeners.length;
  };
  vs.options = function (opt) {
    keyStep = opt.keyStep || 120;
    firefoxMult = opt.firefoxMult || 15;
    touchMult = opt.touchMult || 2;
    mouseMult = opt.mouseMult || 1;
  };
  vs.off = function (f) {
    listeners.splice(f, 1);
    numListeners = listeners.length;
    if (numListeners <= 0) destroyListeners();
  };
  var notify = function (e) {
    event.x += event.deltaX;
    event.y += event.deltaY;
    event.originalEvent = e;
    for (var i = 0; i < numListeners; i++) {
      listeners[i](event);
    }
  };
  var onWheel = function (e) {
    event.deltaX = e.wheelDeltaX || e.deltaX * -1;
    event.deltaY = e.wheelDeltaY || e.deltaY * -1;
    if (isFirefox && e.deltaMode == 1) {
      event.deltaX *= firefoxMult;
      event.deltaY *= firefoxMult;
    }
    event.deltaX *= mouseMult;
    event.deltaY *= mouseMult;
    notify(e);
  };
  var onMouseWheel = function (e) {
    event.deltaX = e.wheelDeltaX ? e.wheelDeltaX : 0;
    event.deltaY = e.wheelDeltaY ? e.wheelDeltaY : e.wheelDelta;
    notify(e);
  };
  var onTouchStart = function (e) {
    var t = e.targetTouches ? e.targetTouches[0] : e;
    touchStartX = t.pageX;
    touchStartY = t.pageY;
  };
  var onTouchMove = function (e) {
    var t = e.targetTouches ? e.targetTouches[0] : e;
    event.deltaX = (t.pageX - touchStartX) * touchMult;
    event.deltaY = (t.pageY - touchStartY) * touchMult;
    touchStartX = t.pageX;
    touchStartY = t.pageY;
    notify(e);
  };
  var onKeyDown = function (e) {
    event.deltaX = event.deltaY = 0;
    switch (e.keyCode) {
      case 37:
        event.deltaX = -keyStep;
        break;
      case 39:
        event.deltaX = keyStep;
        break;
      case 38:
        event.deltaY = keyStep;
        break;
      case 40:
        event.deltaY = -keyStep;
        break;
    }
    notify(e);
  };
  var initListeners = function () {
    if (hasWheelEvent) document.addEventListener("wheel", onWheel);
    if (hasMouseWheelEvent)
      document.addEventListener("mousewheel", onMouseWheel);
    if (hasTouch) {
      document.addEventListener("touchstart", onTouchStart);
      document.addEventListener("touchmove", onTouchMove);
    }
    if (hasPointer && hasTouchWin) {
      bodyTouchAction = document.body.style.msTouchAction;
      document.body.style.msTouchAction = "none";
      document.addEventListener("MSPointerDown", onTouchStart, !0);
      document.addEventListener("MSPointerMove", onTouchMove, !0);
    }
    if (hasKeyDown) document.addEventListener("keydown", onKeyDown);
    initialized = !0;
  };
  var destroyListeners = function () {
    if (hasWheelEvent) document.removeEventListener("wheel", onWheel);
    if (hasMouseWheelEvent)
      document.removeEventListener("mousewheel", onMouseWheel);
    if (hasTouch) {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
    }
    if (hasPointer && hasTouchWin) {
      document.body.style.msTouchAction = bodyTouchAction;
      document.removeEventListener("MSPointerDown", onTouchStart, !0);
      document.removeEventListener("MSPointerMove", onTouchMove, !0);
    }
    if (hasKeyDown) document.removeEventListener("keydown", onKeyDown);
    initialized = !1;
  };
  return vs;
})(document);
