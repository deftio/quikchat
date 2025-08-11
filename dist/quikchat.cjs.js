'use strict';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r );
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (String )(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

// Auto-generated version file - DO NOT EDIT MANUALLY
// This file is automatically updated by tools/updateVersion.js

var quikchatVersion = {
  version: "1.1.16",
  license: "BSD-2",
  url: "https://github/deftio/quikchat",
  fun: true
};

/**
 * Simplified virtual scrolling implementation for QuikChat
 * @private
 */
var SimpleVirtualScroller = /*#__PURE__*/function () {
  function SimpleVirtualScroller(container) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _classCallCheck(this, SimpleVirtualScroller);
    this.container = container;
    this.items = [];
    this.itemHeight = options.itemHeight || 80; // Default/estimate height
    this.buffer = options.buffer || 5;
    this.visibleRange = {
      start: 0,
      end: 0
    };
    this.renderedElements = new Map();
    this.itemHeights = new Map(); // Cache actual heights
    this.itemPositions = new Map(); // Cache positions
    this.totalHeight = 0;
    this.onRenderItem = options.onRenderItem || function () {};
    this._initStructure();
    this._attachScrollListener();
  }
  return _createClass(SimpleVirtualScroller, [{
    key: "_initStructure",
    value: function _initStructure() {
      var _this = this;
      var existingClasses = this.container.className;
      this.container.innerHTML = '';
      this.container.className = existingClasses;
      this.container.style.position = 'relative';
      this.container.style.overflow = 'auto';

      // Ensure container has height
      if (!this.container.style.height && this.container.offsetHeight === 0) {
        this.container.style.height = '100%';
      }
      this.spacer = document.createElement('div');
      this.spacer.style.cssText = 'position: absolute; top: 0; left: 0; width: 1px; pointer-events: none; z-index: -1;';
      this.content = document.createElement('div');
      this.content.style.cssText = 'position: relative; width: 100%;';
      this.container.appendChild(this.spacer);
      this.container.appendChild(this.content);

      // Initial render after structure is set up
      setTimeout(function () {
        _this._updateVisibleRange();
        _this._renderVisibleItems();
      }, 0);
    }
  }, {
    key: "_attachScrollListener",
    value: function _attachScrollListener() {
      var _this2 = this;
      var ticking = false;
      this.container.addEventListener('scroll', function () {
        if (!ticking) {
          requestAnimationFrame(function () {
            _this2._updateVisibleRange();
            _this2._renderVisibleItems();
            ticking = false;
          });
          ticking = true;
        }
      });
    }
  }, {
    key: "_getItemHeight",
    value: function _getItemHeight(index) {
      // Return cached height or estimate
      return this.itemHeights.get(index) || this.itemHeight;
    }
  }, {
    key: "_getItemPosition",
    value: function _getItemPosition(index) {
      // Return cached position or calculate
      if (this.itemPositions.has(index)) {
        return this.itemPositions.get(index);
      }

      // Calculate position based on previous items
      var position = 0;
      for (var i = 0; i < index; i++) {
        position += this._getItemHeight(i);
      }
      this.itemPositions.set(index, position);
      return position;
    }
  }, {
    key: "_recalculatePositions",
    value: function _recalculatePositions(fromIndex) {
      // Recalculate positions from a specific index onwards
      var position = fromIndex > 0 ? this._getItemPosition(fromIndex) : 0;
      for (var i = fromIndex; i < this.items.length; i++) {
        this.itemPositions.set(i, position);
        position += this._getItemHeight(i);

        // Update position of rendered elements
        var element = this.renderedElements.get(i);
        if (element) {
          element.style.top = "".concat(this.itemPositions.get(i), "px");
        }
      }

      // Update total height
      this.totalHeight = position;
      this.spacer.style.height = "".concat(this.totalHeight, "px");
    }
  }, {
    key: "_updateVisibleRange",
    value: function _updateVisibleRange() {
      var scrollTop = this.container.scrollTop;
      var viewportHeight = this.container.clientHeight;

      // Find first visible item based on positions
      var startIndex = 0;
      var endIndex = this.items.length;

      // Use cached positions when available
      if (this.itemPositions.size > 0) {
        // Find start index
        for (var i = 0; i < this.items.length; i++) {
          var pos = this._getItemPosition(i);
          if (pos + this._getItemHeight(i) > scrollTop) {
            startIndex = Math.max(0, i - this.buffer);
            break;
          }
        }

        // Find end index
        for (var _i = startIndex; _i < this.items.length; _i++) {
          var _pos = this._getItemPosition(_i);
          if (_pos > scrollTop + viewportHeight) {
            endIndex = Math.min(this.items.length, _i + this.buffer);
            break;
          }
        }
      } else {
        // Fallback to estimate if no positions cached yet
        startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
        endIndex = Math.min(this.items.length, Math.ceil((scrollTop + viewportHeight) / this.itemHeight) + this.buffer);
      }
      this.visibleRange = {
        start: startIndex,
        end: endIndex
      };
    }
  }, {
    key: "_renderVisibleItems",
    value: function _renderVisibleItems() {
      var _this3 = this;
      var _this$visibleRange = this.visibleRange,
        start = _this$visibleRange.start,
        end = _this$visibleRange.end;

      // Remove elements outside range
      this.renderedElements.forEach(function (element, index) {
        if (index < start || index >= end) {
          element.remove();
          _this3.renderedElements["delete"](index);
          // Don't clear height cache - we might need it again
        }
      });

      // Add new visible elements
      var _loop = function _loop(i) {
        var item = _this3.items[i];
        if (!item || _this3.renderedElements.has(i)) return 1; // continue
        var element = _this3._createItemElement(item, i);
        element.style.position = 'absolute';
        element.style.top = "".concat(_this3._getItemPosition(i), "px");
        element.style.left = '0';
        element.style.right = '0';
        _this3.renderedElements.set(i, element);
        _this3.content.appendChild(element);

        // Measure actual height after rendering
        requestAnimationFrame(function () {
          if (_this3.renderedElements.has(i)) {
            var actualHeight = element.offsetHeight;
            if (actualHeight && actualHeight !== _this3._getItemHeight(i)) {
              _this3.itemHeights.set(i, actualHeight);
              _this3._recalculatePositions(i);
            }
          }
        });
      };
      for (var i = start; i < end; i++) {
        if (_loop(i)) continue;
      }
      this.onRenderItem(this.content);
    }
  }, {
    key: "_createItemElement",
    value: function _createItemElement(item, index) {
      var messageDiv = document.createElement('div');
      messageDiv.className = "quikchat-message quikchat-message-".concat(item.align || 'left', " quikchat-msgid-").concat(String(item.msgid).padStart(10, '0'));
      messageDiv.setAttribute('data-index', index);
      messageDiv.setAttribute('data-msgid', item.msgid);
      if (item.tags && item.tags.length > 0) {
        item.tags.forEach(function (tag) {
          return messageDiv.classList.add("quikchat-tag-".concat(tag));
        });
      }
      var userDiv = document.createElement('div');
      userDiv.className = 'quikchat-message-user';
      userDiv.innerHTML = item.userString || '';
      var contentDiv = document.createElement('div');
      contentDiv.className = 'quikchat-message-content';
      contentDiv.innerHTML = item.content || '';
      messageDiv.appendChild(userDiv);
      messageDiv.appendChild(contentDiv);
      if (!item.visible) {
        messageDiv.style.display = 'none';
      }
      return messageDiv;
    }
  }, {
    key: "addItem",
    value: function addItem(item) {
      this.items.push(item);
      var index = this.items.length - 1;

      // Calculate position for new item
      var position = index > 0 ? this._getItemPosition(index - 1) + this._getItemHeight(index - 1) : 0;
      this.itemPositions.set(index, position);

      // Update total height (using estimate for new item)
      this.totalHeight = position + this.itemHeight;
      this.spacer.style.height = "".concat(this.totalHeight, "px");
      if (index >= this.visibleRange.start && index < this.visibleRange.end) {
        this._renderVisibleItems();
      }
      if (item.scrollIntoView) {
        this.container.scrollTop = this.container.scrollHeight;
      }
      return index;
    }
  }, {
    key: "addItems",
    value: function addItems(items) {
      var _this$items;
      // Batch add items for better performance
      var startLength = this.items.length;
      (_this$items = this.items).push.apply(_this$items, _toConsumableArray(items));

      // Calculate positions for new items
      var position = startLength > 0 ? this._getItemPosition(startLength - 1) + this._getItemHeight(startLength - 1) : 0;
      for (var i = startLength; i < this.items.length; i++) {
        this.itemPositions.set(i, position);
        position += this.itemHeight; // Use estimate for new items
      }
      this.totalHeight = position;
      this.spacer.style.height = "".concat(this.totalHeight, "px");

      // Update visible range and render
      this._updateVisibleRange();
      this._renderVisibleItems();

      // Handle scrollIntoView for last item if needed
      if (items.length > 0 && items[items.length - 1].scrollIntoView) {
        this.container.scrollTop = this.container.scrollHeight;
      }
    }
  }, {
    key: "clear",
    value: function clear() {
      this.items = [];
      this.renderedElements.clear();
      this.itemHeights.clear();
      this.itemPositions.clear();
      this.totalHeight = 0;
      this.content.innerHTML = '';
      this.spacer.style.height = '0px';
      this.visibleRange = {
        start: 0,
        end: 0
      };

      // Force update after clear
      this._updateVisibleRange();
      this._renderVisibleItems();
    }
  }, {
    key: "updateItem",
    value: function updateItem(index, updates) {
      if (index >= 0 && index < this.items.length) {
        this.items[index] = _objectSpread2(_objectSpread2({}, this.items[index]), updates);
        if (this.renderedElements.has(index)) {
          this._renderVisibleItems();
        }
      }
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.container.innerHTML = '';
      this.items = [];
      this.renderedElements.clear();
    }
  }]);
}();
/**
 * QuikChat - A zero-dependency JavaScript chat widget for modern web applications
 * @class quikchat
 * @version 1.1.16-dev1
 */
