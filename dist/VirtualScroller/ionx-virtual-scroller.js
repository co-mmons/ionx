import { HTMLElement, forceUpdate, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { shallowEqual as shallowEqual$1 } from 'fast-equals';
import { waitTillHydrated } from 'ionx/utils';

/**
 * Rounds coordinates upto 4th decimal place (after dot) and appends "px".
 * Small numbers could be printed as `"1.2345e-50"` unless rounded:
 * that would be invalid "px" value in CSS.
 * @param {number}
 * @return {string}
 */
function px(number) {
  // Fractional pixels are used on "retina" screens.
  return (number % 1 === 0 ? number : number.toFixed(2)) + 'px';
}

// A workaround for `<tbody/>` not being able to have `padding`.
var BROWSER_NOT_SUPPORTED_ERROR = 'It looks like you\'re using Internet Explorer which doesn\'t support CSS variables required for a <tbody/> container. VirtualScroller has been switched into "bypass" mode (render all items). See: https://gitlab.com/catamphetamine/virtual-scroller/-/issues/1';
function supportsTbody() {
  // Detect Internet Explorer.
  // https://stackoverflow.com/questions/19999388/check-if-user-is-using-ie
  // `documentMode` is an IE-only property.
  // Supports IE 9-11. Maybe even IE 8.
  // http://msdn.microsoft.com/en-us/library/ie/cc196988(v=vs.85).aspx
  if (typeof window !== 'undefined' && window.document.documentMode) {
    // CSS variables aren't supported in Internet Explorer.
    return false;
  }

  return true;
}
var TBODY_CLASS_NAME = 'VirtualScroller';
var STYLE_ELEMENT_ID = 'VirtualScrollerStyle';
function hasTbodyStyles(tbody) {
  return tbody.classList.contains(TBODY_CLASS_NAME) && Boolean(document.getElementById(STYLE_ELEMENT_ID));
}
function addTbodyStyles(tbody) {
  // `classList.add` is supported in Internet Explorer 10+.
  tbody.classList.add(TBODY_CLASS_NAME); // Create a `<style/>` element.

  var style = document.createElement('style');
  style.id = STYLE_ELEMENT_ID; // CSS variables aren't supported in Internet Explorer.

  style.innerText = "\n\t\ttbody.".concat(TBODY_CLASS_NAME, ":before {\n\t\t\tcontent: '';\n\t\t\tdisplay: table-row;\n\t\t\theight: var(--VirtualScroller-paddingTop);\n\t\t}\n\t\ttbody.").concat(TBODY_CLASS_NAME, ":after {\n\t\t\tcontent: '';\n\t\t\tdisplay: table-row;\n\t\t\theight: var(--VirtualScroller-paddingBottom);\n\t\t}\n\t").replace(/[\n\t]/g, '');
  document.head.appendChild(style);
}
function setTbodyPadding(tbody, beforeItemsHeight, afterItemsHeight) {
  // CSS variables aren't supported in Internet Explorer.
  tbody.style.setProperty('--VirtualScroller-paddingTop', px(beforeItemsHeight));
  tbody.style.setProperty('--VirtualScroller-paddingBottom', px(afterItemsHeight));
}

function _classCallCheck$a(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$a(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$a(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$a(Constructor.prototype, protoProps); if (staticProps) _defineProperties$a(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ItemsContainer$1 = /*#__PURE__*/function () {
  /**
   * Constructs a new "container" from an element.
   * @param {function} getElement
   */
  function ItemsContainer(getElement) {
    _classCallCheck$a(this, ItemsContainer);

    this.getElement = getElement;
  }
  /**
   * Returns an item element's "top offset", relative to the items `container`'s top edge.
   * @param  {number} renderedElementIndex — An index of an item relative to the "first shown item index". For example, if the list is showing items from index 8 to index 12 then `renderedElementIndex = 0` would mean the item at index `8`.
   * @return {number}
   */


  _createClass$a(ItemsContainer, [{
    key: "getNthRenderedItemTopOffset",
    value: function getNthRenderedItemTopOffset(renderedElementIndex) {
      return this.getElement().childNodes[renderedElementIndex].getBoundingClientRect().top - this.getElement().getBoundingClientRect().top;
    }
    /**
     * Returns an item element's height.
     * @param  {number} renderedElementIndex — An index of an item relative to the "first shown item index". For example, if the list is showing items from index 8 to index 12 then `renderedElementIndex = 0` would mean the item at index `8`.
     * @return {number}
     */

  }, {
    key: "getNthRenderedItemHeight",
    value: function getNthRenderedItemHeight(renderedElementIndex) {
      // `offsetHeight` is not precise enough (doesn't return fractional pixels).
      // return this.getElement().childNodes[renderedElementIndex].offsetHeight
      return this.getElement().childNodes[renderedElementIndex].getBoundingClientRect().height;
    }
    /**
     * Returns items container height.
     * @return {number}
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      // `offsetHeight` is not precise enough (doesn't return fractional pixels).
      // return this.getElement().offsetHeight
      return this.getElement().getBoundingClientRect().height;
    }
    /**
     * Removes all item elements of an items container.
     */

  }, {
    key: "clear",
    value: function clear() {
      while (this.getElement().firstChild) {
        this.getElement().removeChild(this.getElement().firstChild);
      }
    }
  }]);

  return ItemsContainer;
}();

function _typeof$2(obj) { "@babel/helpers - typeof"; return _typeof$2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof$2(obj); }

function _defineProperties$9(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$9(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$9(Constructor.prototype, protoProps); if (staticProps) _defineProperties$9(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _classCallCheck$9(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf$1(subClass, superClass); }

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf$1(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf$1(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn$1(this, result); }; }

function _possibleConstructorReturn$1(self, call) { if (call && (_typeof$2(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized$1(self); }

function _assertThisInitialized$1(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf$1(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf$1(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct$1()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf$1(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf$1(o, p) { _setPrototypeOf$1 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf$1(o, p); }

function _getPrototypeOf$1(o) { _getPrototypeOf$1 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf$1(o); }

var ScrollableContainerNotReadyError = /*#__PURE__*/function (_Error) {
  _inherits$1(ScrollableContainerNotReadyError, _Error);

  var _super = _createSuper$1(ScrollableContainerNotReadyError);

  function ScrollableContainerNotReadyError() {
    _classCallCheck$9(this, ScrollableContainerNotReadyError);

    return _super.call(this, '[virtual-scroller] Scrollable container not found');
  }

  return _createClass$9(ScrollableContainerNotReadyError);
}( /*#__PURE__*/_wrapNativeSuper(Error));

function _typeof$1(obj) { "@babel/helpers - typeof"; return _typeof$1 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof$1(obj); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof$1(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _classCallCheck$8(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$8(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$8(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$8(Constructor.prototype, protoProps); if (staticProps) _defineProperties$8(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ScrollableContainer$1 = /*#__PURE__*/function () {
  /**
   * Constructs a new "scrollable container" from an element.
   * @param {func} getElement — Returns the scrollable container element.
   * @param {func} getItemsContainerElement — Returns items "container" element.
   */
  function ScrollableContainer(getElement, getItemsContainerElement) {
    _classCallCheck$8(this, ScrollableContainer);

    this.getElement = getElement;
    this.getItemsContainerElement = getItemsContainerElement;
  }
  /**
   * Returns the current scroll position.
   * @return {number}
   */


  _createClass$8(ScrollableContainer, [{
    key: "getScrollY",
    value: function getScrollY() {
      return this.getElement().scrollTop;
    }
    /**
     * Scrolls to a specific position.
     * @param {number} scrollY
     */

  }, {
    key: "scrollToY",
    value: function scrollToY(scrollY) {
      // IE 11 doesn't seem to have a `.scrollTo()` method.
      // https://gitlab.com/catamphetamine/virtual-scroller/-/issues/10
      // https://stackoverflow.com/questions/39908825/window-scrollto-is-not-working-in-internet-explorer-11
      if (this.getElement().scrollTo) {
        this.getElement().scrollTo(0, scrollY);
      } else {
        this.getElement().scrollTop = scrollY;
      }
    }
    /**
     * Returns "scrollable container" width,
     * i.e. the available width for its content.
     * @return {number}
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      if (!this.getElement()) {
        throw new ScrollableContainerNotReadyError();
      }

      return this.getElement().offsetWidth;
    }
    /**
     * Returns the height of the "scrollable container" itself.
     * Not to be confused with the height of "scrollable container"'s content.
     * @return {number}
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      if (!this.getElement()) {
        throw new ScrollableContainerNotReadyError();
      } // if (!this.getElement() && !precise) {
      // 	return getScreenHeight()
      // }


      return this.getElement().offsetHeight;
    }
    /**
     * Returns a "top offset" of an items container element
     * relative to the "scrollable container"'s top edge.
     * @return {number}
     */

  }, {
    key: "getItemsContainerTopOffset",
    value: function getItemsContainerTopOffset() {
      var scrollableContainerTop = this.getElement().getBoundingClientRect().top;
      var scrollableContainerBorderTopWidth = this.getElement().clientTop;
      var itemsContainerTop = this.getItemsContainerElement().getBoundingClientRect().top;
      return itemsContainerTop - scrollableContainerTop + this.getScrollY() - scrollableContainerBorderTopWidth;
    } // isVisible() {
    // 	const { top, bottom } = this.getElement().getBoundingClientRect()
    // 	return bottom > 0 && top < getScreenHeight()
    // }

    /**
     * Adds a "scroll" event listener to the "scrollable container".
     * @param {onScrollListener} Should be called whenever the scroll position inside the "scrollable container" (potentially) changes.
     * @return {function} Returns a function that stops listening.
     */

  }, {
    key: "onScroll",
    value: function onScroll(onScrollListener) {
      var element = this.getElement();
      element.addEventListener('scroll', onScrollListener);
      return function () {
        return element.removeEventListener('scroll', onScrollListener);
      };
    }
    /**
     * Adds a "resize" event listener to the "scrollable container".
     * @param {onResize} Should be called whenever the "scrollable container"'s width or height (potentially) changes.
      * @return {function} Returns a function that stops listening.
     */

  }, {
    key: "onResize",
    value: function onResize(_onResize) {
      // Watches "scrollable container"'s dimensions via a `ResizeObserver`.
      // https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
      // https://web.dev/resize-observer/
      var unobserve;

      if (typeof ResizeObserver !== 'undefined') {
        var resizeObserver = new ResizeObserver(function (entries) {
          // if (entry.contentBoxSize) {
          // 	// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
          // 	const width = entry.contentBoxSize.inlineSize
          // 	const height = entry.contentBoxSize.blockSize
          // }

          _onResize();
        });
        var element = this.getElement();
        resizeObserver.observe(element);

        unobserve = function unobserve() {
          return resizeObserver.unobserve(element);
        };
      } // I guess, if window is resized, `onResize()` will be triggered twice:
      // once for window resize, and once for the scrollable container resize.
      // But `onResize()` also has an internal check: if the container size
      // hasn't changed since the previous time `onResize()` has been called,
      // then `onResize()` doesn't do anything, so, I guess, there shouldn't be
      // any "performance implications" of running the listener twice in such case.


      var unlistenGlobalResize = addGlobalResizeListener$1(_onResize, {
        itemsContainerElement: this.getItemsContainerElement()
      });
      return function () {
        if (unobserve) {
          unobserve();
        }

        unlistenGlobalResize();
      };
    }
  }]);

  return ScrollableContainer;
}();
var ScrollableWindowContainer = /*#__PURE__*/function (_ScrollableContainer) {
  _inherits(ScrollableWindowContainer, _ScrollableContainer);

  var _super = _createSuper(ScrollableWindowContainer);

  /**
   * Constructs a new window "scrollable container".
   * @param {func} getItemsContainerElement — Returns items "container" element.
   */
  function ScrollableWindowContainer(getItemsContainerElement) {
    _classCallCheck$8(this, ScrollableWindowContainer);

    return _super.call(this, function () {
      return window;
    }, getItemsContainerElement);
  }
  /**
   * Returns the current scroll position.
   * @return {number}
   */


  _createClass$8(ScrollableWindowContainer, [{
    key: "getScrollY",
    value: function getScrollY() {
      // `window.scrollY` is not supported by Internet Explorer.
      return window.pageYOffset;
    }
    /**
     * Returns "scrollable container" width,
     * i.e. the available width for its content.
     * @return {number}
     */

  }, {
    key: "getWidth",
    value: function getWidth() {
      // https://javascript.info/size-and-scroll-window
      // `<!DOCTYPE html>` may be required in order for this to work correctly.
      // Includes scrollbar (if any).
      // Correctly reflects page zoom in iOS Safari.
      // (scales screen width accordingly).
      // But, includes scrollbar (if any).
      return window.innerWidth;
    }
    /**
     * Returns the height of the "scrollable container" itself.
     * Not to be confused with the height of "scrollable container"'s content.
     * @return {number}
     */

  }, {
    key: "getHeight",
    value: function getHeight() {
      // https://javascript.info/size-and-scroll-window
      // `<!DOCTYPE html>` is required in order for this to work correctly.
      // Without it, the returned height would be the height of the entire document.
      // Includes scrollbar (if any).
      // Supports iOS Safari's dynamically shown/hidden
      // top URL bar and bottom actions bar.
      // https://codesandbox.io/s/elegant-fog-iddrh
      // Tested in IE 11.
      // It also correctly reflects page zoom in iOS Safari.
      // (scales screen height accordingly).
      // But, includes scrollbar (if any).
      return window.innerHeight;
    }
    /**
     * Returns a "top offset" of an items container element
     * relative to the "scrollable container"'s top edge.
     * @return {number}
     */

  }, {
    key: "getItemsContainerTopOffset",
    value: function getItemsContainerTopOffset() {
      var borderTopWidth = document.clientTop || document.body.clientTop || 0;
      return this.getItemsContainerElement().getBoundingClientRect().top + this.getScrollY() - borderTopWidth;
    }
    /**
     * Adds a "resize" event listener to the "scrollable container".
     * @param {onScroll} Should be called whenever the "scrollable container"'s width or height (potentially) changes.
     * @return {function} Returns a function that stops listening.
     */

  }, {
    key: "onResize",
    value: function onResize(_onResize2) {
      return addGlobalResizeListener$1(_onResize2, {
        itemsContainerElement: this.getItemsContainerElement()
      });
    } // isVisible() {
    // 	return true
    // }

  }]);

  return ScrollableWindowContainer;
}(ScrollableContainer$1);
/**
 * Adds a "resize" event listener to the `window`.
 * @param {onResize} Should be called whenever the "scrollable container"'s width or height (potentially) changes.
 * @param  {Element} options.itemsContainerElement — The items "container" element, which is not the same as the "scrollable container" element. For example, "scrollable container" could be resized while the list element retaining its size. One such example is a user entering fullscreen mode on an HTML5 `<video/>` element: in that case, a "resize" event is triggered on a window, and window dimensions change to the user's screen size, but such "resize" event can be ignored because the list isn't visible until the user exits fullscreen mode.
 * @return {function} Returns a function that stops listening.
 */

function addGlobalResizeListener$1(onResize, _ref) {
  var itemsContainerElement = _ref.itemsContainerElement;

  var onResizeListener = function onResizeListener() {
    // By default, `VirtualScroller` always performs a re-layout
    // on window `resize` event. But browsers (Chrome, Firefox)
    // [trigger](https://developer.mozilla.org/en-US/docs/Web/API/Window/fullScreen#Notes)
    // window `resize` event also when a user switches into fullscreen mode:
    // for example, when a user is watching a video and double-clicks on it
    // to maximize it. And also when the user goes out of the fullscreen mode.
    // Each such fullscreen mode entering/exiting will trigger window `resize`
    // event that will it turn trigger a re-layout of `VirtualScroller`,
    // resulting in bad user experience. To prevent that, such cases are filtered out.
    // Some other workaround:
    // https://stackoverflow.com/questions/23770449/embedded-youtube-video-fullscreen-or-causing-resize
    if (document.fullscreenElement) {
      // If the fullscreened element doesn't contain the list
      // (and is not the list itself), then the layout hasn't been affected,
      // so don't perform a re-layout.
      //
      // For example, suppose there's a list of items, and some item contains a video.
      // If, upon clicking such video, it plays inline, and the user enters
      // fullscreen mode while playing such inline video, then the layout won't be
      // affected, and so such `resize` event should be ignored: when
      // `document.fullscreenElement` is in a separate "branch" relative to the
      // `container`.
      //
      // Another scenario: suppose that upon click, the video doesn't play inline,
      // but instead a "Slideshow" component is open, with the video shown at the
      // center of the screen in an overlay. If then the user enters fullscreen mode,
      // the layout wouldn't be affected too, so such `resize` event should also be
      // ignored: when `document.fullscreenElement` is inside the `container`.
      //
      if (document.fullscreenElement.contains(itemsContainerElement)) ; else {
        // The element is either inside the `container`,
        // Or is in a separate tree.
        // So the `resize` event won't affect the `container`'s dimensions.
        return;
      }
    }

    onResize();
  };

  window.addEventListener('resize', onResizeListener);
  return function () {
    return window.removeEventListener('resize', onResizeListener);
  };
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, basedir, module) {
	return module = {
		path: basedir,
		exports: {},
		require: function (path, base) {
			return commonjsRequire();
		}
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var performanceNow = createCommonjsModule(function (module) {
// Generated by CoffeeScript 1.12.2
(function() {
  var getNanoSeconds, hrtime, loadTime, moduleLoadTime, nodeLoadTime, upTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - nodeLoadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    moduleLoadTime = getNanoSeconds();
    upTime = process.uptime() * 1e9;
    nodeLoadTime = moduleLoadTime - upTime;
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(commonjsGlobal);

//# sourceMappingURL=performance-now.js.map
});

var root = typeof window === 'undefined' ? commonjsGlobal : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix];

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix];
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix];
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60;

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = performanceNow()
        , next = Math.max(0, frameDuration - (_now - last));
      last = next + _now;
      setTimeout(function() {
        var cp = queue.slice(0);
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0;
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last);
            } catch(e) {
              setTimeout(function() { throw e }, 0);
            }
          }
        }
      }, Math.round(next));
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    });
    return id
  };

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true;
      }
    }
  };
}

var raf_1 = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
};
var cancel = function() {
  caf.apply(root, arguments);
};
var polyfill = function(object) {
  if (!object) {
    object = root;
  }
  object.requestAnimationFrame = raf;
  object.cancelAnimationFrame = caf;
};
raf_1.cancel = cancel;
raf_1.polyfill = polyfill;

var cancelAnimationFrame = raf_1.cancel;
function setTimeout$1(callback, delay) {
  var startedAt = Date.now();
  var animationFrame = raf_1(tick);

  function tick() {
    if (Date.now() - startedAt >= delay) {
      callback();
    } else {
      animationFrame = raf_1(tick);
    }
  }

  return {
    clear: function clear() {
      return cancelAnimationFrame(animationFrame);
    }
  };
}
function clearTimeout(timeout) {
  if (timeout) {
    timeout.clear();
  }
}

function _classCallCheck$7(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$7(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$7(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$7(Constructor.prototype, protoProps); if (staticProps) _defineProperties$7(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var WATCH_LIST_TOP_OFFSET_INTERVAL$1 = 500; // Refreshing for 3 seconds after the initial page load seems reasonable.

var WATCH_LIST_TOP_OFFSET_MAX_DURATION$1 = 3000; // `VirtualScroller` calls `this.layout.layOut()` on mount,
// but if the page styles are applied after `VirtualScroller` mounts
// (for example, if styles are applied via javascript, like Webpack does)
// then the list might not render correctly and it will only show the first item.
// The reason is that in that case calling `.getListTopOffset()` on mount
// returns "incorrect" `top` position because the styles haven't been applied yet.
//
// For example, consider a page:
//
// <div class="page">
//   <nav class="sidebar">...</nav>
//   <main>...</main>
// </div>
//
// The sidebar is styled as `position: fixed`, but, until
// the page styles have been applied, it's gonna be a regular `<div/>`
// meaning that `<main/>` will be rendered below the sidebar
// and will appear offscreen, and so it will only render the first item.
//
// Then, the page styles are loaded and applied, and the sidebar
// is now `position: fixed`, so `<main/>` is now rendered at the top of the page,
// but `VirtualScroller`'s `.render()` has already been called
// and it won't re-render until the user scrolls or the window is resized.
//
// This type of a bug doesn't seem to occur in production, but it can appear
// in development mode when using Webpack. The workaround `VirtualScroller`
// implements for such cases is calling `.getListTopOffset()`
// on the list container DOM element periodically (every second) to check
// if the `top` coordinate has changed as a result of CSS being applied:
// if it has then it recalculates the shown item indexes.
//
// Maybe this bug could occur in production when using Webpack chunks.
// That depends on how a style of a chunk is added to the page:
// if it's added via `javascript` after the page has been rendered
// then this workaround will also work for that case.
//
// Another example would be a page having a really tall expanded "accordion"
// section, below which a `VirtualScroller` list resides. If the user un-expands
// such expanded "accordion" section, the list would become visible but
// it wouldn't get re-rendered because no `scroll` event has occured,
// and the list only re-renders automatically on `scroll` events.
// To work around such cases, call `virtualScroller.updateLayout()` method manually.
// The workaround below could be extended to refresh the list's top coordinate
// indefinitely and at higher intervals, but why waste CPU time on that.
// There doesn't seem to be any DOM API for tracking an element's top position.
// There is `IntersectionObserver` API but it doesn't exactly do that.
//

var ListTopOffsetWatcher$1 = /*#__PURE__*/function () {
  function ListTopOffsetWatcher(_ref) {
    var getListTopOffset = _ref.getListTopOffset,
        onListTopOffsetChange = _ref.onListTopOffsetChange;

    _classCallCheck$7(this, ListTopOffsetWatcher);

    this.getListTopOffset = getListTopOffset;
    this.onListTopOffsetChange = onListTopOffsetChange;
  }

  _createClass$7(ListTopOffsetWatcher, [{
    key: "onListTopOffset",
    value: function onListTopOffset(listTopOffset) {
      if (this.listTopOffsetInsideScrollableContainer === undefined) {
        // Start periodical checks of the list's top offset
        // in order to perform a re-layout in case it changes.
        // See the comments in `ListTopOffsetWatcher.js` file
        // on why can the list's top offset change, and in which circumstances.
        this.start();
      }

      this.listTopOffsetInsideScrollableContainer = listTopOffset;
    }
  }, {
    key: "start",
    value: function start() {
      this._isActive = true;
      this.watchListTopOffset();
    }
  }, {
    key: "isStarted",
    value: function isStarted() {
      return this._isActive;
    }
  }, {
    key: "stop",
    value: function stop() {
      this._isActive = false;

      if (this.watchListTopOffsetTimer) {
        clearTimeout(this.watchListTopOffsetTimer);
        this.watchListTopOffsetTimer = undefined;
      }
    }
  }, {
    key: "watchListTopOffset",
    value: function watchListTopOffset() {
      var _this = this;

      var startedAt = Date.now();

      var check = function check() {
        // If `VirtualScroller` has been unmounted
        // while `setTimeout()` was waiting, then exit.
        if (!_this._isActive) {
          return;
        } // Skip comparing `top` coordinate of the list
        // when this function is called for the first time.


        if (_this.listTopOffsetInsideScrollableContainer !== undefined) {
          // Calling `this.getListTopOffset()` on an element
          // runs about 0.003 milliseconds on a modern desktop CPU,
          // so I guess it's fine calling it twice a second.
          if (_this.getListTopOffset() !== _this.listTopOffsetInsideScrollableContainer) {
            _this.onListTopOffsetChange();
          }
        } // Compare `top` coordinate of the list twice a second
        // to find out if it has changed as a result of loading CSS styles.
        // The total duration of 3 seconds would be enough for any styles to load, I guess.
        // There could be other cases changing the `top` coordinate
        // of the list (like collapsing an "accordeon" panel above the list
        // without scrolling the page), but those cases should be handled
        // by manually calling `.updateLayout()` instance method on `VirtualScroller` instance.


        if (Date.now() - startedAt < WATCH_LIST_TOP_OFFSET_MAX_DURATION$1) {
          _this.watchListTopOffsetTimer = setTimeout$1(check, WATCH_LIST_TOP_OFFSET_INTERVAL$1);
        }
      }; // Run the cycle.


      check();
    }
  }]);

  return ListTopOffsetWatcher;
}();

const DOMEngine = {
  createItemsContainer: function createItemsContainer(getItemsContainerElement) {
    return new ItemsContainer$1(getItemsContainerElement);
  },
  // Creates a `scrollableContainer`.
  // On client side, `scrollableContainer` is always created.
  // On server side, `scrollableContainer` is not created (and not used).
  createScrollableContainer: function createScrollableContainer(getScrollableContainerElement, getItemsContainerElement) {
    if (getScrollableContainerElement) {
      return new ScrollableContainer$1(getScrollableContainerElement, getItemsContainerElement);
    } else if (typeof window !== 'undefined') {
      return new ScrollableWindowContainer(getItemsContainerElement);
    }
  },
  watchListTopOffset: function watchListTopOffset(_ref) {
    var getListTopOffset = _ref.getListTopOffset,
        onListTopOffsetChange = _ref.onListTopOffsetChange;
    return new ListTopOffsetWatcher$1({
      getListTopOffset: getListTopOffset,
      onListTopOffsetChange: onListTopOffsetChange
    });
  }
};

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function log() {
  if (isDebug()) {
    var _console;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    (_console = console).log.apply(_console, _toConsumableArray(['[virtual-scroller]'].concat(args)));
  }
}
function warn() {
  {
    var _console2;

    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    if (warningsAreErrors()) {
      return reportError.apply(this, args);
    }

    (_console2 = console).warn.apply(_console2, _toConsumableArray(['[virtual-scroller]'].concat(args)));
  }
}
function reportError() {
  for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  if (typeof window !== 'undefined') {
    // In a web browser.
    // Output a debug message immediately so that it's known
    // at which point did the error occur between other debug logs.
    log.apply(this, ['ERROR'].concat(args));
    setTimeout(function () {
      // Throw an error in a timeout so that it doesn't interrupt the application's flow.
      // At the same time, by throwing a client-side error, such error could be spotted
      // in some error monitoring software like `sentry.io`, while also being visible
      // in the console.
      // The `.join(' ')` part doesn't support stringifying JSON objects,
      // but those don't seem to be used in any of the error messages.
      throw new Error(['[virtual-scroller]'].concat(args).join(' '));
    }, 0);
  } else {
    var _console3;

    // On a server.
    (_console3 = console).error.apply(_console3, _toConsumableArray(['[virtual-scroller]'].concat(args)));
  }
}
function isDebug() {
  var debug = getDebug();

  if (debug !== undefined) {
    return debug === true || debug === 'debug';
  }
}

function getDebug() {
  return getGlobalVariable('VirtualScrollerDebug');
}

function warningsAreErrors() {
  return getGlobalVariable('VirtualScrollerWarningsAreErrors');
}

function getGlobalVariable(name) {
  if (typeof window !== 'undefined') {
    return window[name];
  } else if (typeof global !== 'undefined') {
    return global[name];
  }
}

function ownKeys$7(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$7(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$7(Object(source), !0).forEach(function (key) { _defineProperty$9(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$7(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty$9(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$6(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$6(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$6(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$6(Constructor.prototype, protoProps); if (staticProps) _defineProperties$6(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var Layout = /*#__PURE__*/function () {
  function Layout(_ref) {
    var bypass = _ref.bypass,
        getInitialEstimatedItemHeight = _ref.getInitialEstimatedItemHeight,
        getInitialEstimatedVisibleItemRowsCount = _ref.getInitialEstimatedVisibleItemRowsCount,
        measureItemsBatchSize = _ref.measureItemsBatchSize,
        getPrerenderMargin = _ref.getPrerenderMargin,
        getVerticalSpacing = _ref.getVerticalSpacing,
        getVerticalSpacingBeforeResize = _ref.getVerticalSpacingBeforeResize,
        getColumnsCount = _ref.getColumnsCount,
        getColumnsCountBeforeResize = _ref.getColumnsCountBeforeResize,
        getItemHeight = _ref.getItemHeight,
        getItemHeightBeforeResize = _ref.getItemHeightBeforeResize,
        getBeforeResizeItemsCount = _ref.getBeforeResizeItemsCount,
        getAverageItemHeight = _ref.getAverageItemHeight,
        getMaxVisibleAreaHeight = _ref.getMaxVisibleAreaHeight,
        getPreviouslyCalculatedLayout = _ref.getPreviouslyCalculatedLayout;

    _classCallCheck$6(this, Layout);

    this.bypass = bypass;
    this.getInitialEstimatedItemHeight = getInitialEstimatedItemHeight;
    this.getInitialEstimatedVisibleItemRowsCount = getInitialEstimatedVisibleItemRowsCount;
    this.measureItemsBatchSize = measureItemsBatchSize;
    this.getPrerenderMargin = getPrerenderMargin;
    this.getVerticalSpacing = getVerticalSpacing;
    this.getVerticalSpacingBeforeResize = getVerticalSpacingBeforeResize;
    this.getColumnsCount = getColumnsCount;
    this.getColumnsCountBeforeResize = getColumnsCountBeforeResize;
    this.getItemHeight = getItemHeight;
    this.getItemHeightBeforeResize = getItemHeightBeforeResize;
    this.getBeforeResizeItemsCount = getBeforeResizeItemsCount;
    this.getAverageItemHeight = getAverageItemHeight;
    this.getMaxVisibleAreaHeight = getMaxVisibleAreaHeight; //
    // The "previously calculated layout" feature is not currently used.
    //
    // The current layout snapshot could be stored as a "previously calculated layout" variable
    // so that it could theoretically be used when calculating new layout incrementally
    // rather than from scratch, which would be an optimization.
    //

    this.getPreviouslyCalculatedLayout = getPreviouslyCalculatedLayout;
  } // React `<VirtualScroller/>` component attempts to create the initial state
  // before the component tree has mounted. This could result in an inability to
  // calculate some initial layout values like `columnsCount` or `lastShownItemIndex`.
  // Such errors aren't considered critical because layout will be re-calculated
  // after the component mounts. The workaround is to use some sane default values
  // until the scrollable container has mounted.


  _createClass$6(Layout, [{
    key: "getInitialLayoutValueWithFallback",
    value: function getInitialLayoutValueWithFallback(name, getValue, defaultValue) {
      try {
        return getValue();
      } catch (error) {
        if (error instanceof ScrollableContainerNotReadyError) {
          log('Couldn\'t calculate', name, 'before scrollable container is ready. Default to', defaultValue);
          return defaultValue;
        } else {
          throw error;
        }
      }
    }
  }, {
    key: "getInitialLayoutValues",
    value: function getInitialLayoutValues(_ref2) {
      var _this = this;

      var itemsCount = _ref2.itemsCount,
          columnsCount = _ref2.columnsCount,
          beforeStart = _ref2.beforeStart;
      var firstShownItemIndex;
      var lastShownItemIndex; // If there're no items then `firstShownItemIndex` stays `undefined`.

      if (itemsCount > 0) {
        var getLastShownItemIndex = function getLastShownItemIndex() {
          return _this.getInitialLastShownItemIndex({
            itemsCount: itemsCount,
            columnsCount: columnsCount,
            firstShownItemIndex: firstShownItemIndex
          });
        };

        firstShownItemIndex = 0;
        lastShownItemIndex = beforeStart ? this.getInitialLayoutValueWithFallback('lastShownItemIndex', getLastShownItemIndex, 0) : getLastShownItemIndex();
      }

      return {
        beforeItemsHeight: 0,
        afterItemsHeight: 0,
        firstShownItemIndex: firstShownItemIndex,
        lastShownItemIndex: lastShownItemIndex
      };
    }
  }, {
    key: "getInitialLastShownItemIndex",
    value: function getInitialLastShownItemIndex(_ref3) {
      var itemsCount = _ref3.itemsCount,
          columnsCount = _ref3.columnsCount,
          firstShownItemIndex = _ref3.firstShownItemIndex;

      if (this.bypass) {
        return itemsCount - 1;
      } // On server side, at initialization time,
      // `scrollableContainer` is `undefined`,
      // so default to `1` estimated rows count.


      var estimatedRowsCount = 1;

      if (this.getMaxVisibleAreaHeight()) {
        estimatedRowsCount = this.getEstimatedRowsCountForHeight(this.getMaxVisibleAreaHeight() + this.getPrerenderMargin());
      } else if (this.getInitialEstimatedVisibleItemRowsCount) {
        estimatedRowsCount = this.getInitialEstimatedVisibleItemRowsCount();

        if (isNaN(estimatedRowsCount)) {
          throw new Error('[virtual-scroller] `getEstimatedVisibleItemRowsCount()` must return a number');
        }
      }

      return Math.min(firstShownItemIndex + (estimatedRowsCount * columnsCount - 1), itemsCount - 1);
    }
  }, {
    key: "getEstimatedRowsCountForHeight",
    value: function getEstimatedRowsCountForHeight(height) {
      var estimatedItemHeight = this.getEstimatedItemHeight();
      var verticalSpacing = this.getVerticalSpacing();

      if (estimatedItemHeight) {
        return Math.ceil((height + verticalSpacing) / (estimatedItemHeight + verticalSpacing));
      } else {
        // If no items have been rendered yet, and no `estimatedItemHeight` option
        // has been passed, then default to `1` estimated rows count in any `height`.
        return 1;
      }
    }
    /**
     * Returns estimated list item height.
     * (depends on which items have been previously rendered and measured).
     * @return {number}
     */

  }, {
    key: "getEstimatedItemHeight",
    value: function getEstimatedItemHeight() {
      var averageItemHeight = this.getAverageItemHeight();

      if (averageItemHeight) {
        return averageItemHeight;
      }

      if (this.getInitialEstimatedItemHeight) {
        var estimatedItemHeight = this.getInitialEstimatedItemHeight();

        if (isNaN(estimatedItemHeight)) {
          throw new Error('[virtual-scroller] `getInitialEstimatedItemHeight()` must return a number');
        }

        return estimatedItemHeight;
      }

      return 0;
    }
  }, {
    key: "getLayoutUpdateForItemsDiff",
    value: function getLayoutUpdateForItemsDiff(_ref4, _ref5, _ref6) {
      var firstShownItemIndex = _ref4.firstShownItemIndex,
          lastShownItemIndex = _ref4.lastShownItemIndex,
          beforeItemsHeight = _ref4.beforeItemsHeight,
          afterItemsHeight = _ref4.afterItemsHeight;
      var prependedItemsCount = _ref5.prependedItemsCount,
          appendedItemsCount = _ref5.appendedItemsCount;
      var itemsCount = _ref6.itemsCount,
          columnsCount = _ref6.columnsCount,
          shouldRestoreScrollPosition = _ref6.shouldRestoreScrollPosition,
          onResetGridLayout = _ref6.onResetGridLayout;
      // const layoutUpdate = {}
      // If the layout stays the same, then simply increase
      // the top and bottom margins proportionally to the amount
      // of the items added.
      var averageItemHeight = this.getAverageItemHeight();
      var verticalSpacing = this.getVerticalSpacing();

      if (appendedItemsCount > 0) {
        var appendedRowsCount = Math.ceil(appendedItemsCount / columnsCount);
        var addedHeightAfter = appendedRowsCount * (verticalSpacing + averageItemHeight);
        afterItemsHeight += addedHeightAfter; // layoutUpdate = {
        // 	...layoutUpdate,
        // 	afterItemsHeight
        // }
      }

      if (prependedItemsCount > 0) {
        var prependedRowsCount = Math.ceil(prependedItemsCount / columnsCount);
        var addedHeightBefore = prependedRowsCount * (averageItemHeight + verticalSpacing);
        firstShownItemIndex += prependedItemsCount;
        lastShownItemIndex += prependedItemsCount;
        beforeItemsHeight += addedHeightBefore; // If the currently shown items position on screen should be preserved
        // when prepending new items, then it means that:
        // * The current scroll position should be snapshotted.
        // * The current list height should be snapshotted.
        // * All prepended items should be shown so that their height could be
        //   measured after they're rendered. Based on the prepended items' height,
        //   the scroll position will be restored so that there's no "jump of content".

        if (shouldRestoreScrollPosition) {
          firstShownItemIndex = 0;
          beforeItemsHeight = 0;
        }

        if (prependedItemsCount % columnsCount > 0) {
          // Rows will be rebalanced as a result of prepending new items,
          // and row heights can change as a result, so re-layout items
          // after they've been measured (after the upcoming re-render).
          //
          // For example, consider a web page where item rows are `display: flex`.
          // Suppose there're 3 columns and it shows items from 4 to 6.
          //
          // ------------------------------------------
          // | Apples are  | Bananas    | Cranberries |
          // | green       |            |             |
          // ------------------------------------------
          // | Dates       | Elderberry | Figs are    |
          // |             |            | tasty       |
          // ------------------------------------------
          //
          // Now, 1 item gets prepended. As a result, all existing rows will have
          // a different set of items, which means that the row heights will change.
          //
          // ------------------------------------------
          // | Zucchini    | Apples are | Bananas     |
          // |             | green      |             |
          // ------------------------------------------
          // | Cranberries | Dates      | Elderberry  |
          // ------------------------------------------
          // | Figs        |
          // | are tasty   |
          // ---------------
          //
          // As it can be seen above, the second row's height has changed from 2 to 1.
          // Not only that, but `itemHeights` have changed as well, so if you thought
          // that the library could easily recalculate row heights using `Math.max()` — 
          // turns out it's not always the case.
          //
          // There could be an explicit opt-in option for automatically recalculating
          // row heights, but I don't want to write code for such an extremely rare
          // use case. Instead, use the `getColumnsCount()` parameter function when
          // fetching previous items.
          onResetGridLayout();
          warn('~ Prepended items count', prependedItemsCount, 'is not divisible by Columns Count', columnsCount, '~');
          warn('Layout reset required');
          var shownItemsCountBeforeItemsUpdate = lastShownItemIndex - firstShownItemIndex + 1;
          firstShownItemIndex = 0;
          beforeItemsHeight = 0;

          if (!shouldRestoreScrollPosition) {
            // Limit shown items count if too many items have been prepended.
            if (prependedItemsCount > shownItemsCountBeforeItemsUpdate) {
              lastShownItemIndex = this.getInitialLastShownItemIndex({
                itemsCount: itemsCount,
                columnsCount: columnsCount,
                firstShownItemIndex: firstShownItemIndex
              }); // Approximate `afterItemsHeight` calculation.

              var afterItemsCount = itemsCount - (lastShownItemIndex + 1);
              afterItemsHeight = Math.ceil(afterItemsCount / columnsCount) * (verticalSpacing + averageItemHeight); // layoutUpdate = {
              // 	...layoutUpdate,
              // 	afterItemsHeight
              // }
            }
          }
        } // layoutUpdate = {
        // 	...layoutUpdate,
        // 	beforeItemsHeight,
        // 	firstShownItemIndex,
        // 	lastShownItemIndex
        // }

      } // return layoutUpdate
      // Overwrite all four props in all scenarios.
      // The reason is that only this way subsequent `setItems()` calls
      // will be truly "stateless" when a chain of `setItems()` calls
      // could be replaced with just the last one in a scenario when
      // `updateState()` calls are "asynchronous" (delayed execution).
      //
      // So, for example, the user calls `setItems()` with one set of items.
      // A `updateState()` call has been dispatched but the `state` hasn't been updated yet.
      // Then the user calls `setItems()` with another set of items.
      // If this function only returned a minimal set of properties that actually change,
      // the other layout properties of the second `setItems()` call wouldn't overwrite the ones
      // scheduled for update during the first `setItems()` call, resulting in an inconsistent `state`.
      //
      // For example, the first `setItems()` call does a `updateState()` call where it updates
      // `afterItemsHeight`, and then the second `setItems()` call only updates `beforeItemsHeight`
      // and `firstShownItemIndex` and `lastShownItemIndex`. If the second `setItems()` call was to
      // overwrite any effects of the pending-but-not-yet-applied first `setItems()` call, it would
      // have to call `updateState()` with an `afterItemsHeight` property too, even though it hasn't change.
      // That would be just to revert the change to `afterItemsHeight` state property already scheduled
      // by the first `setItems()` call.
      //


      return {
        beforeItemsHeight: beforeItemsHeight,
        afterItemsHeight: afterItemsHeight,
        firstShownItemIndex: firstShownItemIndex,
        lastShownItemIndex: lastShownItemIndex
      };
    } // If an item that hasn't been shown (and measured) yet is encountered
    // then show such item and then retry after it has been measured.

  }, {
    key: "getItemNotMeasuredIndexes",
    value: function getItemNotMeasuredIndexes(i, _ref7) {
      var itemsCount = _ref7.itemsCount,
          firstShownItemIndex = _ref7.firstShownItemIndex,
          nonMeasuredAreaHeight = _ref7.nonMeasuredAreaHeight,
          indexOfTheFirstItemInTheRow = _ref7.indexOfTheFirstItemInTheRow;
      log('Item index', i, 'height is required for calculations but hasn\'t been measured yet. Mark the item as "shown", rerender the list, measure the item\'s height and redo the layout.');
      var columnsCount = this.getColumnsCount();
      var itemsCountToRenderForMeasurement = Math.min(this.getEstimatedRowsCountForHeight(nonMeasuredAreaHeight) * columnsCount, this.measureItemsBatchSize || Infinity);

      if (firstShownItemIndex === undefined) {
        firstShownItemIndex = indexOfTheFirstItemInTheRow;
      }

      var lastShownItemIndex = Math.min(indexOfTheFirstItemInTheRow + itemsCountToRenderForMeasurement - 1, // Guard against index overflow.
      itemsCount - 1);
      return {
        firstNonMeasuredItemIndex: i,
        firstShownItemIndex: firstShownItemIndex,
        lastShownItemIndex: lastShownItemIndex
      };
    }
    /**
     * Finds the indexes of the currently visible items.
     * @return {object} `{ firstShownItemIndex: number, lastShownItemIndex: number, firstNonMeasuredItemIndex: number? }`
     */

  }, {
    key: "getShownItemIndexes",
    value: function getShownItemIndexes(_ref8) {
      var itemsCount = _ref8.itemsCount,
          visibleAreaTop = _ref8.visibleAreaTop,
          visibleAreaBottom = _ref8.visibleAreaBottom;

      var indexes = this._getShownItemIndex({
        itemsCount: itemsCount,
        fromIndex: 0,
        visibleAreaTop: visibleAreaTop,
        visibleAreaBottom: visibleAreaBottom,
        findFirstShownItemIndex: true
      });

      if (indexes === null) {
        return this.getNonVisibleListShownItemIndexes();
      }

      if (indexes.firstNonMeasuredItemIndex !== undefined) {
        return indexes;
      }

      var _indexes = indexes,
          firstShownItemIndex = _indexes.firstShownItemIndex,
          beforeItemsHeight = _indexes.beforeItemsHeight;
      indexes = this._getShownItemIndex({
        itemsCount: itemsCount,
        fromIndex: firstShownItemIndex,
        beforeItemsHeight: beforeItemsHeight,
        visibleAreaTop: visibleAreaTop,
        visibleAreaBottom: visibleAreaBottom,
        findLastShownItemIndex: true
      });

      if (indexes === null) {
        return this.getNonVisibleListShownItemIndexes();
      }

      if (indexes.firstNonMeasuredItemIndex !== undefined) {
        return indexes;
      }

      var _indexes2 = indexes,
          lastShownItemIndex = _indexes2.lastShownItemIndex;
      return {
        firstShownItemIndex: firstShownItemIndex,
        lastShownItemIndex: lastShownItemIndex
      };
    }
  }, {
    key: "_getShownItemIndex",
    value: function _getShownItemIndex(parameters) {
      var beforeResize = parameters.beforeResize,
          itemsCount = parameters.itemsCount,
          visibleAreaTop = parameters.visibleAreaTop,
          visibleAreaBottom = parameters.visibleAreaBottom,
          findFirstShownItemIndex = parameters.findFirstShownItemIndex,
          findLastShownItemIndex = parameters.findLastShownItemIndex;
      var fromIndex = parameters.fromIndex,
          beforeItemsHeight = parameters.beforeItemsHeight; // This function could potentially also use `this.getPreviouslyCalculatedLayout()`
      // when `fromIndex` is `0`, it's also assumed to be `0`.

      if (fromIndex === 0) {
        beforeItemsHeight = 0;
      }

      if (beforeItemsHeight === undefined) {
        throw new Error('[virtual-scroller] `beforeItemsHeight` not passed to `Layout.getShownItemIndexes()` when starting from index ' + fromIndex);
      } // const backwards = false
      // while (backwards ? i >= 0 : i < itemsCount) {}


      if (!beforeResize) {
        var beforeResizeItemsCount = this.getBeforeResizeItemsCount();

        if (beforeResizeItemsCount > fromIndex) {
          // First search for the item in "before resize" items.
          var _this$_getShownItemIn = this._getShownItemIndex(_objectSpread$7(_objectSpread$7({}, parameters), {}, {
            beforeResize: true,
            itemsCount: beforeResizeItemsCount
          })),
              notFound = _this$_getShownItemIn.notFound,
              beforeResizeItemsHeight = _this$_getShownItemIn.beforeItemsHeight,
              _firstShownItemIndex = _this$_getShownItemIn.firstShownItemIndex,
              _lastShownItemIndex = _this$_getShownItemIn.lastShownItemIndex; // If the item was not found in "before resize" items
          // then search in regular items skipping "before resize" ones.


          if (notFound) {
            beforeItemsHeight = beforeResizeItemsHeight;
            fromIndex += beforeResizeItemsCount;
          } else {
            // If the item was found in "before resize" items
            // then return the result.
            // Rebalance first / last shown item indexes based on
            // the current columns count, if required.
            var _columnsCount = this.getColumnsCount();

            return {
              firstShownItemIndex: _firstShownItemIndex === undefined ? undefined : Math.floor(_firstShownItemIndex / _columnsCount) * _columnsCount,
              lastShownItemIndex: _lastShownItemIndex === undefined ? undefined : Math.floor(_lastShownItemIndex / _columnsCount) * _columnsCount,
              beforeItemsHeight: beforeResizeItemsHeight
            };
          }
        }
      }

      var columnsCount = beforeResize ? this.getColumnsCountBeforeResize() : this.getColumnsCount();
      var verticalSpacing = beforeResize ? this.getVerticalSpacingBeforeResize() : this.getVerticalSpacing();
      var i = fromIndex;

      while (i < itemsCount) {
        var currentRowFirstItemIndex = i;
        var hasMoreRows = itemsCount > currentRowFirstItemIndex + columnsCount;
        var verticalSpacingAfterCurrentRow = hasMoreRows ? verticalSpacing : 0;
        var currentRowHeight = 0; // Calculate current row height.

        var columnIndex = 0;

        while (columnIndex < columnsCount && i < itemsCount) {
          var itemHeight = beforeResize ? this.getItemHeightBeforeResize(i) : this.getItemHeight(i); // If this item hasn't been measured yet (or re-measured after a resize)
          // then mark it as the first non-measured one.
          //
          // Can't happen by definition when `beforeResize` parameter is `true`.
          //

          if (itemHeight === undefined) {
            return this.getItemNotMeasuredIndexes(i, {
              itemsCount: itemsCount,
              firstShownItemIndex: findLastShownItemIndex ? fromIndex : undefined,
              indexOfTheFirstItemInTheRow: currentRowFirstItemIndex,
              nonMeasuredAreaHeight: visibleAreaBottom + this.getPrerenderMargin() - beforeItemsHeight
            });
          }

          currentRowHeight = Math.max(currentRowHeight, itemHeight);
          columnIndex++;
          i++;
        }

        var itemsHeightFromFirstRowToThisRow = beforeItemsHeight + currentRowHeight;
        var rowStepsIntoVisibleAreaTop = itemsHeightFromFirstRowToThisRow > visibleAreaTop - this.getPrerenderMargin();
        var rowStepsOutOfVisibleAreaBottomOrIsAtTheBorder = itemsHeightFromFirstRowToThisRow + verticalSpacingAfterCurrentRow >= visibleAreaBottom + this.getPrerenderMargin(); // if (backwards) {
        // 	if (findFirstShownItemIndex) {
        // 		if (rowStepsOutOfVisibleAreaTop) {
        // 			return {
        // 				firstShownItemIndex: currentRowFirstItemIndex + columnsCount
        // 			}
        // 		}
        // 	} else if (findLastShownItemIndex) {
        // 		if (rowStepsIntoVisibleAreaBottom) {
        // 			return {
        // 				lastShownItemIndex: currentRowFirstItemIndex + columnsCount - 1
        // 			}
        // 		}
        // 	}
        // }

        if (findFirstShownItemIndex) {
          if (rowStepsIntoVisibleAreaTop) {
            // If item is the first one visible in the viewport
            // then start showing items from this row.
            return {
              firstShownItemIndex: currentRowFirstItemIndex,
              beforeItemsHeight: beforeItemsHeight
            };
          }
        } else if (findLastShownItemIndex) {
          if (rowStepsOutOfVisibleAreaBottomOrIsAtTheBorder) {
            return {
              lastShownItemIndex: Math.min( // The index of the last item in the current row.
              currentRowFirstItemIndex + columnsCount - 1, // Guards against index overflow.
              itemsCount - 1)
            };
          }
        }

        beforeItemsHeight += currentRowHeight + verticalSpacingAfterCurrentRow; // if (backwards) {
        // 	// Set `i` to be the first item of the current row.
        // 	i -= columnsCount
        // 	const prevoiusRowIsBeforeResize = i - 1 < this.getBeforeResizeItemsCount()
        // 	const previousRowColumnsCount = prevoiusRowIsBeforeResize ? this.getColumnsCountBeforeResize() : this.getColumnsCount()
        // 	// Set `i` to be the first item of the previous row.
        // 	i -= previousRowColumnsCount
        // }
      } // if (backwards) {
      // 	if (findFirstShownItemIndex) {
      // 		warn('The list is supposed to be visible but no visible item has been found (while traversing backwards)')
      // 		return null
      // 	} else if (findLastShownItemIndex) {
      // 		return {
      // 			firstShownItemIndex: 0
      // 		}
      // 	}
      // }


      if (beforeResize) {
        return {
          notFound: true,
          beforeItemsHeight: beforeItemsHeight
        };
      } // This case isn't supposed to happen but it could hypothetically happen
      // because the list height is measured from the user's screen and
      // not necessarily can be trusted.


      if (findFirstShownItemIndex) {
        warn('The list is supposed to be visible but no visible item has been found');
        return null;
      } else if (findLastShownItemIndex) {
        return {
          lastShownItemIndex: itemsCount - 1
        };
      }
    }
  }, {
    key: "getNonVisibleListShownItemIndexes",
    value: function getNonVisibleListShownItemIndexes() {
      var layout = {
        firstShownItemIndex: 0,
        lastShownItemIndex: 0
      };

      if (this.getItemHeight(0) === undefined) {
        layout.firstNonMeasuredItemIndex = 0;
      }

      return layout;
    }
    /**
     * Measures "before" items height.
     * @param  {number} beforeItemsCount — Basically, first shown item index.
     * @return {number}
     */

  }, {
    key: "getBeforeItemsHeight",
    value: function getBeforeItemsHeight(beforeItemsCount) {
      var _ref9 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          beforeResize = _ref9.beforeResize;

      // This function could potentially also use `this.getPreviouslyCalculatedLayout()`
      // in order to skip calculating visible item indexes from scratch
      // and instead just calculate the difference from a "previously calculated layout".
      //
      // I did a simple test in a web browser and found out that running the following
      // piece of code is less than 10 milliseconds:
      //
      // var startedAt = Date.now()
      // var i = 0
      // while (i < 1000000) {
      //   i++
      // }
      // console.log(Date.now() - startedAt)
      //
      // Which becomes negligible in my project's use case (a couple thousands items max).
      var beforeItemsHeight = 0;
      var i = 0;

      if (!beforeResize) {
        var beforeResizeItemsCount = this.getBeforeResizeItemsCount();

        if (beforeResizeItemsCount > 0) {
          // First add all "before resize" item heights.
          beforeItemsHeight = this.getBeforeItemsHeight( // `firstShownItemIndex` (called `beforeItemsCount`) could be greater than
          // `beforeResizeItemsCount` when the user scrolls down.
          // `firstShownItemIndex` (called `beforeItemsCount`) could be less than
          // `beforeResizeItemsCount` when the user scrolls up.
          Math.min(beforeItemsCount, beforeResizeItemsCount), {
            beforeResize: true
          });
          i = beforeResizeItemsCount;
        }
      }

      var columnsCount = beforeResize ? this.getColumnsCountBeforeResize() : this.getColumnsCount();
      var verticalSpacing = beforeResize ? this.getVerticalSpacingBeforeResize() : this.getVerticalSpacing();

      while (i < beforeItemsCount) {
        var rowHeight = 0;
        var columnIndex = 0; // Not checking for `itemsCount` overflow here because `i = beforeItemsCount`
        // can only start at the start of a row, meaning that when calculating
        // "before items height" it's not supposed to add item heights from the
        // last row of items because in that case it would have to iterate from
        // `i === beforeItemsCount` and that condition is already checked above.
        // while (i < itemsCount) {

        while (columnIndex < columnsCount) {
          var itemHeight = beforeResize ? this.getItemHeightBeforeResize(i) : this.getItemHeight(i);

          if (itemHeight === undefined) {
            // `itemHeight` can only be `undefined` when not `beforeResize`.
            // Use the current "average item height" as a substitute.
            itemHeight = this.getAverageItemHeight();
          }

          rowHeight = Math.max(rowHeight, itemHeight);
          i++;
          columnIndex++;
        }

        beforeItemsHeight += rowHeight;
        beforeItemsHeight += verticalSpacing;
      }

      return beforeItemsHeight;
    }
    /**
     * Measures "after" items height.
     * @param  {number} lastShownItemIndex — Last shown item index.
     * @param  {number} itemsCount — Items count.
     * @return {number}
     */

  }, {
    key: "getAfterItemsHeight",
    value: function getAfterItemsHeight(lastShownItemIndex, itemsCount) {
      // This function could potentially also use `this.getPreviouslyCalculatedLayout()`
      // in order to skip calculating visible item indexes from scratch
      // and instead just calculate the difference from a "previously calculated layout".
      //
      // I did a simple test in a web browser and found out that running the following
      // piece of code is less than 10 milliseconds:
      //
      // var startedAt = Date.now()
      // var i = 0
      // while (i < 1000000) {
      //   i++
      // }
      // console.log(Date.now() - startedAt)
      //
      // Which becomes negligible in my project's use case (a couple thousands items max).
      var columnsCount = this.getColumnsCount();
      var afterItemsHeight = 0;
      var i = lastShownItemIndex + 1;

      while (i < itemsCount) {
        var rowHeight = 0;
        var columnIndex = 0;

        while (columnIndex < columnsCount && i < itemsCount) {
          var itemHeight = this.getItemHeight(i);

          if (itemHeight === undefined) {
            itemHeight = this.getAverageItemHeight();
          }

          rowHeight = Math.max(rowHeight, itemHeight);
          i++;
          columnIndex++;
        } // Add all "after" items height.


        afterItemsHeight += this.getVerticalSpacing();
        afterItemsHeight += rowHeight;
      }

      return afterItemsHeight;
    }
    /**
     * Returns the items's top offset relative to the top edge of the first item.
     * @param {number} i — Item index
     * @return {[number]} Returns `undefined` if any of the previous items haven't been rendered yet.
     */

  }, {
    key: "getItemTopOffset",
    value: function getItemTopOffset(i) {
      var topOffsetInsideScrollableContainer = 0;
      var beforeResizeItemsCount = this.getBeforeResizeItemsCount();
      var beforeResizeRowsCount = beforeResizeItemsCount === 0 ? 0 : Math.ceil(beforeResizeItemsCount / this.getColumnsCountBeforeResize());
      var maxBeforeResizeRowsCount = i < beforeResizeItemsCount ? Math.floor(i / this.getColumnsCountBeforeResize()) : beforeResizeRowsCount;
      var beforeResizeRowIndex = 0;

      while (beforeResizeRowIndex < maxBeforeResizeRowsCount) {
        var rowHeight = this.getItemHeightBeforeResize(beforeResizeRowIndex * this.getColumnsCountBeforeResize());
        topOffsetInsideScrollableContainer += rowHeight;
        topOffsetInsideScrollableContainer += this.getVerticalSpacingBeforeResize();
        beforeResizeRowIndex++;
      }

      var itemRowIndex = Math.floor((i - beforeResizeItemsCount) / this.getColumnsCount());
      var rowIndex = 0;

      while (rowIndex < itemRowIndex) {
        var _rowHeight = 0;
        var columnIndex = 0;

        while (columnIndex < this.getColumnsCount()) {
          var itemHeight = this.getItemHeight(beforeResizeItemsCount + rowIndex * this.getColumnsCount() + columnIndex);

          if (itemHeight === undefined) {
            return;
          }

          _rowHeight = Math.max(_rowHeight, itemHeight);
          columnIndex++;
        }

        topOffsetInsideScrollableContainer += _rowHeight;
        topOffsetInsideScrollableContainer += this.getVerticalSpacing();
        rowIndex++;
      }

      return topOffsetInsideScrollableContainer;
    }
  }]);

  return Layout;
}();
var LAYOUT_REASON = {
  SCROLL: 'scroll',
  STOPPED_SCROLLING: 'stopped scrolling',
  MANUAL: 'manual',
  STARTED: 'started',
  NON_MEASURED_ITEMS_HAVE_BEEN_MEASURED: 'non-measured item heights have been measured',
  VIEWPORT_WIDTH_CHANGED: 'viewport width changed',
  VIEWPORT_HEIGHT_CHANGED: 'viewport height changed',
  VIEWPORT_SIZE_UNCHANGED: 'viewport size unchanged',
  ITEM_HEIGHT_CHANGED: 'item height changed',
  ITEMS_CHANGED: 'items changed',
  TOP_OFFSET_CHANGED: 'list top offset changed'
};

// For some weird reason, in Chrome, `setTimeout()` would lag up to a second (or more) behind.
/**
 * Same as `lodash`'s `debounce()` for functions with no arguments.
 * @param  {function} func — The function.
 * @param  {number} interval
 * @param  {function} [options.onStart]
 * @param  {function} [options.onStop]
 * @return {function} A function that returns a `Promise` which resolves when the underlying (original) function gets executed.
 */

function debounce(func, interval) {
  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
      onStart = _ref.onStart,
      onStop = _ref.onStop;

  var timeout;
  return function () {
    var _this = this;

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return new Promise(function (resolve) {
      if (timeout) {
        clearTimeout(timeout);
      } else {
        if (onStart) {
          onStart();
        }
      }

      timeout = setTimeout$1(function () {
        timeout = undefined;

        if (onStop) {
          onStop();
        }

        func.apply(_this, args);
        resolve();
      }, interval);
    });
  };
}

function _classCallCheck$5(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$5(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$5(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$5(Constructor.prototype, protoProps); if (staticProps) _defineProperties$5(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty$8(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Resize = /*#__PURE__*/function () {
  function Resize(_ref) {
    var _this = this;

    var bypass = _ref.bypass,
        getWidth = _ref.getWidth,
        getHeight = _ref.getHeight,
        listenForResize = _ref.listenForResize,
        onResizeStart = _ref.onResizeStart,
        onResizeStop = _ref.onResizeStop,
        onHeightChange = _ref.onHeightChange,
        onWidthChange = _ref.onWidthChange,
        onNoChange = _ref.onNoChange;

    _classCallCheck$5(this, Resize);

    _defineProperty$8(this, "_onResize", function () {
      // If `VirtualScroller` has been unmounted
      // while `debounce()`'s `setTimeout()` was waiting, then exit.
      // If the `VirtualScroller` gets restarted later, it will detect
      // that `state.scrollableContainerWidth` doesn't match the actual
      // scrollable container width, and will call `this.onResize()`.
      if (!_this.isActive) {
        return;
      }

      var prevScrollableContainerWidth = _this.width;
      var prevScrollableContainerHeight = _this.height;
      _this.width = _this.getWidth();
      _this.height = _this.getHeight();

      if (_this.width === prevScrollableContainerWidth) {
        if (_this.height === prevScrollableContainerHeight) {
          // The dimensions of the container didn't change,
          // so there's no need to re-layout anything.
          _this.onNoChange();
        } else {
          // Scrollable container height has changed,
          // so just recalculate shown item indexes.
          // No need to perform a re-layout from scratch.
          _this.onHeightChange(prevScrollableContainerHeight, _this.height);
        }
      } else {
        // Reset item heights, because if scrollable container's width (or height)
        // has changed, then the list width (or height) most likely also has changed,
        // and also some CSS `@media()` rules might have been added or removed.
        // So re-render the list entirely.
        _this.onWidthChange(prevScrollableContainerWidth, _this.width);
      }
    });

    this.bypass = bypass;
    this.onHeightChange = onHeightChange;
    this.onWidthChange = onWidthChange;
    this.onNoChange = onNoChange;
    this.getWidth = getWidth;
    this.getHeight = getHeight;
    this.listenForResize = listenForResize;
    this.onResize = debounce(this._onResize, SCROLLABLE_CONTAINER_RESIZE_DEBOUNCE_INTERVAL, {
      onStart: onResizeStart,
      onStop: onResizeStop
    });
  }

  _createClass$5(Resize, [{
    key: "start",
    value: function start() {
      this.isActive = true;

      if (this.bypass) {
        return;
      }

      this.width = this.getWidth();
      this.height = this.getHeight();
      this.unlistenResize = this.listenForResize(this.onResize);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.isActive = false;
      this.width = undefined;
      this.height = undefined;

      if (this.unlistenResize) {
        this.unlistenResize();
        this.unlistenResize = undefined;
      }
    }
    /**
     * On scrollable container resize.
     */

  }]);

  return Resize;
}();
var SCROLLABLE_CONTAINER_RESIZE_DEBOUNCE_INTERVAL = 250;

function ownKeys$6(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$6(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$6(Object(source), !0).forEach(function (key) { _defineProperty$7(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$6(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty$7(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$4(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$4(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$4(Constructor.prototype, protoProps); if (staticProps) _defineProperties$4(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var BeforeResize = /*#__PURE__*/function () {
  function BeforeResize(_ref) {
    var getState = _ref.getState,
        getVerticalSpacing = _ref.getVerticalSpacing,
        getColumnsCount = _ref.getColumnsCount;

    _classCallCheck$4(this, BeforeResize);

    this.getState = getState;
    this.getVerticalSpacing = getVerticalSpacing;
    this.getColumnsCount = getColumnsCount;
  }

  _createClass$4(BeforeResize, [{
    key: "initializeFromState",
    value: function initializeFromState(state) {
      this._includesBeforeResizeInState = Boolean(state.beforeResize);
    } // Cleans up "before resize" item heights and adjusts the scroll position accordingly.
    //
    // Hypothetically, it could also wait for the user to stop scrolling and only then
    // adjust the scroll position. The rationale is that if `window.scrollTo()` is called
    // while the user is scrolling, the user would occasionally experience "lost" mouse wheel
    // events when scrolling with a mouse wheel.
    //
    // Seems like Twitter's website waits for the user to stop scrolling before applying
    // the scroll position correction after a window resize. This library could do that too,
    // but that would require rewriting "before items height" top padding calculation
    // so that it doesn't re-calculate it on every re-render and instead does so incrementally,
    // and then, when the user stops, it re-calculates it from scratch removing the error
    // and adjusting the scroll position accordingly so that there's no "jump of content".
    //
    // But, seems like it works fine as it is and there's no need to rewrite anything.
    //

  }, {
    key: "cleanUpBeforeResizeItemHeights",
    value: function cleanUpBeforeResizeItemHeights() {
      var _this$getState = this.getState(),
          firstShownItemIndex = _this$getState.firstShownItemIndex,
          lastShownItemIndex = _this$getState.lastShownItemIndex,
          itemHeights = _this$getState.itemHeights,
          beforeResize = _this$getState.beforeResize; // If there're "before resize" properties in `state`
      // then it means that the corresponding items are waiting to be
      // re-measured after container resize. Since the resize,
      // some of those non-re-measured items might have just been measured,
      // so see if that's true, and if it is, remove those now-obsolete
      // "before resize" item heights and ajust the scroll position
      // so that there's no "content jumping".


      if (beforeResize) {
        // If the user has scrolled up to reveal a previously hidden item
        // that has not yet been re-measured after a previous resize.
        if (firstShownItemIndex < beforeResize.itemHeights.length) {
          log('~ Clean up "before resize" item heights and correct scroll position ~'); // Some of the "before" items have been un-hidden and re-measured.
          // Un-hiding those items would result in a "jump of content"
          // because "before resize" heights of those un-hidden items
          // could (and most likely will) be different from the current ones,
          // or because "before resize" columns count is different from
          // the current one.
          // To prevent a "jump of content", calculate the scroll position
          // difference and adjust the scroll position.
          // The height of the item rows that have transitioned
          // from hidden to shown.

          var newlyShownItemRowsHeight = 0; // Some of the `itemHeights` between the current `firstShownItemIndex` and
          // the previous `firstShownItemIndex` could stay `undefined` if the user
          // scrolled "abruptly": for example, by using a `window.scrollTo()` call.
          // In that case, the items below the visible ones won't be rendered and measured.
          // In such case, limit the items being iterated over to the current `lastShownItemIndex`
          // rather than the previous `firstShownItemIndex`.

          var prevFirstReMeasuredItemsRowIndex = Math.floor(beforeResize.itemHeights.length / this.getColumnsCount());
          var newlyShownItemsToIndex = Math.min(prevFirstReMeasuredItemsRowIndex * this.getColumnsCount() - 1, lastShownItemIndex);
          var i = firstShownItemIndex;

          while (i <= newlyShownItemsToIndex) {
            // Calculate newly shown row height.
            var rowHeight = 0;
            var columnIndex = 0;

            while (columnIndex < this.getColumnsCount() && i <= newlyShownItemsToIndex) {
              var itemHeight = itemHeights[i];

              if (itemHeight === undefined) {
                // `itemHeight` can only be `undefined` when not `beforeResize`.
                // Use the current "average item height" as a substitute.
                itemHeight = this.getAverageItemHeight();
              }

              rowHeight = Math.max(rowHeight, itemHeight);
              i++;
              columnIndex++;
            } // Append to the total "newly shown item rows height".


            newlyShownItemRowsHeight += rowHeight;
            newlyShownItemRowsHeight += this.getVerticalSpacing();
          } // The height of the "before resize" item rows
          // that will be "cleaned up" in this function call.


          var cleanedUpBeforeResizeItemRowsHeight = 0; // Some of the `beforeResize` item rows might have been skipped if the user
          // scrolled up "abruptly": for example, by using a `window.scrollTo()` call.
          // In that case, the "before resize" items below the bottom border of the screen
          // shouldn't be accounted for when calculating the scrollbar adjustment shift
          // because items after `lastShownItemIndex` aren't participating in the calculation
          // of `newlyShownItemRowsHeight`.

          var maxParticipatingBeforeResizeItemsCount = Math.min(beforeResize.itemHeights.length, lastShownItemIndex + 1);
          var participatingBeforeResizeItemRowsCount = Math.ceil(maxParticipatingBeforeResizeItemsCount / beforeResize.columnsCount);
          var firstCleanedUpBeforeResizeItemsRowIndex = firstShownItemIndex === 0 ? 0 : Math.floor((firstShownItemIndex - 1) / beforeResize.columnsCount) + 1;
          var k = firstCleanedUpBeforeResizeItemsRowIndex;

          while (k < participatingBeforeResizeItemRowsCount) {
            var _rowHeight = beforeResize.itemHeights[k * beforeResize.columnsCount];
            cleanedUpBeforeResizeItemRowsHeight += _rowHeight;
            cleanedUpBeforeResizeItemRowsHeight += beforeResize.verticalSpacing;
            k++;
          } // Schedule an asynchronous `this.updateState()` call that will update
          // `beforeResize` property of `state`. Ideally, it should be updated
          // immediately, but since `this.updateState()` calls are asynchronous,
          // the code updates just the underlying `beforeResize.itemHeights`
          // array immediately instead, which is still a hack but still a lesser one.


          if (firstShownItemIndex === 0) {
            log('Drop all "before resize" item heights');
          } else {
            var firstDroppedBeforeResizeItemIndex = firstShownItemIndex;
            var lastDroppedBeforeResizeItemIndex = beforeResize.itemHeights.length - 1;

            if (firstDroppedBeforeResizeItemIndex === lastDroppedBeforeResizeItemIndex) {
              log('For item index', firstDroppedBeforeResizeItemIndex, '— drop "before resize" height', beforeResize.itemHeights[firstDroppedBeforeResizeItemIndex]);
            } else {
              log('For item indexes from', firstDroppedBeforeResizeItemIndex, 'to', lastDroppedBeforeResizeItemIndex, '— drop "before resize" heights', beforeResize.itemHeights.slice(firstDroppedBeforeResizeItemIndex));
            }
          } // Immediately update `beforeResize.itemHeights`
          // so that the component isn't left in an inconsistent state
          // before a `this.updateState()` call below is applied.


          beforeResize.itemHeights.splice(firstShownItemIndex, beforeResize.itemHeights.length - firstShownItemIndex); // Return the "scroll by" amount that would correct the scroll position.
          // Also return a state update.

          return {
            scrollBy: newlyShownItemRowsHeight - cleanedUpBeforeResizeItemRowsHeight,
            beforeResize: firstShownItemIndex === 0 ? undefined : _objectSpread$6({}, beforeResize)
          };
        }
      }
    } // Snapshots "before resize" values in order to preserve the currently
    // shown items' vertical position on screen so that there's no "content jumping".
    //
    // `newFirstShownItemIndex` is `> 0`.
    //

  }, {
    key: "snapshotBeforeResizeItemHeights",
    value: function snapshotBeforeResizeItemHeights(_ref2) {
      var firstShownItemIndex = _ref2.firstShownItemIndex,
          newFirstShownItemIndex = _ref2.newFirstShownItemIndex;
      var columnsCount = this.getColumnsCount();
      var verticalSpacing = this.getVerticalSpacing();
      this._includesBeforeResizeInState = true;

      var _this$getState2 = this.getState(),
          prevBeforeResize = _this$getState2.beforeResize,
          itemHeights = _this$getState2.itemHeights;

      var prevBeforeResizeItemsCount = prevBeforeResize ? prevBeforeResize.itemHeights.length : 0; // If there already are "before resize" values in `state`
      // then it means that those should be merged with the new ones.
      //
      // `beforeResize.itemHeights` could be empty in an edge case
      // when there's a pending state update that sets `beforeResize`
      // to `undefined`, and in that case empty `beforeResize.itemHeights`
      // signals about that type of a situation.
      //

      if (prevBeforeResizeItemsCount > 0) {
        // Because the "previous" before resize values might have been captured
        // for a window width corresponding to a layout with a different columns count
        // and different vertical spacing, re-calculate those item heights as if
        // they corresponded to the current columns count and current vertical spacing,
        // since "previous" and "new" before resize item heights are gonna be merged.
        if (prevBeforeResize.columnsCount !== columnsCount || prevBeforeResize.verticalSpacing !== verticalSpacing) {
          var prevBeforeResizeBeforeItemsHeight = 0;
          var prevBeforeResizeItemRowsCount = Math.ceil(prevBeforeResizeItemsCount / prevBeforeResize.columnsCount);
          var rowIndex = 0;

          while (rowIndex < prevBeforeResizeItemRowsCount) {
            // Since all "before resize" item heights are equal within a row,
            // the height of the first "before resize" item in a row is that row's height.
            var rowHeight = prevBeforeResize.itemHeights[rowIndex * prevBeforeResize.columnsCount];
            prevBeforeResizeBeforeItemsHeight += rowHeight;
            prevBeforeResizeBeforeItemsHeight += prevBeforeResize.verticalSpacing;
            rowIndex++;
          }

          var newBeforeResizeAdditionalBeforeItemsHeight = 0;
          var i = firstShownItemIndex;

          while (i < newFirstShownItemIndex) {
            var _rowHeight2 = 0;
            var k = 0;

            while (k < columnsCount && i < newFirstShownItemIndex) {
              _rowHeight2 = Math.max(_rowHeight2, itemHeights[i]);
              k++;
              i++;
            }

            newBeforeResizeAdditionalBeforeItemsHeight += _rowHeight2;
            newBeforeResizeAdditionalBeforeItemsHeight += verticalSpacing;
          }

          var newBeforeResizeBeforeItemsHeight = prevBeforeResizeBeforeItemsHeight + newBeforeResizeAdditionalBeforeItemsHeight;
          var newBeforeResizeBeforeItemRowsCount = Math.ceil(newFirstShownItemIndex / columnsCount);
          return new Array(newFirstShownItemIndex).fill( // Re-calculate "before resize" item heights so that "previous" and "new" ones
          // correspond to the same (new) columns count.
          // Also don't occasionally set item heights to `< 0`.
          Math.max(0, newBeforeResizeBeforeItemsHeight / newBeforeResizeBeforeItemRowsCount - verticalSpacing));
        } else {
          // Add new item heights to the previously snapshotted ones.
          return prevBeforeResize.itemHeights.concat(equalizeItemHeights(itemHeights, newFirstShownItemIndex, columnsCount).slice(prevBeforeResize.itemHeights.length));
        }
      } else {
        return equalizeItemHeights(itemHeights, newFirstShownItemIndex, columnsCount);
      }
    }
  }, {
    key: "shouldIncludeBeforeResizeValuesInState",
    value: function shouldIncludeBeforeResizeValuesInState() {
      return this._includesBeforeResizeInState;
    }
  }]);

  return BeforeResize;
}(); // Equalizes all item heights within a given row, for each row.

function equalizeItemHeights(itemHeights, maxItemsCount, columnsCount) {
  itemHeights = itemHeights.slice(0, Math.ceil(maxItemsCount / columnsCount) * columnsCount);
  var rowIndex = 0;

  while (rowIndex * columnsCount < maxItemsCount) {
    // Calculate row height.
    var rowHeight = 0;
    var k = 0;

    while (k < columnsCount) {
      rowHeight = Math.max(rowHeight, itemHeights[rowIndex * columnsCount + k]);
      k++;
    } // Equalize all item heights within the row.


    k = 0;

    while (k < columnsCount) {
      itemHeights[rowIndex * columnsCount + k] = rowHeight;
      k++;
    } // Proceed with the next row.


    rowIndex++;
  }

  return itemHeights.slice(0, maxItemsCount);
}

function cleanUpBeforeResizeState(state) {
  if (state.beforeResize) {
    if (state.beforeResize.itemHeights.length === 0) {
      state.beforeResize = undefined;
    }
  }

  return state;
}

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$3(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$3(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$3(Constructor.prototype, protoProps); if (staticProps) _defineProperties$3(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty$6(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Scroll = /*#__PURE__*/function () {
  function Scroll(_ref) {
    var _this = this;

    var bypass = _ref.bypass,
        scrollableContainer = _ref.scrollableContainer,
        itemsContainer = _ref.itemsContainer,
        onScroll = _ref.onScroll,
        initialScrollPosition = _ref.initialScrollPosition,
        onScrollPositionChange = _ref.onScrollPositionChange,
        isImmediateLayoutScheduled = _ref.isImmediateLayoutScheduled,
        hasNonRenderedItemsAtTheTop = _ref.hasNonRenderedItemsAtTheTop,
        hasNonRenderedItemsAtTheBottom = _ref.hasNonRenderedItemsAtTheBottom,
        getLatestLayoutVisibleArea = _ref.getLatestLayoutVisibleArea,
        getListTopOffset = _ref.getListTopOffset,
        getPrerenderMargin = _ref.getPrerenderMargin,
        onScrolledToTop = _ref.onScrolledToTop,
        waitForScrollingToStop = _ref.waitForScrollingToStop;

    _classCallCheck$3(this, Scroll);

    _defineProperty$6(this, "scrollByY", function (scrollByY) {
      _this.scrollToY(_this.getScrollY() + scrollByY);
    });

    _defineProperty$6(this, "onScrollListener", function () {
      if (_this.onScrollPositionChange) {
        _this.onScrollPositionChange(_this.getScrollY());
      } // If the user has scrolled up to the top of the items container.
      // (this option isn't currently used)


      if (_this.onScrolledToTop) {
        if (_this.getScrollY() < _this.getListTopOffset()) {
          _this.onScrolledToTop();
        }
      }

      if (_this.bypass) {
        return;
      }

      if (_this.ignoreScrollEvents) {
        return;
      } // Prefer not performing a re-layout while the user is scrolling (if possible).
      // If the user doesn't scroll too far and then stops for a moment,
      // then a mid-scroll re-layout could be delayed until such a brief stop:
      // presumably, this results in better (smoother) scrolling performance,
      // delaying the work to when it doesn't introduce any stutter or "jank".
      // Reset `this.onStopScrollingTimer` (will be re-created below).


      _this.cancelOnStopScrollingTimer(); // See if the latest "layout" (the currently rendered set of items)
      // is still sufficient in order to show all the items that're
      // currently inside the viewport. If there're some non-rendered items
      // that're visible in the current viewport, then those items
      // should be rendered "immediately" rather than waiting until
      // the user stops scrolling.


      var forceUpdate = // If the items have been rendered at least once
      _this.getLatestLayoutVisibleArea() && ( // If the user has scrolled up past the "prerender margin"
      // and there're some non-rendered items at the top,
      // then force a re-layout.
      //
      // (during these calculations we assume that the list's top coordinate
      //  hasn't changed since previous layout; even if that's not exactly true,
      //  the items will be re-layout when the user stops scrolling anyway)
      //
      _this.getScrollY() < _this.getLatestLayoutVisibleArea().top - _this.getPrerenderMargin() && _this.hasNonRenderedItemsAtTheTop() || // If the user has scrolled down past the "prerender margin"
      // and there're any non-rendered items left at the end,
      // then force a re-layout.
      //
      // (during these calculations we assume that the list's top coordinate
      //  hasn't changed since previous layout; even if that's not exactly true,
      //  the items will be re-layout when the user stops scrolling anyway)
      //
      _this.getScrollY() + _this.scrollableContainer.getHeight() > _this.getLatestLayoutVisibleArea().bottom + _this.getPrerenderMargin() && _this.hasNonRenderedItemsAtTheBottom());

      if (forceUpdate) {
        log('The user has scrolled far enough: perform a re-layout');
      } else {
        log('The user is scrolling: perform a re-layout when they stop scrolling');
      }

      if (forceUpdate || _this.waitForScrollingToStop === false) {
        return _this.onScroll();
      } // If a re-layout is already scheduled at the next "frame",
      // don't schedule a "re-layout when user stops scrolling" timer.


      if (_this.isImmediateLayoutScheduled()) {
        return;
      }

      _this.shouldCallOnScrollListenerWhenStopsScrolling = true;

      _this.watchOnStopScrolling();
    });

    this.bypass = bypass;
    this.scrollableContainer = scrollableContainer;
    this.itemsContainer = itemsContainer;
    this.onScroll = onScroll;
    this.initialScrollPosition = initialScrollPosition;
    this.onScrollPositionChange = onScrollPositionChange;
    this.isImmediateLayoutScheduled = isImmediateLayoutScheduled;
    this.hasNonRenderedItemsAtTheTop = hasNonRenderedItemsAtTheTop;
    this.hasNonRenderedItemsAtTheBottom = hasNonRenderedItemsAtTheBottom;
    this.getLatestLayoutVisibleArea = getLatestLayoutVisibleArea;
    this.getListTopOffset = getListTopOffset;
    this.getPrerenderMargin = getPrerenderMargin;
    this.onScrolledToTop = onScrolledToTop;
    this.waitForScrollingToStop = waitForScrollingToStop;
  }

  _createClass$3(Scroll, [{
    key: "start",
    value: function start() {
      if (this.initialScrollPosition !== undefined) {
        this.scrollToY(this.initialScrollPosition);
        this.initialScrollPosition = undefined;
      }

      if (this.onScrollPositionChange) {
        this.onScrollPositionChange(this.getScrollY());
      }

      this.stopListeningToScroll = this.scrollableContainer.onScroll(this.onScrollListener);
    }
  }, {
    key: "stop",
    value: function stop() {
      this.stopListeningToScroll();
      this.stopListeningToScroll = undefined; // this.onStopScrollingListener = undefined

      this.shouldCallOnScrollListenerWhenStopsScrolling = undefined;
      this.cancelOnStopScrollingTimer();
    }
  }, {
    key: "scrollToY",
    value: function scrollToY(scrollY) {
      this.ignoreScrollEvents = true;
      this.scrollableContainer.scrollToY(scrollY);
      this.ignoreScrollEvents = undefined;
    }
  }, {
    key: "getScrollY",
    value: function getScrollY() {
      return this.scrollableContainer.getScrollY();
    }
  }, {
    key: "cancelOnStopScrollingTimer",
    value: function cancelOnStopScrollingTimer() {
      if (this.onStopScrollingTimer) {
        clearTimeout(this.onStopScrollingTimer);
        this.onStopScrollingTimer = undefined;
      }
    }
  }, {
    key: "cancelScheduledLayout",
    value: function cancelScheduledLayout() {
      // Cancel a "re-layout when user stops scrolling" timer.
      this.cancelOnStopScrollingTimer();
    }
  }, {
    key: "watchOnStopScrolling",
    value: function watchOnStopScrolling() {
      var _this2 = this;

      this.onStopScrollingTimer = setTimeout$1(function () {
        _this2.onStopScrollingTimer = undefined;

        if (_this2.shouldCallOnScrollListenerWhenStopsScrolling) {
          _this2.shouldCallOnScrollListenerWhenStopsScrolling = undefined;

          _this2.onScroll({
            delayed: true
          });
        } // `onStopScrolling()` feature is not currently used.
        // if (this.onStopScrollingListener) {
        // 	const onStopScrollingListener = this.onStopScrollingListener
        // 	this.onStopScrollingListener = undefined
        // 	// `onStopScrollingListener()` may hypothetically schedule
        // 	// another `onStopScrolling()` listener, so set
        // 	// `this.onStopScrollingListener` to `undefined` before
        // 	// calling it rather than after.
        // 	log('~ The user has stopped scrolling ~')
        // 	onStopScrollingListener()
        // }

      }, // "scroll" events are usually dispatched every 16 milliseconds
      // for 60fps refresh rate, so waiting for 100 milliseconds feels
      // reasonable: that would be about 6 frames of inactivity period,
      // which could mean that either the user has stopped scrolling
      // (for a moment) or the browser is lagging and stuttering
      // (skipping frames due to high load).
      // If the user continues scrolling then this timeout is constantly
      // refreshed (cancelled and then re-created).
      ON_STOP_SCROLLING_INACTIVE_PERIOD);
    } // (this function isn't currently used)
    // onStopScrolling(onStopScrollingListener) {
    // 	this.onStopScrollingListener = onStopScrollingListener
    // 	if (!this.onStopScrollingTimer) {
    // 		this.watchOnStopScrolling()
    // 	}
    // }

    /**
     * Returns visible area coordinates relative to the scrollable container.
     * @return {object} `{ top: number, bottom: number }`
     */

  }, {
    key: "getVisibleAreaBounds",
    value: function getVisibleAreaBounds() {
      var scrollY = this.getScrollY();
      return {
        // The first pixel of the screen.
        top: scrollY,
        // The pixel after the last pixel of the screen.
        bottom: scrollY + this.scrollableContainer.getHeight()
      };
    }
  }]);

  return Scroll;
}();
var ON_STOP_SCROLLING_INACTIVE_PERIOD = 100;

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$2(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$2(Constructor.prototype, protoProps); if (staticProps) _defineProperties$2(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ListHeightMeasurement = /*#__PURE__*/function () {
  function ListHeightMeasurement(_ref) {
    var itemsContainer = _ref.itemsContainer,
        getListTopOffset = _ref.getListTopOffset;

    _classCallCheck$2(this, ListHeightMeasurement);

    this.itemsContainer = itemsContainer;
    this.getListTopOffset = getListTopOffset;
  }
  /**
   * Snapshots the list height while `previousItems` are still rendered,
   * before rendering `newItems`. The list height will be re-measured
   * after the new items have been rendered, yielding the list height difference
   * which is gonna be the amount to scroll vertically in order to restore
   * the previous scroll position. Is only used when prepending items.
   * @param  {any[]} previousItems
   * @param  {any[]} newItems
   * @param  {number} prependedItemsCount
   */


  _createClass$2(ListHeightMeasurement, [{
    key: "snapshotListHeightBeforeAddingNewItems",
    value: function snapshotListHeightBeforeAddingNewItems(_ref2) {
      var previousItems = _ref2.previousItems,
          newItems = _ref2.newItems,
          prependedItemsCount = _ref2.prependedItemsCount;

      // If there were no items in the list
      // then there's no point in restoring scroll position.
      if (previousItems.length === 0) {
        return;
      } // If no items were prepended then no need to restore scroll position.


      if (prependedItemsCount === 0) {
        return;
      } // The first item is supposed to be shown when the user clicks
      // "Show previous items" button. If it isn't shown though,
      // could still calculate the first item's top position using
      // the values from `itemHeights` and `verticalSpacing`.
      // But that would be a weird non-realistic scenario.
      // if (firstShownItemIndex > 0) {
      // 	let i = firstShownItemIndex - 1
      // 	while (i >= 0) {
      // 		firstItemTopOffset += itemHeights[i] + verticalSpacing
      // 		i--
      // 	}
      // }
      // This part is longer relevant: <ReactVirtualScroller/> no longer calls
      // this function two times consequtively.
      //
      // // If the scroll position has already been captured for restoration,
      // // then don't capture it the second time.
      // if (this._snapshot &&
      // 	this._snapshot.previousItems === previousItems &&
      // 	this._snapshot.newItems === newItems) {
      // 	return
      // }


      this._snapshot = {
        previousItems: previousItems,
        newItems: newItems,
        itemIndex: prependedItemsCount,
        itemTopOffset: this.itemsContainer.getNthRenderedItemTopOffset(0),
        // Snapshot list top offset inside the scrollable container too
        // because it's common to hide the "Show previous items" button
        // when the user has browsed to the top of the list, which causes
        // the list's top position to shift upwards due to the button
        // no longer being rendered. Tracking list top offset doesn't
        // fit here that well, but it makes sense in real-world applications.
        listTopOffset: this.getListTopOffset()
      };
    }
  }, {
    key: "getAnchorItemIndex",
    value: function getAnchorItemIndex() {
      return this._snapshot.itemIndex;
    }
  }, {
    key: "hasSnapshot",
    value: function hasSnapshot() {
      return this._snapshot !== undefined;
    }
  }, {
    key: "getListBottomOffsetChange",
    value: function getListBottomOffsetChange() {
      var _this$_snapshot = this._snapshot,
          itemIndex = _this$_snapshot.itemIndex,
          itemTopOffset = _this$_snapshot.itemTopOffset,
          listTopOffset = _this$_snapshot.listTopOffset; // `firstShownItemIndex` is supposed to be `0` at this point,
      // so `renderedElementIndex` would be the same as the `itemIndex`.

      var itemTopOffsetNew = this.itemsContainer.getNthRenderedItemTopOffset(itemIndex);
      var listTopOffsetNew = this.getListTopOffset();
      return itemTopOffsetNew - itemTopOffset + (listTopOffsetNew - listTopOffset);
    }
  }, {
    key: "reset",
    value: function reset() {
      this._snapshot = undefined;
    }
  }]);

  return ListHeightMeasurement;
}();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties$1(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass$1(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties$1(Constructor.prototype, protoProps); if (staticProps) _defineProperties$1(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

var ItemHeights = /*#__PURE__*/function () {
  function ItemHeights(_ref) {
    var container = _ref.container,
        getItemHeight = _ref.getItemHeight,
        setItemHeight = _ref.setItemHeight;

    _classCallCheck$1(this, ItemHeights);

    this.container = container;
    this._get = getItemHeight;
    this._set = setItemHeight;
    this.reset();
  }

  _createClass$1(ItemHeights, [{
    key: "reset",
    value: function reset() {
      this.measuredItemsHeight = 0; // "First measured item index" variable was introduced
      // because it's not always `0`: when `virtualScroller.setItems()`
      // is called, some items might get prepended, in which case
      // `this.lastMeasuredItemIndex` is updated. If there was no
      // `this.firstMeasuredItemIndex`, then the average item height
      // calculated in `.getAverage()` would be incorrect in the timeframe
      // between `.setItems()` is called and those changes have been rendered.
      // And in that timeframe, `.getAverage()` is used to calculate the "layout":
      // stuff like "before/after items height" and "estimated items count on screen".

      this.firstMeasuredItemIndex = undefined;
      this.lastMeasuredItemIndex = undefined;
    }
    /**
     * Can only be called after a `.reset()` (including new instance creation).
     * Initializes `this.measuredItemsHeight`, `this.firstMeasuredItemIndex`
     * and `this.lastMeasuredItemIndex` instance variables from `VirtualScroller` `state`.
     * These instance variables are used when calculating "average" item height:
     * the "average" item height is simply `this.measuredItemsHeight` divided by
     * `this.lastMeasuredItemIndex` minus `this.firstMeasuredItemIndex` plus 1.
     */

  }, {
    key: "readItemHeightsFromState",
    value: function readItemHeightsFromState(_ref2) {
      var itemHeights = _ref2.itemHeights;
      var i = 0;

      while (i < itemHeights.length) {
        if (itemHeights[i] === undefined) {
          if (this.firstMeasuredItemIndex !== undefined) {
            this.lastMeasuredItemIndex = i - 1;
            break;
          }
        } else {
          if (this.firstMeasuredItemIndex === undefined) {
            this.firstMeasuredItemIndex = i;
          }

          this.measuredItemsHeight += itemHeights[i];
        }

        i++;
      }
    } // Seems to be no longer used.
    // getItemHeight(i, firstShownItemIndex) {
    // 	if (this._get(i)) {
    // 		return this._get(i)
    // 	}
    // 	const itemHeight = this._measureItemHeight(i, firstShownItemIndex)
    // 	if (itemHeight) {
    // 		this._set(i, itemHeight)
    // 		return itemHeight
    // 	}
    // 	return this.getAverage()
    // }

  }, {
    key: "_measureItemHeight",
    value: function _measureItemHeight(i, firstShownItemIndex) {
      return this.container.getNthRenderedItemHeight(i - firstShownItemIndex);
    }
    /**
     * Measures item heights:
     *
     * * For the items that haven't been previously measured,
     *   measures them for the first time.
     *
     * * For the items that have been previoulsy measured,
     *   validate that their previously measured height
     *   is still equal to their current height.
     *   The unequalness may not necessarily be caused by
     *   incorrect use of `virtual-scroller`: there are
     *   also some valid use cases when such unequalness
     *   could happen (see the comments in the code).
     *
     * @param {number} firstShownItemIndex
     * @param {number} lastShownItemIndex
     * @return {number[]} The indexes of the items that have not previously been measured and have been measured now.
     */

  }, {
    key: "measureItemHeights",
    value: function measureItemHeights(firstShownItemIndex, lastShownItemIndex) {
      log('~ Measure item heights ~'); // If no items are rendered, don't measure anything.

      if (firstShownItemIndex === undefined) {
        return;
      } // Reset `this.measuredItemsHeight` if it's not a "continuous" measured items list:
      // if a group of items has been measured previously, and now it has rendered a completely
      // different group of items, and there's a non-measured "gap" between those two groups,
      // then reset `this.measuredItemsHeight` and "first measured"/"last measured" item indexes.
      // For example, this could happen when `.setItems()` prepends a lot of new items.


      if (this.firstMeasuredItemIndex !== undefined) {
        if (firstShownItemIndex > this.lastMeasuredItemIndex + 1 || lastShownItemIndex < this.firstMeasuredItemIndex - 1) {
          // Reset.
          log('Non-measured items gap detected. Reset first and last measured item indexes.');
          this.reset();
        }
      }

      var nonPreviouslyMeasuredItemIndexes = [];
      var previousFirstMeasuredItemIndex = this.firstMeasuredItemIndex;
      var previousLastMeasuredItemIndex = this.lastMeasuredItemIndex;
      var firstMeasuredItemIndexHasBeenUpdated = false;
      var i = firstShownItemIndex;

      while (i <= lastShownItemIndex) {
        // Measure item heights that haven't been measured previously.
        // Don't re-measure item heights that have been measured previously.
        // The rationale is that developers are supposed to manually call
        // `.onItemHeightChange()` every time an item's height changes.
        // If developers don't neglect that rule, item heights won't
        // change unexpectedly.
        if (this._get(i) === undefined) {
          nonPreviouslyMeasuredItemIndexes.push(i);

          var height = this._measureItemHeight(i, firstShownItemIndex);

          log('Item index', i, 'height', height);

          this._set(i, height); // Update average item height calculation variables
          // related to the previously measured items
          // that're above the items currently being shown.
          // It is known to be a "continuous" measured items list,
          // because the code at the start of this function checks that.


          if (previousFirstMeasuredItemIndex === undefined || i < previousFirstMeasuredItemIndex) {
            this.measuredItemsHeight += height; // Update first measured item index.

            if (!firstMeasuredItemIndexHasBeenUpdated) {
              // log('Set first measured item index', i)
              this.firstMeasuredItemIndex = i;
              firstMeasuredItemIndexHasBeenUpdated = true;
            }
          } // Update average item height calculation variables
          // related to the previously measured items
          // that're below the items currently being shown.
          // It is known to be a "continuous" measured items list,
          // because the code at the start of this function checks that.


          if (previousLastMeasuredItemIndex === undefined || i > previousLastMeasuredItemIndex) {
            // If `previousLastMeasuredItemIndex` is `undefined`
            // then `previousFirstMeasuredItemIndex` is also `undefined`
            // which means that the item's `height` has already been added
            // to `this.measuredItemsHeight` in the code above,
            // so this condition guards against counting the item's `height`
            // twice in `this.measuredItemsHeight`.
            if (previousLastMeasuredItemIndex !== undefined) {
              // Add newly shown item height.
              this.measuredItemsHeight += height;
            } // Update last measured item index.


            this.lastMeasuredItemIndex = i;
          }
        } else {
          // Validate that the item's height didn't change since it was last measured.
          // If it did, then display a warning and update the item's height
          // as an attempt to fix things.
          // If an item's height changes unexpectedly then it means that there'll
          // likely be "content jumping".
          var previousHeight = this._get(i);

          var _height = this._measureItemHeight(i, firstShownItemIndex);

          if (previousHeight !== _height) {
            warn('Item index', i, 'height changed unexpectedly: it was', previousHeight, 'before, but now it is', _height, '. An item\'s height is allowed to change only in two cases: when the item\'s "state" changes and the developer calls `onItemStateChange(i, newState)`, or when the item\'s height changes for some other reason and the developer calls `onItemHeightChange(i)`. Perhaps you forgot to persist the item\'s "state" by calling `onItemStateChange(i, newState)` when it changed, and that "state" got lost when the item element was unmounted, which resulted in a different height when the item was shown again having its "state" reset.'); // Update the item's height as an attempt to fix things.

            this._set(i, _height);
          }
        }

        i++;
      } // // Update average item height.
      // this.updateAverageItemHeight()


      return nonPreviouslyMeasuredItemIndexes;
    }
    /**
     * Re-measures item height.
     * @param  {number} i — Item index.
     * @param  {number} firstShownItemIndex
     */

  }, {
    key: "remeasureItemHeight",
    value: function remeasureItemHeight(i, firstShownItemIndex) {
      var previousHeight = this._get(i);

      var height = this._measureItemHeight(i, firstShownItemIndex); // // Because this function is called from `.onItemHeightChange()`,
      // // there're no guarantees in which circumstances a developer calls it,
      // // and for which item indexes.
      // // Therefore, to guard against cases of incorrect usage,
      // // this function won't crash anything if the item isn't rendered
      // // or hasn't been previously rendered.
      // if (height !== undefined) {
      // 	reportError(`"onItemHeightChange()" has been called for item ${i}, but that item isn't rendered.`)
      // 	return
      // }
      // if (previousHeight === undefined) {
      // 	reportError(`"onItemHeightChange()" has been called for item ${i}, but that item hasn't been rendered before.`)
      // 	return
      // }


      this._set(i, height);

      this.measuredItemsHeight += height - previousHeight;
      return height;
    } // /**
    //  * "Average" item height is stored as an instance variable.
    //  * For example, for caching, so that it isn't calculated every time it's requested.
    //  * But that would be negligible performance gain, not really worth the extra code.
    //  * Another thing it's stored for as an instance variable is
    //  * keeping "previous" "average" item height, because it can be more precise
    //  * than the newly calculated "average" item height, provided it had
    //  * more "samples" (measured items). The newly calculated average item height
    //  * could get less samples in a scenario when the scroll somehow jumps
    //  * from one position to some other distant position: in that case previous
    //  * "total measured items height" is discarded and the new one is initialized.
    //  * Could such situation happen in real life? I guess, it's unlikely.
    //  * So I'm commenting out this code, but still keeping it just in case.
    //  */
    // updateAverageItemHeight() {
    // 	this.averageItemHeightSamplesCount = this.lastMeasuredItemIndex - this.firstMeasuredItemIndex + 1
    // 	this.averageItemHeight = this.measuredItemsHeight / this.averageItemHeightSamplesCount
    // }
    //
    // /**
    //  * Public API: is called by `VirtualScroller`.
    //  * @return {number}
    //  */
    // getAverage() {
    // 	// Previously measured average item height might still be
    // 	// more precise if it contains more measured items ("samples").
    // 	if (this.previousAverageItemHeight) {
    // 		if (this.previousAverageItemHeightSamplesCount > this.averageItemHeightSamplesCount) {
    // 			return this.previousAverageItemHeight
    // 		}
    // 	}
    // 	return this.averageItemHeight || 0
    // }

    /**
     * Public API: is called by `VirtualScroller`.
     * @return {number}
     */

  }, {
    key: "getAverage",
    value: function getAverage() {
      if (this.lastMeasuredItemIndex === undefined) {
        return 0;
      }

      return this.measuredItemsHeight / (this.lastMeasuredItemIndex - this.firstMeasuredItemIndex + 1);
    }
  }, {
    key: "onPrepend",
    value: function onPrepend(count) {
      if (this.firstMeasuredItemIndex !== undefined) {
        this.firstMeasuredItemIndex += count;
        this.lastMeasuredItemIndex += count;
      }
    }
  }]);

  return ItemHeights;
}();

function ownKeys$5(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$5(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$5(Object(source), !0).forEach(function (key) { _defineProperty$5(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$5(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty$5(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Creates a snapshot of a `state` or a partial update of a `state`.
// Is only used for logging state snapshots for later debug.
//
// When `state` is output to the browser console via `console.log()`,
// it is explorable in real time. That also means that if that `state`
// is modified later, the user will see the modified state, not the
// original one. In the current implementation, `state` is not strictly
// "immutable": things like individual item heights (including "before resize" ones)
// or states are updated in-place — `state.itemHeights[i] = newItemHeight` or
// `state.itemStates[i] = newItemState`. That's because those `state` properties
// are the ones that don’t affect the presentation, so there's no need to re-render
// the list when those do change — updating those properties is just an effect of
// some change rather than cause for one.
//
// So, when outputting `state` via `console.log()` for debug, it makes sense to
// snapshot it so that the developer, while debugging later, sees the correct
// item heights or item states.
//
function getStateSnapshot(state) {
  var stateSnapshot = _objectSpread$5({}, state);

  if (state.itemHeights) {
    stateSnapshot.itemHeights = state.itemHeights.slice();
  }

  if (state.itemStates) {
    stateSnapshot.itemStates = state.itemStates.slice();
  }

  if (state.beforeResize) {
    stateSnapshot.beforeResize = _objectSpread$5({}, state.beforeResize);
    stateSnapshot.beforeResize.itemHeights = state.beforeResize.itemHeights.slice();
  }

  return stateSnapshot;
}

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$4(Object(source), !0).forEach(function (key) { _defineProperty$4(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$4(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
//
// * On scroll.
// * On window resize.
// * On set new items.
//
// State updates may be "asynchronous" (like in React), in which case the
// corresponding operation is "pending" until the state update is applied.
//
// If there's a "pending" window resize or a "pending" update of the set of items,
// then "on scroll" updates aren't dispatched.
//
// If there's a "pending" on scroll update and the window is resize or a new set
// of items is set, then that "pending" on scroll update gets overwritten.
//
// If there's a "pending" update of the set of items, then window resize handler
// sees that "pending" update and dispatches its own state update so that the
// "pending" state update originating from `setItems()` is not lost.
//
// If there's a "pending" window resize, and a new set of items is set,
// then the state update of the window resize handler gets overwritten.

function createStateHelpers(_ref) {
  var _this = this;

  var state = _ref.state,
      onStateChange = _ref.onStateChange,
      render = _ref.render,
      initialItems = _ref.items;
  this.onStateChange = onStateChange;
  this._render = render;

  this._onItemStateChange = function (i, newItemState) {
    if (isDebug()) {
      log('~ Item state changed ~');
      log('Item', i); // Uses `JSON.stringify()` here instead of just outputting the JSON objects as is
      // because outputting JSON objects as is would show different results later when
      // the developer inspects those in the web browser console if those state objects
      // get modified in between they've been output to the console and the developer
      // decided to inspect them.

      log('Previous state' + '\n' + JSON.stringify(_this.getState().itemStates[i], null, 2));
      log('New state' + '\n' + JSON.stringify(newItemState, null, 2));
    }

    _this.getState().itemStates[i] = newItemState; // Schedule the item state update for after the new items have been rendered.

    if (_this.newItemsWillBeRendered) {
      if (!_this.itemStatesThatChangedWhileNewItemsWereBeingRendered) {
        _this.itemStatesThatChangedWhileNewItemsWereBeingRendered = {};
      }

      _this.itemStatesThatChangedWhileNewItemsWereBeingRendered[String(i)] = newItemState;
    }
  };

  this.getState = function () {
    return _this._getState();
  };

  this.updateState = function (stateUpdate) {
    if (isDebug()) {
      log('~ Set state ~');
      log(getStateSnapshot(stateUpdate));
    } // Ensure that a non-initial `stateUpdate` can only contain an `items`
    // property when it comes from a `setItems()` call.


    if (stateUpdate.items) {
      if (!_this._isSettingNewItems) {
        reportError('A `stateUpdate` can only contain `items` property as a result of calling `.setItems()`');
      }
    }

    _this._isSettingNewItems = undefined; // Update `state`.

    _this.previousState = _this.getState();

    _this._updateState(stateUpdate);
  };

  this.getInitialState = function () {
    if (state) {
      return getRestoredState.call(_this, state);
    }

    return getInitialStateFromScratch.call(_this);
  };

  this.useState = function (_ref2) {
    var getState = _ref2.getState,
        updateState = _ref2.updateState;

    if (_this._isActive) {
      throw new Error('[virtual-scroller] `VirtualScroller` has already been started');
    }

    if (_this._getState) {
      throw new Error('[virtual-scroller] Custom state storage has already been configured');
    }

    if (render) {
      throw new Error('[virtual-scroller] Creating a `VirtualScroller` class instance with a `render()` parameter means using the default (internal) state storage');
    }

    if (!getState || !updateState) {
      throw new Error('[virtual-scroller] When using a custom state storage, one must supply both `getState()` and `updateState()` functions');
    }

    _this._usesCustomStateStorage = true;
    _this._getState = getState;
    _this._updateState = updateState;
  };

  this.useDefaultStateStorage = function () {
    if (!render) {
      throw new Error('[virtual-scroller] When using the default (internal) state management, one must supply a `render(state, prevState)` function parameter');
    } // Create default `getState()`/`updateState()` functions.


    _this._getState = defaultGetState.bind(_this);
    _this._updateState = defaultUpdateState.bind(_this); // When `state` is stored externally, a developer is responsible for
    // initializing it with the initial value.
    // Otherwise, if default state management is used, set the initial state now.

    var setInitialState = defaultSetInitialState.bind(_this);
    setInitialState(_this.getInitialState());
  };

  function defaultGetState() {
    return this.state;
  }

  function defaultSetInitialState(newState) {
    this.state = newState;
  }

  function defaultUpdateState(stateUpdate) {
    // Because this variant of `.updateState()` is "synchronous" (immediate),
    // it can be written like `...prevState`, and no state updates would be lost.
    // But if it was "asynchronous" (not immediate), then `...prevState`
    // wouldn't work in all cases, because it could be stale in cases
    // when more than a single `updateState()` call is made before
    // the state actually updates, making `prevState` stale.
    this.state = _objectSpread$4(_objectSpread$4({}, this.state), stateUpdate);
    render(this.state, this.previousState);
    this.onRender();
  }
  /**
   * Returns the initial state of the `VirtualScroller` "from scratch".
   * (i.e. not from a previously saved one).
   * @return {object}
   */


  function getInitialStateFromScratch() {
    var items = initialItems;

    var state = _objectSpread$4(_objectSpread$4({}, getInitialLayoutState.call(this, items, {
      beforeStart: true
    })), {}, {
      items: items,
      itemStates: new Array(items.length)
    });

    if (isDebug()) {
      log('Initial state (autogenerated)', getStateSnapshot(state));
    }

    log('First shown item index', state.firstShownItemIndex);
    log('Last shown item index', state.lastShownItemIndex);
    return state;
  }

  function getRestoredState(state) {
    if (isDebug()) {
      log('Restore state', getStateSnapshot(state));
    } // Possibly clean up "before resize" property in state.
    // "Before resize" state property is cleaned up when all "before resize" item heights
    // have been re-measured in an asynchronous `this.updateState({ beforeResize: undefined })` call.
    // If `VirtualScroller` state was snapshotted externally before that `this.updateState()` call
    // has been applied, then "before resize" property might have not been cleaned up properly.


    state = cleanUpBeforeResizeState(state); // Reset `verticalSpacing` so that it re-measures it after the list
    // has been rendered initially. The rationale is that a previously captured
    // inter-item vertical spacing can't be "trusted" in a sense that the user
    // might have resized the window after the previous `state` has been snapshotted.
    // If the user has resized the window, then changing window width might have
    // activated different CSS `@media()` "queries" resulting in a potentially different
    // vertical spacing when the `VirtualScroller` is re-created with such previously
    // snapshotted state.

    state = _objectSpread$4(_objectSpread$4({}, state), {}, {
      verticalSpacing: undefined
    }); // `this.verticalSpacing` acts as a "true" source for vertical spacing value.
    // Vertical spacing is also stored in `state` but `state` updates could be
    // "asynchronous" (not applied immediately) and `this.onUpdateShownItemIndexes()`
    // requires vertical spacing to be correct at any time, without any delays.
    // So, vertical spacing is also duplicated in `state`, but the "true" source
    // is still `this.verticalSpacing`.
    //
    // `this.verticalSpacing` must be initialized before calling `this.getInitialStateFromScratch()`
    // because `this.getInitialStateFromScratch()` uses `this.verticalSpacing` in its calculations.
    //
    // With the code above, `state.verticalSpacing` is always gonna be `undefined`,
    // so commented out this code. It's safer to just re-measure vertical spacing
    // from scratch when `VirtualScroller` is mounted.
    //
    // this.verticalSpacing = state ? state.verticalSpacing : undefined
    // Check if the actual `columnsCount` on the screen matches the one from state.

    if (isStateColumnsCountMismatch(state, {
      columnsCount: this.getActualColumnsCount()
    })) {
      warn('Reset Layout');
      state = _objectSpread$4(_objectSpread$4({}, state), getInitialLayoutState.call(this, state.items, {
        beforeStart: false
      }));
    }

    return state;
  }

  function getInitialLayoutState(items, _ref3) {
    var _this2 = this;

    var beforeStart = _ref3.beforeStart;
    var itemsCount = items.length;

    var getColumnsCount = function getColumnsCount() {
      return _this2.getActualColumnsCount();
    };

    beforeStart ? this.layout.getInitialLayoutValueWithFallback('columnsCount', getColumnsCount, 1) : getColumnsCount();

    var _this$layout$getIniti = this.layout.getInitialLayoutValues({
      itemsCount: itemsCount,
      columnsCount: this.getActualColumnsCount(),
      beforeStart: beforeStart
    }),
        firstShownItemIndex = _this$layout$getIniti.firstShownItemIndex,
        lastShownItemIndex = _this$layout$getIniti.lastShownItemIndex,
        beforeItemsHeight = _this$layout$getIniti.beforeItemsHeight,
        afterItemsHeight = _this$layout$getIniti.afterItemsHeight;

    var itemHeights = new Array(itemsCount); // Optionally preload items to be rendered.

    this.onBeforeShowItems(items, itemHeights, firstShownItemIndex, lastShownItemIndex);
    return {
      itemHeights: itemHeights,
      columnsCount: this.getActualColumnsCountForState(),
      verticalSpacing: this.verticalSpacing,
      firstShownItemIndex: firstShownItemIndex,
      lastShownItemIndex: lastShownItemIndex,
      beforeItemsHeight: beforeItemsHeight,
      afterItemsHeight: afterItemsHeight
    };
  } // Checks if the actual `columnsCount` on the screen matches the one from state.
  //
  // For example, a developer might snapshot `VirtualScroller` state
  // when the user navigates from the page containing the list
  // in order to later restore the list's state when the user goes "Back".
  // But, the user might have also resized the window while being on that
  // "other" page, and when they come "Back", their snapshotted state
  // no longer qualifies. Well, it does qualify, but only partially.
  // For example, `itemStates` are still valid, but first and last shown
  // item indexes aren't.
  //


  function isStateColumnsCountMismatch(state, _ref4) {
    var columnsCount = _ref4.columnsCount;
    var stateColumnsCount = state.columnsCount || 1;

    if (stateColumnsCount !== columnsCount) {
      warn('~ Columns Count changed from', stateColumnsCount, 'to', columnsCount, '~');
      return true;
    }

    var firstShownItemIndex = Math.floor(state.firstShownItemIndex / columnsCount) * columnsCount;

    if (firstShownItemIndex !== state.firstShownItemIndex) {
      warn('~ First Shown Item Index', state.firstShownItemIndex, 'is not divisible by Columns Count', columnsCount, '~');
      return true;
    }
  }
}

function getVerticalSpacing(_ref) {
  var itemsContainer = _ref.itemsContainer,
      renderedItemsCount = _ref.renderedItemsCount;

  if (renderedItemsCount > 1) {
    var firstShownRowTopOffset = itemsContainer.getNthRenderedItemTopOffset(0);
    var firstShownRowHeight = itemsContainer.getNthRenderedItemHeight(0);
    var i = 1;

    while (i < renderedItemsCount) {
      var itemTopOffset = itemsContainer.getNthRenderedItemTopOffset(i);
      var itemHeight = itemsContainer.getNthRenderedItemHeight(i); // If next row is detected.

      if (itemTopOffset !== firstShownRowTopOffset) {
        // Measure inter-row spacing.
        return itemTopOffset - (firstShownRowTopOffset + firstShownRowHeight);
      } // A row height is the maximum of its item heights.


      firstShownRowHeight = Math.max(firstShownRowHeight, itemHeight);
      i++;
    }
  }
}

function createVerticalSpacingHelpers() {
  var _this = this;

  // Bind to `this` in order to prevent bugs when this function is passed by reference
  // and then called with its `this` being unintentionally `window` resulting in
  // the `if` condition being "falsy".
  this.getVerticalSpacing = function () {
    return _this.verticalSpacing || 0;
  };

  this.getVerticalSpacingBeforeResize = function () {
    // `beforeResize.verticalSpacing` can be `undefined`.
    // For example, if `this.updateState({ verticalSpacing })` call hasn't been applied
    // before the resize happened (in case of an "asynchronous" state update).
    var _this$getState = _this.getState(),
        beforeResize = _this$getState.beforeResize;

    return beforeResize && beforeResize.verticalSpacing || 0;
  };
  /**
   * Measures item vertical spacing, if not measured.
   * @return {object} [stateUpdate]
   */


  this.measureVerticalSpacingIfNotMeasured = function () {
    if (_this.verticalSpacing === undefined) {
      _this.verticalSpacing = measureVerticalSpacing.call(_this);
      return _this.verticalSpacing;
    }
  };

  function measureVerticalSpacing() {
    var _this$getState2 = this.getState(),
        firstShownItemIndex = _this$getState2.firstShownItemIndex,
        lastShownItemIndex = _this$getState2.lastShownItemIndex;

    log('~ Measure item vertical spacing ~');
    var verticalSpacing = getVerticalSpacing({
      itemsContainer: this.itemsContainer,
      renderedItemsCount: lastShownItemIndex - firstShownItemIndex + 1
    });

    if (verticalSpacing === undefined) {
      log('Not enough items rendered to measure vertical spacing');
    } else {
      log('Item vertical spacing', verticalSpacing);
      return verticalSpacing;
    }
  }
}

function createColumnsHelpers(_ref) {
  var _this = this;

  var getColumnsCount = _ref.getColumnsCount;

  if (getColumnsCount) {
    var scrollableContainerArgument = {
      getWidth: function getWidth() {
        return _this.scrollableContainer.getWidth();
      }
    };

    this.getActualColumnsCountForState = function () {
      var columnsCount = getColumnsCount(scrollableContainerArgument); // `columnsCount: 1` is effectively same as `columnsCount: undefined`
      // from the code's point of view. This makes one less property in `state`
      // which makes `state` a bit less cluttered (easier for inspection).

      if (columnsCount !== 1) {
        return columnsCount;
      }
    };
  } else {
    this.getActualColumnsCountForState = function () {
      return undefined;
    };
  }

  this.getActualColumnsCount = function () {
    return _this.getActualColumnsCountForState() || 1;
  };

  this.getColumnsCount = function () {
    return _this.getState() && _this.getState().columnsCount || 1;
  };
}

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty$3(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function createLayoutHelpers () {
  var _this = this;

  this.onUpdateShownItemIndexes = function (_ref) {
    var reason = _ref.reason,
        stateUpdate = _ref.stateUpdate;

    // In case of "don't do anything".
    var skip = function skip() {
      if (stateUpdate) {
        _this.updateState(stateUpdate);
      }
    }; // If new `items` have been set and are waiting to be applied,
    // or if the viewport width has changed requiring a re-layout,
    // then temporarily stop all other updates like "on scroll" updates.
    // This prevents `state` being inconsistent, because, for example,
    // both `setItems()` and this function could update `VirtualScroller` state
    // and having them operate in parallel could result in incorrectly calculated
    // `beforeItemsHeight` / `afterItemsHeight` / `firstShownItemIndex` /
    // `lastShownItemIndex`, because, when operating in parallel, this function
    // would have different `items` than the `setItems()` function, so their
    // results could diverge.


    if (_this.newItemsWillBeRendered || _this.widthHasChanged || _this._isResizing) {
      return skip();
    } // If there're no items then there's no need to re-layout anything.


    if (_this.getItemsCount() === 0) {
      return skip();
    } // Cancel a "re-layout when user stops scrolling" timer.


    _this.scroll.cancelScheduledLayout(); // Cancel a re-layout that is scheduled to run at the next "frame",
    // because a re-layout will be performed right now.


    stateUpdate = _this.cancelLayoutTimer({
      stateUpdate: stateUpdate
    }); // Perform a re-layout.

    log("~ Update Layout (on ".concat(reason, ") ~"));
    updateShownItemIndexes.call(_this, {
      stateUpdate: stateUpdate
    });
  };
  /**
   * Updates the "from" and "to" shown item indexes.
   * If the list is visible and some of the items being shown are new
   * and are required to be measured first, then
   * `firstNonMeasuredItemIndex` is defined.
   * If the list is visible and all items being shown have been encountered
   * (and measured) before, then `firstNonMeasuredItemIndex` is `undefined`.
   *
   * The `stateUpdate` parameter is just an optional "additional" state update.
   */


  function updateShownItemIndexes(_ref2) {
    var stateUpdate = _ref2.stateUpdate;
    var startedAt = Date.now(); // Get shown item indexes.

    var _getShownItemIndexes$ = getShownItemIndexes.call(this),
        firstShownItemIndex = _getShownItemIndexes$.firstShownItemIndex,
        lastShownItemIndex = _getShownItemIndexes$.lastShownItemIndex,
        shownItemsHeight = _getShownItemIndexes$.shownItemsHeight,
        firstNonMeasuredItemIndex = _getShownItemIndexes$.firstNonMeasuredItemIndex; // If scroll position is scheduled to be restored after render,
    // then the "anchor" item must be rendered, and all of the prepended
    // items before it, all in a single pass. This way, all of the
    // prepended items' heights could be measured right after the render
    // has finished, and the scroll position can then be immediately restored.


    if (this.listHeightMeasurement.hasSnapshot()) {
      if (lastShownItemIndex < this.listHeightMeasurement.getAnchorItemIndex()) {
        lastShownItemIndex = this.listHeightMeasurement.getAnchorItemIndex();
      } // `firstShownItemIndex` is always `0` when prepending items.
      // And `lastShownItemIndex` always covers all prepended items in this case.
      // None of the prepended items have been rendered before,
      // so their heights are unknown. The code at the start of this function
      // did therefore set `firstNonMeasuredItemIndex` to non-`undefined`
      // in order to render just the first prepended item in order to
      // measure it, and only then make a decision on how many other
      // prepended items to render. But since we've instructed the code
      // to show all of the prepended items at once, there's no need to
      // "redo layout after render". Additionally, if layout was re-done
      // after render, then there would be a short interval of visual
      // "jitter" due to the scroll position not being restored because it'd
      // wait for the second layout to finish instead of being restored
      // right after the first one.


      firstNonMeasuredItemIndex = undefined;
    } // Validate the heights of items to be hidden on next render.
    // For example, a user could click a "Show more" button,
    // or an "Expand YouTube video" button, which would result
    // in the actual height of the list item being different
    // from what has been initially measured in `this.itemHeights[i]`,
    // if the developer didn't call `.onItemStateChange()` and `.onItemHeightChange(i)`.


    if (!validateWillBeHiddenItemHeightsAreAccurate.call(this, firstShownItemIndex, lastShownItemIndex)) {
      log('~ Because some of the will-be-hidden item heights (listed above) have changed since they\'ve last been measured, redo layout. ~'); // Redo layout, now with the correct item heights.

      return updateShownItemIndexes.call(this, {
        stateUpdate: stateUpdate
      });
    } // Measure "before" items height.


    var beforeItemsHeight = this.layout.getBeforeItemsHeight(firstShownItemIndex); // Measure "after" items height.

    var afterItemsHeight = this.layout.getAfterItemsHeight(lastShownItemIndex, this.getItemsCount());
    var layoutDuration = Date.now() - startedAt; // Debugging.

    log('~ Calculated Layout' + (this.bypass ? ' (bypass)' : '') + ' ~');

    if (layoutDuration < SLOW_LAYOUT_DURATION) ; else {
      warn('Layout calculated in', layoutDuration, 'ms');
    }

    if (this.getColumnsCount()) {
      log('Columns count', this.getColumnsCount());
    }

    log('First shown item index', firstShownItemIndex);
    log('Last shown item index', lastShownItemIndex);
    log('Before items height', beforeItemsHeight);
    log('After items height (actual or estimated)', afterItemsHeight);
    log('Average item height (used for estimated after items height calculation)', this.itemHeights.getAverage());

    if (isDebug()) {
      log('Item heights', this.getState().itemHeights.slice());
      log('Item states', this.getState().itemStates.slice());
    } // Optionally preload items to be rendered.


    this.onBeforeShowItems(this.getState().items, this.getState().itemHeights, firstShownItemIndex, lastShownItemIndex); // Set `this.firstNonMeasuredItemIndex`.

    this.firstNonMeasuredItemIndex = firstNonMeasuredItemIndex; // Set "previously calculated layout".
    //
    // The "previously calculated layout" feature is not currently used.
    //
    // The current layout snapshot could be stored as a "previously calculated layout" variable
    // so that it could theoretically be used when calculating new layout incrementally
    // rather than from scratch, which would be an optimization.
    //
    // Currently, this feature is not used, and `shownItemsHeight` property
    // is not returned at all, so don't set any "previously calculated layout".
    //

    if (shownItemsHeight === undefined) {
      this.previouslyCalculatedLayout = undefined;
    } else {
      // If "previously calculated layout" feature would be implmeneted,
      // then this code would set "previously calculate layout" instance variable.
      //
      // What for would this instance variable be used?
      //
      // Instead of using a `this.previouslyCalculatedLayout` instance variable,
      // this code could use `this.getState()` because it reflects what's currently on screen,
      // but there's a single edge case when it could go out of sync —
      // updating item heights externally via `.onItemHeightChange(i)`.
      //
      // If, for example, an item height was updated externally via `.onItemHeightChange(i)`
      // then `this.getState().itemHeights` would get updated immediately but
      // `this.getState().beforeItemsHeight` or `this.getState().afterItemsHeight`
      // would still correspond to the previous item height, so those would be "stale".
      // On the other hand, same values in `this.previouslyCalculatedLayout` instance variable
      // can also be updated immediately, so they won't go out of sync with the updated item height.
      // That seems the only edge case when using a separate `this.previouslyCalculatedLayout`
      // instance variable instead of using `this.getState()` would theoretically be justified.
      //
      this.previouslyCalculatedLayout = {
        firstShownItemIndex: firstShownItemIndex,
        lastShownItemIndex: lastShownItemIndex,
        beforeItemsHeight: beforeItemsHeight,
        shownItemsHeight: shownItemsHeight
      };
    } // Update `VirtualScroller` state.
    // `VirtualScroller` automatically re-renders on state updates.
    //
    // All `state` properties updated here should be overwritten in
    // the implementation of `setItems()` and `onResize()` methods
    // so that the `state` is not left in an inconsistent state
    // whenever there're concurrent `updateState()` updates that could
    // possibly conflict with one another — instead, those state updates
    // should overwrite each other in terms of priority.
    // These "on scroll" updates have the lowest priority compared to
    // the state updates originating from `setItems()` and `onResize()` methods.
    //


    this.updateState(_objectSpread$3({
      firstShownItemIndex: firstShownItemIndex,
      lastShownItemIndex: lastShownItemIndex,
      beforeItemsHeight: beforeItemsHeight,
      afterItemsHeight: afterItemsHeight
    }, stateUpdate));
  }

  function getVisibleArea() {
    var visibleArea = this.scroll.getVisibleAreaBounds();
    this.latestLayoutVisibleArea = visibleArea; // Subtract the top offset of the list inside the scrollable container.

    var listTopOffsetInsideScrollableContainer = this.getListTopOffsetInsideScrollableContainer();
    return {
      top: visibleArea.top - listTopOffsetInsideScrollableContainer,
      bottom: visibleArea.bottom - listTopOffsetInsideScrollableContainer
    };
  }

  function getShownItemIndexes() {
    var itemsCount = this.getItemsCount();

    var _getVisibleArea$call = getVisibleArea.call(this),
        visibleAreaTop = _getVisibleArea$call.top,
        visibleAreaBottom = _getVisibleArea$call.bottom;

    if (this.bypass) {
      return {
        firstShownItemIndex: 0,
        lastShownItemIndex: itemsCount - 1 // shownItemsHeight: this.getState().itemHeights.reduce((sum, itemHeight) => sum + itemHeight, 0)

      };
    } // Find the indexes of the items that are currently visible
    // (or close to being visible) in the scrollable container.
    // For scrollable containers other than the main screen, it could also
    // check the visibility of such scrollable container itself, because it
    // might be not visible.
    // If such kind of an optimization would hypothetically be implemented,
    // then it would also require listening for "scroll" events on the screen.
    // Overall, I suppose that such "actual visibility" feature would be
    // a very minor optimization and not something I'd deal with.


    var isVisible = visibleAreaTop < this.itemsContainer.getHeight() && visibleAreaBottom > 0;

    if (!isVisible) {
      log('The entire list is off-screen. No items are visible.');
      return this.layout.getNonVisibleListShownItemIndexes();
    } // Get shown item indexes.


    return this.layout.getShownItemIndexes({
      itemsCount: this.getItemsCount(),
      visibleAreaTop: visibleAreaTop,
      visibleAreaBottom: visibleAreaBottom
    });
  }
  /**
   * Validates the heights of items to be hidden on next render.
   * For example, a user could click a "Show more" button,
   * or an "Expand YouTube video" button, which would result
   * in the actual height of the list item being different
   * from what has been initially measured in `this.itemHeights[i]`,
   * if the developer didn't call `.onItemStateChange()` and `.onItemHeightChange(i)`.
   */


  function validateWillBeHiddenItemHeightsAreAccurate(firstShownItemIndex, lastShownItemIndex) {
    var isValid = true;
    var i = this.getState().firstShownItemIndex;

    while (i <= this.getState().lastShownItemIndex) {
      if (i >= firstShownItemIndex && i <= lastShownItemIndex) ; else {
        // The item will be hidden. Re-measure its height.
        // The rationale is that there could be a situation when an item's
        // height has changed, and the developer has properly added an
        // `.onItemHeightChange(i)` call to notify `VirtualScroller`
        // about that change, but at the same time that wouldn't work.
        // For example, suppose there's a list of several items on a page,
        // and those items are in "minimized" state (having height 100px).
        // Then, a user clicks an "Expand all items" button, and all items
        // in the list are expanded (expanded item height is gonna be 700px).
        // `VirtualScroller` demands that `.onItemHeightChange(i)` is called
        // in such cases, and the developer has properly added the code to do that.
        // So, if there were 10 "minimized" items visible on a page, then there
        // will be 10 individual `.onItemHeightChange(i)` calls. No issues so far.
        // But, as the first `.onItemHeightChange(i)` call executes, it immediately
        // ("synchronously") triggers a re-layout, and that re-layout finds out
        // that now, because the first item is big, it occupies most of the screen
        // space, and only the first 3 items are visible on screen instead of 10,
        // and so it leaves the first 3 items mounted and unmounts the rest 7.
        // Then, after `VirtualScroller` has rerendered, the code returns to
        // where it was executing, and calls `.onItemHeightChange(i)` for the
        // second item. It also triggers an immediate re-layout that finds out
        // that only the first 2 items are visible on screen, and it unmounts
        // the third one too. After that, it calls `.onItemHeightChange(i)`
        // for the third item, but that item is no longer rendered, so its height
        // can't be measured, and the same's for all the rest of the original 10 items.
        // So, even though the developer has written their code properly, the
        // `VirtualScroller` still ends up having incorrect `itemHeights[]`:
        // `[700px, 700px, 100px, 100px, 100px, 100px, 100px, 100px, 100px, 100px]`
        // while it should have been `700px` for all of them.
        // To work around such issues, every item's height is re-measured before it
        // gets hidden.
        var previouslyMeasuredItemHeight = this.getState().itemHeights[i];
        var actualItemHeight = remeasureItemHeight.call(this, i);

        if (actualItemHeight !== previouslyMeasuredItemHeight) {
          if (isValid) {
            log('~ Validate will-be-hidden item heights. ~'); // Update or reset previously calculated layout.

            updatePreviouslyCalculatedLayoutOnItemHeightChange.call(this, i, previouslyMeasuredItemHeight, actualItemHeight);
          }

          isValid = false;
          warn('Item index', i, 'is no longer visible and will be unmounted. Its height has changed from', previouslyMeasuredItemHeight, 'to', actualItemHeight, 'since it was last measured. This is not necessarily a bug, and could happen, for example, on screen width change, or when there\'re several `onItemHeightChange(i)` calls issued at the same time, and the first one triggers a re-layout before the rest of them have had a chance to be executed.');
        }
      }

      i++;
    }

    return isValid;
  }

  function remeasureItemHeight(i) {
    var _this$getState = this.getState(),
        firstShownItemIndex = _this$getState.firstShownItemIndex;

    return this.itemHeights.remeasureItemHeight(i, firstShownItemIndex);
  } // Updates the snapshot of the current layout when an item's height changes.
  //
  // The "previously calculated layout" feature is not currently used.
  //
  // The current layout snapshot could be stored as a "previously calculated layout" variable
  // so that it could theoretically be used when calculating new layout incrementally
  // rather than from scratch, which would be an optimization.
  //


  function updatePreviouslyCalculatedLayoutOnItemHeightChange(i, previousHeight, newHeight) {
    if (this.previouslyCalculatedLayout) {
      var heightDifference = newHeight - previousHeight;

      if (i < this.previouslyCalculatedLayout.firstShownItemIndex) {
        // Patch `this.previouslyCalculatedLayout`'s `.beforeItemsHeight`.
        this.previouslyCalculatedLayout.beforeItemsHeight += heightDifference;
      } else if (i > this.previouslyCalculatedLayout.lastShownItemIndex) {
        // Could patch `.afterItemsHeight` of `this.previouslyCalculatedLayout` here,
        // if `.afterItemsHeight` property existed in `this.previouslyCalculatedLayout`.
        if (this.previouslyCalculatedLayout.afterItemsHeight !== undefined) {
          this.previouslyCalculatedLayout.afterItemsHeight += heightDifference;
        }
      } else {
        // Patch `this.previouslyCalculatedLayout`'s shown items height.
        this.previouslyCalculatedLayout.shownItemsHeight += newHeight - previousHeight;
      }
    }
  }
  /**
   * Returns the list's top offset relative to the scrollable container's top edge.
   * @return {number}
   */


  this.getListTopOffsetInsideScrollableContainer = function () {
    var listTopOffset = _this.scrollableContainer.getItemsContainerTopOffset();

    if (_this.listTopOffsetWatcher) {
      _this.listTopOffsetWatcher.onListTopOffset(listTopOffset);
    }

    return listTopOffset;
  };

  this._onItemHeightChange = function (i) {
    log('~ Re-measure item height ~');
    log('Item', i);

    var _this$getState2 = _this.getState(),
        itemHeights = _this$getState2.itemHeights,
        firstShownItemIndex = _this$getState2.firstShownItemIndex,
        lastShownItemIndex = _this$getState2.lastShownItemIndex; // Check if the item is still rendered.


    if (!(i >= firstShownItemIndex && i <= lastShownItemIndex)) {
      // There could be valid cases when an item is no longer rendered
      // by the time `.onItemHeightChange(i)` gets called.
      // For example, suppose there's a list of several items on a page,
      // and those items are in "minimized" state (having height 100px).
      // Then, a user clicks an "Expand all items" button, and all items
      // in the list are expanded (expanded item height is gonna be 700px).
      // `VirtualScroller` demands that `.onItemHeightChange(i)` is called
      // in such cases, and the developer has properly added the code to do that.
      // So, if there were 10 "minimized" items visible on a page, then there
      // will be 10 individual `.onItemHeightChange(i)` calls. No issues so far.
      // But, as the first `.onItemHeightChange(i)` call executes, it immediately
      // ("synchronously") triggers a re-layout, and that re-layout finds out
      // that now, because the first item is big, it occupies most of the screen
      // space, and only the first 3 items are visible on screen instead of 10,
      // and so it leaves the first 3 items mounted and unmounts the rest 7.
      // Then, after `VirtualScroller` has rerendered, the code returns to
      // where it was executing, and calls `.onItemHeightChange(i)` for the
      // second item. It also triggers an immediate re-layout that finds out
      // that only the first 2 items are visible on screen, and it unmounts
      // the third one too. After that, it calls `.onItemHeightChange(i)`
      // for the third item, but that item is no longer rendered, so its height
      // can't be measured, and the same's for all the rest of the original 10 items.
      // So, even though the developer has written their code properly, there're
      // still situations when the item could be no longer rendered by the time
      // `.onItemHeightChange(i)` gets called.
      return warn('The item is no longer rendered. This is not necessarily a bug, and could happen, for example, when there\'re several `onItemHeightChange(i)` calls issued at the same time.');
    }

    var previousHeight = itemHeights[i];

    if (previousHeight === undefined) {
      return reportError("\"onItemHeightChange()\" has been called for item ".concat(i, ", but that item hasn't been rendered before."));
    }

    var newHeight = remeasureItemHeight.call(_this, i);
    log('Previous height', previousHeight);
    log('New height', newHeight);

    if (previousHeight !== newHeight) {
      log('~ Item height has changed ~'); // Update or reset previously calculated layout.

      updatePreviouslyCalculatedLayoutOnItemHeightChange.call(_this, i, previousHeight, newHeight); // Recalculate layout.

      _this.onUpdateShownItemIndexes({
        reason: LAYOUT_REASON.ITEM_HEIGHT_CHANGED
      }); // Schedule the item height update for after the new items have been rendered.


      if (_this.newItemsWillBeRendered) {
        if (!_this.itemHeightsThatChangedWhileNewItemsWereBeingRendered) {
          _this.itemHeightsThatChangedWhileNewItemsWereBeingRendered = {};
        }

        _this.itemHeightsThatChangedWhileNewItemsWereBeingRendered[String(i)] = newHeight;
      }
    }
  };

  this.getPrerenderMargin = function () {
    // The list component renders not only the items that're currently visible
    // but also the items that lie within some extra vertical margin (called
    // "prerender margin") on top and bottom for future scrolling: this way,
    // there'll be significantly less layout recalculations as the user scrolls,
    // because now it doesn't have to recalculate layout on each scroll event.
    // By default, the "prerender margin" is equal to the screen height:
    // this seems to be the optimal value for "Page Up" / "Page Down" navigation
    // and optimized mouse wheel scrolling (a user is unlikely to continuously
    // scroll past the screen height, because they'd stop to read through
    // the newly visible items first, and when they do stop scrolling, that's
    // when layout gets recalculated).
    var renderAheadMarginRatio = 1; // in scrollable container heights.

    return _this.scrollableContainer.getHeight() * renderAheadMarginRatio;
  };
  /**
   * Calls `onItemFirstRender()` for items that haven't been
   * "seen" previously.
   * @param  {any[]} items
   * @param  {number[]} itemHeights
   * @param  {number} firstShownItemIndex
   * @param  {number} lastShownItemIndex
   */


  this.onBeforeShowItems = function (items, itemHeights, firstShownItemIndex, lastShownItemIndex) {
    if (_this.onItemInitialRender) {
      var i = firstShownItemIndex;

      while (i <= lastShownItemIndex) {
        if (itemHeights[i] === undefined) {
          _this.onItemInitialRender(items[i]);
        }

        i++;
      }
    }
  };

  this.measureItemHeightsAndSpacing = function () {
    // Measure "newly shown" item heights.
    // Also re-validate already measured items' heights.
    _this.itemHeights.measureItemHeights(_this.getState().firstShownItemIndex, _this.getState().lastShownItemIndex); // Measure item vertical spacing, if required.


    var verticalSpacing = _this.measureVerticalSpacingIfNotMeasured(); // Return a state update if vertical spacing has been measured.
    // Doesn't set `verticalSpacing: 0` in `state` because it is effectively
    // same as `verticalSpacing: undefined` in terms code behavior and calculations.
    // Not having `verticalSpacing: 0` in `state` just makes the `state` object
    // a bit more cleaner and a bit less cluttered (easier for inspection).


    if (verticalSpacing && verticalSpacing !== 0) {
      // Return a state update.
      // Sets `verticalSpacing` property in `state`.
      return {
        verticalSpacing: verticalSpacing
      };
    }
  };

  this.cancelLayoutTimer = function (_ref3) {
    var stateUpdate = _ref3.stateUpdate;

    if (_this.layoutTimer) {
      clearTimeout(_this.layoutTimer);
      _this.layoutTimer = undefined; // Merge state updates.

      if (stateUpdate || _this.layoutTimerStateUpdate) {
        stateUpdate = _objectSpread$3(_objectSpread$3({}, _this.layoutTimerStateUpdate), stateUpdate);
        _this.layoutTimerStateUpdate = undefined;
        return stateUpdate;
      }
    } else {
      return stateUpdate;
    }
  };

  this.scheduleLayoutTimer = function (_ref4) {
    var reason = _ref4.reason,
        stateUpdate = _ref4.stateUpdate;
    _this.layoutTimerStateUpdate = stateUpdate;
    _this.layoutTimer = setTimeout$1(function () {
      _this.layoutTimerStateUpdate = undefined;
      _this.layoutTimer = undefined;

      _this.onUpdateShownItemIndexes({
        reason: reason,
        stateUpdate: stateUpdate
      });
    }, 0);
  };
}
var SLOW_LAYOUT_DURATION = 15; // in milliseconds.

// https://github.com/lodash/lodash/issues/2340

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var hasOwnProperty = Object.prototype.hasOwnProperty;
/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */

function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    // Added the nonzero y check to make Flow happy, but it is redundant
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}
/**
 * Performs equality by iterating through keys on an object and returning false
 * when any key has values which are not strictly equal between the arguments.
 * Returns true when the values of all keys are strictly equal.
 */


function shallowEqual(objA, objB) {
  if (is(objA, objB)) {
    return true;
  }

  if (_typeof(objA) !== 'object' || objA === null || _typeof(objB) !== 'object' || objB === null) {
    return false;
  }

  var keysA = Object.keys(objA);
  var keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  } // Test for A's keys different from B.


  for (var i = 0; i < keysA.length; i++) {
    if (!hasOwnProperty.call(objB, keysA[i]) || !is(objA[keysA[i]], objB[keysA[i]])) {
      return false;
    }
  }

  return true;
}

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty$2(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function createOnRenderHelpers () {
  var _this = this;

  /**
   * Should be called right after updates to `state` have been rendered.
   * @param  {object} newState
   * @param  {object} [prevState]
   */
  this._onRender = function (newState, prevState) {
    log('~ Rendered ~');

    if (isDebug()) {
      log('State', getStateSnapshot(newState));
    }

    if (_this.onStateChange) {
      if (!shallowEqual(newState, prevState)) {
        _this.onStateChange(newState);
      }
    } // Update `<tbody/>` `padding`.
    // (`<tbody/>` is different in a way that it can't have `margin`, only `padding`).
    // https://gitlab.com/catamphetamine/virtual-scroller/-/issues/1


    if (_this.tbody) {
      setTbodyPadding(_this.getItemsContainerElement(), newState.beforeItemsHeight, newState.afterItemsHeight);
    }

    if (!prevState) {
      return;
    } // `this.resetStateUpdateFlags()` must be called before calling
    // `this.measureItemHeightsAndSpacing()`.


    var _resetStateUpdateFlag = resetStateUpdateFlags.call(_this),
        nonMeasuredItemsHaveBeenRendered = _resetStateUpdateFlag.nonMeasuredItemsHaveBeenRendered,
        widthHasChanged = _resetStateUpdateFlag.widthHasChanged;

    var layoutUpdateReason; // If the `VirtualScroller`, while calculating layout parameters, encounters
    // a not-shown item with a non-measured height, it calls `updateState()` just to
    // render that item first, and then, after the list has been re-rendered, it measures
    // the item's height and then proceeds with calculating the correct layout parameters.

    if (nonMeasuredItemsHaveBeenRendered) {
      layoutUpdateReason = LAYOUT_REASON.NON_MEASURED_ITEMS_HAVE_BEEN_MEASURED;
    } // If scrollable container width has changed, and it has been re-rendered,
    // then it's time to measure the new item heights and then perform a re-layout
    // with the correctly calculated layout parameters.
    //
    // A re-layout is required because the layout parameters calculated on resize
    // are approximate ones, and the exact item heights aren't known at that point.
    // So on resize, it calls `updateState()` just to re-render the `VirtualScroller`.
    // After it has been re-rendered, it will measure item heights and then calculate
    // correct layout parameters.
    //


    if (widthHasChanged) {
      layoutUpdateReason = LAYOUT_REASON.VIEWPORT_WIDTH_CHANGED; // Reset measured item heights on viewport width change.

      _this.itemHeights.reset(); // Reset `verticalSpacing` (will be re-measured).


      _this.verticalSpacing = undefined;
    }

    var previousItems = prevState.items;
    var newItems = newState.items; // Even if `this.newItemsWillBeRendered` flag is `true`,
    // `newItems` could still be equal to `previousItems`.
    // For example, when `updateState()` calls don't update `state` immediately
    // and a developer first calls `setItems(newItems)` and then calls `setItems(oldItems)`:
    // in that case, `this.newItemsWillBeRendered` flag will be `true` but the actual `items`
    // in state wouldn't have changed due to the first `updateState()` call being overwritten
    // by the second `updateState()` call (that's called "batching state updates" in React).

    if (newItems !== previousItems) {
      var itemsDiff = _this.getItemsDiff(previousItems, newItems);

      if (itemsDiff) {
        // The call to `.onPrepend()` must precede the call to `.measureItemHeights()`
        // which is called in `.onRender()`.
        // `this.itemHeights.onPrepend()` updates `firstMeasuredItemIndex`
        // and `lastMeasuredItemIndex` of `this.itemHeights`.
        var prependedItemsCount = itemsDiff.prependedItemsCount;

        _this.itemHeights.onPrepend(prependedItemsCount);
      } else {
        _this.itemHeights.reset();
      }

      if (!widthHasChanged) {
        // The call to `this.onNewItemsRendered()` must precede the call to
        // `.measureItemHeights()` which is called in `.onRender()` because
        // `this.onNewItemsRendered()` updates `firstMeasuredItemIndex` and
        // `lastMeasuredItemIndex` of `this.itemHeights` in case of a prepend.
        //
        // If after prepending items the scroll position
        // should be "restored" so that there's no "jump" of content
        // then it means that all previous items have just been rendered
        // in a single pass, and there's no need to update layout again.
        //
        if (onNewItemsRendered.call(_this, itemsDiff, newState) !== 'SEAMLESS_PREPEND') {
          layoutUpdateReason = LAYOUT_REASON.ITEMS_CHANGED;
        }
      }
    }

    var stateUpdate; // Re-measure item heights.
    // Also, measure vertical spacing (if not measured) and fix `<table/>` padding.
    //
    // This block should go after `if (newItems !== previousItems) {}`
    // because `this.itemHeights` can get `.reset()` there, which would
    // discard all the measurements done here, and having currently shown
    // item height measurements is required.
    //

    if (newState.firstShownItemIndex !== prevState.firstShownItemIndex || newState.lastShownItemIndex !== prevState.lastShownItemIndex || newState.items !== prevState.items || widthHasChanged) {
      var verticalSpacingStateUpdate = _this.measureItemHeightsAndSpacing();

      if (verticalSpacingStateUpdate) {
        stateUpdate = _objectSpread$2(_objectSpread$2({}, stateUpdate), verticalSpacingStateUpdate);
      }
    } // Clean up "before resize" item heights and adjust the scroll position accordingly.
    // Calling `this.beforeResize.cleanUpBeforeResizeItemHeights()` might trigger
    // a `this.updateState()` call but that wouldn't matter because `beforeResize`
    // properties have already been modified directly in `state` (a hacky technique)


    var cleanedUpBeforeResize = _this.beforeResize.cleanUpBeforeResizeItemHeights();

    if (cleanedUpBeforeResize !== undefined) {
      var scrollBy = cleanedUpBeforeResize.scrollBy,
          beforeResize = cleanedUpBeforeResize.beforeResize;
      log('Correct scroll position by', scrollBy);

      _this.scroll.scrollByY(scrollBy);

      stateUpdate = _objectSpread$2(_objectSpread$2({}, stateUpdate), {}, {
        beforeResize: beforeResize
      });
    }

    if (!_this._isActive) {
      _this._stoppedStateUpdate = stateUpdate;
      return;
    }

    if (layoutUpdateReason) {
      updateStateRightAfterRender.call(_this, {
        stateUpdate: stateUpdate,
        reason: layoutUpdateReason
      });
    } else if (stateUpdate) {
      _this.updateState(stateUpdate);
    } else {
      log('~ Finished Layout ~');
    }
  }; // After a new set of items has been rendered:
  //
  // * Restores scroll position when using `preserveScrollPositionOnPrependItems`
  //   and items have been prepended.
  //
  // * Applies any "pending" `itemHeights` updates — those ones that happened
  //   while an asynchronous `updateState()` call in `setItems()` was pending.
  //
  // * Either creates or resets the snapshot of the current layout.
  //
  //   The current layout snapshot could be stored as a "previously calculated layout" variable
  //   so that it could theoretically be used when calculating new layout incrementally
  //   rather than from scratch, which would be an optimization.
  //
  //   The "previously calculated layout" feature is not currently used.
  //


  function onNewItemsRendered(itemsDiff, newLayout) {
    // If it's an "incremental" update.
    if (itemsDiff) {
      var prependedItemsCount = itemsDiff.prependedItemsCount;

      var _this$getState = this.getState(),
          itemHeights = _this$getState.itemHeights,
          itemStates = _this$getState.itemStates; // See if any items' heights changed while new items were being rendered.


      if (this.itemHeightsThatChangedWhileNewItemsWereBeingRendered) {
        for (var _i = 0, _Object$keys = Object.keys(this.itemHeightsThatChangedWhileNewItemsWereBeingRendered); _i < _Object$keys.length; _i++) {
          var i = _Object$keys[_i];
          itemHeights[prependedItemsCount + parseInt(i)] = this.itemHeightsThatChangedWhileNewItemsWereBeingRendered[i];
        }
      } // See if any items' states changed while new items were being rendered.


      if (this.itemStatesThatChangedWhileNewItemsWereBeingRendered) {
        for (var _i2 = 0, _Object$keys2 = Object.keys(this.itemStatesThatChangedWhileNewItemsWereBeingRendered); _i2 < _Object$keys2.length; _i2++) {
          var _i3 = _Object$keys2[_i2];
          itemStates[prependedItemsCount + parseInt(_i3)] = this.itemStatesThatChangedWhileNewItemsWereBeingRendered[_i3];
        }
      }

      if (prependedItemsCount === 0) {
        // Adjust `this.previouslyCalculatedLayout`.
        if (this.previouslyCalculatedLayout) {
          if (this.previouslyCalculatedLayout.firstShownItemIndex === newLayout.firstShownItemIndex && this.previouslyCalculatedLayout.lastShownItemIndex === newLayout.lastShownItemIndex) ; else {
            warn('Unexpected (non-matching) "firstShownItemIndex" or "lastShownItemIndex" encountered in "onRender()" after appending items');
            warn('Previously calculated layout', this.previouslyCalculatedLayout);
            warn('New layout', newLayout);
            this.previouslyCalculatedLayout = undefined;
          }
        }

        return 'SEAMLESS_APPEND';
      } else {
        if (this.listHeightMeasurement.hasSnapshot()) {
          if (newLayout.firstShownItemIndex === 0) {
            // Restore (adjust) scroll position.
            log('~ Restore Scroll Position ~');
            var listBottomOffsetChange = this.listHeightMeasurement.getListBottomOffsetChange({
              beforeItemsHeight: newLayout.beforeItemsHeight
            });
            this.listHeightMeasurement.reset();

            if (listBottomOffsetChange) {
              log('Scroll down by', listBottomOffsetChange);
              this.scroll.scrollByY(listBottomOffsetChange);
            } else {
              log('Scroll position hasn\'t changed');
            } // Create new `this.previouslyCalculatedLayout`.


            if (this.previouslyCalculatedLayout) {
              if (this.previouslyCalculatedLayout.firstShownItemIndex === 0 && this.previouslyCalculatedLayout.lastShownItemIndex === newLayout.lastShownItemIndex - prependedItemsCount) {
                this.previouslyCalculatedLayout = {
                  beforeItemsHeight: 0,
                  shownItemsHeight: this.previouslyCalculatedLayout.shownItemsHeight + listBottomOffsetChange,
                  firstShownItemIndex: 0,
                  lastShownItemIndex: newLayout.lastShownItemIndex
                };
              } else {
                warn('Unexpected (non-matching) "firstShownItemIndex" or "lastShownItemIndex" encountered in "onRender()" after prepending items');
                warn('Previously calculated layout', this.previouslyCalculatedLayout);
                warn('New layout', newLayout);
                this.previouslyCalculatedLayout = undefined;
              }
            }

            return 'SEAMLESS_PREPEND';
          } else {
            warn("Unexpected \"firstShownItemIndex\" ".concat(newLayout.firstShownItemIndex, " encountered in \"onRender()\" after prepending items. Expected 0."));
          }
        }
      }
    } // Reset `this.previouslyCalculatedLayout` in any case other than
    // SEAMLESS_PREPEND or SEAMLESS_APPEND.


    this.previouslyCalculatedLayout = undefined;
  }

  function updateStateRightAfterRender(_ref) {
    var reason = _ref.reason,
        stateUpdate = _ref.stateUpdate;

    // In React, `setTimeout()` is used to prevent a React error:
    // "Maximum update depth exceeded.
    //  This can happen when a component repeatedly calls
    //  `.updateState()` inside `componentWillUpdate()` or `componentDidUpdate()`.
    //  React limits the number of nested updates to prevent infinite loops."
    if (this._useTimeoutInRenderLoop) {
      // Cancel a previously scheduled re-layout.
      stateUpdate = this.cancelLayoutTimer({
        stateUpdate: stateUpdate
      }); // Schedule a new re-layout.

      this.scheduleLayoutTimer({
        reason: reason,
        stateUpdate: stateUpdate
      });
    } else {
      this.onUpdateShownItemIndexes({
        reason: reason,
        stateUpdate: stateUpdate
      });
    }
  }

  function resetStateUpdateFlags() {
    // Read and reset `this.widthHasChanged` flag.
    //
    // If `this.widthHasChanged` flag was reset after calling
    // `this.measureWidthHeightsAndSpacingAndUpdateTablePadding()`
    // then there would be a bug because
    // `this.measureWidthHeightsAndSpacingAndUpdateTablePadding()`
    // calls `this.updateState({ verticalSpacing })` which calls
    // `this.onRender()` immediately, so `this.widthHasChanged`
    // flag wouldn't be reset by that time and would trigger things
    // like `this.itemHeights.reset()` a second time.
    //
    // So, instead read the value of `this.widthHasChanged` flag
    // and reset it right away to prevent any such potential bugs.
    //
    var widthHasChanged = Boolean(this.widthHasChanged); //
    // Reset `this.widthHasChanged` flag.

    this.widthHasChanged = undefined; // Read `this.firstNonMeasuredItemIndex` flag.

    var nonMeasuredItemsHaveBeenRendered = this.firstNonMeasuredItemIndex !== undefined; // Reset `this.firstNonMeasuredItemIndex` flag.

    this.firstNonMeasuredItemIndex = undefined; // Reset `this.newItemsWillBeRendered` flag.

    this.newItemsWillBeRendered = undefined; // Reset `this.itemHeightsThatChangedWhileNewItemsWereBeingRendered`.

    this.itemHeightsThatChangedWhileNewItemsWereBeingRendered = undefined; // Reset `this.itemStatesThatChangedWhileNewItemsWereBeingRendered`.

    this.itemStatesThatChangedWhileNewItemsWereBeingRendered = undefined;
    return {
      nonMeasuredItemsHaveBeenRendered: nonMeasuredItemsHaveBeenRendered,
      widthHasChanged: widthHasChanged
    };
  }
}

function createResizeHelpers () {
  var _this = this;

  this.onResize = function () {
    // Reset "previously calculated layout".
    //
    // The "previously calculated layout" feature is not currently used.
    //
    // The current layout snapshot could be stored as a "previously calculated layout" variable
    // so that it could theoretically be used when calculating new layout incrementally
    // rather than from scratch, which would be an optimization.
    //
    _this.previouslyCalculatedLayout = undefined; // Cancel any potential scheduled scroll position restoration.

    _this.listHeightMeasurement.reset(); // Get the most recent items count.
    // If there're a "pending" `setItems()` call then use the items count from that call
    // instead of using the count of currently shown `items` from `state`.
    // A `setItems()` call is "pending" when `updateState()` operation is "asynchronous", that is
    // when `updateState()` calls aren't applied immediately, like in React.


    var itemsCount = _this.newItemsWillBeRendered ? _this.newItemsWillBeRendered.count : _this.getState().itemHeights.length; // If layout values have been calculated as a result of a "pending" `setItems()` call,
    // then don't discard those new layout values and use them instead of the ones from `state`.
    //
    // A `setItems()` call is "pending" when `updateState()` operation is "asynchronous", that is
    // when `updateState()` calls aren't applied immediately, like in React.
    //

    var layout = _this.newItemsWillBeRendered ? _this.newItemsWillBeRendered.layout : _this.getState(); // Update `VirtualScroller` state.

    var newState = {
      scrollableContainerWidth: _this.scrollableContainer.getWidth(),
      // This state update should also overwrite all the `state` properties
      // that are also updated in the "on scroll" handler (`getShownItemIndexes()`):
      //
      // * `firstShownItemIndex`
      // * `lastShownItemIndex`
      // * `beforeItemsHeight`
      // * `afterItemsHeight`
      //
      // That's because this `updateState()` update has a higher priority
      // than that of the "on scroll" handler, so it should overwrite
      // any potential state changes dispatched by the "on scroll" handler.
      //
      // All these properties might have changed, but they're not
      // recalculated here becase they'll be recalculated after
      // this new state is applied (rendered).
      //
      firstShownItemIndex: layout.firstShownItemIndex,
      lastShownItemIndex: layout.lastShownItemIndex,
      beforeItemsHeight: layout.beforeItemsHeight,
      afterItemsHeight: layout.afterItemsHeight,
      // Reset item heights, because if scrollable container's width (or height)
      // has changed, then the list width (or height) most likely also has changed,
      // and also some CSS `@media()` rules might have been added or removed.
      // So re-render the list entirely.
      itemHeights: new Array(itemsCount),
      columnsCount: _this.getActualColumnsCountForState(),
      // Re-measure vertical spacing after render because new CSS styles
      // might be applied for the new window width.
      verticalSpacing: undefined
    };
    var firstShownItemIndex = layout.firstShownItemIndex,
        lastShownItemIndex = layout.lastShownItemIndex; // Get the `columnsCount` for the new window width.

    var newColumnsCount = _this.getActualColumnsCount(); // Re-calculate `firstShownItemIndex` and `lastShownItemIndex`
    // based on the new `columnsCount` so that the whole row is visible.


    var newFirstShownItemIndex = Math.floor(firstShownItemIndex / newColumnsCount) * newColumnsCount;
    var newLastShownItemIndex = Math.min(Math.ceil((lastShownItemIndex + 1) / newColumnsCount) * newColumnsCount, itemsCount) - 1; // Potentially update `firstShownItemIndex` if it needs to be adjusted in order to
    // correspond to the new `columnsCount`.

    if (newFirstShownItemIndex !== firstShownItemIndex) {
      log('Columns Count changed from', _this.getState().columnsCount || 1, 'to', newColumnsCount);
      log('First Shown Item Index needs to change from', firstShownItemIndex, 'to', newFirstShownItemIndex);
    } // Always rewrite `firstShownItemIndex` and `lastShownItemIndex`
    // as part of the `state` update, even if it hasn't been modified.
    //
    // The reason is that there could be two subsequent `onResize()` calls:
    // the first one could be user resizing the window to half of its width,
    // resulting in an "asynchronous" `updateState()` call, and then, before that
    // `updateState()` call is applied, a second resize event happens when the user
    // has resized the window back to its original width, meaning that the
    // `columnsCount` is back to its original value.
    // In that case, the final `newFirstShownItemIndex` will be equal to the
    // original `firstShownItemIndex` that was in `state` before the user
    // has started resizing the window, so, in the end, `state.firstShownItemIndex`
    // property wouldn't have changed, but it still has to be part of the final
    // state update in order to overwrite the previous update of `firstShownItemIndex`
    // property that has been scheduled to be applied in state after the first resize
    // happened.
    //


    newState.firstShownItemIndex = newFirstShownItemIndex;
    newState.lastShownItemIndex = newLastShownItemIndex;

    var verticalSpacing = _this.getVerticalSpacing();

    var columnsCount = _this.getColumnsCount(); // `beforeResize` is always overwritten in `state` here.
    // (once it has started being tracked in `state`)


    if (_this.shouldDiscardBeforeResizeItemHeights() || newFirstShownItemIndex === 0) {
      if (_this.beforeResize.shouldIncludeBeforeResizeValuesInState()) {
        newState.beforeResize = undefined;
      }
    } // Snapshot "before resize" values in order to preserve the currently
    // shown items' vertical position on screen so that there's no "content jumping".
    else {
      // Keep "before resize" values in order to preserve the currently
      // shown items' vertical position on screen so that there's no
      // "content jumping". These "before resize" values will be discarded
      // when (if) the user scrolls back to the top of the list.
      newState.beforeResize = {
        verticalSpacing: verticalSpacing,
        columnsCount: columnsCount,
        itemHeights: _this.beforeResize.snapshotBeforeResizeItemHeights({
          firstShownItemIndex: firstShownItemIndex,
          newFirstShownItemIndex: newFirstShownItemIndex,
          newColumnsCount: newColumnsCount
        })
      };
    } // `this.widthHasChanged` tells `VirtualScroller` that it should
    // temporarily stop other updates (like "on scroll" updates) and wait
    // for the new `state` to be applied, after which the `onRender()`
    // function will clear this flag and perform a re-layout.
    //
    // A re-layout is required because the layout parameters calculated above
    // are approximate ones, and the exact item heights aren't known at this point.
    // So the `updateState()` call below is just to re-render the `VirtualScroller`.
    // After it has been re-rendered, it will measure item heights and then calculate
    // correct layout parameters.
    //


    _this.widthHasChanged = {
      stateUpdate: newState
    }; // Rerender.

    _this.updateState(newState);
  }; // Returns whether "before resize" item heights should be discarded
  // as a result of calling `setItems()` with a new set of items
  // when an asynchronous `updateState()` call inside that function
  // hasn't been applied yet.
  //
  // If `setItems()` update was an "incremental" one and no items
  // have been prepended, then `firstShownItemIndex` is preserved,
  // and all items' heights before it should be kept in order to
  // preserve the top offset of the first shown item so that there's
  // no "content jumping".
  //
  // If `setItems()` update was an "incremental" one but there're
  // some prepended items, then it means that now there're new items
  // with unknown heights at the top, so the top offset of the first
  // shown item won't be preserved because there're no "before resize"
  // heights of those items.
  //
  // If `setItems()` update was not an "incremental" one, then don't
  // attempt to restore previous item heights after a potential window
  // width change because all item heights have been reset.
  //


  this.shouldDiscardBeforeResizeItemHeights = function () {
    if (_this.newItemsWillBeRendered) {
      var _this$newItemsWillBeR = _this.newItemsWillBeRendered,
          prepend = _this$newItemsWillBeR.prepend,
          replace = _this$newItemsWillBeR.replace;
      return prepend || replace;
    }
  };
}

/**
 * Checks whether it's an "incremental" items update, and returns the "diff".
 * @param  {any[]} previousItems
 * @param  {any[]} newItems
 * @return {object} [diff]
 */
function getItemsDiff(previousItems, newItems, isEqual) {
  var firstPreviousItemIndex = -1;
  var lastPreviousItemIndex = -1;

  if (previousItems.length > 0) {
    firstPreviousItemIndex = findInArray(newItems, previousItems[0], isEqual);

    if (firstPreviousItemIndex >= 0) {
      if (arePreviousItemsPreserved(previousItems, newItems, firstPreviousItemIndex, isEqual)) {
        lastPreviousItemIndex = firstPreviousItemIndex + previousItems.length - 1;
      }
    }
  }

  var isIncrementalUpdate = firstPreviousItemIndex >= 0 && lastPreviousItemIndex >= 0;

  if (isIncrementalUpdate) {
    return {
      prependedItemsCount: firstPreviousItemIndex,
      appendedItemsCount: newItems.length - (lastPreviousItemIndex + 1)
    };
  }
}

function arePreviousItemsPreserved(previousItems, newItems, offset, isEqual) {
  // Check each item of the `previousItems` to determine
  // whether it's an "incremental" items update.
  // (an update when items are prepended or appended)
  var i = 0;

  while (i < previousItems.length) {
    if (newItems.length <= offset + i || !isEqual(newItems[offset + i], previousItems[i])) {
      return false;
    }

    i++;
  }

  return true;
}

function findInArray(array, element, isEqual) {
  var i = 0;

  while (i < array.length) {
    if (isEqual(array[i], element)) {
      return i;
    }

    i++;
  }

  return -1;
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty$1(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function createItemsHelpers () {
  var _this = this;

  this.getItemsCount = function () {
    return _this.getState().items.length;
  };
  /**
   * Updates `items`. For example, can prepend or append new items to the list.
   * @param  {any[]} newItems
   * @param {boolean} [options.preserveScrollPositionOnPrependItems] — Set to `true` to enable "restore scroll position after prepending items" feature (could be useful when implementing "Show previous items" button).
   */


  this._setItems = function (newItems) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _this$getState = _this.getState(),
        previousItems = _this$getState.items; // Even if `newItems` are equal to `this.state.items`,
    // still perform a `updateState()` call, because, if `updateState()` calls
    // were "asynchronous", there could be a situation when a developer
    // first calls `setItems(newItems)` and then `setItems(oldItems)`:
    // if this function did `return` `if (newItems === this.state.items)`
    // then `updateState({ items: newItems })` would be scheduled as part of
    // `setItems(newItems)` call, but the subsequent `setItems(oldItems)` call
    // wouldn't do anything resulting in `newItems` being set as a result,
    // and that wouldn't be what the developer intended.


    var _this$getState2 = _this.getState(),
        itemStates = _this$getState2.itemStates;

    var _ref = _this.widthHasChanged ? _this.widthHasChanged.stateUpdate : _this.getState(),
        itemHeights = _ref.itemHeights;

    log('~ Update items ~');
    var layoutUpdate;
    var itemsUpdateInfo; // Compare the new items to the current items.

    var itemsDiff = _this.getItemsDiff(previousItems, newItems); // See if it's an "incremental" items update.


    if (itemsDiff) {
      var _ref2 = _this.widthHasChanged ? _this.widthHasChanged.stateUpdate : _this.getState(),
          firstShownItemIndex = _ref2.firstShownItemIndex,
          lastShownItemIndex = _ref2.lastShownItemIndex,
          beforeItemsHeight = _ref2.beforeItemsHeight,
          afterItemsHeight = _ref2.afterItemsHeight;

      var shouldRestoreScrollPosition = firstShownItemIndex === 0 && ( // `preserveScrollPosition` option name is deprecated,
      // use `preserveScrollPositionOnPrependItems` instead.
      options.preserveScrollPositionOnPrependItems || options.preserveScrollPosition);
      var prependedItemsCount = itemsDiff.prependedItemsCount,
          appendedItemsCount = itemsDiff.appendedItemsCount;
      var shouldResetGridLayout;
      layoutUpdate = _this.layout.getLayoutUpdateForItemsDiff({
        firstShownItemIndex: firstShownItemIndex,
        lastShownItemIndex: lastShownItemIndex,
        beforeItemsHeight: beforeItemsHeight,
        afterItemsHeight: afterItemsHeight
      }, {
        prependedItemsCount: prependedItemsCount,
        appendedItemsCount: appendedItemsCount
      }, {
        itemsCount: newItems.length,
        columnsCount: _this.getActualColumnsCount(),
        shouldRestoreScrollPosition: shouldRestoreScrollPosition,
        onResetGridLayout: function onResetGridLayout() {
          return shouldResetGridLayout = true;
        }
      });

      if (prependedItemsCount > 0) {
        log('Prepend', prependedItemsCount, 'items');
        itemHeights = new Array(prependedItemsCount).concat(itemHeights);

        if (itemStates) {
          itemStates = new Array(prependedItemsCount).concat(itemStates);
        } // Restore scroll position after prepending items (if requested).


        if (shouldRestoreScrollPosition) {
          log('Will restore scroll position');

          _this.listHeightMeasurement.snapshotListHeightBeforeAddingNewItems({
            previousItems: previousItems,
            newItems: newItems,
            prependedItemsCount: prependedItemsCount
          }); // "Seamless prepend" scenario doesn't result in a re-layout,
          // so if any "non measured item" is currently pending,
          // it doesn't get reset and will be handled after `state` is updated.


          if (_this.firstNonMeasuredItemIndex !== undefined) {
            _this.firstNonMeasuredItemIndex += prependedItemsCount;
          }
        } else {
          log('Reset layout');

          if (shouldResetGridLayout) {
            log('Reason: Prepended items count', prependedItemsCount, 'is not divisible by Columns Count', _this.getActualColumnsCount()); // Reset item heights because the whole grid is going to be rebalanced
            // and re-rendered in a different configuration.

            itemHeights = new Array(newItems.length);
          } else {
            // Reset layout because none of the prepended items have been measured.
            log('Reason: Prepended items\' heights are unknown');
          }

          layoutUpdate = _this.layout.getInitialLayoutValues({
            itemsCount: newItems.length,
            columnsCount: _this.getActualColumnsCount()
          }); // Unschedule a potentially scheduled layout update
          // after measuring a previously non-measured item
          // because the list will be re-layout anyway
          // due to the new items being set.

          _this.firstNonMeasuredItemIndex = undefined;
        }
      }

      if (appendedItemsCount > 0) {
        log('Append', appendedItemsCount, 'items');
        itemHeights = itemHeights.concat(new Array(appendedItemsCount));

        if (itemStates) {
          itemStates = itemStates.concat(new Array(appendedItemsCount));
        }
      }

      itemsUpdateInfo = {
        prepend: prependedItemsCount > 0,
        append: appendedItemsCount > 0
      };
    } else {
      log('Items have changed, and', itemsDiff ? 'a re-layout from scratch has been requested.' : 'it\'s not a simple append and/or prepend.', 'Rerender the entire list from scratch.');
      log('Previous items', previousItems);
      log('New items', newItems); // Reset item heights and item states.

      itemHeights = new Array(newItems.length);
      itemStates = new Array(newItems.length);
      layoutUpdate = _this.layout.getInitialLayoutValues({
        itemsCount: newItems.length,
        columnsCount: _this.getActualColumnsCount()
      }); // Unschedule a potentially scheduled layout update
      // after measuring a previously non-measured item
      // because the list will be re-layout from scratch
      // due to the new items being set.

      _this.firstNonMeasuredItemIndex = undefined; // Also reset any potential pending scroll position restoration.
      // For example, imagine a developer first called `.setItems(incrementalItemsUpdate)`
      // and then called `.setItems(differentItems)` and there was no state update
      // in between those two calls. This could happen because state updates aren't
      // required to be "synchronous". On other words, calling `this.updateState()`
      // doesn't necessarily mean that the state is applied immediately.
      // Imagine also that such "delayed" state updates could be batched,
      // like they do in React inside event handlers (though that doesn't apply to this case):
      // https://github.com/facebook/react/issues/10231#issuecomment-316644950
      // If `this.listHeightMeasurement` wasn't reset on `.setItems(differentItems)`
      // and if the second `this.updateState()` call overwrites the first one
      // then it would attempt to restore scroll position in a situation when
      // it should no longer do that. Hence the reset here.

      _this.listHeightMeasurement.reset();

      itemsUpdateInfo = {
        replace: true
      };
    }

    log('~ Update state ~'); // const layoutValuesAfterUpdate = {
    // 	...this.getState(),
    // 	...layoutUpdate
    // }
    // `layoutUpdate` is equivalent to `layoutValuesAfterUpdate` because
    // `layoutUpdate` contains all the relevant properties.

    log('First shown item index', layoutUpdate.firstShownItemIndex);
    log('Last shown item index', layoutUpdate.lastShownItemIndex);
    log('Before items height', layoutUpdate.beforeItemsHeight);
    log('After items height (actual or estimated)', layoutUpdate.afterItemsHeight); // Optionally preload items to be rendered.
    //
    // `layoutUpdate` is equivalent to `layoutValuesAfterUpdate` because
    // `layoutUpdate` contains all the relevant properties.
    //

    _this.onBeforeShowItems(newItems, itemHeights, layoutUpdate.firstShownItemIndex, layoutUpdate.lastShownItemIndex); // `this.newItemsWillBeRendered` signals that new `items` are being rendered,
    // and that `VirtualScroller` should temporarily stop all other updates.
    //
    // `this.newItemsWillBeRendered` is cleared in `onRender()`.
    //
    // The values in `this.newItemsWillBeRendered` are used, for example,
    // in `.onResize()` handler in order to not break state consistency when
    // state updates are "asynchronous" (delayed) and there's a window resize event
    // in between calling `updateState()` below and that call actually being applied.
    //


    _this.newItemsWillBeRendered = _objectSpread$1(_objectSpread$1({}, itemsUpdateInfo), {}, {
      count: newItems.length,
      // `layoutUpdate` now contains all layout-related properties, even if those that
      // didn't change. So `firstShownItemIndex` is always in `this.newItemsWillBeRendered`.
      layout: layoutUpdate
    }); // `layoutUpdate` now contains all layout-related properties, even if those that
    // didn't change. So this part is no longer relevant.
    //
    // // If `firstShownItemIndex` is gonna be modified as a result of setting new items
    // // then keep that "new" `firstShownItemIndex` in order for it to be used by
    // // `onResize()` handler when it calculates "new" `firstShownItemIndex`
    // // based on the new columns count (corresponding to the new window width).
    // if (layoutUpdate.firstShownItemIndex !== undefined) {
    // 	this.newItemsWillBeRendered = {
    // 		...this.newItemsWillBeRendered,
    // 		firstShownItemIndex: layoutUpdate.firstShownItemIndex
    // 	}
    // }
    // Update `VirtualScroller` state.
    //
    // This state update should overwrite all the `state` properties
    // that are also updated in the "on scroll" handler (`getShownItemIndexes()`):
    //
    // * `firstShownItemIndex`
    // * `lastShownItemIndex`
    // * `beforeItemsHeight`
    // * `afterItemsHeight`
    //
    // That's because this `updateState()` update has a higher priority
    // than that of the "on scroll" handler, so it should overwrite
    // any potential state changes dispatched by the "on scroll" handler.
    //

    var newState = _objectSpread$1(_objectSpread$1({}, layoutUpdate), {}, {
      items: newItems,
      itemStates: itemStates,
      itemHeights: itemHeights
    }); // Introduced `shouldIncludeBeforeResizeValuesInState()` getter just to prevent
    // cluttering `state` with `beforeResize: undefined` property if `beforeResize`
    // hasn't ever been set in `state` previously.


    if (_this.beforeResize.shouldIncludeBeforeResizeValuesInState()) {
      if (_this.shouldDiscardBeforeResizeItemHeights()) {
        // Reset "before resize" item heights because now there're new items prepended
        // with unknown heights, or completely new items with unknown heights, so
        // `beforeItemsHeight` value won't be preserved anyway.
        newState.beforeResize = undefined;
      } else {
        // Overwrite `beforeResize` property in `state` even if it wasn't modified
        // because state updates could be "asynchronous" and in that case there could be
        // some previous `updateState()` call from some previous `setItems()` call that
        // hasn't yet been applied, and that previous call might have scheduled setting
        // `state.beforeResize` property to `undefined` in order to reset it, but this
        // next `updateState()` call might not require resetting `state.beforeResize` property
        // so it should undo resetting it by simply overwriting it with its normal value.
        newState.beforeResize = _this.widthHasChanged ? _this.widthHasChanged.stateUpdate.beforeResize : _this.getState().beforeResize;
      }
    } // `newState` should also overwrite all `state` properties that're updated in `onResize()`
    // because `setItems()`'s state updates always overwrite `onResize()`'s state updates.
    // (The least-priority ones are `onScroll()` state updates, but those're simply skipped
    // if there's a pending `setItems()` or `onResize()` update).
    //
    // `state` property exceptions:
    //
    // `verticalSpacing` property is not updated here because it's fine setting it to
    // `undefined` in `onResize()` — it will simply be re-measured after the component re-renders.
    //
    // `columnsCount` property is also not updated here because by definition it's only
    // updated in `onResize()`.
    // Render.


    _this._isSettingNewItems = true;

    _this.updateState(newState);
  };

  this.getItemsDiff = function (previousItems, newItems) {
    return getItemsDiff(previousItems, newItems, _this.isItemEqual);
  };
}

/**
 * @param  {function} getItemsContainerElement — Returns the container DOM `Element`.
 * @param  {any[]} items — The list of items.
 * @param  {Object} [options] — See README.md.
 * @return {VirtualScroller}
 */

function VirtualScrollerConstructor(getItemsContainerElement, items) {
  var _this = this;

  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var render = options.render,
      state = options.state,
      onStateChange = options.onStateChange,
      initialScrollPosition = options.initialScrollPosition,
      onScrollPositionChange = options.onScrollPositionChange,
      scrollableContainer = options.scrollableContainer,
      _options$measureItems = options.measureItemsBatchSize,
      measureItemsBatchSize = _options$measureItems === void 0 ? 50 : _options$measureItems,
      getColumnsCount = options.getColumnsCount,
      getItemId = options.getItemId,
      tbody = options.tbody,
      estimatedItemHeight = options.estimatedItemHeight,
      getEstimatedVisibleItemRowsCount = options.getEstimatedVisibleItemRowsCount,
      onItemInitialRender = options.onItemInitialRender,
      onItemFirstRender = options.onItemFirstRender,
      _useTimeoutInRenderLoop = options._useTimeoutInRenderLoop,
      _waitForScrollingToStop = options._waitForScrollingToStop,
      engine = options.engine;
  var bypass = options.bypass,
      getEstimatedItemHeight = options.getEstimatedItemHeight,
      getScrollableContainer = options.getScrollableContainer;
  log('~ Initialize ~'); // Could support non-DOM rendering engines.
  // For example, React Native, `<canvas/>`, etc.

  this.engine = engine || DOMEngine;

  if (!getEstimatedItemHeight && typeof estimatedItemHeight === 'number') {
    getEstimatedItemHeight = function getEstimatedItemHeight() {
      return estimatedItemHeight;
    };
  } // `scrollableContainer` option is deprecated.
  // Use `getScrollableContainer()` option instead.


  if (!getScrollableContainer && scrollableContainer) {
    getScrollableContainer = function getScrollableContainer() {
      return scrollableContainer;
    };
  } // Sometimes, when `new VirtualScroller()` instance is created,
  // `getItemsContainerElement()` might not be ready to return the "container" DOM Element yet
  // (for example, because it's not rendered yet). That's the reason why it's a getter function.
  // For example, in React `<VirtualScroller/>` component, a `VirtualScroller`
  // instance is created in the React component's `constructor()`, and at that time
  // the container Element is not yet available. The container Element is available
  // in `componentDidMount()`, but `componentDidMount()` is not executed on server,
  // which would mean that React `<VirtualScroller/>` wouldn't render at all
  // on server side, while with the `getItemsContainerElement()` approach, on server side,
  // it still "renders" a list with a predefined amount of items in it by default.
  // (`initiallyRenderedItemsCount`, or `1`).


  this.getItemsContainerElement = getItemsContainerElement; // if (prerenderMargin === undefined) {
  // 	// Renders items which are outside of the screen by this "prerender margin".
  // 	// Is the screen height by default: seems to be the optimal value
  // 	// for "Page Up" / "Page Down" navigation and optimized mouse wheel scrolling.
  // 	prerenderMargin = this.scrollableContainer ? this.scrollableContainer.getHeight() : 0
  // }

  if (options.getState || options.setState) {
    throw new Error('[virtual-scroller] `getState`/`setState` options usage has changed in the new version. See the readme for more details.');
  } // Work around `<tbody/>` not being able to have `padding`.
  // https://gitlab.com/catamphetamine/virtual-scroller/-/issues/1


  if (tbody) {
    if (this.engine !== DOMEngine) {
      throw new Error('[virtual-scroller] `tbody` option is only supported for DOM rendering engine');
    }

    log('~ <tbody/> detected ~');
    this.tbody = true;

    if (!supportsTbody()) {
      log('~ <tbody/> not supported ~');
      reportError(BROWSER_NOT_SUPPORTED_ERROR);
      bypass = true;
    }
  }

  if (bypass) {
    log('~ "bypass" mode ~');
  } // In `bypass` mode, `VirtualScroller` doesn't wait
  // for the user to scroll down to render all items:
  // instead, it renders all items right away, as if
  // the list is rendered without using `VirtualScroller`.
  // It was added just to measure how much is the
  // performance difference between using a `VirtualScroller`
  // and not using a `VirtualScroller`.
  // It turned out that unmounting large React component trees
  // is a very long process, so `VirtualScroller` does seem to
  // make sense when used in a React application.


  this.bypass = bypass; // this.bypassBatchSize = bypassBatchSize || 10
  // Using `setTimeout()` in render loop is a workaround
  // for avoiding a React error message:
  // "Maximum update depth exceeded.
  //  This can happen when a component repeatedly calls
  //  `.setState()` inside `componentWillUpdate()` or `componentDidUpdate()`.
  //  React limits the number of nested updates to prevent infinite loops."

  this._useTimeoutInRenderLoop = _useTimeoutInRenderLoop;

  if (getItemId) {
    this.isItemEqual = function (a, b) {
      return getItemId(a) === getItemId(b);
    };
  } else {
    this.isItemEqual = function (a, b) {
      return a === b;
    };
  }

  if (onItemInitialRender) {
    this.onItemInitialRender = onItemInitialRender;
  } // `onItemFirstRender(i)` is deprecated, use `onItemInitialRender(item)` instead.
  else if (onItemFirstRender) {
    this.onItemInitialRender = function (item) {
      warn('`onItemFirstRender(i)` is deprecated, use `onItemInitialRender(item)` instead.');

      var _this$getState = _this.getState(),
          items = _this$getState.items;

      var i = items.indexOf(item); // The `item` could also be non-found due to the inconsistency bug:
      // The reason is that `i` can be non-consistent with the `items`
      // passed to `<VirtualScroller/>` in React due to `updateState()` not being
      // instanteneous: when new `items` are passed to `<VirtualScroller/>`,
      // `VirtualScroller.updateState({ items })` is called, and if `onItemFirstRender(i)`
      // is called after the aforementioned `updateState()` is called but before it finishes,
      // `i` would point to an index in "previous" `items` while the application
      // would assume that `i` points to an index in the "new" `items`,
      // resulting in an incorrect item being assumed by the application
      // or even in an "array index out of bounds" error.

      if (i >= 0) {
        onItemFirstRender(i);
      }
    };
  } // If initial `state` is passed then use `items` from `state`
  // instead of the `items` argument.


  if (state) {
    items = state.items;
  }

  log('Items count', items.length);

  if (getEstimatedItemHeight) {
    log('Estimated item height', getEstimatedItemHeight());
  }

  createStateHelpers.call(this, {
    state: state,
    onStateChange: onStateChange,
    render: render,
    items: items
  });
  createVerticalSpacingHelpers.call(this);
  createColumnsHelpers.call(this, {
    getColumnsCount: getColumnsCount
  });
  createLayoutHelpers.call(this);
  createOnRenderHelpers.call(this);
  createResizeHelpers.call(this);
  createItemsHelpers.call(this);
  createHelpers.call(this, {
    getScrollableContainer: getScrollableContainer,
    getEstimatedItemHeight: getEstimatedItemHeight,
    getEstimatedVisibleItemRowsCount: getEstimatedVisibleItemRowsCount,
    measureItemsBatchSize: measureItemsBatchSize,
    initialScrollPosition: initialScrollPosition,
    onScrollPositionChange: onScrollPositionChange,
    waitForScrollingToStop: _waitForScrollingToStop
  });

  if (state) {
    // Initialize `ItemHeights` from previously measured `state.itemHeights`.
    this.itemHeights.readItemHeightsFromState(state); // Initialize some `BeforeResize` internal flags from a previously saved state.

    this.beforeResize.initializeFromState(state);
  }
}

function createHelpers(_ref) {
  var _this2 = this;

  var getScrollableContainer = _ref.getScrollableContainer,
      getEstimatedItemHeight = _ref.getEstimatedItemHeight,
      getEstimatedVisibleItemRowsCount = _ref.getEstimatedVisibleItemRowsCount,
      measureItemsBatchSize = _ref.measureItemsBatchSize,
      initialScrollPosition = _ref.initialScrollPosition,
      onScrollPositionChange = _ref.onScrollPositionChange,
      waitForScrollingToStop = _ref.waitForScrollingToStop;
  this.itemsContainer = this.engine.createItemsContainer(this.getItemsContainerElement); // If the items "container" element is mounted at this stage,
  // remove any accidental text nodes from it (like whitespace).
  //
  // Also, this guards against cases when someone accidentally tries
  // using `VirtualScroller` on a non-empty element.
  //

  if (this.getItemsContainerElement()) {
    this.itemsContainer.clear();
  }

  this.scrollableContainer = this.engine.createScrollableContainer(getScrollableContainer, this.getItemsContainerElement); // Create `ItemHeights` instance.

  this.itemHeights = new ItemHeights({
    container: this.itemsContainer,
    getItemHeight: function getItemHeight(i) {
      return _this2.getState().itemHeights[i];
    },
    setItemHeight: function setItemHeight(i, height) {
      return _this2.getState().itemHeights[i] = height;
    }
  });
  this.layout = new Layout({
    bypass: this.bypass,
    getInitialEstimatedItemHeight: getEstimatedItemHeight,
    getInitialEstimatedVisibleItemRowsCount: getEstimatedVisibleItemRowsCount,
    measureItemsBatchSize: measureItemsBatchSize,
    getPrerenderMargin: function getPrerenderMargin() {
      return _this2.getPrerenderMargin();
    },
    getVerticalSpacing: function getVerticalSpacing() {
      return _this2.getVerticalSpacing();
    },
    getVerticalSpacingBeforeResize: function getVerticalSpacingBeforeResize() {
      return _this2.getVerticalSpacingBeforeResize();
    },
    getColumnsCount: function getColumnsCount() {
      return _this2.getColumnsCount();
    },
    getColumnsCountBeforeResize: function getColumnsCountBeforeResize() {
      return _this2.getState().beforeResize && _this2.getState().beforeResize.columnsCount;
    },
    getItemHeight: function getItemHeight(i) {
      return _this2.getState().itemHeights[i];
    },
    getItemHeightBeforeResize: function getItemHeightBeforeResize(i) {
      return _this2.getState().beforeResize && _this2.getState().beforeResize.itemHeights[i];
    },
    getBeforeResizeItemsCount: function getBeforeResizeItemsCount() {
      return _this2.getState().beforeResize ? _this2.getState().beforeResize.itemHeights.length : 0;
    },
    getAverageItemHeight: function getAverageItemHeight() {
      return _this2.itemHeights.getAverage();
    },
    // `this.scrollableContainer` is gonna be `undefined` during server-side rendering.
    // https://gitlab.com/catamphetamine/virtual-scroller/-/issues/30
    getMaxVisibleAreaHeight: function getMaxVisibleAreaHeight() {
      return _this2.scrollableContainer && _this2.scrollableContainer.getHeight();
    },
    //
    // The "previously calculated layout" feature is not currently used.
    //
    // The current layout snapshot could be stored as a "previously calculated layout" variable
    // so that it could theoretically be used when calculating new layout incrementally
    // rather than from scratch, which would be an optimization.
    //
    getPreviouslyCalculatedLayout: function getPreviouslyCalculatedLayout() {
      return _this2.previouslyCalculatedLayout;
    }
  });
  this.resize = new Resize({
    bypass: this.bypass,
    getWidth: function getWidth() {
      return _this2.scrollableContainer.getWidth();
    },
    getHeight: function getHeight() {
      return _this2.scrollableContainer.getHeight();
    },
    listenForResize: function listenForResize(listener) {
      return _this2.scrollableContainer.onResize(listener);
    },
    onResizeStart: function onResizeStart() {
      log('~ Scrollable container resize started ~');
      _this2._isResizing = true;
    },
    onResizeStop: function onResizeStop() {
      log('~ Scrollable container resize finished ~');
      _this2._isResizing = undefined;
    },
    onNoChange: function onNoChange() {
      // There might have been some missed `this.onUpdateShownItemIndexes()` calls
      // due to setting `this._isResizing` flag to `true` during the resize.
      // So, update shown item indexes just in case.
      _this2.onUpdateShownItemIndexes({
        reason: LAYOUT_REASON.VIEWPORT_SIZE_UNCHANGED
      });
    },
    onHeightChange: function onHeightChange() {
      return _this2.onUpdateShownItemIndexes({
        reason: LAYOUT_REASON.VIEWPORT_HEIGHT_CHANGED
      });
    },
    onWidthChange: function onWidthChange(prevWidth, newWidth) {
      log('~ Scrollable container width changed from', prevWidth, 'to', newWidth, '~');

      _this2.onResize();
    }
  });
  this.scroll = new Scroll({
    bypass: this.bypass,
    scrollableContainer: this.scrollableContainer,
    itemsContainer: this.itemsContainer,
    waitForScrollingToStop: waitForScrollingToStop,
    onScroll: function onScroll() {
      var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          delayed = _ref2.delayed;

      _this2.onUpdateShownItemIndexes({
        reason: delayed ? LAYOUT_REASON.STOPPED_SCROLLING : LAYOUT_REASON.SCROLL
      });
    },
    initialScrollPosition: initialScrollPosition,
    onScrollPositionChange: onScrollPositionChange,
    isImmediateLayoutScheduled: function isImmediateLayoutScheduled() {
      return Boolean(_this2.layoutTimer);
    },
    hasNonRenderedItemsAtTheTop: function hasNonRenderedItemsAtTheTop() {
      return _this2.getState().firstShownItemIndex > 0;
    },
    hasNonRenderedItemsAtTheBottom: function hasNonRenderedItemsAtTheBottom() {
      return _this2.getState().lastShownItemIndex < _this2.getItemsCount() - 1;
    },
    getLatestLayoutVisibleArea: function getLatestLayoutVisibleArea() {
      return _this2.latestLayoutVisibleArea;
    },
    getListTopOffset: this.getListTopOffsetInsideScrollableContainer,
    getPrerenderMargin: function getPrerenderMargin() {
      return _this2.getPrerenderMargin();
    }
  });
  this.listHeightMeasurement = new ListHeightMeasurement({
    itemsContainer: this.itemsContainer,
    getListTopOffset: this.getListTopOffsetInsideScrollableContainer
  });

  if (this.engine.watchListTopOffset) {
    this.listTopOffsetWatcher = this.engine.watchListTopOffset({
      getListTopOffset: this.getListTopOffsetInsideScrollableContainer,
      onListTopOffsetChange: function onListTopOffsetChange(_ref3) {
        return _this2.onUpdateShownItemIndexes({
          reason: LAYOUT_REASON.TOP_OFFSET_CHANGED
        });
      }
    });
  }

  this.beforeResize = new BeforeResize({
    getState: this.getState,
    getVerticalSpacing: this.getVerticalSpacing,
    getColumnsCount: this.getColumnsCount
  });
}

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var VirtualScroller = /*#__PURE__*/function () {
  /**
   * @param  {function} getItemsContainerElement — Returns the container DOM `Element`.
   * @param  {any[]} items — The list of items.
   * @param  {Object} [options] — See README.md.
   * @return {VirtualScroller}
   */
  function VirtualScroller(getItemsContainerElement, items) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    _classCallCheck(this, VirtualScroller);

    _defineProperty(this, "stop", function () {
      if (!_this._isActive) {
        throw new Error('[virtual-scroller] Can\'t stop a `VirtualScroller` that hasn\'t been started');
      }

      _this._isActive = false;
      log('~ Stop ~');

      _this.resize.stop();

      _this.scroll.stop(); // Stop `ListTopOffsetWatcher` if it has been started.
      // There seems to be no need to restart `ListTopOffsetWatcher`.
      // It's mainly a hacky workaround for development mode anyway.


      if (_this.listTopOffsetWatcher && _this.listTopOffsetWatcher.isStarted()) {
        _this.listTopOffsetWatcher.stop();
      } // Cancel any scheduled layout.


      _this.cancelLayoutTimer({});
    });

    _defineProperty(this, "updateLayout", function () {
      _this.hasToBeStarted();

      _this.onUpdateShownItemIndexes({
        reason: LAYOUT_REASON.MANUAL
      });
    });

    _defineProperty(this, "onRender", function () {
      _this._onRender(_this.getState(), _this.previousState);
    });

    VirtualScrollerConstructor.call(this, getItemsContainerElement, items, options);
  }
  /**
   * Should be invoked after a "container" DOM Element is mounted (inserted into the DOM tree).
   */


  _createClass(VirtualScroller, [{
    key: "start",
    value: function start() {
      if (this._isActive) {
        throw new Error('[virtual-scroller] `VirtualScroller` has already been started');
      } // If has been stopped previously.


      var isRestart = this._isActive === false;

      if (!isRestart) {
        // If no custom state storage has been configured, use the default one.
        // Also sets the initial state.
        if (!this._usesCustomStateStorage) {
          this.useDefaultStateStorage();
        } // If `render()` function parameter was passed,
        // perform an initial render.


        if (this._render) {
          this._render(this.getState());
        }
      }

      log('~ Start ~'); // `this._isActive = true` should be placed somewhere at the start of this function.

      this._isActive = true; // Reset `ListHeightMeasurement` just in case it has some "leftover" state.

      this.listHeightMeasurement.reset(); // Reset `_isResizing` flag just in case it has some "leftover" value.

      this._isResizing = undefined; // Reset `_isSettingNewItems` flag just in case it has some "leftover" value.

      this._isSettingNewItems = undefined; // Work around `<tbody/>` not being able to have `padding`.
      // https://gitlab.com/catamphetamine/virtual-scroller/-/issues/1

      if (this.tbody) {
        if (!hasTbodyStyles(this.getItemsContainerElement())) {
          addTbodyStyles(this.getItemsContainerElement());
        }
      } // If there was a pending state update that didn't get applied
      // because of stopping the `VirtualScroller`, apply that state update now.
      //
      // The pending state update won't get applied if the scrollable container width
      // has changed but that's ok because that state update currently could only contain:
      // * `scrollableContainerWidth`
      // * `verticalSpacing`
      // * `beforeResize`
      // All of those get rewritten in `onResize()` anyway.
      //


      var stateUpdate = this._stoppedStateUpdate;
      this._stoppedStateUpdate = undefined; // Reset `this.verticalSpacing` so that it re-measures it in cases when
      // the `VirtualScroller` was previously stopped and is now being restarted.
      // The rationale is that a previously captured inter-item vertical spacing
      // can't be "trusted" in a sense that the user might have resized the window
      // after the previous `state` has been snapshotted.
      // If the user has resized the window, then changing window width might have
      // activated different CSS `@media()` "queries" resulting in a potentially different
      // vertical spacing after the restart.
      // If it's not a restart then `this.verticalSpacing` is `undefined` anyway.

      this.verticalSpacing = undefined;
      var verticalSpacingStateUpdate = this.measureItemHeightsAndSpacing();

      if (verticalSpacingStateUpdate) {
        stateUpdate = _objectSpread(_objectSpread({}, stateUpdate), verticalSpacingStateUpdate);
      }

      this.resize.start();
      this.scroll.start(); // If `scrollableContainerWidth` hasn't been measured yet,
      // measure it and write it to state.

      if (this.getState().scrollableContainerWidth === undefined) {
        var scrollableContainerWidth = this.scrollableContainer.getWidth();
        stateUpdate = _objectSpread(_objectSpread({}, stateUpdate), {}, {
          scrollableContainerWidth: scrollableContainerWidth
        });
      } else {
        // Reset layout:
        // * If the scrollable container width has changed while stopped.
        // * If the restored state was calculated for another scrollable container width.
        var newWidth = this.scrollableContainer.getWidth();
        var prevWidth = this.getState().scrollableContainerWidth;

        if (newWidth !== prevWidth) {
          log('~ Scrollable container width changed from', prevWidth, 'to', newWidth, '~'); // `stateUpdate` doesn't get passed to `this.onResize()`, and, therefore,
          // won't be applied. But that's ok because currently it could only contain:
          // * `scrollableContainerWidth`
          // * `verticalSpacing`
          // * `beforeResize`
          // All of those get rewritten in `onResize()` anyway.

          return this.onResize();
        }
      } // If the `VirtualScroller` uses custom (external) state storage, then
      // check if the columns count has changed between calling `.getInitialState()`
      // and `.start()`. If it has, perform a re-layout "from scratch".


      if (this._usesCustomStateStorage) {
        var columnsCount = this.getActualColumnsCount();
        var columnsCountFromState = this.getState().columnsCount || 1;

        if (columnsCount !== columnsCountFromState) {
          return this.onResize();
        }
      } // Re-calculate layout and re-render the list.
      // Do that even if when an initial `state` parameter, containing layout values,
      // has been passed. The reason is that the `state` parameter can't be "trusted"
      // in a way that it could have been snapshotted for another window width and
      // the user might have resized their window since then.


      this.onUpdateShownItemIndexes({
        reason: LAYOUT_REASON.STARTED,
        stateUpdate: stateUpdate
      });
    } // Could be passed as a "callback" parameter, so bind it to `this`.

  }, {
    key: "hasToBeStarted",
    value: function hasToBeStarted() {
      if (!this._isActive) {
        throw new Error('[virtual-scroller] `VirtualScroller` hasn\'t been started');
      }
    } // Bind it to `this` because this function could hypothetically be passed
    // as a "callback" parameter.

  }, {
    key: "getItemScrollPosition",
    value:
    /**
     * Returns the items's top offset relative to the scrollable container's top edge.
     * @param {number} i — Item index
     * @return {[number]} Returns the item's scroll Y position. Returns `undefined` if any of the previous items haven't been rendered yet.
     */
    function getItemScrollPosition(i) {
      var itemTopOffsetInList = this.layout.getItemTopOffset(i);

      if (itemTopOffsetInList === undefined) {
        return;
      }

      return this.getListTopOffsetInsideScrollableContainer() + itemTopOffsetInList;
    }
    /**
     * Forces a re-measure of an item's height.
     * @param  {number} i — Item index
     */

  }, {
    key: "onItemHeightChange",
    value: function onItemHeightChange(i) {
      this.hasToBeStarted();

      this._onItemHeightChange(i);
    }
    /**
     * Updates an item's state in `state.itemStates[]`.
     * @param  {number} i — Item index
     * @param  {any} i — Item's new state
     */

  }, {
    key: "onItemStateChange",
    value: function onItemStateChange(i, newItemState) {
      this.hasToBeStarted();

      this._onItemStateChange(i, newItemState);
    }
    /**
     * Updates `items`. For example, can prepend or append new items to the list.
     * @param  {any[]} newItems
     * @param {boolean} [options.preserveScrollPositionOnPrependItems] — Set to `true` to enable "restore scroll position after prepending items" feature (could be useful when implementing "Show previous items" button).
     */

  }, {
    key: "setItems",
    value: function setItems(newItems) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.hasToBeStarted();
      return this._setItems(newItems, options);
    }
  }]);

  return VirtualScroller;
}();

class ItemsContainer {
  /**
   * Constructs a new "container" from an element.
   * @param {function} getElement
   */
  constructor(getElement) {
    this.getElement = getElement;
  }
  /**
   * Returns an item element's "top offset", relative to the items `container`'s top edge.
   * @param  {number} renderedElementIndex — An index of an item relative to the "first shown item index". For example, if the list is showing items from index 8 to index 12 then `renderedElementIndex = 0` would mean the item at index `8`.
   * @return {number}
   */
  getNthRenderedItemTopOffset(renderedElementIndex) {
    const elem = this.getElement();
    const children = elem.children;
    return children.length > renderedElementIndex ? children[renderedElementIndex].getBoundingClientRect().top - elem.getBoundingClientRect().top : 0;
  }
  /**
   * Returns an item element's height.
   * @param  {number} renderedElementIndex — An index of an item relative to the "first shown item index". For example, if the list is showing items from index 8 to index 12 then `renderedElementIndex = 0` would mean the item at index `8`.
   * @return {number}
   */
  getNthRenderedItemHeight(renderedElementIndex) {
    const elem = this.getElement();
    const children = elem.children;
    // `offsetHeight` is not precise enough (doesn't return fractional pixels).
    // return this.getElement().childNodes[renderedElementIndex].offsetHeight
    return children.length > renderedElementIndex ? children[renderedElementIndex].getBoundingClientRect().height : 0;
  }
  /**
   * Returns items container height.
   * @return {number}
   */
  getHeight() {
    // `offsetHeight` is not precise enough (doesn't return fractional pixels).
    // return this.getElement().offsetHeight
    return this.getElement().getBoundingClientRect().height;
  }
  /**
   * Removes all item elements of an items container.
   */
  clear() {
    const elem = this.getElement();
    while (elem.firstChild) {
      elem.removeChild(elem.firstChild);
    }
  }
}

class ScrollableContainer {
	/**
	 * Constructs a new "scrollable container" from an element.
	 * @param {Element} scrollableContainer
	 * @param {func} getItemsContainerElement — Returns items "container" element.
	 */
	constructor(element, getItemsContainerElement) {
		this.element = element;
		this.getItemsContainerElement = getItemsContainerElement;
	}

	/**
	 * Returns the current scroll position.
	 * @return {number}
	 */
	getScrollY() {
		return this.element.scrollTop
	}

	/**
	 * Scrolls to a specific position.
	 * @param {number} scrollY
	 */
	scrollToY(scrollY) {
		// IE 11 doesn't seem to have a `.scrollTo()` method.
		// https://gitlab.com/catamphetamine/virtual-scroller/-/issues/10
		// https://stackoverflow.com/questions/39908825/window-scrollto-is-not-working-in-internet-explorer-11
		if (this.element.scrollTo) {
			this.element.scrollTo(0, scrollY);
		} else {
			this.element.scrollTop = scrollY;
		}
	}

	/**
	 * Returns "scrollable container" width,
	 * i.e. the available width for its content.
	 * @return {number}
	 */
	getWidth() {
		return this.element.offsetWidth
	}

	/**
	 * Returns the height of the "scrollable container" itself.
	 * Not to be confused with the height of "scrollable container"'s content.
	 * @return {number}
	 */
	getHeight() {
		// if (!this.element && !precise) {
		// 	return getScreenHeight()
		// }
		return this.element.offsetHeight
	}

	/**
	 * Returns a "top offset" of an items container element
	 * relative to the "scrollable container"'s top edge.
	 * @return {number}
	 */
	getItemsContainerTopOffset() {
		const scrollableContainerTop = this.element.getBoundingClientRect().top;
		const scrollableContainerBorderTopWidth = this.element.clientTop;
		const itemsContainerTop = this.getItemsContainerElement().getBoundingClientRect().top;
		return (itemsContainerTop - scrollableContainerTop) + this.getScrollY() - scrollableContainerBorderTopWidth
	}

	// isVisible() {
	// 	const { top, bottom } = this.element.getBoundingClientRect()
	// 	return bottom > 0 && top < getScreenHeight()
	// }

	/**
	 * Adds a "scroll" event listener to the "scrollable container".
	 * @param {onScroll} Should be called whenever the scroll position inside the "scrollable container" (potentially) changes.
	 * @return {function} Returns a function that stops listening.
	 */
	onScroll(onScroll) {
		this.element.addEventListener('scroll', onScroll);
		return () => this.element.removeEventListener('scroll', onScroll)
	}

	/**
	 * Adds a "resize" event listener to the "scrollable container".
	 * @param {onResize} Should be called whenever the "scrollable container"'s width or height (potentially) changes.
   * @return {function} Returns a function that stops listening.
	 */
	onResize(onResize) {
		// Watches "scrollable container"'s dimensions via a `ResizeObserver`.
		// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
		// https://web.dev/resize-observer/
		let unobserve;
		if (typeof ResizeObserver !== 'undefined') {
			const resizeObserver = new ResizeObserver((entries) => {

                const page = this.getItemsContainerElement()?.closest(".ion-page");
                if (page && page.classList.contains("ion-page-hidden")) {
                    return;
                }
				// // If `entry.contentBoxSize` property is supported by the web browser.
				// if (entry.contentBoxSize) {
				// 	// https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserverEntry/contentBoxSize
				// 	const width = entry.contentBoxSize.inlineSize
				// 	const height = entry.contentBoxSize.blockSize
				// }
				onResize();
			});
			resizeObserver.observe(this.element);
			unobserve = () => resizeObserver.unobserve(this.element);
		}
		// I guess, if window is resized, `onResize()` will be triggered twice:
		// once for window resize, and once for the scrollable container resize.
		// But `onResize()` also has an internal check: if the container size
		// hasn't changed since the previous time `onResize()` has been called,
		// then `onResize()` doesn't do anything, so, I guess, there shouldn't be
		// any "performance implications" of running the listener twice in such case.
		const unlistenGlobalResize = addGlobalResizeListener(onResize, {
			itemsContainerElement: this.getItemsContainerElement()
		});
		return () => {
			if (unobserve) {
				unobserve();
			}
			unlistenGlobalResize();
		}
	}
}

/**
 * Adds a "resize" event listener to the `window`.
 * @param {onResize} Should be called whenever the "scrollable container"'s width or height (potentially) changes.
 * @param  {Element} options.itemsContainerElement — The items "container" element, which is not the same as the "scrollable container" element. For example, "scrollable container" could be resized while the list element retaining its size. One such example is a user entering fullscreen mode on an HTML5 `<video/>` element: in that case, a "resize" event is triggered on a window, and window dimensions change to the user's screen size, but such "resize" event can be ignored because the list isn't visible until the user exits fullscreen mode.
 * @return {function} Returns a function that stops listening.
 */
function addGlobalResizeListener(onResize, { itemsContainerElement }) {
	const onResizeListener = () => {
		// By default, `VirtualScroller` always performs a re-layout
		// on window `resize` event. But browsers (Chrome, Firefox)
		// [trigger](https://developer.mozilla.org/en-US/docs/Web/API/Window/fullScreen#Notes)
		// window `resize` event also when a user switches into fullscreen mode:
		// for example, when a user is watching a video and double-clicks on it
		// to maximize it. And also when the user goes out of the fullscreen mode.
		// Each such fullscreen mode entering/exiting will trigger window `resize`
		// event that will it turn trigger a re-layout of `VirtualScroller`,
		// resulting in bad user experience. To prevent that, such cases are filtered out.
		// Some other workaround:
		// https://stackoverflow.com/questions/23770449/embedded-youtube-video-fullscreen-or-causing-resize
		if (document.fullscreenElement) {
			// If the fullscreened element doesn't contain the list
			// (and is not the list itself), then the layout hasn't been affected,
			// so don't perform a re-layout.
			//
			// For example, suppose there's a list of items, and some item contains a video.
			// If, upon clicking such video, it plays inline, and the user enters
			// fullscreen mode while playing such inline video, then the layout won't be
			// affected, and so such `resize` event should be ignored: when
			// `document.fullscreenElement` is in a separate "branch" relative to the
			// `container`.
			//
			// Another scenario: suppose that upon click, the video doesn't play inline,
			// but instead a "Slideshow" component is open, with the video shown at the
			// center of the screen in an overlay. If then the user enters fullscreen mode,
			// the layout wouldn't be affected too, so such `resize` event should also be
			// ignored: when `document.fullscreenElement` is inside the `container`.
			//
			if (document.fullscreenElement.contains(itemsContainerElement)) ; else {
				// The element is either inside the `container`,
				// Or is in a separate tree.
				// So the `resize` event won't affect the `container`'s dimensions.
				return
			}
		}
		onResize();
	};
	window.addEventListener('resize', onResizeListener);
	return () => window.removeEventListener('resize', onResizeListener)
}

// For some weird reason, in Chrome, `setTimeout()` would lag up to a second (or more) behind.

// Refreshing two times every seconds seems reasonable.
const WATCH_LIST_TOP_OFFSET_INTERVAL = 500;

// Refreshing for 3 seconds after the initial page load seems reasonable.
const WATCH_LIST_TOP_OFFSET_MAX_DURATION = 3000;

// `VirtualScroller` calls `this.layout.layOut()` on mount,
// but if the page styles are applied after `VirtualScroller` mounts
// (for example, if styles are applied via javascript, like Webpack does)
// then the list might not render correctly and it will only show the first item.
// The reason is that in that case calling `.getListTopOffset()` on mount
// returns "incorrect" `top` position because the styles haven't been applied yet.
//
// For example, consider a page:
//
// <div class="page">
//   <nav class="sidebar">...</nav>
//   <main>...</main>
// </div>
//
// The sidebar is styled as `position: fixed`, but, until
// the page styles have been applied, it's gonna be a regular `<div/>`
// meaning that `<main/>` will be rendered below the sidebar
// and will appear offscreen, and so it will only render the first item.
//
// Then, the page styles are loaded and applied, and the sidebar
// is now `position: fixed`, so `<main/>` is now rendered at the top of the page,
// but `VirtualScroller`'s `.render()` has already been called
// and it won't re-render until the user scrolls or the window is resized.
//
// This type of a bug doesn't seem to occur in production, but it can appear
// in development mode when using Webpack. The workaround `VirtualScroller`
// implements for such cases is calling `.getListTopOffset()`
// on the list container DOM element periodically (every second) to check
// if the `top` coordinate has changed as a result of CSS being applied:
// if it has then it recalculates the shown item indexes.
//
// Maybe this bug could occur in production when using Webpack chunks.
// That depends on how a style of a chunk is added to the page:
// if it's added via `javascript` after the page has been rendered
// then this workaround will also work for that case.
//
// Another example would be a page having a really tall expanded "accordion"
// section, below which a `VirtualScroller` list resides. If the user un-expands
// such expanded "accordion" section, the list would become visible but
// it wouldn't get re-rendered because no `scroll` event has occured,
// and the list only re-renders automatically on `scroll` events.
// To work around such cases, call `virtualScroller.updateLayout()` method manually.
// The workaround below could be extended to refresh the list's top coordinate
// indefinitely and at higher intervals, but why waste CPU time on that.
// There doesn't seem to be any DOM API for tracking an element's top position.
// There is `IntersectionObserver` API but it doesn't exactly do that.
//
class ListTopOffsetWatcher {
    constructor({
                    getListTopOffset,
                    onListTopOffsetChange
                }) {
        this.getListTopOffset = getListTopOffset;
        this.onListTopOffsetChange = onListTopOffsetChange;
    }

    onListTopOffset(listTopOffset) {
        if (this.listTopOffsetInsideScrollableContainer === undefined) {
            // Start periodical checks of the list's top offset
            // in order to perform a re-layout in case it changes.
            // See the comments in `ListTopOffsetWatcher.js` file
            // on why can the list's top offset change, and in which circumstances.
            this.start();
        }
        this.listTopOffsetInsideScrollableContainer = listTopOffset;
    }

    start() {
        this._isActive = true;
        this.watchListTopOffset();
    }

    isStarted() {
        return this._isActive
    }

    stop() {
        this._isActive = false;

        if (this.watchListTopOffsetTimer) {
            clearTimeout(this.watchListTopOffsetTimer);
            this.watchListTopOffsetTimer = undefined;
        }
    }

    watchListTopOffset() {
        const startedAt = Date.now();
        const check = () => {
            // If `VirtualScroller` has been unmounted
            // while `setTimeout()` was waiting, then exit.
            if (!this._isActive) {
                return
            }
            // Skip comparing `top` coordinate of the list
            // when this function is called for the first time.
            if (this.listTopOffsetInsideScrollableContainer !== undefined) {
                // Calling `this.getListTopOffset()` on an element
                // runs about 0.003 milliseconds on a modern desktop CPU,
                // so I guess it's fine calling it twice a second.
                if (this.getListTopOffset() !== this.listTopOffsetInsideScrollableContainer) {
                    this.onListTopOffsetChange();
                }
            }
            // Compare `top` coordinate of the list twice a second
            // to find out if it has changed as a result of loading CSS styles.
            // The total duration of 3 seconds would be enough for any styles to load, I guess.
            // There could be other cases changing the `top` coordinate
            // of the list (like collapsing an "accordeon" panel above the list
            // without scrolling the page), but those cases should be handled
            // by manually calling `.updateLayout()` instance method on `VirtualScroller` instance.
            if (Date.now() - startedAt < WATCH_LIST_TOP_OFFSET_MAX_DURATION) {
                this.watchListTopOffsetTimer = setTimeout$1(check, WATCH_LIST_TOP_OFFSET_INTERVAL);
            }
        };
        // Run the cycle.
        check();
    }
}

const engine = {
	createItemsContainer(getItemsContainerElement) {
		return new ItemsContainer(getItemsContainerElement)
	},
	// Creates a `scrollableContainer`.
	// On client side, `scrollableContainer` is always created.
	// On server side, `scrollableContainer` is not created (and not used).
	createScrollableContainer(getScrollableContainer, getItemsContainerElement) {
        return new ScrollableContainer(getScrollableContainer(), getItemsContainerElement)
	},
	watchListTopOffset({
		getListTopOffset,
		onListTopOffsetChange
	}) {
		return new ListTopOffsetWatcher({
			getListTopOffset,
			onListTopOffsetChange
		})
	}
};

const virtualScrollerComponentCss = "ionx-virtual-scroller{display:block}";

let VirtualScrollerComponent = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.preserveScrollPositionOnPrependItems = true;
  }
  initScroller() {
    this.state = {
      items: this.items,
      firstShownItemIndex: 50,
      lastShownItemIndex: 100,
      itemHeights: new Array(this.items.length),
      afterItemsHeight: 0,
      beforeItemsHeight: 0,
      itemStates: new Array(this.items.length)
    };
    this.scroller = new VirtualScroller(() => this.element, this.items, {
      tbody: false,
      engine,
      scrollableContainer: this.element.closest("ion-content").shadowRoot.querySelector(".inner-scroll"),
      getItemId: this.itemKey ? (item) => this.itemKey(item) : undefined
    });
    this.scroller.useState({
      getState: () => {
        return this.state;
      },
      updateState: (stateUpdate) => {
        const prev = this.state;
        const state = { ...prev, ...stateUpdate };
        // console.debug("%c[ionx-virtual-scroller] update state", "color: green; font-weight: bold; font-size: 120%", stateUpdate);
        if (prev.items !== state.items) {
          state.afterItemsHeight = prev.afterItemsHeight;
          state.beforeItemsHeight = prev.beforeItemsHeight;
        }
        if (!shallowEqual$1(prev, state)) {
          this.state = state;
          forceUpdate(this);
        }
      }
    });
  }
  componentDidRender() {
    this.scroller?.onRender();
  }
  itemsChanged(items, _old) {
    if (Array.isArray(items) && items.length > 0 && !this.scroller) {
      this.initScroller();
      setTimeout(() => this.scroller.start());
    }
    else {
      const { preserveScrollPositionOnPrependItems, state } = this;
      const firstItemPosition = this.scroller.getItemScrollPosition(state.firstShownItemIndex);
      console.log(firstItemPosition);
      this.scroller.setItems(items, { preserveScrollPositionOnPrependItems });
    }
  }
  componentShouldUpdate(_new, _old, propName) {
    if (propName === "items") {
      return false;
    }
  }
  connectedCallback() {
    this.initScroller();
  }
  async componentDidLoad() {
    await waitTillHydrated(this.element.closest("ion-content"));
    setTimeout(() => this.scroller.start());
  }
  disconnectedCallback() {
    this.scroller?.stop();
  }
  render() {
    let { items, firstShownItemIndex, lastShownItemIndex, beforeItemsHeight, afterItemsHeight } = this.state;
    if (!items) {
      items = this.items;
    }
    const itemsToRender = [];
    for (let i = firstShownItemIndex; i <= lastShownItemIndex; i++) {
      if (items.length > i) {
        itemsToRender.push([items[i], i]);
      }
    }
    // console.debug("%c[ionx-virtual-scroller] render", "color: magenta; font-weight: bold", firstShownItemIndex, lastShownItemIndex);
    return h(Host, { style: { display: "block", paddingTop: `${beforeItemsHeight}px`, paddingBottom: `${afterItemsHeight}px` } }, itemsToRender.map(item => this.renderItem(item[0], item[1])));
  }
  get element() { return this; }
  static get watchers() { return {
    "items": ["itemsChanged"]
  }; }
  static get style() { return virtualScrollerComponentCss; }
};
VirtualScrollerComponent = /*@__PURE__*/ proxyCustomElement(VirtualScrollerComponent, [0, "ionx-virtual-scroller", {
    "items": [16],
    "renderItem": [16],
    "itemKey": [16],
    "preserveScrollPositionOnPrependItems": [4, "preserve-scroll-position-on-prepend-items"],
    "estimatedItemHeight": [2, "estimated-item-height"]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["ionx-virtual-scroller"];
  components.forEach(tagName => { switch (tagName) {
    case "ionx-virtual-scroller":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, VirtualScrollerComponent);
      }
      break;
  } });
}
defineCustomElement$1();

const IonxVirtualScroller = VirtualScrollerComponent;
const defineCustomElement = defineCustomElement$1;

export { IonxVirtualScroller, defineCustomElement };
