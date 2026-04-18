'use strict';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}
function _callSuper(t, o, e) {
  return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e));
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t];
    o.enumerable = o.enumerable || false, o.configurable = true, "value" in o && (o.writable = true), Object.defineProperty(e, _toPropertyKey(o.key), o);
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
    writable: false
  }), e;
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: true
          } : {
            done: false,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = true,
    u = false;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = true, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: true,
    configurable: true,
    writable: true
  }) : e[r] = t, e;
}
function _getPrototypeOf(t) {
  return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function (t) {
    return t.__proto__ || Object.getPrototypeOf(t);
  }, _getPrototypeOf(t);
}
function _inherits(t, e) {
  if ("function" != typeof e && null !== e) throw new TypeError("Super expression must either be null or a function");
  t.prototype = Object.create(e && e.prototype, {
    constructor: {
      value: t,
      writable: true,
      configurable: true
    }
  }), Object.defineProperty(t, "prototype", {
    writable: false
  }), e && _setPrototypeOf(t, e);
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
  } catch (t) {}
  return (_isNativeReflectConstruct = function () {
    return !!t;
  })();
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
    r % 2 ? ownKeys(Object(t), true).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _possibleConstructorReturn(t, e) {
  if (e && ("object" == typeof e || "function" == typeof e)) return e;
  if (void 0 !== e) throw new TypeError("Derived constructors may only return object or undefined");
  return _assertThisInitialized(t);
}
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r);
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
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