var quikchat = /*#__PURE__*/function () {
  /**
   * Creates a new QuikChat instance
   * @constructor
   * @param {string|HTMLElement} parentElement - CSS selector or DOM element to attach the chat widget to
   * @param {Function} [onSend] - Callback function triggered when user sends a message
   * @param {Object} [options] - Configuration options
   * @param {string} [options.theme='quikchat-theme-light'] - CSS theme class name
   * @param {boolean} [options.trackHistory=true] - Whether to track message history
   * @param {Object} [options.titleArea] - Title area configuration
   * @param {string} [options.titleArea.title='Chat'] - Title text/HTML
   * @param {boolean} [options.titleArea.show=false] - Whether to show title area initially
   * @param {'left'|'center'|'right'} [options.titleArea.align='center'] - Title alignment
   * @param {Object} [options.messagesArea] - Messages area configuration
   * @param {boolean} [options.messagesArea.alternating=true] - Alternate message colors
   * @param {Object} [options.inputArea] - Input area configuration
   * @param {boolean} [options.inputArea.show=true] - Whether to show input area initially
   * @param {boolean} [options.sendOnEnter=true] - Send message on Enter key
   * @param {boolean} [options.sendOnShiftEnter=false] - Send message on Shift+Enter
   * @param {string} [options.instanceClass=''] - Additional CSS class for the widget instance
   * @example
   * // Basic usage
   * const chat = new quikchat('#chat-container', (instance, message) => {
   *   console.log('User sent:', message);
   * });
   * 
   * @example
   * // With options
   * const chat = new quikchat('#chat', handleMessage, {
   *   theme: 'quikchat-theme-dark',
   *   titleArea: { title: 'Support Chat', show: true },
   *   sendOnEnter: false,
   *   sendOnShiftEnter: true
   * });
   */
  function quikchat(parentElement) {
    var onSend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, quikchat);
    var defaultOpts = {
      theme: 'quikchat-theme-light',
      trackHistory: true,
      titleArea: {
        title: "Chat",
        show: false,
        align: "center"
      },
      messagesArea: {
        alternating: true
      },
      inputArea: {
        show: true
      },
      sendOnEnter: true,
      sendOnShiftEnter: false,
      instanceClass: '',
      virtualScrolling: true,
      // Default to true for better performance
      virtualScrollingThreshold: 500 // Lower threshold since it performs so well
    };
    var meta = _objectSpread2(_objectSpread2({}, defaultOpts), options); // merge options with defaults

    if (typeof parentElement === 'string') {
      parentElement = document.querySelector(parentElement);
    }
    //console.log(parentElement, meta);
    this._parentElement = parentElement;
    this._theme = meta.theme;
    this._onSend = onSend ? onSend : function () {}; // call back function for onSend
    this._createWidget();
    if (meta.instanceClass) {
      this._chatWidget.classList.add(meta.instanceClass);
    }

    // title area
    if (meta.titleArea) {
      this.titleAreaSetContents(meta.titleArea.title, meta.titleArea.align);
      if (meta.titleArea.show === true) {
        this.titleAreaShow();
      } else {
        this.titleAreaHide();
      }
    }
    // messages area
    if (meta.messagesArea) {
      this.messagesAreaAlternateColors(meta.messagesArea.alternating);
    }

    // input area
    if (meta.inputArea) {
      if (meta.inputArea.show === true) this.inputAreaShow();else this.inputAreaHide();
    }
    // plumbing
    this._attachEventListeners();
    this.trackHistory = meta.trackHistory || true;
    this._historyLimit = 10000000;
    this._history = [];
    this._activeTags = new Set();

    // send on enter / shift enter
    this.sendOnEnter = meta.sendOnEnter;
    this.sendOnShiftEnter = meta.sendOnShiftEnter;

    // Virtual scrolling setup
    this.virtualScrollingEnabled = meta.virtualScrolling;
    this.virtualScrollingThreshold = meta.virtualScrollingThreshold;
    this.virtualScroller = null;

    // Don't initialize virtual scrolling immediately - wait for threshold
    // Virtual scrolling will be initialized when message count exceeds threshold
  }

  /**
   * Initialize virtual scrolling
   * @private
   */
  return _createClass(quikchat, [{
    key: "_initVirtualScrolling",
    value: function _initVirtualScrolling() {
      var _this4 = this;
      if (this.virtualScrollingEnabled && this._messagesArea && !this.virtualScroller) {
        // Check if we've hit the threshold (or about to with the next message)
        if (this._history.length >= this.virtualScrollingThreshold - 1) {
          this.virtualScroller = new SimpleVirtualScroller(this._messagesArea, {
            itemHeight: 80,
            buffer: 5,
            onRenderItem: function onRenderItem(content) {
              // Apply alternating colors if enabled
              if (_this4._messagesArea.classList.contains('quikchat-messages-area-alt')) {
                _this4._updateMessageStyles();
              }
            }
          });

          // Migrate existing messages to virtual scroller
          this._migrateToVirtualScrolling();
        }
      }
    }

    /**
     * Migrate existing messages to virtual scrolling
     * @private
     */
  }, {
    key: "_migrateToVirtualScrolling",
    value: function _migrateToVirtualScrolling() {
      if (!this.virtualScroller) return;

      // Clear DOM but keep history
      this._messagesArea.innerHTML = '';

      // Add all messages to virtual scroller
      var items = this._history.map(function (msg) {
        return {
          msgid: msg.msgid,
          content: msg.content,
          userString: msg.userString,
          align: msg.align,
          role: msg.role,
          visible: msg.visible,
          tags: msg.tags || [],
          scrollIntoView: false
        };
      });
      this.virtualScroller.addItems(items);
    }
  }, {
    key: "_createWidget",
    value: function _createWidget() {
      var widgetHTML = "\n            <div class=\"quikchat-base ".concat(this.theme, "\">\n                <div class=\"quikchat-title-area\">\n                    <span style=\"font-size: 1.5em; font-weight: 600;\">Title Area</span>\n                </div>\n                <div class=\"quikchat-messages-area\"></div>\n                <div class=\"quikchat-input-area\">\n                    <textarea class=\"quikchat-input-textbox\"></textarea>\n                    <button class=\"quikchat-input-send-btn\">Send</button>\n                </div>\n            </div>\n            ");
      this._parentElement.innerHTML = widgetHTML;
      this._chatWidget = this._parentElement.querySelector('.quikchat-base');
      this._titleArea = this._chatWidget.querySelector('.quikchat-title-area');
      this._messagesArea = this._chatWidget.querySelector('.quikchat-messages-area');
      this._inputArea = this._chatWidget.querySelector('.quikchat-input-area');
      this._textEntry = this._inputArea.querySelector('.quikchat-input-textbox');
      this._sendButton = this._inputArea.querySelector('.quikchat-input-send-btn');
      this.msgid = 0;
    }

    /**
     * Attach event listeners to the widget
     */
  }, {
    key: "_attachEventListeners",
    value: function _attachEventListeners() {
      var _this5 = this;
      this._sendButton.addEventListener('click', function (event) {
        event.preventDefault();
        _this5._onSend(_this5, _this5._textEntry.value.trim());
      });
      window.addEventListener('resize', function () {
        return _this5._handleContainerResize();
      });
      this._chatWidget.addEventListener('resize', function () {
        return _this5._handleContainerResize();
      });
      this._textEntry.addEventListener('keydown', function (event) {
        // Check if Shift + Enter is pressed then we just do carraige
        if (event.shiftKey && event.keyCode === 13) {
          // Prevent default behavior (adding new line)
          if (_this5.sendOnShiftEnter) {
            event.preventDefault();
            _this5._onSend(_this5, _this5._textEntry.value.trim());
          }
        } else if (event.keyCode === 13) {
          // Enter but not Shift + Enter
          if (_this5.sendOnEnter) {
            event.preventDefault();
            _this5._onSend(_this5, _this5._textEntry.value.trim());
          }
        }
      });
      this._messagesArea.addEventListener('scroll', function () {
        var _this5$_messagesArea = _this5._messagesArea,
          scrollTop = _this5$_messagesArea.scrollTop,
          scrollHeight = _this5$_messagesArea.scrollHeight,
          clientHeight = _this5$_messagesArea.clientHeight;
        _this5.userScrolledUp = scrollTop + clientHeight < scrollHeight;
      });
    }

    // set the onSend function callback.
  }, {
    key: "setCallbackOnSend",
    value: function setCallbackOnSend(callback) {
      this._onSend = callback;
    }
    // set a callback for everytime a message is added (listener)
  }, {
    key: "setCallbackonMessageAdded",
    value: function setCallbackonMessageAdded(callback) {
      this._onMessageAdded = callback;
    }

    /**
     * Sets the callback function for when content is appended to a message
     * @param {Function} callback - Function to call when content is appended
     * @param {quikchat} callback.instance - The QuikChat instance
     * @param {number} callback.msgId - The ID of the message being appended to
     * @param {string} callback.content - The content being appended
     * @since 1.1.15
     * @example
     * chat.setCallbackonMessageAppend((instance, msgId, content) => {
     *   console.log(`Appended "${content}" to message ${msgId}`);
     * });
     */
  }, {
    key: "setCallbackonMessageAppend",
    value: function setCallbackonMessageAppend(callback) {
      this._onMessageAppend = callback;
    }

    /**
     * Sets the callback function for when a message's content is replaced
     * @param {Function} callback - Function to call when content is replaced
     * @param {quikchat} callback.instance - The QuikChat instance
     * @param {number} callback.msgId - The ID of the message being replaced
     * @param {string} callback.content - The new content
     * @since 1.1.15
     * @example
     * chat.setCallbackonMessageReplace((instance, msgId, content) => {
     *   console.log(`Message ${msgId} replaced with: ${content}`);
     * });
     */
  }, {
    key: "setCallbackonMessageReplace",
    value: function setCallbackonMessageReplace(callback) {
      this._onMessageReplace = callback;
    }

    /**
     * Sets the callback function for when a message is deleted
     * @param {Function} callback - Function to call when a message is deleted
     * @param {quikchat} callback.instance - The QuikChat instance
     * @param {number} callback.msgId - The ID of the deleted message
     * @since 1.1.15
     * @example
     * chat.setCallbackonMessageDelete((instance, msgId) => {
     *   console.log(`Message ${msgId} was deleted`);
     * });
     */
  }, {
    key: "setCallbackonMessageDelete",
    value: function setCallbackonMessageDelete(callback) {
      this._onMessageDelete = callback;
    }

    // Public methods
    /**
     * Toggles the visibility of the title area
     * @returns {void}
     */
  }, {
    key: "titleAreaToggle",
    value: function titleAreaToggle() {
      this._titleArea.style.display === 'none' ? this.titleAreaShow() : this.titleAreaHide();
    }

    /**
     * Shows the title area
     * @returns {void}
     */
  }, {
    key: "titleAreaShow",
    value: function titleAreaShow() {
      this._titleArea.style.display = '';
      this._adjustMessagesAreaHeight();
    }

    /**
     * Hides the title area
     * @returns {void}
     */
  }, {
    key: "titleAreaHide",
    value: function titleAreaHide() {
      this._titleArea.style.display = 'none';
      this._adjustMessagesAreaHeight();
    }

    /**
     * Sets the contents of the title area
     * @param {string} title - HTML content to display in the title area
     * @param {'left'|'center'|'right'} [align='center'] - Text alignment
     * @returns {void}
     * @example
     * chat.titleAreaSetContents('<h2>Support Chat</h2>', 'center');
     */
  }, {
    key: "titleAreaSetContents",
    value: function titleAreaSetContents(title) {
      var align = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'center';
      this._titleArea.innerHTML = title;
      this._titleArea.style.textAlign = align;
    }

    /**
     * Gets the current contents of the title area
     * @returns {string} The HTML content of the title area
     */
  }, {
    key: "titleAreaGetContents",
    value: function titleAreaGetContents() {
      return this._titleArea.innerHTML;
    }
  }, {
    key: "inputAreaToggle",
    value: function inputAreaToggle() {
      this._inputArea.classList.toggle('hidden');
      this._inputArea.style.display === 'none' ? this.inputAreaShow() : this.inputAreaHide();
    }
  }, {
    key: "inputAreaShow",
    value: function inputAreaShow() {
      this._inputArea.style.display = '';
      this._adjustMessagesAreaHeight();
    }
  }, {
    key: "inputAreaHide",
    value: function inputAreaHide() {
      this._inputArea.style.display = 'none';
      this._adjustMessagesAreaHeight();
    }
  }, {
    key: "_adjustMessagesAreaHeight",
    value: function _adjustMessagesAreaHeight() {
      var hiddenElements = _toConsumableArray(this._chatWidget.children).filter(function (child) {
        return child.classList.contains('hidden');
      });
      var totalHiddenHeight = hiddenElements.reduce(function (sum, child) {
        return sum + child.offsetHeight;
      }, 0);
      var containerHeight = this._chatWidget.offsetHeight;
      this._messagesArea.style.height = "calc(100% - ".concat(containerHeight - totalHiddenHeight, "px)");
    }
  }, {
    key: "_handleContainerResize",
    value: function _handleContainerResize() {
      this._adjustMessagesAreaHeight();
      this._adjustSendButtonWidth();
      return true;
    }
  }, {
    key: "_adjustSendButtonWidth",
    value: function _adjustSendButtonWidth() {
      var sendButtonText = this._sendButton.textContent.trim();
      var fontSize = parseFloat(getComputedStyle(this._sendButton).fontSize);
      var minWidth = fontSize * sendButtonText.length + 16;
      this._sendButton.style.minWidth = "".concat(minWidth, "px");
      return true;
    }

    //messagesArea functions
  }, {
    key: "messagesAreaAlternateColors",
    value: function messagesAreaAlternateColors() {
      var alt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      if (alt) {
        this._messagesArea.classList.add('quikchat-messages-area-alt');
      } else {
        this._messagesArea.classList.remove('quikchat-messages-area-alt');
      }
      return alt === true;
    }
  }, {
    key: "messagesAreaAlternateColorsToggle",
    value: function messagesAreaAlternateColorsToggle() {
      this._messagesArea.classList.toggle('quikchat-messages-area-alt');
    }
  }, {
    key: "messagesAreaAlternateColorsGet",
    value: function messagesAreaAlternateColorsGet() {
      return this._messagesArea.classList.contains('quikchat-messages-area-alt');
    }
    /**
     * Adds a new message to the chat with full configuration options
     * @param {Object} input - Message configuration object
     * @param {string} [input.content=''] - Message content (HTML allowed)
     * @param {string} [input.userString='user'] - Display name for the message sender
     * @param {'left'|'right'|'center'} [input.align='right'] - Message alignment
     * @param {string} [input.role='user'] - Role identifier (user, assistant, system)
     * @param {number} [input.userID=-1] - User ID for the message
     * @param {string|false} [input.timestamp=false] - ISO timestamp or false for auto
     * @param {string|false} [input.updatedtime=false] - Last updated timestamp
     * @param {boolean|'smart'} [input.scrollIntoView=true] - Scroll behavior (true/false/'smart')
     * @param {boolean} [input.visible=true] - Whether message is initially visible
     * @param {string[]} [input.tags=[]] - Tags for message categorization
     * @returns {number} Message ID for the newly added message
     * @example
     * const msgId = chat.messageAddFull({
     *   content: 'Hello!',
     *   userString: 'Bot',
     *   align: 'left',
     *   scrollIntoView: 'smart',
     *   tags: ['greeting']
     * });
     */
  }, {
    key: "messageAddFull",
    value: function messageAddFull() {
      var _this6 = this;
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        content: "",
        userString: "user",
        align: "right",
        role: "user",
        userID: -1,
        timestamp: false,
        updatedtime: false,
        scrollIntoView: true,
        visible: true,
        tags: []
      };
      var msgid = this.msgid;
      this.msgid++;
      var messageDiv = null; // Initialize messageDiv to null

      // Check if we should initialize virtual scrolling
      if (this.virtualScrollingEnabled && !this.virtualScroller && this._history.length >= this.virtualScrollingThreshold - 1) {
        this._initVirtualScrolling();
      }

      // If virtual scrolling is enabled, use the virtual scroller
      if (this.virtualScroller) {
        var messageData = {
          msgid: msgid,
          content: input.content,
          userString: input.userString,
          align: input.align,
          role: input.role,
          visible: input.visible !== undefined ? input.visible : true,
          tags: input.tags || [],
          scrollIntoView: input.scrollIntoView
        };

        // Add tags to active tags set
        if (Array.isArray(input.tags)) {
          input.tags.forEach(function (tag) {
            if (typeof tag === 'string' && /^[a-zA-Z0-9-]+$/.test(tag)) {
              _this6._activeTags.add(tag);
            }
          });
        }

        // Add to virtual scroller
        this.virtualScroller.addItem(messageData);

        // Clear text entry
        this._textEntry.value = '';
        this._adjustMessagesAreaHeight();
      } else {
        // Original DOM-based implementation
        messageDiv = document.createElement('div');
        var msgidClass = 'quikchat-msgid-' + String(msgid).padStart(10, '0');
        'quikchat-userid-' + String(input.userString).padStart(10, '0'); // hash this..
        messageDiv.classList.add('quikchat-message', msgidClass, 'quikchat-structure');
        if (Array.isArray(input.tags)) {
          input.tags.forEach(function (tag) {
            if (typeof tag === 'string' && /^[a-zA-Z0-9-]+$/.test(tag)) {
              messageDiv.classList.add("quikchat-tag-".concat(tag));
              _this6._activeTags.add(tag);
            }
          });
        }
        var userDiv = document.createElement('div');
        userDiv.innerHTML = input.userString;
        userDiv.classList.add('quikchat-user-label');
        userDiv.style.textAlign = input.align;
        var contentDiv = document.createElement('div');
        contentDiv.classList.add('quikchat-message-content');

        // Determine text alignment for right-aligned messages
        if (input.align === "right") {
          var isMultiLine = input.content.includes("\n");
          var isLong = input.content.length > 50; // Adjust length threshold

          if (isMultiLine || isLong) {
            contentDiv.classList.add("quikchat-right-multiline");
          } else {
            contentDiv.classList.add("quikchat-right-singleline");
          }
        }
        contentDiv.innerHTML = input.content;
        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        this._messagesArea.appendChild(messageDiv);
        if (input.visible === false) {
          messageDiv.style.display = 'none';
        }

        // Handle scroll behavior based on scrollIntoView parameter
        // 'smart' = only scroll if near bottom, true = always scroll, false = never scroll
        if (input.scrollIntoView === true) {
          this.messageScrollToBottom();
        } else if (input.scrollIntoView === 'smart' && !this.userScrolledUp) {
          this.messageScrollToBottom();
        }
        // If scrollIntoView is false, don't scroll at all

        this._textEntry.value = '';
        this._adjustMessagesAreaHeight();
        this._handleShortLongMessageCSS(messageDiv, input.align); // Handle CSS for short/long messages
        this._updateMessageStyles();
      }

      // Add timestamp now, unless it is passed in 
      var timestamp = input.timestamp ? input.timestamp : new Date().toISOString();
      var updatedtime = input.updatedtime ? input.updatedtime : timestamp;
      var visible = input.visible !== undefined ? input.visible : true;
      if (this.trackHistory) {
        this._history.push(_objectSpread2(_objectSpread2({
          msgid: msgid
        }, input), {}, {
          visible: visible,
          timestamp: timestamp,
          updatedtime: updatedtime,
          messageDiv: messageDiv || null
        }));
        if (this._history.length > this._historyLimit) {
          this._history.shift();
        }
      }
      if (this._onMessageAdded) {
        this._onMessageAdded(this, msgid);
      }
      return msgid;
    }

    /**
     * Adds a new message to the chat (simplified version of messageAddFull)
     * @param {string} [content=''] - Message content (HTML allowed)
     * @param {string} [userString='user'] - Display name for the message sender
     * @param {'left'|'right'|'center'} [align='right'] - Message alignment
     * @param {string} [role='user'] - Role identifier (user, assistant, system)
     * @param {boolean|'smart'} [scrollIntoView=true] - Scroll behavior
     * @param {boolean} [visible=true] - Whether message is initially visible
     * @param {string[]} [tags=[]] - Tags for message categorization
     * @returns {number} Message ID for the newly added message
     * @example
     * // Simple message
     * chat.messageAddNew('Hello!', 'User', 'right');
     * 
     * // Bot message with smart scroll
     * chat.messageAddNew('Hi there!', 'Bot', 'left', 'assistant', 'smart');
     */
  }, {
    key: "messageAddNew",
    value: function messageAddNew() {
      var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var userString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "user";
      var align = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "right";
      var role = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "user";
      var scrollIntoView = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : true;
      var visible = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
      var tags = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : [];
      var retvalue = this.messageAddFull({
        content: content,
        userString: userString,
        align: align,
        role: role,
        scrollIntoView: scrollIntoView,
        visible: visible,
        tags: tags
      });
      // this.messageScrollToBottom();
      return retvalue;
    }

    /**
     * Removes a message from the chat by its ID
     * @param {number} n - Message ID to remove
     * @returns {boolean} True if message was removed, false if not found
     * @example
     * const success = chat.messageRemove(5);
     */
  }, {
    key: "messageRemove",
    value: function messageRemove(n) {
      // use css selector to remove the message
      var sucess = false;
      try {
        this._messagesArea.removeChild(this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0'))));
        sucess = true;
      } catch (error) {
        console.log("{String(n)} : Message ID not found");
      }
      if (sucess) {
        // slow way to remove from history
        //this._history = this._history.filter((item) => item.msgid !== n); // todo make this more efficient

        // better way to delete this from history
        this._history.splice(this._history.findIndex(function (item) {
          return item.msgid === n;
        }), 1);

        // Call the onMessageDelete callback if it exists
        if (this._onMessageDelete) {
          this._onMessageDelete(this, n);
        }
      }
      return sucess;
    }
    /* returns the message html object from the DOM
    */
    /**
     * Gets the DOM element for a message by its ID
     * @param {number} n - Message ID
     * @returns {HTMLElement|null} The message DOM element or null if not found
     */
  }, {
    key: "messageGetDOMObject",
    value: function messageGetDOMObject(n) {
      var msg = null;
      // now use css selector to get the message 
      try {
        msg = this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0')));
      } catch (error) {
        console.log("{String(n)} : Message ID not found");
      }
      return msg;
    }
    /* returns the message content only
    */
    /**
     * Gets the content of a message by its ID
     * @param {number} n - Message ID
     * @returns {string} The message content or empty string if not found
     */
  }, {
    key: "messageGetContent",
    value: function messageGetContent(n) {
      var content = "";
      // now use css selector to get the message 
      try {
        // get from history..
        content = this._history.filter(function (item) {
          return item.msgid === n;
        })[0].content;
        //content =  this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.textContent;
      } catch (error) {
        console.log("{String(n)} : Message ID not found");
      }
      return content;
    }

    /* returns the DOM Content element of a given message
    */
  }, {
    key: "messageGetContentDOMElement",
    value: function messageGetContentDOMElement(n) {
      var contentElement = null;
      // now use css selector to get the message
      try {
        //contentElement = this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild;
        contentElement = this._history.filter(function (item) {
          return item.msgid === n;
        })[0].messageDiv.lastChild;
      } catch (error) {
        console.log("{String(n)} : Message ID not found");
      }
      return contentElement;
    }

    /* append message to the message content
    */
  }, {
    key: "messageAppendContent",
    value: function messageAppendContent(n, content) {
      var success = false;
      try {
        // Update history first
        var item = this._history.filter(function (item) {
          return item.msgid === n;
        })[0];
        item.content += content;
        item.updatedtime = new Date().toISOString();

        // If virtual scrolling is active, update the virtual scroller
        if (this.virtualScroller) {
          // Find the item index in virtual scroller
          var index = this.virtualScroller.items.findIndex(function (item) {
            return item.msgid === n;
          });
          if (index >= 0) {
            this.virtualScroller.items[index].content += content;
            // Re-render if the item is currently visible
            this.virtualScroller.updateItem(index, {
              content: this.virtualScroller.items[index].content
            });
          }
        } else {
          // Regular DOM manipulation
          this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0'))).lastChild.innerHTML += content;
        }
        success = true;

        // Call the onMessageAppend callback if it exists
        if (this._onMessageAppend) {
          this._onMessageAppend(this, n, content);
        }

        // Don't auto-scroll on append - let user control this
        // Users can call messageScrollToBottom() if they want to scroll
      } catch (error) {
        console.log("".concat(String(n), " : Message ID not found"));
      }
      return success;
    }

    /* replace message content
    */
  }, {
    key: "messageReplaceContent",
    value: function messageReplaceContent(n, content) {
      var success = false;
      try {
        // Update history first
        var item = this._history.filter(function (item) {
          return item.msgid === n;
        })[0];
        item.content = content;
        item.updatedtime = new Date().toISOString();

        // If virtual scrolling is active, update the virtual scroller
        if (this.virtualScroller) {
          // Find the item index in virtual scroller
          var index = this.virtualScroller.items.findIndex(function (item) {
            return item.msgid === n;
          });
          if (index >= 0) {
            this.virtualScroller.items[index].content = content;
            // Re-render if the item is currently visible
            this.virtualScroller.updateItem(index, {
              content: content
            });
          }
        } else {
          // Regular DOM manipulation
          this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0'))).lastChild.innerHTML = content;
        }
        success = true;

        // Call the onMessageReplace callback if it exists
        if (this._onMessageReplace) {
          this._onMessageReplace(this, n, content);
        }

        // Don't auto-scroll on append - let user control this
        // Users can call messageScrollToBottom() if they want to scroll
      } catch (error) {
        console.log("".concat(String(n), " : Message ID not found"));
      }
      return success;
    }

    /**
     * Scrolls the messages area to the bottom.
     */
  }, {
    key: "messageScrollToBottom",
    value: function messageScrollToBottom() {
      if (this._messagesArea.lastElementChild) {
        this._messagesArea.lastElementChild.scrollIntoView();
      }
    }

    /**
     * Removes the last message from the messages area.
     */
  }, {
    key: "messageRemoveLast",
    value: function messageRemoveLast() {
      // find the last message by id:
      if (this._history.length >= 0) {
        var lastMsgId = this._history[this._history.length - 1].msgid;
        return this.messageRemove(lastMsgId);
      }
      return false;
    }
  }, {
    key: "messageSetVisibility",
    value: function messageSetVisibility(msgid, isVisible) {
      var message = this._history.find(function (item) {
        return item.msgid === msgid;
      });
      if (message && message.messageDiv) {
        message.messageDiv.style.display = isVisible ? '' : 'none';
        message.visible = isVisible;
        this._updateMessageStyles();
        return true;
      }
      return false;
    }
  }, {
    key: "messageGetVisibility",
    value: function messageGetVisibility(msgid) {
      var message = this._history.find(function (item) {
        return item.msgid === msgid;
      });
      if (message && message.messageDiv) {
        return message.messageDiv.style.display !== 'none';
      }
      return false; // Return false if not found or no messageDiv
    }
  }, {
    key: "_updateMessageStyles",
    value: function _updateMessageStyles() {
      var visibleMessages = _toConsumableArray(this._messagesArea.children).filter(function (child) {
        return child.style.display !== 'none';
      });
      visibleMessages.forEach(function (messageDiv, index) {
        messageDiv.classList.remove('quikchat-message-1', 'quikchat-message-2');
        messageDiv.classList.add(index % 2 === 0 ? 'quikchat-message-1' : 'quikchat-message-2');
      });
    }

    /**
     * For right sided or centered messages, we need to handle the CSS for short and long messages.
     * for short messages we use simple justifying, for long messages we need to wrap and perform multiline
     * formatting. 
     * 
     * @param {*} messageElement 
     * @returns nothing
     */
  }, {
    key: "_handleShortLongMessageCSS",
    value: function _handleShortLongMessageCSS(messageElement, align) {
      // console.log(messageElement);
      // Reset classes
      messageElement.classList.remove('left-singleline', 'left-multiline', 'center-singleline', 'center-multiline', 'right-singleline', 'right-multiline');
      var contentDiv = messageElement.lastChild;
      window.lastDiv = contentDiv; // for debugging   
      // Determine if the message is short or long

      var computedStyle = window.getComputedStyle(contentDiv);

      // Get the element's height
      var elementHeight = contentDiv.offsetHeight;

      // Calculate or estimate line height
      var lineHeight;
      if (computedStyle.lineHeight === "normal") {
        var fontSize = parseFloat(computedStyle.fontSize);
        lineHeight = fontSize * 1.2; // approximate "normal" as 1.2 times font-size
      } else {
        lineHeight = parseFloat(computedStyle.lineHeight);
      }

      // Check if the element height is more than one line-height
      var isMultiLine = elementHeight > lineHeight;

      // Using scrollHeight and clientHeight to check for overflow (multi-line)
      switch (align) {
        case 'center':
          if (isMultiLine) {
            messageElement.classList.add('center-multiline');
          } else {
            messageElement.classList.add('center-singleline');
          }
          break;
        case 'right':
          if (isMultiLine) {
            messageElement.classList.add('right-multiline');
          } else {
            messageElement.classList.add('right-singleline');
          }
          break;
        case 'left':
        default:
          if (isMultiLine) {
            messageElement.classList.add('left-multiline');
          } else {
            messageElement.classList.add('left-singleline');
          }
          break;
      }
    }
    // history functions
    /**
     * 
     * @param {*} n 
     * @param {*} m 
     * @returns array of history messages
     */
    /**
     * Gets a slice of message history
     * @param {number} [n] - Start index (defaults to 0)
     * @param {number} [m] - End index (defaults to history length)
     * @returns {Array} Array of message objects
     * @example
     * // Get first 10 messages
     * const messages = chat.historyGet(0, 10);
     * 
     * // Get all messages
     * const allMessages = chat.historyGet();
     */
  }, {
    key: "historyGet",
    value: function historyGet(n, m) {
      if (n == undefined) {
        n = 0;
        m = this._history.length;
      }
      if (m === undefined) {
        m = n < 0 ? m : n + 1;
      }
      // remember that entries could be deleted.  TODO: So we need to return the actual history entries
      // so now we need to find the array index that correspondes to messageIds n (start) and m (end)

      return this._history.slice(n, m);
    }

    /**
     * Gets a copy of the entire message history
     * @returns {Array} Complete array of all message objects
     * @example
     * const history = chat.historyGetAllCopy();
     * console.log(`Total messages: ${history.length}`);
     */
  }, {
    key: "historyGetAllCopy",
    value: function historyGetAllCopy() {
      return this._history.slice();
    }

    /**
     * Get a page of history messages with pagination support
     * @param {number} page - Page number (1-based)
     * @param {number} pageSize - Number of messages per page (default 50)
     * @param {string} order - 'asc' for oldest first, 'desc' for newest first (default 'asc')
     * @returns {object} Object with messages array, pagination info
     */
  }, {
    key: "historyGetPage",
    value: function historyGetPage() {
      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var pageSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;
      var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'asc';
      var totalMessages = this._history.length;
      var totalPages = Math.ceil(totalMessages / pageSize);
      var currentPage = Math.max(1, Math.min(page, totalPages || 1));
      var start, end;
      if (order === 'desc') {
        // For descending order, page 1 shows the newest messages
        start = Math.max(0, totalMessages - currentPage * pageSize);
        end = totalMessages - (currentPage - 1) * pageSize;
      } else {
        // For ascending order, page 1 shows the oldest messages
        start = (currentPage - 1) * pageSize;
        end = Math.min(start + pageSize, totalMessages);
      }
      var messages = this._history.slice(start, end);

      // Reverse messages array if descending order requested
      if (order === 'desc') {
        messages.reverse();
      }
      return {
        messages: messages,
        pagination: {
          currentPage: currentPage,
          pageSize: pageSize,
          totalPages: totalPages,
          totalMessages: totalMessages,
          hasNext: currentPage < totalPages,
          hasPrevious: currentPage > 1,
          order: order
        }
      };
    }

    /**
     * Get information about history size and pagination
     * @param {number} pageSize - Size to calculate pages for (default 50)
     * @returns {object} History metadata
     */
    /**
     * Search history for messages matching criteria
     * @param {object} criteria - Search criteria object
     * @param {string} criteria.text - Text to search for in message content
     * @param {string} criteria.userString - Filter by user name
     * @param {string} criteria.role - Filter by role
     * @param {array} criteria.tags - Filter by tags (messages with any of these tags)
     * @param {number} criteria.limit - Maximum results to return (default 100)
     * @returns {array} Array of matching messages
     */
    /**
     * Searches through message history with various filters
     * @param {Object} [criteria={}] - Search criteria
     * @param {string} [criteria.text] - Text to search for in message content
     * @param {string} [criteria.userString] - Filter by specific user
     * @param {string} [criteria.role] - Filter by role (user, assistant, system)
     * @param {string[]} [criteria.tags] - Filter by tags (messages must have at least one)
     * @param {number} [criteria.limit=100] - Maximum number of results
     * @returns {Array} Array of matching messages
     * @since 1.1.15
     * @example
     * // Search for messages containing 'error'
     * const errors = chat.historySearch({ text: 'error' });
     * 
     * // Find all bot messages
     * const botMessages = chat.historySearch({ role: 'assistant' });
     * 
     * // Complex search
     * const results = chat.historySearch({
     *   text: 'help',
     *   userString: 'Support',
     *   tags: ['urgent'],
     *   limit: 20
     * });
     */
  }, {
    key: "historySearch",
    value: function historySearch() {
      var criteria = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var results = this._history;

      // Filter by text content (case-insensitive)
      if (criteria.text) {
        var searchText = criteria.text.toLowerCase();
        results = results.filter(function (msg) {
          return msg.content.toLowerCase().includes(searchText);
        });
      }

      // Filter by user
      if (criteria.userString) {
        results = results.filter(function (msg) {
          return msg.userString === criteria.userString;
        });
      }

      // Filter by role
      if (criteria.role) {
        results = results.filter(function (msg) {
          return msg.role === criteria.role;
        });
      }

      // Filter by tags (match any tag)
      if (criteria.tags && criteria.tags.length > 0) {
        results = results.filter(function (msg) {
          return msg.tags && msg.tags.some(function (tag) {
            return criteria.tags.includes(tag);
          });
        });
      }

      // Limit results
      var limit = criteria.limit || 100;
      if (results.length > limit) {
        results = results.slice(0, limit);
      }
      return results;
    }

    /**
     * Gets metadata and statistics about the message history
     * @param {number} [pageSize=50] - Page size for calculating total pages
     * @returns {Object} History information object
     * @returns {number} returns.totalMessages - Total number of messages
     * @returns {number} returns.totalPages - Total pages based on page size
     * @returns {Object|null} returns.oldestMessage - First message info
     * @returns {Object|null} returns.newestMessage - Last message info
     * @returns {Object} returns.memoryUsage - Memory usage statistics
     * @since 1.1.15
     * @example
     * const info = chat.historyGetInfo();
     * console.log(`Messages: ${info.totalMessages}`);
     * console.log(`Memory: ${info.memoryUsage.estimatedSize} bytes`);
     */
  }, {
    key: "historyGetInfo",
    value: function historyGetInfo() {
      var pageSize = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 50;
      var totalMessages = this._history.length;
      return {
        totalMessages: totalMessages,
        totalPages: Math.ceil(totalMessages / pageSize),
        oldestMessage: totalMessages > 0 ? {
          msgid: this._history[0].msgid,
          timestamp: this._history[0].timestamp,
          userString: this._history[0].userString
        } : null,
        newestMessage: totalMessages > 0 ? {
          msgid: this._history[totalMessages - 1].msgid,
          timestamp: this._history[totalMessages - 1].timestamp,
          userString: this._history[totalMessages - 1].userString
        } : null,
        memoryUsage: {
          estimatedSize: JSON.stringify(this._history).length,
          averageMessageSize: totalMessages > 0 ? Math.round(JSON.stringify(this._history).length / totalMessages) : 0
        }
      };
    }

    /**
     * Clears all messages and resets the chat
     * @returns {void}
     * @example
     * chat.historyClear(); // Removes all messages
     */
  }, {
    key: "historyClear",
    value: function historyClear() {
      this.msgid = 0;

      // Handle virtual scroller
      if (this.virtualScroller) {
        this.virtualScroller.clear();
      } else {
        this._messagesArea.innerHTML = "";
      }
      this._history = [];
      this._activeTags.clear();
    }
  }, {
    key: "historyGetLength",
    value: function historyGetLength() {
      return this._history.length;
    }
  }, {
    key: "historyGetMessage",
    value: function historyGetMessage(n) {
      if (n >= 0 && n < this._history.length) {
        return this._history[n];
      }
      return {};
    }
  }, {
    key: "historyGetMessageContent",
    value: function historyGetMessageContent(n) {
      if (n >= 0 && n < this._history.length) return this._history[n].content;else return "";
    }

    // expects an array of messages to be in the format of the history object
  }, {
    key: "historyRestoreAll",
    value: function historyRestoreAll(messageList) {
      var _this7 = this;
      // clear all messages and history
      this.historyClear();

      // clear the messages div 
      this._messagesArea.innerHTML = "";

      // add all messages
      messageList.forEach(function (message) {
        _this7.messageAddFull(message);
      });
    }
    /**
     * 
     * @param {string} newTheme 
     */
  }, {
    key: "changeTheme",
    value: function changeTheme(newTheme) {
      this._chatWidget.classList.remove(this._theme);
      this._chatWidget.classList.add(newTheme);
      this._theme = newTheme;
    }

    /**
     *  Get the current theme
     * @returns {string} - The current theme
     */
  }, {
    key: "theme",
    get: function get() {
      return this._theme;
    }

    /**
     * 
     * @returns {object} - Returns the version and license information for the library.
     */
    /**
     * Gets the QuikChat version information
     * @static
     * @returns {Object} Version information object
     * @returns {string} returns.version - Version number (e.g., '1.1.15')
     * @returns {string} returns.license - License type (e.g., 'BSD-2')
     * @returns {string} returns.url - Project URL
     * @returns {boolean} returns.fun - Easter egg flag
     * @example
     * const version = quikchat.version();
     * console.log(`QuikChat v${version.version}`);
     */
  }, {
    key: "setTagVisibility",
    value:
    /**
     * Sets visibility for all messages with a specific tag
     * @param {string} tagName - Tag name to control
     * @param {boolean} isVisible - Whether to show or hide messages with this tag
     * @returns {boolean} True if successful, false if invalid tag name
     * @since 1.1.14
     * @example
     * // Hide all system messages
     * chat.setTagVisibility('system', false);
     * 
     * // Show urgent messages
     * chat.setTagVisibility('urgent', true);
     */
    function setTagVisibility(tagName, isVisible) {
      if (typeof tagName !== 'string' || !/^[a-zA-Z0-9-]+$/.test(tagName)) {
        return false;
      }
      var className = "quikchat-show-tag-".concat(tagName);
      if (isVisible) {
        this._chatWidget.classList.add(className);
      } else {
        this._chatWidget.classList.remove(className);
      }
      this._updateMessageStyles();
      return true;
    }

    /**
     * Gets the visibility state of a tag
     * @param {string} tagName - Tag name to check
     * @returns {boolean} True if tag is visible, false otherwise
     * @since 1.1.14
     * @example
     * const isVisible = chat.getTagVisibility('system');
     */
  }, {
    key: "getTagVisibility",
    value: function getTagVisibility(tagName) {
      if (typeof tagName !== 'string' || !/^[a-zA-Z0-9-]+$/.test(tagName)) {
        return false;
      }
      return this._chatWidget.classList.contains("quikchat-show-tag-".concat(tagName));
    }

    /**
     * Gets all active tags in the chat
     * @returns {string[]} Array of all tags currently in use
     * @since 1.1.14
     * @example
     * const tags = chat.getActiveTags();
     * console.log('Active tags:', tags);
     */
  }, {
    key: "getActiveTags",
    value: function getActiveTags() {
      return Array.from(this._activeTags);
    }

    /**
     * Checks if virtual scrolling is currently enabled
     * @returns {boolean} True if virtual scrolling is enabled, false otherwise
     * @since 1.1.16
     * @example
     * if (chat.isVirtualScrollingEnabled()) {
     *     console.log('Virtual scrolling is active');
     * }
     */
  }, {
    key: "isVirtualScrollingEnabled",
    value: function isVirtualScrollingEnabled() {
      return this.virtualScrollingEnabled && this.virtualScroller !== null;
    }

    /**
     * Gets the virtual scrolling configuration
     * @returns {Object} Virtual scrolling configuration with enabled status and threshold
     * @since 1.1.16
     * @example
     * const config = chat.getVirtualScrollingConfig();
     * console.log(`Virtual scrolling: ${config.enabled}, threshold: ${config.threshold}`);
     */
  }, {
    key: "getVirtualScrollingConfig",
    value: function getVirtualScrollingConfig() {
      return {
        enabled: this.virtualScrollingEnabled,
        active: this.virtualScroller !== null,
        threshold: this.virtualScrollingThreshold
      };
    }
  }], [{
    key: "version",
    value: function version() {
      return quikchatVersion;
    }

    /**
     * quikchat.loremIpsum() - Generate a simple string of Lorem Ipsum text (sample typographer's text) of numChars in length.
     * borrowed from github.com/deftio/bitwrench.js
     * @param {number} numChars - The number of characters to generate (random btw 25 and 150 if undefined).    
     * @param {number} [startSpot=0] - The starting index in the Lorem Ipsum text. If undefined, a random startSpot will be generated.
     * @param {boolean} [startWithCapitalLetter=true] - If true, capitalize the first character or inject a capital letter if the first character isn't a capital letter.
     * 
     * @returns {string} A string of Lorem Ipsum text.
     * 
     * @example 
     * // Returns 200 characters of Lorem Ipsum starting from index 50
     * loremIpsum(200, 50);
     * 
     * @example 
     * //Returns a 200 Lorem Ipsum characters starting from a random index
     * loremIpsum(200);
     */

    /**
     * Generates Lorem Ipsum placeholder text
     * @static
     * @param {number} [numChars] - Length of text to generate (random if not specified)
     * @param {number} [startSpot] - Starting offset in Lorem text (random if not specified)
     * @param {boolean} [startWithCapitalLetter=true] - Whether to capitalize first letter
     * @returns {string} Generated Lorem Ipsum text
     * @example
     * // Generate 100 characters
     * const text = quikchat.loremIpsum(100);
     * 
     * // Generate random length
     * const randomText = quikchat.loremIpsum();
     */
  }, {
    key: "loremIpsum",
    value: function loremIpsum(numChars) {
      var startSpot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var startWithCapitalLetter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ";
      if (typeof numChars !== "number") {
        numChars = Math.floor(Math.random() * 150) + 25;
      }
      if (startSpot === undefined) {
        startSpot = Math.floor(Math.random() * loremText.length);
      }
      startSpot = startSpot % loremText.length;

      // Move startSpot to the next non-whitespace and non-punctuation character
      while (loremText[startSpot] === ' ' || /[.,:;!?]/.test(loremText[startSpot])) {
        startSpot = (startSpot + 1) % loremText.length;
      }
      var l = loremText.substring(startSpot) + loremText.substring(0, startSpot);
      if (typeof numChars !== "number") {
        numChars = l.length;
      }
      var s = "";
      while (numChars > 0) {
        s += numChars < l.length ? l.substring(0, numChars) : l;
        numChars -= l.length;
      }
      if (s[s.length - 1] === " ") {
        s = s.substring(0, s.length - 1) + "."; // always end on non-whitespace. "." was chosen arbitrarily.
      }
      if (startWithCapitalLetter) {
        var c = s[0].toUpperCase();
        c = /[A-Z]/.test(c) ? c : "M";
        s = c + s.substring(1);
      }
      return s;
    }
  }, {
    key: "tempMessageGenerator",
    value:
    /**
     * Creates a temporary message that updates periodically
     * @static
     * @param {string|HTMLElement} domElement - Element selector or DOM element
     * @param {string} content - Initial message content
     * @param {number} interval - Update interval in milliseconds (min 100ms)
     * @param {Function} [cb=null] - Callback to generate new content
     * @param {string} cb.message - Current message
     * @param {number} cb.count - Update count
     * @returns {void}
     * @example
     * // Simple loading indicator
     * quikchat.tempMessageGenerator('#loading', 'Loading', 500);
     * 
     * // Custom update function
     * quikchat.tempMessageGenerator('#status', 'Processing', 1000, (msg, count) => {
     *   return `Processing... ${count}%`;
     * });
     */
    function tempMessageGenerator(domElement, content, interval) {
      var cb = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
      interval = Math.max(interval, 100); // Ensure at least 100ms interval

      var count = 0;
      var defaultCB = function defaultCB(msg, count) {
        msg += ".";
        return msg;
      };
      if (cb && typeof cb !== 'function') {
        cb = null;
      }
      cb = cb || defaultCB;

      // if its a string, then get the element (css sel) or its an DOM element already 
      var el = domElement;
      if (typeof el === 'string') {
        el = document.querySelector(el);
      }
      var element = el;

      // Ensure the element exists
      if (!element) return;
      element.innerHTML = content;
      var currentMsg = content;
      var intervalId = setInterval(function () {
        if (element.innerHTML !== currentMsg) {
          clearInterval(intervalId); // Stop updating if content is changed externally
          return;
        }
        currentMsg = String(cb(currentMsg, count)); // Use callback return value if provided

        count++;
        element.innerHTML = currentMsg;
      }, interval);
    }
  }, {
    key: "createTempMessageDOMStr",
    value: function createTempMessageDOMStr(initialContent) {
      var updateInterval = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000;
      var callback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      // Make sure the interval is at least 100ms
      updateInterval = Math.max(updateInterval, 100);

      // Validate callback; if not a function, ignore it.
      if (callback && typeof callback !== 'function') {
        callback = null;
      }
      // Default callback simply appends a dot.
      callback = callback || function (msg, count) {
        return msg + ".";
      };

      // Allow an optional CSS class for the container element
      var containerClass = options.containerClass ? options.containerClass : '';

      // Generate a unique id so that the inline script can reliably find the container.
      var uniqueId = "tempMsg_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);

      // Build and return the HTML string.
      // Note the use of <\/script> (with a backslash) so that the inline script is not terminated early.
      return "\n          <span id=\"".concat(uniqueId, "\" ").concat(containerClass ? "class=\"".concat(containerClass, "\"") : '', ">\n            ").concat(initialContent, "\n          </span>\n          <script>\n            (function(){\n              // Get our container element by its unique id.\n              var container = document.getElementById(\"").concat(uniqueId, "\");\n              if (!container) return;\n              var count = 0;\n              var currentMsg = container.innerHTML;\n              var interval = ").concat(updateInterval, ";\n              // Convert the callback function into its string representation.\n              var cb = ").concat(callback.toString(), ";\n              var intervalId = setInterval(function(){\n                // If the content has been replaced, stop updating.\n                if(container.innerHTML !== currentMsg){\n                  clearInterval(intervalId);\n                  return;\n                }\n                // Use the callback to generate the new message.\n                currentMsg = String(cb(currentMsg, count));\n                count++;\n                container.innerHTML = currentMsg;\n              }, interval);\n            })();\n          </script>\n        ");
    }
  }]);
}();

module.exports = quikchat;
//# sourceMappingURL=quikchat.cjs.js.map