var quikchat = /*#__PURE__*/function () {
  /**
   *
   * @param string or DOM element  parentElement
   * @param {*} meta
   */
  function quikchat(parentElement) {
    var onSend = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () {};
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, quikchat);
    var defaultOpts = {
      theme: 'quikchat-theme-light',
      trackHistory: true,
      showTimestamps: false,
      titleArea: {
        title: "Chat",
        show: false,
        align: "center"
      },
      messagesArea: {
        alternating: true
      }
    };
    var meta = _objectSpread2(_objectSpread2({}, defaultOpts), options); // merge options with defaults

    if (typeof parentElement === 'string') {
      parentElement = document.querySelector(parentElement);
    }
    this._parentElement = parentElement;
    this._theme = meta.theme;
    this._onSend = onSend ? onSend : function () {}; // call back function for onSend
    this._messageFormatter = meta.messageFormatter || null;
    this._sanitize = meta.sanitize || false;
    this._createWidget();
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
    // timestamps
    if (meta.showTimestamps) {
      this.messagesAreaShowTimestamps(true);
    }
    // direction (ltr/rtl)
    if (meta.direction) {
      this.setDirection(meta.direction);
    }
    // plumbing
    this._attachEventListeners();
    this.trackHistory = meta.trackHistory !== false;
    this._historyLimit = 10000000;
    this._history = [];
  }
  return _createClass(quikchat, [{
    key: "_createWidget",
    value: function _createWidget() {
      var widgetHTML = "\n            <div class=\"quikchat-base ".concat(this.theme, "\">\n                <div class=\"quikchat-title-area\"></div>\n                <div class=\"quikchat-messages-wrapper\"><div class=\"quikchat-messages-area\" role=\"log\" aria-live=\"polite\" aria-label=\"Chat messages\"></div><button class=\"quikchat-scroll-bottom\" aria-label=\"Scroll to bottom\"></button></div>\n                <div class=\"quikchat-input-area\">\n                    <textarea class=\"quikchat-input-textbox\" rows=\"1\" aria-label=\"Type a message\"></textarea>\n                    <button class=\"quikchat-input-send-btn\">Send</button>\n                </div>\n            </div>\n            ");
      this._parentElement.innerHTML = widgetHTML;
      this._chatWidget = this._parentElement.querySelector('.quikchat-base');
      this._titleArea = this._chatWidget.querySelector('.quikchat-title-area');
      this._messagesWrapper = this._chatWidget.querySelector('.quikchat-messages-wrapper');
      this._messagesArea = this._chatWidget.querySelector('.quikchat-messages-area');
      this._scrollBottomBtn = this._messagesWrapper.querySelector('.quikchat-scroll-bottom');
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
      var _this = this;
      this._sendButton.addEventListener('click', function () {
        var text = _this._textEntry.value.trim();
        if (text === '') return;
        _this._onSend(_this, text);
      });
      this._textEntry.addEventListener('keydown', function (event) {
        // Check if Shift + Enter is pressed
        if (event.shiftKey && event.keyCode === 13) {
          event.preventDefault();
          var text = _this._textEntry.value.trim();
          if (text === '') return;
          _this._onSend(_this, text);
        }
      });

      // Auto-grow textarea
      this._textEntry.addEventListener('input', function () {
        return _this._autoGrowTextarea();
      });
      this._messagesArea.addEventListener('scroll', function () {
        var _this$_messagesArea = _this._messagesArea,
          scrollTop = _this$_messagesArea.scrollTop,
          scrollHeight = _this$_messagesArea.scrollHeight,
          clientHeight = _this$_messagesArea.clientHeight;
        _this.userScrolledUp = scrollTop + clientHeight < scrollHeight - 1;
        _this._updateScrollBottomBtn();
      });

      // Scroll-to-bottom button
      this._scrollBottomBtn.addEventListener('click', function () {
        return _this.scrollToBottom();
      });

      // Ctrl+End to scroll to bottom
      this._chatWidget.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.key === 'End') {
          event.preventDefault();
          _this.scrollToBottom();
        }
      });

      // Use ResizeObserver to detect parent container resize
      if (typeof ResizeObserver !== 'undefined') {
        this._resizeObserver = new ResizeObserver(function () {
          return _this._handleContainerResize();
        });
        this._resizeObserver.observe(this._parentElement);
      }
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
  }, {
    key: "setCallbackonMessageAppend",
    value: function setCallbackonMessageAppend(callback) {
      this._onMessageAppend = callback;
    }
  }, {
    key: "setCallbackonMessageReplace",
    value: function setCallbackonMessageReplace(callback) {
      this._onMessageReplace = callback;
    }
  }, {
    key: "setCallbackonMessageDelete",
    value: function setCallbackonMessageDelete(callback) {
      this._onMessageDelete = callback;
    }

    // Public methods
  }, {
    key: "titleAreaToggle",
    value: function titleAreaToggle() {
      if (this._titleArea.style.display === 'none') {
        this.titleAreaShow();
      } else {
        this.titleAreaHide();
      }
    }
  }, {
    key: "titleAreaShow",
    value: function titleAreaShow() {
      this._titleArea.style.display = '';
    }
  }, {
    key: "titleAreaHide",
    value: function titleAreaHide() {
      this._titleArea.style.display = 'none';
    }
  }, {
    key: "titleAreaSetContents",
    value: function titleAreaSetContents(title) {
      var align = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'center';
      this._titleArea.innerHTML = title;
      this._titleArea.style.textAlign = align;
    }
  }, {
    key: "titleAreaGetContents",
    value: function titleAreaGetContents() {
      return this._titleArea.innerHTML;
    }
  }, {
    key: "inputAreaToggle",
    value: function inputAreaToggle() {
      if (this._inputArea.style.display === 'none') {
        this.inputAreaShow();
      } else {
        this.inputAreaHide();
      }
    }
  }, {
    key: "inputAreaShow",
    value: function inputAreaShow() {
      this._inputArea.style.display = '';
    }
  }, {
    key: "inputAreaHide",
    value: function inputAreaHide() {
      this._inputArea.style.display = 'none';
    }
  }, {
    key: "inputAreaSetEnabled",
    value: function inputAreaSetEnabled(enabled) {
      this._textEntry.disabled = !enabled;
      this._sendButton.disabled = !enabled;
    }
  }, {
    key: "inputAreaSetButtonText",
    value: function inputAreaSetButtonText(text) {
      this._sendButton.textContent = text;
    }
  }, {
    key: "inputAreaGetButtonText",
    value: function inputAreaGetButtonText() {
      return this._sendButton.textContent;
    }
  }, {
    key: "setDirection",
    value: function setDirection(dir) {
      var d = dir === 'rtl' ? 'rtl' : 'ltr';
      this._chatWidget.setAttribute('dir', d);
      if (d === 'rtl') {
        this._chatWidget.classList.add('quikchat-rtl');
      } else {
        this._chatWidget.classList.remove('quikchat-rtl');
      }
    }
  }, {
    key: "getDirection",
    value: function getDirection() {
      return this._chatWidget.getAttribute('dir') || 'ltr';
    }
  }, {
    key: "_handleContainerResize",
    value: function _handleContainerResize() {
      // Layout is handled by CSS flexbox — no JS height calculation needed.
      // This hook exists for future use or custom resize callbacks.
    }
  }, {
    key: "scrollToBottom",
    value: function scrollToBottom() {
      this._messagesArea.scrollTop = this._messagesArea.scrollHeight;
      this.userScrolledUp = false;
      this._updateScrollBottomBtn();
    }
  }, {
    key: "_updateScrollBottomBtn",
    value: function _updateScrollBottomBtn() {
      if (this.userScrolledUp) {
        this._scrollBottomBtn.classList.add('quikchat-scroll-bottom-visible');
      } else {
        this._scrollBottomBtn.classList.remove('quikchat-scroll-bottom-visible');
      }
    }
  }, {
    key: "_autoGrowTextarea",
    value: function _autoGrowTextarea() {
      var el = this._textEntry;
      el.style.height = 'auto';
      var maxHeight = 120;
      el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
      el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }
  }, {
    key: "_formatTimestamp",
    value: function _formatTimestamp(isoString) {
      var d = new Date(isoString);
      var h = d.getHours();
      var m = String(d.getMinutes()).padStart(2, '0');
      var ampm = h >= 12 ? 'PM' : 'AM';
      var h12 = h % 12 || 12;
      return h12 + ':' + m + ' ' + ampm;
    }
  }, {
    key: "messagesAreaShowTimestamps",
    value: function messagesAreaShowTimestamps(show) {
      if (show) {
        this._messagesArea.classList.add('quikchat-show-timestamps');
      } else {
        this._messagesArea.classList.remove('quikchat-show-timestamps');
      }
    }
  }, {
    key: "messagesAreaShowTimestampsGet",
    value: function messagesAreaShowTimestampsGet() {
      return this._messagesArea.classList.contains('quikchat-show-timestamps');
    }
  }, {
    key: "messagesAreaShowTimestampsToggle",
    value: function messagesAreaShowTimestampsToggle() {
      this._messagesArea.classList.toggle('quikchat-show-timestamps');
    }
  }, {
    key: "_escapeHTML",
    value: function _escapeHTML(str) {
      var div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }, {
    key: "_processContent",
    value: function _processContent(content) {
      if (this._sanitize === true) {
        content = this._escapeHTML(content);
      } else if (typeof this._sanitize === 'function') {
        content = this._sanitize(content);
      }
      if (this._messageFormatter) {
        content = this._messageFormatter(content);
      }
      return content;
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
    // message functions
  }, {
    key: "messageAddFull",
    value: function messageAddFull() {
      var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
        content: "",
        userString: "user",
        align: "right",
        role: "user",
        userID: -1
      };
      var msgid = this.msgid;
      var messageDiv = document.createElement('div');
      var msgidClass = 'quikchat-msgid-' + String(msgid).padStart(10, '0');
      messageDiv.classList.add('quikchat-message', msgidClass);
      messageDiv.classList.add('quikchat-role-' + (input.role || 'user'));
      messageDiv.classList.add('quikchat-align-' + (input.align || 'right'));
      this.msgid++;
      messageDiv.classList.add(this._messagesArea.children.length % 2 === 1 ? 'quikchat-message-1' : 'quikchat-message-2');

      // Visibility: default true, hidden messages get display:none
      var visible = input.visible !== false;
      if (!visible) {
        messageDiv.style.display = 'none';
      }

      // Tags: array of strings for group-based visibility control
      var tags = Array.isArray(input.tags) ? input.tags.slice() : [];
      var userDiv = document.createElement('div');
      userDiv.classList.add('quikchat-user-label');
      userDiv.style.textAlign = input.align;
      userDiv.innerHTML = input.userString;
      var contentDiv = document.createElement('div');
      contentDiv.classList.add('quikchat-message-content');
      contentDiv.style.textAlign = input.align;
      contentDiv.innerHTML = this._processContent(input.content);
      var timestamp = new Date().toISOString();
      var timestampSpan = document.createElement('span');
      timestampSpan.classList.add('quikchat-timestamp');
      timestampSpan.textContent = this._formatTimestamp(timestamp);
      messageDiv.appendChild(userDiv);
      messageDiv.appendChild(contentDiv);
      messageDiv.appendChild(timestampSpan);
      this._messagesArea.appendChild(messageDiv);

      // Scroll to the last message only if the user is not actively scrolling up
      if (!this.userScrolledUp) {
        this._messagesArea.scrollTop = this._messagesArea.scrollHeight;
      }
      this._textEntry.value = '';
      this._autoGrowTextarea();
      var updatedtime = timestamp;
      if (this.trackHistory) {
        this._history.push(_objectSpread2(_objectSpread2({
          msgid: msgid
        }, input), {}, {
          visible: visible,
          tags: tags,
          timestamp: timestamp,
          updatedtime: updatedtime,
          messageDiv: messageDiv
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
  }, {
    key: "messageAddNew",
    value: function messageAddNew() {
      var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
      var userString = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "user";
      var align = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : "right";
      var role = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "user";
      return this.messageAddFull({
        content: content,
        userString: userString,
        align: align,
        role: role
      });
    }
  }, {
    key: "messageRemove",
    value: function messageRemove(n) {
      var success = false;
      try {
        this._messagesArea.removeChild(this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0'))));
        success = true;
      } catch (_error) {
        // Message ID not found
      }
      if (success) {
        this._history.splice(this._history.findIndex(function (item) {
          return item.msgid === n;
        }), 1);
        if (this._onMessageDelete) {
          this._onMessageDelete(this, n);
        }
      }
      return success;
    }
    /* returns the message html object from the DOM
    */
  }, {
    key: "messageGetDOMObject",
    value: function messageGetDOMObject(n) {
      var msg = null;
      try {
        msg = this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0')));
      } catch (_error) {
        // Message ID not found
      }
      return msg;
    }
    /* returns the message content only
    */
  }, {
    key: "messageGetContent",
    value: function messageGetContent(n) {
      var content = "";
      try {
        content = this._history.filter(function (item) {
          return item.msgid === n;
        })[0].content;
      } catch (_error) {
        // Message ID not found
      }
      return content;
    }
  }, {
    key: "messageSetVisible",
    value: function messageSetVisible(n, visible) {
      var msgEl = this.messageGetDOMObject(n);
      if (!msgEl) return false;
      msgEl.style.display = visible ? '' : 'none';
      var item = this._history.find(function (entry) {
        return entry.msgid === n;
      });
      if (item) item.visible = visible;
      return true;
    }
  }, {
    key: "messageGetVisible",
    value: function messageGetVisible(n) {
      var item = this._history.find(function (entry) {
        return entry.msgid === n;
      });
      return item ? item.visible !== false : false;
    }
  }, {
    key: "messageToggleVisible",
    value: function messageToggleVisible(n) {
      var current = this.messageGetVisible(n);
      return this.messageSetVisible(n, !current);
    }
  }, {
    key: "messageSetVisibleByTag",
    value: function messageSetVisibleByTag(tag, visible) {
      var count = 0;
      var _iterator = _createForOfIteratorHelper(this._history),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var item = _step.value;
          if (item.tags && item.tags.includes(tag)) {
            this.messageSetVisible(item.msgid, visible);
            count++;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
      return count;
    }
  }, {
    key: "messageGetTags",
    value: function messageGetTags(n) {
      var item = this._history.find(function (entry) {
        return entry.msgid === n;
      });
      return item && item.tags ? item.tags.slice() : [];
    }
  }, {
    key: "messageSetTags",
    value: function messageSetTags(n, tags) {
      var item = this._history.find(function (entry) {
        return entry.msgid === n;
      });
      if (!item) return false;
      item.tags = Array.isArray(tags) ? tags.slice() : [];
      return true;
    }

    /* append message to the message content
    */
  }, {
    key: "messageAppendContent",
    value: function messageAppendContent(n, content) {
      var success = false;
      try {
        var msgEl = this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0')));
        var item = this._history.filter(function (entry) {
          return entry.msgid === n;
        })[0];
        item.content += content;
        item.updatedtime = new Date().toISOString();
        msgEl.querySelector('.quikchat-message-content').innerHTML = this._processContent(item.content);
        msgEl.classList.remove('quikchat-typing');
        success = true;
        if (!this.userScrolledUp) {
          this._messagesArea.scrollTop = this._messagesArea.scrollHeight;
        }
        if (this._onMessageAppend) {
          this._onMessageAppend(this, n, content);
        }
      } catch (_error) {
        // Message ID not found
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
        var msgEl = this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0')));
        var item = this._history.filter(function (entry) {
          return entry.msgid === n;
        })[0];
        item.content = content;
        item.updatedtime = new Date().toISOString();
        msgEl.querySelector('.quikchat-message-content').innerHTML = this._processContent(content);
        msgEl.classList.remove('quikchat-typing');
        success = true;
        if (!this.userScrolledUp) {
          this._messagesArea.scrollTop = this._messagesArea.scrollHeight;
        }
        if (this._onMessageReplace) {
          this._onMessageReplace(this, n, content);
        }
      } catch (_error) {
        // Message ID not found
      }
      return success;
    }
  }, {
    key: "messageAddTypingIndicator",
    value: function messageAddTypingIndicator() {
      var userString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var align = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'left';
      var msgid = this.messageAddFull({
        content: '',
        userString: userString,
        align: align,
        role: 'assistant'
      });
      var msgEl = this.messageGetDOMObject(msgid);
      msgEl.classList.add('quikchat-typing');
      var contentDiv = msgEl.querySelector('.quikchat-message-content');
      contentDiv.innerHTML = '<span class="quikchat-typing-dots"><span>.</span><span>.</span><span>.</span></span>';
      return msgid;
    }
  }, {
    key: "setMessageFormatter",
    value: function setMessageFormatter(formatter) {
      this._messageFormatter = formatter;
    }
  }, {
    key: "setSanitize",
    value: function setSanitize(sanitize) {
      this._sanitize = sanitize;
    }

    // history functions
    /**
     *
     * @param {*} n
     * @param {*} m
     * @returns array of history messages
     */
  }, {
    key: "historyGet",
    value: function historyGet(n, m) {
      if (n === undefined) {
        return this._history.slice();
      }
      if (m === undefined) {
        if (n < 0) {
          return this._history.slice(n);
        }
        return this._history.slice(n, n + 1);
      }
      return this._history.slice(n, m);
    }
  }, {
    key: "historyClear",
    value: function historyClear() {
      this.msgid = 0;
      this._history = [];
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
      if (n >= 0 && n < this._history.length) {
        return this._history[n].content;
      }
      return "";
    }
  }, {
    key: "historyExport",
    value: function historyExport() {
      return this._history.map(function (item) {
        return {
          msgid: item.msgid,
          content: item.content,
          userString: item.userString,
          align: item.align,
          role: item.role,
          userID: item.userID,
          visible: item.visible,
          tags: item.tags ? item.tags.slice() : [],
          timestamp: item.timestamp,
          updatedtime: item.updatedtime
        };
      });
    }
  }, {
    key: "historyImport",
    value: function historyImport(data) {
      // Clear existing messages from DOM and history
      this._messagesArea.innerHTML = '';
      this._history = [];
      this.msgid = 0;
      var _iterator2 = _createForOfIteratorHelper(data),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var entry = _step2.value;
          this.messageAddFull({
            content: entry.content || '',
            userString: entry.userString || 'user',
            align: entry.align || 'right',
            role: entry.role || 'user',
            userID: entry.userID,
            visible: entry.visible,
            tags: entry.tags
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "changeTheme",
    value: function changeTheme(newTheme) {
      this._chatWidget.classList.remove(this._theme);
      this._chatWidget.classList.add(newTheme);
      this._theme = newTheme;
    }
  }, {
    key: "theme",
    get: function get() {
      return this._theme;
    }
  }], [{
    key: "version",
    value: function version() {
      return {
        "version": "1.2.6",
        "license": "BSD-2",
        "url": "https://github/deftio/quikchat"
      };
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
  }, {
    key: "loremIpsum",
    value: function loremIpsum(numChars) {
      var startSpot = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
      var startWithCapitalLetter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ";
      if (typeof numChars !== "number") {
        numChars = Math.floor(Math.random() * 126) + 25;
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
      var s = "";
      while (numChars > 0) {
        s += numChars < l.length ? l.substring(0, numChars) : l;
        numChars -= l.length;
      }
      if (s[s.length - 1] === " ") {
        s = s.substring(0, s.length - 1) + "."; // always end on non-whitespace. "." was chosen arbitrarily.
      }
      if (startWithCapitalLetter) {
        s = s[0].toUpperCase() + s.substring(1);
      }
      return s;
    }
  }]);
}();

/**
 * quikdown - Lightweight Markdown Parser
 * @version 1.2.10
 * @license BSD-2-Clause
 * @copyright DeftIO 2025
 */
/**
 * quikdown_classify — Shared line-classification utilities
 * ═════════════════════════════════════════════════════════
 *
 * Pure functions for classifying markdown lines.  Used by both the main
 * parser (quikdown.js) and the editor (quikdown_edit.js) so the logic
 * lives in one place.
 *
 * All functions operate on a **trimmed** line (caller must trim).
 * None use regexes with nested quantifiers — every check is either a
 * simple regex or a linear scan, so there is zero ReDoS risk.
 */


/**
 * Dash-only HR check — exact parity with the main parser's original
 * regex `/^---+\s*$/`.  Only matches lines of three or more dashes
 * with optional trailing whitespace (no interspersed spaces).
 *
 * @param {string} trimmed  The line, already trimmed
 * @returns {boolean}
 */
function isDashHRLine(trimmed) {
    if (trimmed.length < 3) return false;
    for (let i = 0; i < trimmed.length; i++) {
        const ch = trimmed[i];
        if (ch === '-') continue;
        // Allow trailing whitespace only
        if (ch === ' ' || ch === '\t') {
            for (let j = i + 1; j < trimmed.length; j++) {
                if (trimmed[j] !== ' ' && trimmed[j] !== '\t') return false;
            }
            return i >= 3; // at least 3 dashes before whitespace
        }
        return false;
    }
    return true; // all dashes
}

/**
 * quikdown — A compact, scanner-based markdown parser
 * ════════════════════════════════════════════════════
 *
 * Architecture overview (v1.2.8 — lexer rewrite)
 * ───────────────────────────────────────────────
 * Prior to v1.2.8, quikdown used a multi-pass regex pipeline: each block
 * type (headings, blockquotes, HR, lists, tables) and each inline format
 * (bold, italic, links, …) was handled by its own global regex applied
 * sequentially to the full document string. That worked but made the code
 * hard to extend and debug — a new construct meant adding another regex
 * pass, and ordering bugs between passes were subtle.
 *
 * Starting in v1.2.8 the parser uses a **line-scanning** approach for
 * block detection and a **per-block inline pass** for formatting:
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │  Phase 1 — Code Extraction                             │
 *   │  Scan for fenced code blocks (``` / ~~~) and inline    │
 *   │  code spans (`…`). Replace with §CB§ / §IC§ place-    │
 *   │  holders so code content is never touched by later      │
 *   │  phases.                                                │
 *   ├─────────────────────────────────────────────────────────┤
 *   │  Phase 2 — HTML Escaping                                │
 *   │  Escape &, <, >, ", ' in the remaining text to prevent │
 *   │  XSS. (Skipped when allow_unsafe_html is true.)         │
 *   ├─────────────────────────────────────────────────────────┤
 *   │  Phase 3 — Block Scanning                               │
 *   │  Walk the text **line by line**.  At each line, the     │
 *   │  scanner checks (in order):                             │
 *   │    • table rows  (|)                                    │
 *   │    • headings    (#)                                    │
 *   │    • HR          (---)                                  │
 *   │    • blockquotes (&gt;)                                 │
 *   │    • list items  (-, *, +, 1.)                          │
 *   │    • code-block placeholder (§CB…§)                     │
 *   │    • paragraph text (everything else)                   │
 *   │                                                         │
 *   │  Block text is run through the **inline formatter**     │
 *   │  which handles bold, italic, strikethrough, links,      │
 *   │  images, and autolinks.                                 │
 *   │                                                         │
 *   │  Paragraphs are wrapped in <p> tags.  Lazy linefeeds   │
 *   │  (single \n → <br>) are handled here too.               │
 *   ├─────────────────────────────────────────────────────────┤
 *   │  Phase 4 — Code Restoration                             │
 *   │  Replace §CB§ / §IC§ placeholders with rendered <pre>  │
 *   │  / <code> HTML, applying the fence_plugin if present.   │
 *   └─────────────────────────────────────────────────────────┘
 *
 * Why this design?
 *  • Single pass over lines for block identification — no re-scanning.
 *  • Each block type is a clearly separated branch, easy to add new ones.
 *  • Inline formatting is confined to block text — can't accidentally
 *    match across block boundaries or inside HTML tags.
 *  • Code extraction still uses a simple regex (it's one pattern, not a
 *    chain) because the §-placeholder approach is proven and simple.
 *
 * @param {string} markdown  The markdown source text
 * @param {Object} options   Configuration (see below)
 * @returns {string}         Rendered HTML
 */


// ────────────────────────────────────────────────────────────────────
//  Constants
// ────────────────────────────────────────────────────────────────────

/** Build-time version stamp (injected by tools/updateVersion) */
const quikdownVersion = '1.2.10';

/** CSS class prefix used for all generated elements */
const CLASS_PREFIX = 'quikdown-';

/** Placeholder sigils — chosen to be extremely unlikely in real text */
const PLACEHOLDER_CB = '§CB';   // fenced code blocks
const PLACEHOLDER_IC = '§IC';   // inline code spans

/** HTML entity escape map */
const ESC_MAP = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};

// ────────────────────────────────────────────────────────────────────
//  Style definitions
// ────────────────────────────────────────────────────────────────────

/**
 * Inline styles for every element quikdown can emit.
 * When `inline_styles: true` these are injected as style="…" attributes.
 * When `inline_styles: false` (default) we use class="quikdown-<tag>"
 * and these same values are emitted by `quikdown.emitStyles()`.
 */
const QUIKDOWN_STYLES = {
    h1: 'font-size:2em;font-weight:600;margin:.67em 0;text-align:left',
    h2: 'font-size:1.5em;font-weight:600;margin:.83em 0',
    h3: 'font-size:1.25em;font-weight:600;margin:1em 0',
    h4: 'font-size:1em;font-weight:600;margin:1.33em 0',
    h5: 'font-size:.875em;font-weight:600;margin:1.67em 0',
    h6: 'font-size:.85em;font-weight:600;margin:2em 0',
    pre: 'background:#f4f4f4;padding:10px;border-radius:4px;overflow-x:auto;margin:1em 0',
    code: 'background:#f0f0f0;padding:2px 4px;border-radius:3px;font-family:monospace',
    blockquote: 'border-left:4px solid #ddd;margin-left:0;padding-left:1em',
    table: 'border-collapse:collapse;width:100%;margin:1em 0',
    th: 'border:1px solid #ddd;padding:8px;background-color:#f2f2f2;font-weight:bold;text-align:left',
    td: 'border:1px solid #ddd;padding:8px;text-align:left',
    hr: 'border:none;border-top:1px solid #ddd;margin:1em 0',
    img: 'max-width:100%;height:auto',
    a: 'color:#06c;text-decoration:underline',
    strong: 'font-weight:bold',
    em: 'font-style:italic',
    del: 'text-decoration:line-through',
    ul: 'margin:.5em 0;padding-left:2em',
    ol: 'margin:.5em 0;padding-left:2em',
    li: 'margin:.25em 0',
    'task-item': 'list-style:none',
    'task-checkbox': 'margin-right:.5em'
};

// ────────────────────────────────────────────────────────────────────
//  Attribute factory
// ────────────────────────────────────────────────────────────────────

/**
 * Creates a `getAttr(tag, additionalStyle?)` helper that returns
 * either a class="…" or style="…" attribute string depending on mode.
 *
 * @param {boolean} inline_styles  True → emit style="…"; false → class="…"
 * @param {Object}  styles         The QUIKDOWN_STYLES map
 * @returns {Function}
 */
function createGetAttr(inline_styles, styles) {
    return function(tag, additionalStyle = '') {
        if (inline_styles) {
            let style = styles[tag];
            if (!style && !additionalStyle) return '';

            // When adding alignment that conflicts with the tag's default,
            // strip the default text-align first.
            if (additionalStyle && additionalStyle.includes('text-align') && style && style.includes('text-align')) {
                style = style.replace(/text-align:[^;]+;?/, '').trim();
                /* istanbul ignore next */
                if (style && !style.endsWith(';')) style += ';';
            }

            /* istanbul ignore next - defensive: additionalStyle without style doesn't occur with current tags */
            const fullStyle = additionalStyle ? (style ? `${style}${additionalStyle}` : additionalStyle) : style;
            return ` style="${fullStyle}"`;
        } else {
            const classAttr = ` class="${CLASS_PREFIX}${tag}"`;
            if (additionalStyle) {
                return `${classAttr} style="${additionalStyle}"`;
            }
            return classAttr;
        }
    };
}

// ════════════════════════════════════════════════════════════════════
//  Main parser function
// ════════════════════════════════════════════════════════════════════

function quikdown(markdown, options = {}) {
    // ── Guard: only process non-empty strings ──
    if (!markdown || typeof markdown !== 'string') {
        return '';
    }

    // ── Unpack options ──
    const { fence_plugin, inline_styles = false, bidirectional = false, lazy_linefeeds = false, allow_unsafe_html = false } = options;
    const styles = QUIKDOWN_STYLES;
    const getAttr = createGetAttr(inline_styles, styles);

    // ── Helpers (closed over options) ──

    /** Escape the five HTML-special characters. */
    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, m => ESC_MAP[m]);
    }

    /**
     * Bidirectional marker helper.
     * When bidirectional mode is on, returns ` data-qd="…"`.
     * The non-bidirectional branch is a trivial no-op arrow; it is
     * exercised in the core bundle but never in quikdown_bd.
     */
    /* istanbul ignore next - trivial no-op fallback */
    const dataQd = bidirectional ? (marker) => ` data-qd="${escapeHtml(marker)}"` : () => '';

    /**
     * Sanitize a URL to block javascript:, vbscript:, and non-image data: URIs.
     * Returns '#' for blocked URLs.
     */
    function sanitizeUrl(url, allowUnsafe = false) {
        /* istanbul ignore next - defensive programming, regex ensures url is never empty */
        if (!url) return '';
        if (allowUnsafe) return url;

        const trimmedUrl = url.trim();
        const lowerUrl = trimmedUrl.toLowerCase();
        const dangerousProtocols = ['javascript:', 'vbscript:', 'data:'];

        for (const protocol of dangerousProtocols) {
            if (lowerUrl.startsWith(protocol)) {
                if (protocol === 'data:' && lowerUrl.startsWith('data:image/')) {
                    return trimmedUrl;
                }
                return '#';
            }
        }
        return trimmedUrl;
    }

    // ────────────────────────────────────────────────────────────────
    //  Phase 1 — Code Extraction
    // ────────────────────────────────────────────────────────────────
    // Why extract code first?  Fenced blocks and inline code spans can
    // contain markdown-like characters (*, _, #, |, etc.) that must NOT
    // be interpreted as formatting.  By pulling them out and replacing
    // with unique placeholders, the rest of the pipeline never sees them.

    let html = markdown;
    const codeBlocks = [];    // Array of {lang, code, custom, fence, hasReverse}
    const inlineCodes = [];   // Array of escaped-HTML strings

    // ── Fenced code blocks ──
    // Matches paired fences: ``` with ``` and ~~~ with ~~~.
    // The fence must start at column 0 of a line (^ with /m flag).
    // Group 1 = fence marker, Group 2 = language hint, Group 3 = code body.
    html = html.replace(/^(```|~~~)([^\n]*)\n([\s\S]*?)^\1$/gm, (match, fence, lang, code) => {
        const placeholder = `${PLACEHOLDER_CB}${codeBlocks.length}§`;
        const langTrimmed = lang ? lang.trim() : '';

        if (fence_plugin && fence_plugin.render && typeof fence_plugin.render === 'function') {
            // Custom plugin — store raw code (un-escaped) so the plugin
            // receives the original source.
            codeBlocks.push({
                lang: langTrimmed,
                code: code.trimEnd(),
                custom: true,
                fence: fence,
                hasReverse: !!fence_plugin.reverse
            });
        } else {
            // Default — pre-escape the code for safe HTML output.
            codeBlocks.push({
                lang: langTrimmed,
                code: escapeHtml(code.trimEnd()),
                custom: false,
                fence: fence
            });
        }
        return placeholder;
    });

    // ── Inline code spans ──
    // Matches a single backtick pair: `content`.
    // Content is captured and HTML-escaped immediately.
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `${PLACEHOLDER_IC}${inlineCodes.length}§`;
        inlineCodes.push(escapeHtml(code));
        return placeholder;
    });

    // ────────────────────────────────────────────────────────────────
    //  Phase 2 — HTML Escaping
    // ────────────────────────────────────────────────────────────────
    // All remaining text (everything except code placeholders) is escaped
    // to prevent XSS.  The `allow_unsafe_html` option skips this for
    // trusted pipelines that intentionally embed raw HTML.

    if (!allow_unsafe_html) {
        html = escapeHtml(html);
    }

    // ────────────────────────────────────────────────────────────────
    //  Phase 3 — Block Scanning + Inline Formatting + Paragraphs
    // ────────────────────────────────────────────────────────────────
    // This is the heart of the lexer rewrite.  Instead of applying
    // 10+ global regex passes, we:
    //   1. Process tables (line walker — tables need multi-line lookahead)
    //   2. Scan remaining lines for headings, HR, blockquotes
    //   3. Process lists (line walker — lists need indent tracking)
    //   4. Apply inline formatting to all text content
    //   5. Wrap remaining text in <p> tags
    //
    // Steps 1 and 3 are line-walkers that process the full text in a
    // single pass each.  Step 2 replaces global regex with a per-line
    // scanner.  Steps 4-5 are applied to the result.
    //
    // Total: 3 structured passes instead of 10+ regex passes.

    // ── Step 1: Tables ──
    // Tables need multi-line lookahead (header → separator → body rows)
    // so they're handled by a dedicated line-walker first.
    html = processTable(html, getAttr);

    // ── Step 2: Headings, HR, Blockquotes ──
    // These are simple line-level constructs.  We scan each line once
    // and replace matching lines with their HTML representation.
    html = scanLineBlocks(html, getAttr, dataQd);

    // ── Step 3: Lists ──
    // Lists need indent-level tracking across lines, so they get their
    // own line-walker.
    html = processLists(html, getAttr, inline_styles, bidirectional);

    // ── Step 4: Inline formatting ──
    // Apply bold, italic, strikethrough, images, links, and autolinks
    // to all text content.  This runs on the output of steps 1-3, so
    // it sees text inside headings, blockquotes, table cells, list
    // items, and paragraph text.

    // Images (must come before links — ![alt](src) vs [text](url))
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        const sanitizedSrc = sanitizeUrl(src, options.allow_unsafe_urls);
        /* istanbul ignore next - bd-only branch */
        const altAttr = bidirectional && alt ? ` data-qd-alt="${escapeHtml(alt)}"` : '';
        /* istanbul ignore next - bd-only branch */
        const srcAttr = bidirectional ? ` data-qd-src="${escapeHtml(src)}"` : '';
        return `<img${getAttr('img')} src="${sanitizedSrc}" alt="${alt}"${altAttr}${srcAttr}${dataQd('!')}>`;
    });

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
        const sanitizedHref = sanitizeUrl(href, options.allow_unsafe_urls);
        const isExternal = /^https?:\/\//i.test(sanitizedHref);
        const rel = isExternal ? ' rel="noopener noreferrer"' : '';
        /* istanbul ignore next - bd-only branch */
        const textAttr = bidirectional ? ` data-qd-text="${escapeHtml(text)}"` : '';
        return `<a${getAttr('a')} href="${sanitizedHref}"${rel}${textAttr}${dataQd('[')}>${text}</a>`;
    });

    // Autolinks — bare https?:// URLs become clickable <a> tags
    html = html.replace(/(^|\s)(https?:\/\/[^\s<]+)/g, (match, prefix, url) => {
        const sanitizedUrl = sanitizeUrl(url, options.allow_unsafe_urls);
        return `${prefix}<a${getAttr('a')} href="${sanitizedUrl}" rel="noopener noreferrer">${url}</a>`;
    });

    // Protect rendered tags so emphasis regexes don't see attribute
    // values — fixes #3 (underscores in URLs interpreted as emphasis).
    const savedTags = [];
    html = html.replace(/<[^>]+>/g, m => { savedTags.push(m); return `%%T${savedTags.length - 1}%%`; });

    // Bold, italic, strikethrough
    const inlinePatterns = [
        [/\*\*(.+?)\*\*/g, 'strong', '**'],
        [/__(.+?)__/g, 'strong', '__'],
        [/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, 'em', '*'],
        [/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, 'em', '_'],
        [/~~(.+?)~~/g, 'del', '~~']
    ];
    inlinePatterns.forEach(([pattern, tag, marker]) => {
        html = html.replace(pattern, `<${tag}${getAttr(tag)}${dataQd(marker)}>$1</${tag}>`);
    });

    // Restore protected tags
    html = html.replace(/%%T(\d+)%%/g, (_, i) => savedTags[i]);

    // ── Step 5: Line breaks + paragraph wrapping ──
    if (lazy_linefeeds) {
        // Lazy linefeeds mode: every single \n becomes <br> EXCEPT:
        //   • Double newlines → paragraph break
        //   • Newlines adjacent to block elements (h, blockquote, pre, hr, table, list)
        //
        // Strategy: protect block-adjacent newlines with §N§, convert
        // the rest, then restore.

        const blocks = [];
        let bi = 0;

        // Protect tables and lists from <br> injection
        html = html.replace(/<(table|[uo]l)[^>]*>[\s\S]*?<\/\1>/g, m => {
            blocks[bi] = m;
            return `§B${bi++}§`;
        });

        html = html.replace(/\n\n+/g, '§P§')
            // After block-level closing tags
            .replace(/(<\/(?:h[1-6]|blockquote|pre)>)\n/g, '$1§N§')
            .replace(/(<(?:h[1-6]|blockquote|pre|hr)[^>]*>)\n/g, '$1§N§')
            // Before block-level opening tags
            .replace(/\n(<(?:h[1-6]|blockquote|pre|hr)[^>]*>)/g, '§N§$1')
            .replace(/\n(§B\d+§)/g, '§N§$1')
            .replace(/(§B\d+§)\n/g, '$1§N§')
            // Convert surviving newlines to <br>
            .replace(/\n/g, `<br${getAttr('br')}>`)
            // Restore
            .replace(/§N§/g, '\n')
            .replace(/§P§/g, '</p><p>');

        // Restore protected blocks
        blocks.forEach((b, i) => html = html.replace(`§B${i}§`, b));

        html = '<p>' + html + '</p>';
    } else {
        // Standard mode: two trailing spaces → <br>, double newline → new paragraph
        html = html.replace(/ {2}$/gm, `<br${getAttr('br')}>`);

        html = html.replace(/\n\n+/g, (match, offset) => {
            const before = html.substring(0, offset);
            if (before.match(/<\/(h[1-6]|blockquote|ul|ol|table|pre|hr)>$/)) {
                return '<p>';
            }
            return '</p><p>';
        });
        html = '<p>' + html + '</p>';
    }

    // ── Step 6: Cleanup ──
    // Remove <p> wrappers that accidentally enclose block elements.
    // This is simpler than trying to prevent them during wrapping.
    const cleanupPatterns = [
        [/<p><\/p>/g, ''],
        [/<p>(<h[1-6][^>]*>)/g, '$1'],
        [/(<\/h[1-6]>)<\/p>/g, '$1'],
        [/<p>(<blockquote[^>]*>)/g, '$1'],
        [/(<\/blockquote>)<\/p>/g, '$1'],
        [/<p>(<ul[^>]*>|<ol[^>]*>)/g, '$1'],
        [/(<\/ul>|<\/ol>)<\/p>/g, '$1'],
        [/<p>(<hr[^>]*>)<\/p>/g, '$1'],
        [/<p>(<table[^>]*>)/g, '$1'],
        [/(<\/table>)<\/p>/g, '$1'],
        [/<p>(<pre[^>]*>)/g, '$1'],
        [/(<\/pre>)<\/p>/g, '$1'],
        [new RegExp(`<p>(${PLACEHOLDER_CB}\\d+§)</p>`, 'g'), '$1']
    ];
    cleanupPatterns.forEach(([pattern, replacement]) => {
        html = html.replace(pattern, replacement);
    });

    // When a block element is followed by a newline and then text, open a <p>.
    html = html.replace(/(<\/(?:h[1-6]|blockquote|ul|ol|table|pre|hr)>)\n([^<])/g, '$1\n<p>$2');

    // ────────────────────────────────────────────────────────────────
    //  Phase 4 — Code Restoration
    // ────────────────────────────────────────────────────────────────
    // Replace placeholders with rendered HTML.  For fenced blocks this
    // means wrapping in <pre><code>…</code></pre> (or calling the
    // fence_plugin).  For inline code it means <code>…</code>.

    codeBlocks.forEach((block, i) => {
        let replacement;

        if (block.custom && fence_plugin && fence_plugin.render) {
            // Delegate to the user-provided fence plugin.
            replacement = fence_plugin.render(block.code, block.lang);

            if (replacement === undefined) {
                // Plugin declined — fall back to default rendering.
                const langClass = !inline_styles && block.lang ? ` class="language-${block.lang}"` : '';
                const codeAttr = inline_styles ? getAttr('code') : langClass;
                /* istanbul ignore next - bd-only branch */
                const langAttr = bidirectional && block.lang ? ` data-qd-lang="${escapeHtml(block.lang)}"` : '';
                /* istanbul ignore next - bd-only branch */
                const fenceAttr = bidirectional ? ` data-qd-fence="${escapeHtml(block.fence)}"` : '';
                replacement = `<pre${getAttr('pre')}${fenceAttr}${langAttr}><code${codeAttr}>${escapeHtml(block.code)}</code></pre>`;
            } else /* istanbul ignore next - bd-only branch */ if (bidirectional) {
                // Plugin returned HTML — inject data attributes for roundtrip.
                replacement = replacement.replace(/^<(\w+)/,
                    `<$1 data-qd-fence="${escapeHtml(block.fence)}" data-qd-lang="${escapeHtml(block.lang)}" data-qd-source="${escapeHtml(block.code)}"`);
            }
        } else {
            // Default rendering — wrap in <pre><code>.
            const langClass = !inline_styles && block.lang ? ` class="language-${block.lang}"` : '';
            const codeAttr = inline_styles ? getAttr('code') : langClass;
            /* istanbul ignore next - bd-only branch */
            const langAttr = bidirectional && block.lang ? ` data-qd-lang="${escapeHtml(block.lang)}"` : '';
            /* istanbul ignore next - bd-only branch */
            const fenceAttr = bidirectional ? ` data-qd-fence="${escapeHtml(block.fence)}"` : '';
            replacement = `<pre${getAttr('pre')}${fenceAttr}${langAttr}><code${codeAttr}>${block.code}</code></pre>`;
        }

        const placeholder = `${PLACEHOLDER_CB}${i}§`;
        html = html.replace(placeholder, replacement);
    });

    // Restore inline code spans
    inlineCodes.forEach((code, i) => {
        const placeholder = `${PLACEHOLDER_IC}${i}§`;
        html = html.replace(placeholder, `<code${getAttr('code')}${dataQd('`')}>${code}</code>`);
    });

    return html.trim();
}

// ════════════════════════════════════════════════════════════════════
//  Block-level line scanner
// ════════════════════════════════════════════════════════════════════

/**
 * scanLineBlocks — single-pass line scanner for headings, HR, blockquotes
 *
 * Walks the text line by line.  For each line it checks (in order):
 *   1. Heading   — starts with 1-6 '#' followed by a space
 *   2. HR        — line is entirely '---…' (3+ dashes, optional trailing space)
 *   3. Blockquote — starts with '&gt; ' (the > was already HTML-escaped)
 *
 * Lines that don't match any block pattern are passed through unchanged.
 *
 * This replaces three separate global regex passes from the pre-1.2.8
 * architecture with one structured scan.
 *
 * @param {string}   text    The document text (HTML-escaped, code extracted)
 * @param {Function} getAttr Attribute factory (class or style)
 * @param {Function} dataQd  Bidirectional marker factory
 * @returns {string}         Text with block-level elements rendered
 */
function scanLineBlocks(text, getAttr, dataQd) {
    const lines = text.split('\n');
    const result = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // ── Heading ──
        // Count leading '#' characters.  Valid heading: 1-6 hashes then a space.
        // Example: "## Hello World ##" → <h2>Hello World</h2>
        let hashCount = 0;
        while (hashCount < line.length && hashCount < 7 && line[hashCount] === '#') {
            hashCount++;
        }
        if (hashCount >= 1 && hashCount <= 6 && line[hashCount] === ' ') {
            // Extract content after "# " and strip trailing hashes
            const content = line.slice(hashCount + 1).replace(/\s*#+\s*$/, '');
            const tag = 'h' + hashCount;
            result.push(`<${tag}${getAttr(tag)}${dataQd('#'.repeat(hashCount))}>${content}</${tag}>`);
            i++;
            continue;
        }

        // ── Horizontal Rule ──
        // Three or more dashes, optional trailing whitespace, nothing else.
        if (isDashHRLine(line)) {
            result.push(`<hr${getAttr('hr')}>`);
            i++;
            continue;
        }

        // ── Blockquote ──
        // After Phase 2, the '>' character has been escaped to '&gt;'.
        // Pattern: "&gt; content" or merged consecutive blockquotes.
        if (/^&gt;\s+/.test(line)) {
            result.push(`<blockquote${getAttr('blockquote')}>${line.replace(/^&gt;\s+/, '')}</blockquote>`);
            i++;
            continue;
        }

        // ── Pass-through ──
        result.push(line);
        i++;
    }

    // Merge consecutive blockquotes into a single element.
    // <blockquote>A</blockquote>\n<blockquote>B</blockquote>
    //   → <blockquote>A\nB</blockquote>
    let joined = result.join('\n');
    joined = joined.replace(/<\/blockquote>\n<blockquote>/g, '\n');
    return joined;
}

// ════════════════════════════════════════════════════════════════════
//  Table processing (line walker)
// ════════════════════════════════════════════════════════════════════

/**
 * Inline markdown formatter for table cells.
 * Handles bold, italic, strikethrough, and code within cell text.
 * Links / images / autolinks are handled by the global inline pass
 * (Phase 3 Step 4) which runs after table processing.
 */
function processInlineMarkdown(text, getAttr) {
    const patterns = [
        [/\*\*(.+?)\*\*/g, 'strong'],
        [/__(.+?)__/g, 'strong'],
        [/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, 'em'],
        [/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, 'em'],
        [/~~(.+?)~~/g, 'del'],
        [/`([^`]+)`/g, 'code']
    ];
    patterns.forEach(([pattern, tag]) => {
        text = text.replace(pattern, `<${tag}${getAttr(tag)}>$1</${tag}>`);
    });
    return text;
}

/**
 * processTable — line walker for markdown tables
 *
 * Walks through lines looking for runs of pipe-containing lines.
 * Each run is validated (must contain a separator row: |---|---|)
 * and rendered as an HTML <table>.  Invalid runs are restored as-is.
 *
 * @param {string}   text    Full document text
 * @param {Function} getAttr Attribute factory
 * @returns {string}         Text with tables rendered
 */
function processTable(text, getAttr) {
    const lines = text.split('\n');
    const result = [];
    let inTable = false;
    let tableLines = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        if (line.includes('|') && (line.startsWith('|') || /[^\\|]/.test(line))) {
            if (!inTable) {
                inTable = true;
                tableLines = [];
            }
            tableLines.push(line);
        } else {
            if (inTable) {
                const tableHtml = buildTable(tableLines, getAttr);
                if (tableHtml) {
                    result.push(tableHtml);
                } else {
                    result.push(...tableLines);
                }
                inTable = false;
                tableLines = [];
            }
            result.push(lines[i]);
        }
    }

    // Handle table at end of document
    if (inTable && tableLines.length > 0) {
        const tableHtml = buildTable(tableLines, getAttr);
        if (tableHtml) {
            result.push(tableHtml);
        } else {
            result.push(...tableLines);
        }
    }

    return result.join('\n');
}

/**
 * buildTable — validate and render a table from accumulated lines
 *
 * @param {string[]} lines   Array of pipe-containing lines
 * @param {Function} getAttr Attribute factory
 * @returns {string|null}    HTML table string, or null if invalid
 */
function buildTable(lines, getAttr) {
    if (lines.length < 2) return null;

    // Find the separator row (---|---|)
    let separatorIndex = -1;
    for (let i = 1; i < lines.length; i++) {
        if (/^\|?[\s\-:|]+\|?$/.test(lines[i]) && lines[i].includes('-')) {
            separatorIndex = i;
            break;
        }
    }
    if (separatorIndex === -1) return null;

    const headerLines = lines.slice(0, separatorIndex);
    const bodyLines = lines.slice(separatorIndex + 1);

    // Parse alignment from separator cells (:--- = left, :---: = center, ---: = right)
    const separator = lines[separatorIndex];
    const separatorCells = separator.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
    const alignments = separatorCells.map(cell => {
        const trimmed = cell.trim();
        if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
        if (trimmed.endsWith(':')) return 'right';
        return 'left';
    });

    let html = `<table${getAttr('table')}>\n`;

    // Header
    html += `<thead${getAttr('thead')}>\n`;
    headerLines.forEach(line => {
        html += `<tr${getAttr('tr')}>\n`;
        const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
        cells.forEach((cell, i) => {
            const alignStyle = alignments[i] && alignments[i] !== 'left' ? `text-align:${alignments[i]}` : '';
            const processedCell = processInlineMarkdown(cell.trim(), getAttr);
            html += `<th${getAttr('th', alignStyle)}>${processedCell}</th>\n`;
        });
        html += '</tr>\n';
    });
    html += '</thead>\n';

    // Body
    if (bodyLines.length > 0) {
        html += `<tbody${getAttr('tbody')}>\n`;
        bodyLines.forEach(line => {
            html += `<tr${getAttr('tr')}>\n`;
            const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
            cells.forEach((cell, i) => {
                const alignStyle = alignments[i] && alignments[i] !== 'left' ? `text-align:${alignments[i]}` : '';
                const processedCell = processInlineMarkdown(cell.trim(), getAttr);
                html += `<td${getAttr('td', alignStyle)}>${processedCell}</td>\n`;
            });
            html += '</tr>\n';
        });
        html += '</tbody>\n';
    }

    html += '</table>';
    return html;
}

// ════════════════════════════════════════════════════════════════════
//  List processing (line walker)
// ════════════════════════════════════════════════════════════════════

/**
 * processLists — line walker for ordered, unordered, and task lists
 *
 * Scans each line for list markers (-, *, +, 1., 2., etc.) with
 * optional leading indentation for nesting.  Non-list lines close
 * any open lists and pass through unchanged.
 *
 * Task lists (- [ ] / - [x]) are detected and rendered with
 * checkbox inputs.
 *
 * @param {string}   text         Full document text
 * @param {Function} getAttr      Attribute factory
 * @param {boolean}  inline_styles Whether to use inline styles
 * @param {boolean}  bidirectional Whether to add data-qd markers
 * @returns {string}              Text with lists rendered
 */
function processLists(text, getAttr, inline_styles, bidirectional) {
    const lines = text.split('\n');
    const result = [];
    const listStack = [];   // tracks nesting: [{type:'ul', level:0}, …]

    // Helper to escape HTML for data-qd attributes. List markers (`-`, `*`,
    // `+`, `1.`, etc.) never contain HTML-special chars, so the replace
    // callback is defensive-only and never actually fires in practice.
    /* istanbul ignore next - defensive: list markers never trigger escaping */
    const escapeHtml = (text) => text.replace(/[&<>"']/g,
        /* istanbul ignore next - defensive: list markers never contain HTML specials */
        m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
    /* istanbul ignore next - trivial no-op fallback; not exercised via bd bundle */
    const dataQd = bidirectional ? (marker) => ` data-qd="${escapeHtml(marker)}"` : () => '';

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(\s*)([*\-+]|\d+\.)\s+(.+)$/);

        if (match) {
            const [, indent, marker, content] = match;
            const level = Math.floor(indent.length / 2);
            const isOrdered = /^\d+\./.test(marker);
            const listType = isOrdered ? 'ol' : 'ul';

            // Task list detection (only in unordered lists)
            let listItemContent = content;
            let taskListClass = '';
            const taskMatch = content.match(/^\[([x ])\]\s+(.*)$/i);
            if (taskMatch && !isOrdered) {
                const [, checked, taskContent] = taskMatch;
                const isChecked = checked.toLowerCase() === 'x';
                const checkboxAttr = inline_styles
                    ? ' style="margin-right:.5em"'
                    : ` class="${CLASS_PREFIX}task-checkbox"`;
                listItemContent = `<input type="checkbox"${checkboxAttr}${isChecked ? ' checked' : ''} disabled> ${taskContent}`;
                taskListClass = inline_styles ? ' style="list-style:none"' : ` class="${CLASS_PREFIX}task-item"`;
            }

            // Close deeper nesting levels
            while (listStack.length > level + 1) {
                const list = listStack.pop();
                result.push(`</${list.type}>`);
            }

            // Open new list or switch type at current level
            if (listStack.length === level) {
                listStack.push({ type: listType, level });
                result.push(`<${listType}${getAttr(listType)}>`);
            } else if (listStack.length === level + 1) {
                const currentList = listStack[listStack.length - 1];
                if (currentList.type !== listType) {
                    result.push(`</${currentList.type}>`);
                    listStack.pop();
                    listStack.push({ type: listType, level });
                    result.push(`<${listType}${getAttr(listType)}>`);
                }
            }

            const liAttr = taskListClass || getAttr('li');
            result.push(`<li${liAttr}${dataQd(marker)}>${listItemContent}</li>`);
        } else {
            // Not a list item — close all open lists
            while (listStack.length > 0) {
                const list = listStack.pop();
                result.push(`</${list.type}>`);
            }
            result.push(line);
        }
    }

    // Close any remaining open lists
    while (listStack.length > 0) {
        const list = listStack.pop();
        result.push(`</${list.type}>`);
    }

    return result.join('\n');
}

// ════════════════════════════════════════════════════════════════════
//  Static API
// ════════════════════════════════════════════════════════════════════

/**
 * Emit CSS rules for all quikdown elements.
 *
 * @param {string} prefix  Class prefix (default: 'quikdown-')
 * @param {string} theme   'light' (default) or 'dark'
 * @returns {string}       CSS text
 */
quikdown.emitStyles = function(prefix = 'quikdown-', theme = 'light') {
    const styles = QUIKDOWN_STYLES;

    const themeOverrides = {
        dark: {
            '#f4f4f4': '#2a2a2a',   // pre background
            '#f0f0f0': '#2a2a2a',   // code background
            '#f2f2f2': '#2a2a2a',   // th background
            '#ddd': '#3a3a3a',      // borders
            '#06c': '#6db3f2',      // links
            _textColor: '#e0e0e0'
        },
        light: {
            _textColor: '#333'
        }
    };

    let css = '';
    for (const [tag, style] of Object.entries(styles)) {
        let themedStyle = style;

        if (theme === 'dark' && themeOverrides.dark) {
            for (const [oldColor, newColor] of Object.entries(themeOverrides.dark)) {
                if (!oldColor.startsWith('_')) {
                    themedStyle = themedStyle.replaceAll(oldColor, newColor);
                }
            }
            const needsTextColor = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'li', 'blockquote'];
            if (needsTextColor.includes(tag)) {
                themedStyle += `;color:${themeOverrides.dark._textColor}`;
            }
        } else if (theme === 'light' && themeOverrides.light) {
            const needsTextColor = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'li', 'blockquote'];
            if (needsTextColor.includes(tag)) {
                themedStyle += `;color:${themeOverrides.light._textColor}`;
            }
        }

        css += `.${prefix}${tag} { ${themedStyle} }\n`;
    }

    return css;
};

/**
 * Create a pre-configured parser with baked-in options.
 *
 * @param {Object} options  Options to bake in
 * @returns {Function}      Configured quikdown(markdown) function
 */
quikdown.configure = function(options) {
    return function(markdown) {
        return quikdown(markdown, options);
    };
};

/** Semantic version (injected at build time) */
quikdown.version = quikdownVersion;

// ════════════════════════════════════════════════════════════════════
//  Exports
// ════════════════════════════════════════════════════════════════════

/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = quikdown;
}

/* istanbul ignore next */
if (typeof window !== 'undefined') {
    window.quikdown = quikdown;
}

// Subclass that pre-wires quikdown as the message formatter
var quikchatMD = /*#__PURE__*/function (_quikchat) {
  function quikchatMD(parentElement, onSend) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, quikchatMD);
    if (!options.messageFormatter) {
      options.messageFormatter = function (content) {
        return quikdown(content);
      };
    }
    return _callSuper(this, quikchatMD, [parentElement, onSend, options]);
  }
  _inherits(quikchatMD, _quikchat);
  return _createClass(quikchatMD);
}(quikchat); // Expose quikdown on the class for direct access
quikchatMD.quikdown = quikdown;

module.exports = quikchatMD;
//# sourceMappingURL=quikchat-md.cjs.js.map
