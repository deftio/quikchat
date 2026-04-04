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
      var maxHeight = parseInt(getComputedStyle(el).getPropertyValue('--quikchat-input-max-height')) || 120;
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
        "version": "1.2.4",
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
 * Quikdown Editor - Drop-in Markdown Parser
 * @version 1.1.1
 * @license BSD-2-Clause
 * @copyright DeftIO 2025
 */
/**
 * quikdown - A minimal markdown parser optimized for chat/LLM output
 * Supports tables, code blocks, lists, and common formatting
 * @param {string} markdown - The markdown source text
 * @param {Object} options - Optional configuration object
 * @param {Function} options.fence_plugin - Custom renderer for fenced code blocks
 *                   (content, fence_string) => html string
 * @param {boolean} options.inline_styles - If true, uses inline styles instead of classes
 * @param {boolean} options.bidirectional - If true, adds data-qd attributes for source tracking
 * @param {boolean} options.lazy_linefeeds - If true, single newlines become <br> tags
 * @returns {string} - The rendered HTML
 */

// Version will be injected at build time  
const quikdownVersion = '1.1.1';

// Constants for reuse
const CLASS_PREFIX = 'quikdown-';
const PLACEHOLDER_CB = '§CB';
const PLACEHOLDER_IC = '§IC';

// Escape map at module level
const ESC_MAP = {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'};

// Single source of truth for all style definitions - optimized
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
    // Task list specific styles
    'task-item': 'list-style:none',
    'task-checkbox': 'margin-right:.5em'
};

// Factory function to create getAttr for a given context
function createGetAttr(inline_styles, styles) {
    return function(tag, additionalStyle = '') {
        if (inline_styles) {
            let style = styles[tag];
            if (!style && !additionalStyle) return '';
            
            // Remove default text-align if we're adding a different alignment
            if (additionalStyle && additionalStyle.includes('text-align') && style && style.includes('text-align')) {
                style = style.replace(/text-align:[^;]+;?/, '').trim();
                if (style && !style.endsWith(';')) style += ';';
            }
            
            /* istanbul ignore next - defensive: additionalStyle without style doesn't occur with current tags */
            const fullStyle = additionalStyle ? (style ? `${style}${additionalStyle}` : additionalStyle) : style;
            return ` style="${fullStyle}"`;
        } else {
            const classAttr = ` class="${CLASS_PREFIX}${tag}"`;
            // Apply inline styles for alignment even when using CSS classes
            if (additionalStyle) {
                return `${classAttr} style="${additionalStyle}"`;
            }
            return classAttr;
        }
    };
}

function quikdown(markdown, options = {}) {
    if (!markdown || typeof markdown !== 'string') {
        return '';
    }
    
    const { fence_plugin, inline_styles = false, bidirectional = false, lazy_linefeeds = false } = options;
    const styles = QUIKDOWN_STYLES; // Use module-level styles
    const getAttr = createGetAttr(inline_styles, styles); // Create getAttr once

    // Escape HTML entities to prevent XSS
    function escapeHtml(text) {
        return text.replace(/[&<>"']/g, m => ESC_MAP[m]);
    }
    
    // Helper to add data-qd attributes for bidirectional support
    const dataQd = bidirectional ? (marker) => ` data-qd="${escapeHtml(marker)}"` : () => '';
    
    // Sanitize URLs to prevent XSS attacks
    function sanitizeUrl(url, allowUnsafe = false) {
        /* istanbul ignore next - defensive programming, regex ensures url is never empty */
        if (!url) return '';
        
        // If unsafe URLs are explicitly allowed, return as-is
        if (allowUnsafe) return url;
        
        const trimmedUrl = url.trim();
        const lowerUrl = trimmedUrl.toLowerCase();
        
        // Block dangerous protocols
        const dangerousProtocols = ['javascript:', 'vbscript:', 'data:'];
        
        for (const protocol of dangerousProtocols) {
            if (lowerUrl.startsWith(protocol)) {
                // Exception: Allow data:image/* for images
                if (protocol === 'data:' && lowerUrl.startsWith('data:image/')) {
                    return trimmedUrl;
                }
                // Return safe empty link for dangerous protocols
                return '#';
            }
        }
        
        return trimmedUrl;
    }

    // Process the markdown in phases
    let html = markdown;
    
    // Phase 1: Extract and protect code blocks and inline code
    const codeBlocks = [];
    const inlineCodes = [];
    
    // Extract fenced code blocks first (supports both ``` and ~~~)
    // Match paired fences - ``` with ``` and ~~~ with ~~~
    // Fence must be at start of line
    html = html.replace(/^(```|~~~)([^\n]*)\n([\s\S]*?)^\1$/gm, (match, fence, lang, code) => {
        const placeholder = `${PLACEHOLDER_CB}${codeBlocks.length}§`;
        
        // Trim the language specification
        const langTrimmed = lang ? lang.trim() : '';
        
        // If custom fence plugin is provided, use it (v1.1.0: object format required)
        if (fence_plugin && fence_plugin.render && typeof fence_plugin.render === 'function') {
            codeBlocks.push({
                lang: langTrimmed,
                code: code.trimEnd(),
                custom: true,
                fence: fence,
                hasReverse: !!fence_plugin.reverse
            });
        } else {
            codeBlocks.push({
                lang: langTrimmed,
                code: escapeHtml(code.trimEnd()),
                custom: false,
                fence: fence
            });
        }
        return placeholder;
    });
    
    // Extract inline code
    html = html.replace(/`([^`]+)`/g, (match, code) => {
        const placeholder = `${PLACEHOLDER_IC}${inlineCodes.length}§`;
        inlineCodes.push(escapeHtml(code));
        return placeholder;
    });
    
    // Now escape HTML in the rest of the content
    html = escapeHtml(html);
    
    // Phase 2: Process block elements
    
    // Process tables
    html = processTable(html, getAttr);
    
    // Process headings (supports optional trailing #'s)
    html = html.replace(/^(#{1,6})\s+(.+?)\s*#*$/gm, (match, hashes, content) => {
        const level = hashes.length;
        return `<h${level}${getAttr('h' + level)}${dataQd(hashes)}>${content}</h${level}>`;
    });
    
    // Process blockquotes (must handle escaped > since we already escaped HTML)
    html = html.replace(/^&gt;\s+(.+)$/gm, `<blockquote${getAttr('blockquote')}>$1</blockquote>`);
    // Merge consecutive blockquotes
    html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');
    
    // Process horizontal rules (allow trailing spaces)
    html = html.replace(/^---+\s*$/gm, `<hr${getAttr('hr')}>`);
    
    // Process lists
    html = processLists(html, getAttr, inline_styles, bidirectional);
    
    // Phase 3: Process inline elements
    
    // Images (must come before links, with URL sanitization)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
        const sanitizedSrc = sanitizeUrl(src, options.allow_unsafe_urls);
        const altAttr = bidirectional && alt ? ` data-qd-alt="${escapeHtml(alt)}"` : '';
        const srcAttr = bidirectional ? ` data-qd-src="${escapeHtml(src)}"` : '';
        return `<img${getAttr('img')} src="${sanitizedSrc}" alt="${alt}"${altAttr}${srcAttr}${dataQd('!')}>`;
    });
    
    // Links (with URL sanitization)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, href) => {
        // Sanitize URL to prevent XSS
        const sanitizedHref = sanitizeUrl(href, options.allow_unsafe_urls);
        const isExternal = /^https?:\/\//i.test(sanitizedHref);
        const rel = isExternal ? ' rel="noopener noreferrer"' : '';
        const textAttr = bidirectional ? ` data-qd-text="${escapeHtml(text)}"` : '';
        return `<a${getAttr('a')} href="${sanitizedHref}"${rel}${textAttr}${dataQd('[')}>${text}</a>`;
    });
    
    // Autolinks - convert bare URLs to clickable links
    html = html.replace(/(^|\s)(https?:\/\/[^\s<]+)/g, (match, prefix, url) => {
        const sanitizedUrl = sanitizeUrl(url, options.allow_unsafe_urls);
        return `${prefix}<a${getAttr('a')} href="${sanitizedUrl}" rel="noopener noreferrer">${url}</a>`;
    });
    
    // Process inline formatting (bold, italic, strikethrough)
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
    
    // Line breaks
    if (lazy_linefeeds) {
        // Lazy linefeeds: single newline becomes <br> (except between paragraphs and after/before block elements)
        const blocks = [];
        let bi = 0;
        
        // Protect tables and lists  
        html = html.replace(/<(table|[uo]l)[^>]*>[\s\S]*?<\/\1>/g, m => {
            blocks[bi] = m;
            return `§B${bi++}§`;
        });
        
        // Handle paragraphs and block elements
        html = html.replace(/\n\n+/g, '§P§')
            // After block elements
            .replace(/(<\/(?:h[1-6]|blockquote|pre)>)\n/g, '$1§N§')
            .replace(/(<(?:h[1-6]|blockquote|pre|hr)[^>]*>)\n/g, '$1§N§')
            // Before block elements  
            .replace(/\n(<(?:h[1-6]|blockquote|pre|hr)[^>]*>)/g, '§N§$1')
            .replace(/\n(§B\d+§)/g, '§N§$1')
            .replace(/(§B\d+§)\n/g, '$1§N§')
            // Convert remaining newlines
            .replace(/\n/g, `<br${getAttr('br')}>`)
            // Restore
            .replace(/§N§/g, '\n')
            .replace(/§P§/g, '</p><p>');
        
        // Restore protected blocks
        blocks.forEach((b, i) => html = html.replace(`§B${i}§`, b));
        
        html = '<p>' + html + '</p>';
    } else {
        // Standard: two spaces at end of line for line breaks
        html = html.replace(/  $/gm, `<br${getAttr('br')}>`);
        
        // Paragraphs (double newlines)
        // Don't add </p> after block elements (they're not in paragraphs)
        html = html.replace(/\n\n+/g, (match, offset) => {
            // Check if we're after a block element closing tag
            const before = html.substring(0, offset);
            if (before.match(/<\/(h[1-6]|blockquote|ul|ol|table|pre|hr)>$/)) {
                return '<p>';  // Just open a new paragraph
            }
            return '</p><p>';  // Normal paragraph break
        });
        html = '<p>' + html + '</p>';
    }
    
    // Clean up empty paragraphs and unwrap block elements
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
        [new RegExp(`<p>(${PLACEHOLDER_CB}\\d+§)<\/p>`, 'g'), '$1']
    ];
    
    cleanupPatterns.forEach(([pattern, replacement]) => {
        html = html.replace(pattern, replacement);
    });
    
    // Fix orphaned closing </p> tags after block elements
    // When a paragraph follows a block element, ensure it has opening <p>
    html = html.replace(/(<\/(?:h[1-6]|blockquote|ul|ol|table|pre|hr)>)\n([^<])/g, '$1\n<p>$2');
    
    // Phase 4: Restore code blocks and inline code
    
    // Restore code blocks
    codeBlocks.forEach((block, i) => {
        let replacement;
        
        if (block.custom && fence_plugin && fence_plugin.render) {
            // Use custom fence plugin (v1.1.0: object format with render function)
            replacement = fence_plugin.render(block.code, block.lang);
            
            // If plugin returns undefined, fall back to default rendering
            if (replacement === undefined) {
                const langClass = !inline_styles && block.lang ? ` class="language-${block.lang}"` : '';
                const codeAttr = inline_styles ? getAttr('code') : langClass;
                const langAttr = bidirectional && block.lang ? ` data-qd-lang="${escapeHtml(block.lang)}"` : '';
                const fenceAttr = bidirectional ? ` data-qd-fence="${escapeHtml(block.fence)}"` : '';
                replacement = `<pre${getAttr('pre')}${fenceAttr}${langAttr}><code${codeAttr}>${escapeHtml(block.code)}</code></pre>`;
            } else if (bidirectional) {
                // If bidirectional and plugin provided HTML, add data attributes for roundtrip
                replacement = replacement.replace(/^<(\w+)/, 
                    `<$1 data-qd-fence="${escapeHtml(block.fence)}" data-qd-lang="${escapeHtml(block.lang)}" data-qd-source="${escapeHtml(block.code)}"`);
            }
        } else {
            // Default rendering
            const langClass = !inline_styles && block.lang ? ` class="language-${block.lang}"` : '';
            const codeAttr = inline_styles ? getAttr('code') : langClass;
            const langAttr = bidirectional && block.lang ? ` data-qd-lang="${escapeHtml(block.lang)}"` : '';
            const fenceAttr = bidirectional ? ` data-qd-fence="${escapeHtml(block.fence)}"` : '';
            replacement = `<pre${getAttr('pre')}${fenceAttr}${langAttr}><code${codeAttr}>${block.code}</code></pre>`;
        }
        
        const placeholder = `${PLACEHOLDER_CB}${i}§`;
        html = html.replace(placeholder, replacement);
    });
    
    // Restore inline code
    inlineCodes.forEach((code, i) => {
        const placeholder = `${PLACEHOLDER_IC}${i}§`;
        html = html.replace(placeholder, `<code${getAttr('code')}${dataQd('`')}>${code}</code>`);
    });
    
    return html.trim();
}

/**
 * Process inline markdown formatting
 */
function processInlineMarkdown(text, getAttr) {
    
    // Process inline formatting patterns
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
 * Process markdown tables
 */
function processTable(text, getAttr) {
    const lines = text.split('\n');
    const result = [];
    let inTable = false;
    let tableLines = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Check if this line looks like a table row (with or without trailing |)
        if (line.includes('|') && (line.startsWith('|') || /[^\\|]/.test(line))) {
            if (!inTable) {
                inTable = true;
                tableLines = [];
            }
            tableLines.push(line);
        } else {
            // Not a table line
            if (inTable) {
                // Process the accumulated table
                const tableHtml = buildTable(tableLines, getAttr);
                if (tableHtml) {
                    result.push(tableHtml);
                } else {
                    // Not a valid table, restore original lines
                    result.push(...tableLines);
                }
                inTable = false;
                tableLines = [];
            }
            result.push(lines[i]);
        }
    }
    
    // Handle table at end of text
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
 * Build an HTML table from markdown table lines
 */
function buildTable(lines, getAttr) {
    
    if (lines.length < 2) return null;
    
    // Check for separator line (second line should be the separator)
    let separatorIndex = -1;
    for (let i = 1; i < lines.length; i++) {
        // Support separator with or without leading/trailing pipes
        if (/^\|?[\s\-:|]+\|?$/.test(lines[i]) && lines[i].includes('-')) {
            separatorIndex = i;
            break;
        }
    }
    
    if (separatorIndex === -1) return null;
    
    const headerLines = lines.slice(0, separatorIndex);
    const bodyLines = lines.slice(separatorIndex + 1);
    
    // Parse alignment from separator
    const separator = lines[separatorIndex];
    // Handle pipes at start/end or not
    const separatorCells = separator.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
    const alignments = separatorCells.map(cell => {
        const trimmed = cell.trim();
        if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
        if (trimmed.endsWith(':')) return 'right';
        return 'left';
    });
    
    let html = `<table${getAttr('table')}>\n`;
    
    // Build header
    // Note: headerLines will always have length > 0 since separatorIndex starts from 1
    html += `<thead${getAttr('thead')}>\n`;
    headerLines.forEach(line => {
            html += `<tr${getAttr('tr')}>\n`;
            // Handle pipes at start/end or not
            const cells = line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
            cells.forEach((cell, i) => {
                const alignStyle = alignments[i] && alignments[i] !== 'left' ? `text-align:${alignments[i]}` : '';
                const processedCell = processInlineMarkdown(cell.trim(), getAttr);
                html += `<th${getAttr('th', alignStyle)}>${processedCell}</th>\n`;
            });
            html += '</tr>\n';
    });
    html += '</thead>\n';
    
    // Build body
    if (bodyLines.length > 0) {
        html += `<tbody${getAttr('tbody')}>\n`;
        bodyLines.forEach(line => {
            html += `<tr${getAttr('tr')}>\n`;
            // Handle pipes at start/end or not
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

/**
 * Process markdown lists (ordered and unordered)
 */
function processLists(text, getAttr, inline_styles, bidirectional) {
    
    const lines = text.split('\n');
    const result = [];
    let listStack = []; // Track nested lists
    
    // Helper to escape HTML for data-qd attributes
    const escapeHtml = (text) => text.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
    const dataQd = bidirectional ? (marker) => ` data-qd="${escapeHtml(marker)}"` : () => '';
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/^(\s*)([*\-+]|\d+\.)\s+(.+)$/);
        
        if (match) {
            const [, indent, marker, content] = match;
            const level = Math.floor(indent.length / 2);
            const isOrdered = /^\d+\./.test(marker);
            const listType = isOrdered ? 'ol' : 'ul';
            
            // Check for task list items
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
            
            // Close deeper levels
            while (listStack.length > level + 1) {
                const list = listStack.pop();
                result.push(`</${list.type}>`);
            }
            
            // Open new level if needed
            if (listStack.length === level) {
                // Need to open a new list
                listStack.push({ type: listType, level });
                result.push(`<${listType}${getAttr(listType)}>`);
            } else if (listStack.length === level + 1) {
                // Check if we need to switch list type
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
            // Not a list item, close all lists
            while (listStack.length > 0) {
                const list = listStack.pop();
                result.push(`</${list.type}>`);
            }
            result.push(line);
        }
    }
    
    // Close any remaining lists
    while (listStack.length > 0) {
        const list = listStack.pop();
        result.push(`</${list.type}>`);
    }
    
    return result.join('\n');
}

/**
 * Emit CSS styles for quikdown elements
 * @param {string} prefix - Optional class prefix (default: 'quikdown-')
 * @param {string} theme - Optional theme: 'light' (default) or 'dark'
 * @returns {string} CSS string with quikdown styles
 */
quikdown.emitStyles = function(prefix = 'quikdown-', theme = 'light') {
    const styles = QUIKDOWN_STYLES;
    
    // Define theme color overrides
    const themeOverrides = {
        dark: {
            '#f4f4f4': '#2a2a2a', // pre background
            '#f0f0f0': '#2a2a2a', // code background
            '#f2f2f2': '#2a2a2a', // th background
            '#ddd': '#3a3a3a',    // borders
            '#06c': '#6db3f2',    // links
            _textColor: '#e0e0e0'
        },
        light: {
            _textColor: '#333'    // Explicit text color for light theme
        }
    };
    
    let css = '';
    for (const [tag, style] of Object.entries(styles)) {
        let themedStyle = style;
            
            // Apply theme overrides if dark theme
            if (theme === 'dark' && themeOverrides.dark) {
                // Replace colors
                for (const [oldColor, newColor] of Object.entries(themeOverrides.dark)) {
                    if (!oldColor.startsWith('_')) {
                        themedStyle = themedStyle.replace(new RegExp(oldColor, 'g'), newColor);
                    }
                }
                
                // Add text color for certain elements in dark theme
                const needsTextColor = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'td', 'li', 'blockquote'];
                if (needsTextColor.includes(tag)) {
                    themedStyle += `;color:${themeOverrides.dark._textColor}`;
                }
            } else if (theme === 'light' && themeOverrides.light) {
                // Add explicit text color for light theme elements too
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
 * Configure quikdown with options and return a function
 * @param {Object} options - Configuration options
 * @returns {Function} Configured quikdown function
 */
quikdown.configure = function(options) {
    return function(markdown) {
        return quikdown(markdown, options);
    };
};

/**
 * Version information
 */
quikdown.version = quikdownVersion;

// Export for both CommonJS and ES6
/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = quikdown;
}

// For browser global
/* istanbul ignore next */
if (typeof window !== 'undefined') {
    window.quikdown = quikdown;
}

/**
 * quikdown_bd - Bidirectional markdown/HTML converter
 * Extends core quikdown with HTML→Markdown conversion
 * 
 * Uses data-qd attributes to preserve original markdown syntax
 * Enables HTML→Markdown conversion for quikdown-generated HTML
 */


/**
 * Create bidirectional version by extending quikdown
 * This wraps quikdown and adds the toMarkdown method
 */
function quikdown_bd(markdown, options = {}) {
    // Use core quikdown with bidirectional flag to add data-qd attributes
    return quikdown(markdown, { ...options, bidirectional: true });
}

// Copy all properties and methods from quikdown (including version)
Object.keys(quikdown).forEach(key => {
    quikdown_bd[key] = quikdown[key];
});

// Add the toMarkdown method for HTML→Markdown conversion
quikdown_bd.toMarkdown = function(htmlOrElement, options = {}) {
    // Accept either HTML string or DOM element
    let container;
    if (typeof htmlOrElement === 'string') {
        container = document.createElement('div');
        container.innerHTML = htmlOrElement;
    } else if (htmlOrElement instanceof Element) {
        /* istanbul ignore next - browser-only code path, not testable in jsdom */
        container = htmlOrElement;
    } else {
        return '';
    }
    
    // Walk the DOM tree and reconstruct markdown
    function walkNode(node, parentContext = {}) {
        if (node.nodeType === Node.TEXT_NODE) {
            // Return text content, preserving whitespace where needed
            return node.textContent;
        }
        
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return '';
        }
        
        const tag = node.tagName.toLowerCase();
        const dataQd = node.getAttribute('data-qd');
        
        // Process children with context
        let childContent = '';
        for (let child of node.childNodes) {
            childContent += walkNode(child, { parentTag: tag, ...parentContext });
        }
        
        // Determine markdown based on element and attributes
        switch (tag) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                const level = parseInt(tag[1]);
                const prefix = dataQd || '#'.repeat(level);
                return `${prefix} ${childContent.trim()}\n\n`;
                
            case 'strong':
            case 'b':
                if (!childContent) return ''; // Don't add markers for empty content
                const boldMarker = dataQd || '**';
                return `${boldMarker}${childContent}${boldMarker}`;
                
            case 'em':
            case 'i':
                if (!childContent) return ''; // Don't add markers for empty content
                const emMarker = dataQd || '*';
                return `${emMarker}${childContent}${emMarker}`;
                
            case 'del':
            case 's':
            case 'strike':
                if (!childContent) return ''; // Don't add markers for empty content
                const delMarker = dataQd || '~~';
                return `${delMarker}${childContent}${delMarker}`;
                
            case 'code':
                // Note: code inside pre is handled directly by the pre case using querySelector
                if (!childContent) return ''; // Don't add markers for empty content
                const codeMarker = dataQd || '`';
                return `${codeMarker}${childContent}${codeMarker}`;
                
            case 'pre':
                const fence = node.getAttribute('data-qd-fence') || dataQd || '```';
                const lang = node.getAttribute('data-qd-lang') || '';
                
                // Check if this was created by a fence plugin with reverse handler
                if (options.fence_plugin && options.fence_plugin.reverse && lang) {
                    try {
                        const result = options.fence_plugin.reverse(node);
                        if (result && result.content) {
                            const fenceMarker = result.fence || fence;
                            const langStr = result.lang || lang;
                            return `${fenceMarker}${langStr}\n${result.content}\n${fenceMarker}\n\n`;
                        }
                    } catch (err) {
                        console.warn('Fence reverse handler error:', err);
                        // Fall through to default handling
                    }
                }
                
                // Fallback: use data-qd-source if available
                const source = node.getAttribute('data-qd-source');
                if (source) {
                    return `${fence}${lang}\n${source}\n${fence}\n\n`;
                }
                
                // Final fallback: extract text content
                const codeEl = node.querySelector('code');
                const codeContent = codeEl ? codeEl.textContent : childContent;
                return `${fence}${lang}\n${codeContent.trimEnd()}\n${fence}\n\n`;
                
            case 'blockquote':
                const quoteMarker = dataQd || '>';
                const lines = childContent.trim().split('\n');
                return lines.map(line => `${quoteMarker} ${line}`).join('\n') + '\n\n';
                
            case 'hr':
                const hrMarker = dataQd || '---';
                return `${hrMarker}\n\n`;
                
            case 'br':
                const brMarker = dataQd || '  ';
                return `${brMarker}\n`;
                
            case 'a':
                const linkText = node.getAttribute('data-qd-text') || childContent.trim();
                const href = node.getAttribute('href') || '';
                // Check for autolinks
                if (linkText === href && !dataQd) {
                    return `<${href}>`;
                }
                return `[${linkText}](${href})`;
                
            case 'img':
                const alt = node.getAttribute('data-qd-alt') || node.getAttribute('alt') || '';
                const src = node.getAttribute('data-qd-src') || node.getAttribute('src') || '';
                const imgMarker = dataQd || '!';
                return `${imgMarker}[${alt}](${src})`;
                
            case 'ul':
            case 'ol':
                return walkList(node, tag === 'ol') + '\n';
                
            case 'li':
                // Handled by list processor
                return childContent;
                
            case 'table':
                return walkTable(node) + '\n\n';
                
            case 'p':
                // Check if it's actually a paragraph or just a wrapper
                if (childContent.trim()) {
                    // Check if paragraph ends with a line that's just whitespace
                    // This indicates an intentional blank line before the next element
                    const lines = childContent.split('\n');
                    let content = childContent.trim();
                    
                    // If the last line(s) are just whitespace, preserve one blank line
                    if (lines.length > 1) {
                        let trailingBlankLines = 0;
                        for (let i = lines.length - 1; i >= 0; i--) {
                            if (lines[i].trim() === '') {
                                trailingBlankLines++;
                            } else {
                                break;
                            }
                        }
                        if (trailingBlankLines > 0) {
                            // Add a line with just a space, followed by single newline
                            // The \n\n will be added below for paragraph separation
                            content = content + '\n ';
                            // Only add one newline since we're preserving the space line
                            return content + '\n';
                        }
                    }
                    
                    return content + '\n\n';
                }
                return '';
                
            case 'div':
                // Check if this was created by a fence plugin with reverse handler
                const divLang = node.getAttribute('data-qd-lang');
                const divFence = node.getAttribute('data-qd-fence');
                
                if (divLang && options.fence_plugin && options.fence_plugin.reverse) {
                    try {
                        const result = options.fence_plugin.reverse(node);
                        if (result && result.content) {
                            const fenceMarker = result.fence || divFence || '```';
                            const langStr = result.lang || divLang;
                            return `${fenceMarker}${langStr}\n${result.content}\n${fenceMarker}\n\n`;
                        }
                    } catch (err) {
                        console.warn('Fence reverse handler error:', err);
                        // Fall through to default handling
                    }
                }
                
                // Fallback: use data-qd-source if available
                const divSource = node.getAttribute('data-qd-source');
                if (divSource && divFence) {
                    return `${divFence}${divLang || ''}\n${divSource}\n${divFence}\n\n`;
                }
                
                // Check if it's a mermaid container
                if (node.classList && node.classList.contains('mermaid-container')) {
                    const fence = node.getAttribute('data-qd-fence') || '```';
                    const lang = node.getAttribute('data-qd-lang') || 'mermaid';
                    
                    // First check for data-qd-source attribute on the container
                    const source = node.getAttribute('data-qd-source');
                    if (source) {
                        // Decode HTML entities from the attribute (mainly &quot;)
                        const temp = document.createElement('textarea');
                        temp.innerHTML = source;
                        const code = temp.value;
                        return `${fence}${lang}\n${code}\n${fence}\n\n`;
                    }
                    
                    // Check for source on the pre.mermaid element
                    const mermaidPre = node.querySelector('pre.mermaid');
                    if (mermaidPre) {
                        const preSource = mermaidPre.getAttribute('data-qd-source');
                        if (preSource) {
                            const temp = document.createElement('textarea');
                            temp.innerHTML = preSource;
                            const code = temp.value;
                            return `${fence}${lang}\n${code}\n${fence}\n\n`;
                        }
                    }
                    
                    // Fallback: Look for the legacy .mermaid-source element
                    const sourceElement = node.querySelector('.mermaid-source');
                    if (sourceElement) {
                        // Decode HTML entities
                        const temp = document.createElement('div');
                        temp.innerHTML = sourceElement.innerHTML;
                        const code = temp.textContent;
                        return `${fence}${lang}\n${code}\n${fence}\n\n`;
                    }
                    
                    // Final fallback: try to extract from the mermaid element (unreliable after rendering)
                    const mermaidElement = node.querySelector('.mermaid');
                    if (mermaidElement && mermaidElement.textContent.includes('graph')) {
                        return `${fence}${lang}\n${mermaidElement.textContent.trim()}\n${fence}\n\n`;
                    }
                }
                // Check if it's a standalone mermaid diagram (legacy)
                if (node.classList && node.classList.contains('mermaid')) {
                    const fence = node.getAttribute('data-qd-fence') || '```';
                    const lang = node.getAttribute('data-qd-lang') || 'mermaid';
                    const code = node.textContent.trim();
                    return `${fence}${lang}\n${code}\n${fence}\n\n`;
                }
                // Pass through other divs
                return childContent;
            
            case 'span':
                // Pass through container elements
                return childContent;
                
            default:
                return childContent;
        }
    }
    
    // Walk list elements
    function walkList(listNode, isOrdered, depth = 0) {
        let result = '';
        let index = 1;
        const indent = '  '.repeat(depth);
        
        for (let child of listNode.children) {
            if (child.tagName !== 'LI') continue;
            
            const dataQd = child.getAttribute('data-qd');
            let marker = dataQd || (isOrdered ? `${index}.` : '-');
            
            // Check for task list checkbox
            const checkbox = child.querySelector('input[type="checkbox"]');
            if (checkbox) {
                const checked = checkbox.checked ? 'x' : ' ';
                marker = '-';
                // Get text without the checkbox
                let text = '';
                for (let node of child.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        text += node.textContent;
                    } else if (node.tagName && node.tagName !== 'INPUT') {
                        text += walkNode(node);
                    }
                }
                result += `${indent}${marker} [${checked}] ${text.trim()}\n`;
            } else {
                let itemContent = '';
                
                for (let node of child.childNodes) {
                    if (node.tagName === 'UL' || node.tagName === 'OL') {
                        itemContent += walkList(node, node.tagName === 'OL', depth + 1);
                    } else {
                        itemContent += walkNode(node);
                    }
                }
                
                result += `${indent}${marker} ${itemContent.trim()}\n`;
            }
            
            index++;
        }
        
        return result;
    }
    
    // Walk table elements
    function walkTable(table) {
        let result = '';
        const alignData = table.getAttribute('data-qd-align');
        const alignments = alignData ? alignData.split(',') : [];
        
        // Process header
        const thead = table.querySelector('thead');
        if (thead) {
            const headerRow = thead.querySelector('tr');
            if (headerRow) {
                const headers = [];
                for (let th of headerRow.querySelectorAll('th')) {
                    headers.push(th.textContent.trim());
                }
                result += '| ' + headers.join(' | ') + ' |\n';
                
                // Add separator with alignment
                const separators = headers.map((_, i) => {
                    const align = alignments[i] || 'left';
                    if (align === 'center') return ':---:';
                    if (align === 'right') return '---:';
                    return '---';
                });
                result += '| ' + separators.join(' | ') + ' |\n';
            }
        }
        
        // Process body
        const tbody = table.querySelector('tbody');
        if (tbody) {
            for (let row of tbody.querySelectorAll('tr')) {
                const cells = [];
                for (let td of row.querySelectorAll('td')) {
                    cells.push(td.textContent.trim());
                }
                if (cells.length > 0) {
                    result += '| ' + cells.join(' | ') + ' |\n';
                }
            }
        }
        
        return result.trim();
    }
    
    // Process the DOM tree
    let markdown = walkNode(container);
    
    // Clean up
    markdown = markdown.replace(/\n{3,}/g, '\n\n'); // Remove excessive newlines
    markdown = markdown.trim();
    
    return markdown;
};

// Override the configure method to return a bidirectional version
quikdown_bd.configure = function(options) {
    return function(markdown) {
        return quikdown_bd(markdown, options);
    };
};

// Set version
// Version is already copied from quikdown via Object.keys loop

// Export for both module and browser
/* istanbul ignore next */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = quikdown_bd;
}

/* istanbul ignore next */
if (typeof window !== 'undefined') {
    window.quikdown_bd = quikdown_bd;
}

/**
 * Rich copy functionality for QuikdownEditor
 * Handles copying rendered content with proper formatting for pasting into rich text editors
 */

/**
 * Get platform information
 * @returns {string} The detected platform: 'macos', 'windows', 'linux', or 'unknown'
 */
function getPlatform() {
    const platform = navigator.platform?.toLowerCase() || '';
    const userAgent = navigator.userAgent?.toLowerCase() || '';
    
    if (platform.includes('mac') || userAgent.includes('mac')) {
        return 'macos';
    } else if (userAgent.includes('windows')) {
        return 'windows';
    } else if (userAgent.includes('linux')) {
        return 'linux';
    }
    return 'unknown';
}

/**
 * Copy to clipboard using HTML selection fallback (for Safari)
 * Uses div with selection to preserve HTML formatting
 * @param {string} html - HTML content to copy
 * @returns {boolean} Success status
 */
function copyToClipboard(html) {
    let tempDiv;
    let result;
    
    try {
        // Use a div instead of textarea to preserve HTML formatting
        tempDiv = document.createElement('div');
        tempDiv.style.position = 'fixed';
        tempDiv.style.left = '-9999px';
        tempDiv.style.top = '0';
        tempDiv.style.width = '1px';
        tempDiv.style.height = '1px';
        tempDiv.style.overflow = 'hidden';
        tempDiv.innerHTML = html;
        
        document.body.appendChild(tempDiv);
        
        // Select the HTML content
        const range = document.createRange();
        range.selectNodeContents(tempDiv);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        
        // Try to copy
        result = document.execCommand('copy');
        
        // Clear selection
        selection.removeAllRanges();
    } catch (err) {
        console.error('Fallback copy failed:', err);
        result = false;
    } finally {
        if (tempDiv && tempDiv.parentNode) {
            document.body.removeChild(tempDiv);
        }
    }
    
    return result;
}

/**
 * Convert SVG to PNG blob (based on squibview's implementation)
 * @param {SVGElement} svgElement - The SVG element to convert
 * @returns {Promise<Blob>} A promise that resolves with the PNG blob
 */
async function svgToPng(svgElement, needsWhiteBackground = false) {
    return new Promise((resolve, reject) => {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        const scale = 2;
        
        // Check if this is a Mermaid-generated SVG (they don't have explicit width/height attributes)
        const isMermaidSvg = svgElement.closest('.mermaid') || svgElement.classList.contains('mermaid');
        const hasExplicitDimensions = svgElement.getAttribute('width') && svgElement.getAttribute('height');
        
        let svgWidth, svgHeight;
        
        if (isMermaidSvg || !hasExplicitDimensions) {
            // For Mermaid or other generated SVGs, prioritize computed dimensions
            svgWidth = svgElement.clientWidth || 
                       (svgElement.viewBox && svgElement.viewBox.baseVal.width) || 
                       parseFloat(svgElement.getAttribute('width')) || 400;
            svgHeight = svgElement.clientHeight || 
                        (svgElement.viewBox && svgElement.viewBox.baseVal.height) || 
                        parseFloat(svgElement.getAttribute('height')) || 300;
        } else {
            // For explicit SVGs (like fenced SVG blocks), prioritize explicit attributes
            svgWidth = parseFloat(svgElement.getAttribute('width')) || 
                       (svgElement.viewBox && svgElement.viewBox.baseVal.width) || 
                       svgElement.clientWidth || 400;
            svgHeight = parseFloat(svgElement.getAttribute('height')) || 
                        (svgElement.viewBox && svgElement.viewBox.baseVal.height) || 
                        svgElement.clientHeight || 300;
        }
        
        // Ensure the SVG string has explicit dimensions by modifying it if necessary
        let modifiedSvgString = svgString;
        if (svgWidth && svgHeight) {
            // Create a temporary SVG element to modify the serialized string
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = svgString;
            const tempSvg = tempDiv.querySelector('svg');
            if (tempSvg) {
                tempSvg.setAttribute('width', svgWidth.toString());
                tempSvg.setAttribute('height', svgHeight.toString());
                modifiedSvgString = new XMLSerializer().serializeToString(tempSvg);
            }
        }
        
        canvas.width = svgWidth * scale;
        canvas.height = svgHeight * scale;
        ctx.scale(scale, scale);
        
        img.onload = () => {
            try {
                // Add white background for math equations (they often have transparent backgrounds)
                if (needsWhiteBackground) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                ctx.drawImage(img, 0, 0, svgWidth, svgHeight);
                canvas.toBlob(blob => {
                    resolve(blob);
                }, 'image/png', 1.0);
            } catch (err) {
                reject(err);
            }
        };
        
        img.onerror = reject;
        // Use data URI instead of blob URL to avoid tainting the canvas
        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(modifiedSvgString)}`;
        img.src = svgDataUrl;
    });
}

/**
 * Rasterize a GeoJSON Leaflet map to PNG data URL (following Gem's guide)
 * @param {HTMLElement} liveContainer - The live map container element
 * @returns {Promise<string|null>} PNG data URL or null if failed
 */
async function rasterizeGeoJSONMap(liveContainer) {
    try {
        const map = liveContainer._map;
        if (!map) {
            console.warn('No map found on container');
            return null;
        }
        
        // Get container dimensions
        const mapRect = liveContainer.getBoundingClientRect();
        const width = Math.round(mapRect.width);
        const height = Math.round(mapRect.height);
        
        if (width === 0 || height === 0) {
            console.warn('Map container has zero dimensions');
            return null;
        }
        
        // Create canvas sized to the map container
        const canvas = document.createElement('canvas');
        const dpr = window.devicePixelRatio || 1;
        
        // Set canvas size with DPR for sharpness
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // White background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        // 1. Draw tiles from THIS container only
        const tiles = liveContainer.querySelectorAll('.leaflet-tile');
        
        const tilePromises = [];
        for (const tile of tiles) {
            tilePromises.push(new Promise((resolve) => {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                img.onload = () => {
                    try {
                        // Calculate tile position relative to container
                        const tileRect = tile.getBoundingClientRect();
                        const offsetX = tileRect.left - mapRect.left;
                        const offsetY = tileRect.top - mapRect.top;
                        
                        // Draw tile at correct position
                        ctx.drawImage(img, offsetX, offsetY, tileRect.width, tileRect.height);
                    } catch (err) {
                        console.warn('Failed to draw tile:', err);
                    }
                    resolve();
                };
                
                img.onerror = () => {
                    console.warn('Failed to load tile:', tile.src);
                    resolve();
                };
                
                img.src = tile.src;
            }));
        }
        
        // Wait for all tiles to load
        await Promise.all(tilePromises);
        
        // 2. Draw vector overlays (SVG paths for GeoJSON features)
        const svgOverlays = liveContainer.querySelectorAll('svg:not(.leaflet-attribution-flag)');
        
        for (const svg of svgOverlays) {
            // Skip attribution/control overlays
            if (svg.closest('.leaflet-control')) continue;
            
            try {
                const svgRect = svg.getBoundingClientRect();
                const offsetX = svgRect.left - mapRect.left;
                const offsetY = svgRect.top - mapRect.top;
                
                // Serialize SVG
                const serializer = new XMLSerializer();
                const svgStr = serializer.serializeToString(svg);
                const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
                const url = URL.createObjectURL(svgBlob);
                
                // Draw SVG overlay
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        ctx.drawImage(img, offsetX, offsetY, svgRect.width, svgRect.height);
                        URL.revokeObjectURL(url);
                        resolve();
                    };
                    img.onerror = () => {
                        URL.revokeObjectURL(url);
                        reject(new Error('Failed to load SVG overlay'));
                    };
                    img.src = url;
                });
            } catch (err) {
                console.warn('Failed to draw SVG overlay:', err);
            }
        }
        
        // 3. Draw marker icons if any
        const markerIcons = liveContainer.querySelectorAll('.leaflet-marker-icon');
        
        for (const marker of markerIcons) {
            try {
                const img = new Image();
                img.crossOrigin = 'anonymous';
                
                await new Promise((resolve) => {
                    img.onload = () => {
                        const markerRect = marker.getBoundingClientRect();
                        const offsetX = markerRect.left - mapRect.left;
                        const offsetY = markerRect.top - mapRect.top;
                        ctx.drawImage(img, offsetX, offsetY, markerRect.width, markerRect.height);
                        resolve();
                    };
                    img.onerror = resolve;
                    img.src = marker.src;
                });
            } catch (err) {
                console.warn('Failed to draw marker icon:', err);
            }
        }
        
        // Return PNG data URL
        return canvas.toDataURL('image/png', 1.0);
        
    } catch (error) {
        console.error('Failed to rasterize GeoJSON map:', error);
        return null;
    }
}

/**
 * Get rendered content as rich HTML suitable for clipboard
 * @param {HTMLElement} previewPanel - The preview panel element to copy from
 * @returns {Promise<{success: boolean, html?: string, text?: string}>}
 */
async function getRenderedContent(previewPanel) {
    if (!previewPanel) {
        throw new Error('No preview panel available');
    }
    
    // Check if MathJax needs to render (only if not already rendered)
    const mathBlocks = previewPanel.querySelectorAll('.math-display');
    if (mathBlocks.length > 0) {
        // Check if already rendered (has mjx-container inside)
        const needsRendering = Array.from(mathBlocks).some(block => !block.querySelector('mjx-container'));
        
        if (needsRendering && window.MathJax && window.MathJax.typesetPromise) {
            try {
                await window.MathJax.typesetPromise(Array.from(mathBlocks));
            } catch (err) {
                console.warn('MathJax typesetting failed:', err);
            }
        }
    }
    
    // Clone the preview panel to avoid modifying the actual DOM
    const clone = previewPanel.cloneNode(true);
    
    // Process different fence types for rich copy
    try {
        // Phase 1: Process basic markdown elements with inline styles
        
        // 1.1 Text formatting - add inline styles
        clone.querySelectorAll('strong, b').forEach(el => {
            el.style.fontWeight = 'bold';
        });
        
        clone.querySelectorAll('em, i').forEach(el => {
            el.style.fontStyle = 'italic';
        });
        
        clone.querySelectorAll('del, s, strike').forEach(el => {
            el.style.textDecoration = 'line-through';
        });
        
        clone.querySelectorAll('u').forEach(el => {
            el.style.textDecoration = 'underline';
        });
        
        clone.querySelectorAll('code:not(pre code)').forEach(el => {
            el.style.backgroundColor = '#f4f4f4';
            el.style.padding = '2px 4px';
            el.style.borderRadius = '3px';
            el.style.fontFamily = 'monospace';
            el.style.fontSize = '0.9em';
        });
        
        // 1.2 Block elements - add inline styles
        clone.querySelectorAll('h1').forEach(el => {
            el.style.fontSize = '2em';
            el.style.fontWeight = 'bold';
            el.style.marginTop = '0.67em';
            el.style.marginBottom = '0.67em';
        });
        
        clone.querySelectorAll('h2').forEach(el => {
            el.style.fontSize = '1.5em';
            el.style.fontWeight = 'bold';
            el.style.marginTop = '0.83em';
            el.style.marginBottom = '0.83em';
        });
        
        clone.querySelectorAll('h3').forEach(el => {
            el.style.fontSize = '1.17em';
            el.style.fontWeight = 'bold';
            el.style.marginTop = '1em';
            el.style.marginBottom = '1em';
        });
        
        clone.querySelectorAll('h4').forEach(el => {
            el.style.fontSize = '1em';
            el.style.fontWeight = 'bold';
            el.style.marginTop = '1.33em';
            el.style.marginBottom = '1.33em';
        });
        
        clone.querySelectorAll('h5').forEach(el => {
            el.style.fontSize = '0.83em';
            el.style.fontWeight = 'bold';
            el.style.marginTop = '1.67em';
            el.style.marginBottom = '1.67em';
        });
        
        clone.querySelectorAll('h6').forEach(el => {
            el.style.fontSize = '0.67em';
            el.style.fontWeight = 'bold';
            el.style.marginTop = '2.33em';
            el.style.marginBottom = '2.33em';
        });
        
        clone.querySelectorAll('blockquote').forEach(el => {
            el.style.borderLeft = '4px solid #ddd';
            el.style.marginLeft = '0';
            el.style.paddingLeft = '1em';
            el.style.color = '#666';
        });
        
        clone.querySelectorAll('hr').forEach(el => {
            el.style.border = 'none';
            el.style.borderTop = '1px solid #ccc';
            el.style.margin = '1em 0';
        });
        
        // 1.3 Tables - add inline styles
        clone.querySelectorAll('table').forEach(table => {
            table.style.borderCollapse = 'collapse';
            table.style.width = '100%';
            table.style.marginBottom = '1em';
        });
        
        clone.querySelectorAll('th').forEach(th => {
            th.style.border = '1px solid #ccc';
            th.style.padding = '8px';
            th.style.textAlign = 'left';
            th.style.backgroundColor = '#f0f0f0';
            th.style.fontWeight = 'bold';
        });
        
        clone.querySelectorAll('td').forEach(td => {
            td.style.border = '1px solid #ccc';
            td.style.padding = '8px';
            td.style.textAlign = 'left';
        });
        
        // 1.4 Links - add inline styles
        clone.querySelectorAll('a').forEach(a => {
            a.style.color = '#0066cc';
            a.style.textDecoration = 'underline';
        });
        
        // Process code blocks - wrap in table and add syntax highlighting colors
        clone.querySelectorAll('pre code').forEach(block => {
            const pre = block.parentElement;
            
            // Add inline styles for syntax highlighting (GitHub theme colors)
            if (block.classList.contains('hljs')) {
                // Apply inline styles to all highlight.js elements
                block.querySelectorAll('.hljs-keyword').forEach(el => {
                    el.style.color = '#d73a49';
                    el.style.fontWeight = 'bold';
                });
                block.querySelectorAll('.hljs-string').forEach(el => {
                    el.style.color = '#032f62';
                });
                block.querySelectorAll('.hljs-number').forEach(el => {
                    el.style.color = '#005cc5';
                });
                block.querySelectorAll('.hljs-comment').forEach(el => {
                    el.style.color = '#6a737d';
                    el.style.fontStyle = 'italic';
                });
                block.querySelectorAll('.hljs-function').forEach(el => {
                    el.style.color = '#6f42c1';
                });
                block.querySelectorAll('.hljs-class').forEach(el => {
                    el.style.color = '#6f42c1';
                });
                block.querySelectorAll('.hljs-title').forEach(el => {
                    el.style.color = '#6f42c1';
                });
                block.querySelectorAll('.hljs-built_in').forEach(el => {
                    el.style.color = '#005cc5';
                });
                block.querySelectorAll('.hljs-literal').forEach(el => {
                    el.style.color = '#005cc5';
                });
                block.querySelectorAll('.hljs-meta').forEach(el => {
                    el.style.color = '#005cc5';
                });
                block.querySelectorAll('.hljs-attr').forEach(el => {
                    el.style.color = '#22863a';
                });
                block.querySelectorAll('.hljs-variable').forEach(el => {
                    el.style.color = '#e36209';
                });
                block.querySelectorAll('.hljs-regexp').forEach(el => {
                    el.style.color = '#032f62';
                });
                block.querySelectorAll('.hljs-selector-class').forEach(el => {
                    el.style.color = '#22863a';
                });
                block.querySelectorAll('.hljs-selector-id').forEach(el => {
                    el.style.color = '#6f42c1';
                });
                block.querySelectorAll('.hljs-selector-tag').forEach(el => {
                    el.style.color = '#22863a';
                });
                block.querySelectorAll('.hljs-tag').forEach(el => {
                    el.style.color = '#22863a';
                });
                block.querySelectorAll('.hljs-name').forEach(el => {
                    el.style.color = '#22863a';
                });
                block.querySelectorAll('.hljs-attribute').forEach(el => {
                    el.style.color = '#6f42c1';
                });
            }
            
            const table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.style.border = 'none';
            table.style.marginBottom = '1em';
            
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.style.backgroundColor = '#f7f7f7';
            td.style.padding = '12px';
            td.style.fontFamily = 'Consolas, Monaco, "Courier New", monospace';
            td.style.fontSize = '14px';
            td.style.lineHeight = '1.4';
            td.style.whiteSpace = 'pre';
            td.style.overflowX = 'auto';
            td.style.border = '1px solid #ddd';
            td.style.borderRadius = '4px';
            
            // Move the formatted code content with inline styles
            td.innerHTML = block.innerHTML;
            
            tr.appendChild(td);
            table.appendChild(tr);
            
            // Replace the pre element with the table
            pre.parentNode.replaceChild(table, pre);
        });
        
        // Process images - convert to data URLs and ensure proper dimensions
        const images = clone.querySelectorAll('img');
        for (const img of images) {
            // Ensure image has dimensions for Google Docs compatibility
            if (!img.width && img.naturalWidth) {
                img.width = img.naturalWidth;
            }
            if (!img.height && img.naturalHeight) {
                img.height = img.naturalHeight;
            }
            
            // Set max dimensions to prevent huge images
            const maxWidth = 800;
            const maxHeight = 600;
            if (img.width > maxWidth || img.height > maxHeight) {
                const scale = Math.min(maxWidth / img.width, maxHeight / img.height);
                img.width = Math.round(img.width * scale);
                img.height = Math.round(img.height * scale);
            }
            
            // Ensure width and height attributes are set
            if (img.width) {
                img.setAttribute('width', img.width.toString());
                img.style.width = img.width + 'px';
            }
            if (img.height) {
                img.setAttribute('height', img.height.toString());
                img.style.height = img.height + 'px';
            }
            
            // Add v:shapes for Word compatibility
            if (!img.getAttribute('v:shapes')) {
                img.setAttribute('v:shapes', 'image' + Math.random().toString(36).substr(2, 9));
            }
            
            // Skip if already a data URL
            if (img.src && !img.src.startsWith('data:')) {
                try {
                    // Try to convert to data URL
                    const response = await fetch(img.src);
                    const blob = await response.blob();
                    
                    // Check if image is too large (Google Docs has limits)
                    const maxSize = 2 * 1024 * 1024; // 2MB limit for inline images
                    if (blob.size > maxSize) {
                        console.warn('Image too large for inline data URL:', img.src, 'Size:', blob.size);
                        // For large images, we might want to resize or keep the URL
                        continue;
                    }
                    
                    const dataUrl = await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(blob);
                    });
                    img.src = dataUrl;
                } catch (err) {
                    console.warn('Failed to convert image to data URL:', img.src, err);
                    // Keep original src if conversion fails
                }
            }
        }
        
        // Phase 2: Process fence block types
        // 1. Process STL 3D models - convert canvas to image or placeholder
        const stlContainers = clone.querySelectorAll('.qde-stl-container');
        for (const container of stlContainers) {
            try {
                // Find the corresponding original container to get the canvas
                const containerId = container.dataset.stlId;
                const originalContainer = previewPanel.querySelector(`.qde-stl-container[data-stl-id="${containerId}"]`);
                
                if (originalContainer) {
                    // Look for canvas element in the original container (Three.js WebGL canvas)
                    const canvas = originalContainer.querySelector('canvas');
                    if (canvas && canvas.width > 0 && canvas.height > 0) {
                        try {
                            // Get Three.js references stored on the container (like squibview)
                            const renderer = originalContainer._threeRenderer;
                            const scene = originalContainer._threeScene;
                            const camera = originalContainer._threeCamera;
                            
                            // If we have access to the Three.js objects, force render the scene
                            if (renderer && scene && camera) {
                                renderer.render(scene, camera);
                            }
                            
                            // Try to capture the canvas as an image
                            const dataUrl = canvas.toDataURL('image/png', 1.0);
                            const img = document.createElement('img');
                            img.src = dataUrl;
                            
                            // Use canvas dimensions for the image
                            const imgWidth = canvas.width / 2; // Divide by scale factor (2x for retina)
                            const imgHeight = canvas.height / 2;
                            
                            // Set both HTML attributes and CSS properties for maximum compatibility
                            img.width = imgWidth;
                            img.height = imgHeight;
                            img.setAttribute('width', imgWidth.toString());
                            img.setAttribute('height', imgHeight.toString());
                            img.style.width = imgWidth + 'px';
                            img.style.height = imgHeight + 'px';
                            img.style.maxWidth = 'none';
                            img.style.maxHeight = 'none';
                            img.style.border = '1px solid #ddd';
                            img.style.borderRadius = '4px';
                            img.style.margin = '0.5em 0';
                            img.setAttribute('v:shapes', 'image' + Math.random().toString(36).substr(2, 9));
                            img.alt = 'STL 3D Model';
                            
                            container.parentNode.replaceChild(img, container);
                            continue;
                        } catch (canvasErr) {
                            console.warn('Failed to convert STL canvas to image (likely WebGL context issue):', canvasErr);
                        }
                    } else {
                        console.warn('No valid canvas found in STL container');
                    }
                } else {
                    console.warn('Could not find original STL container');
                }
            } catch (err) {
                console.error('Error processing STL container for copy:', err);
            }
            
            // Fallback to placeholder if canvas conversion fails
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'padding: 12px; background-color: #f0f0f0; border: 1px solid #ccc; text-align: center; margin: 0.5em 0; border-radius: 4px;';
            placeholder.textContent = '[STL 3D Model - Interactive content not available in copy]';
            container.parentNode.replaceChild(placeholder, container);
        }
        
        // 2. Process Mermaid diagrams - convert SVG to PNG
        const mermaidContainers = clone.querySelectorAll('.mermaid');
        for (const container of mermaidContainers) {
            const svg = container.querySelector('svg');
            if (svg) {
                try {
                    const pngBlob = await svgToPng(svg);
                    const dataUrl = await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onloadend = () => resolve(reader.result);
                        reader.readAsDataURL(pngBlob);
                    });
                    
                    const img = document.createElement('img');
                    img.src = dataUrl;
                    
                    // Use the exact same dimension calculation logic as svgToPng (like squibview)
                    const isMermaidSvg = svg.closest('.mermaid') || svg.classList.contains('mermaid');
                    const hasExplicitDimensions = svg.getAttribute('width') && svg.getAttribute('height');
                    
                    let imgWidth, imgHeight;
                    
                    if (isMermaidSvg || !hasExplicitDimensions) {
                        // For Mermaid or other generated SVGs, prioritize computed dimensions
                        imgWidth = svg.clientWidth || 
                                   (svg.viewBox && svg.viewBox.baseVal.width) || 
                                   parseFloat(svg.getAttribute('width')) || 400;
                        imgHeight = svg.clientHeight || 
                                    (svg.viewBox && svg.viewBox.baseVal.height) || 
                                    parseFloat(svg.getAttribute('height')) || 300;
                    } else {
                        // For explicit SVGs (like fenced SVG blocks), prioritize explicit attributes
                        imgWidth = parseFloat(svg.getAttribute('width')) || 
                                   (svg.viewBox && svg.viewBox.baseVal.width) || 
                                   svg.clientWidth || 400;
                        imgHeight = parseFloat(svg.getAttribute('height')) || 
                                    (svg.viewBox && svg.viewBox.baseVal.height) || 
                                    svg.clientHeight || 300;
                    }
                    
                    // Set both HTML attributes and CSS properties for maximum compatibility (like squibview)
                    img.width = imgWidth;
                    img.height = imgHeight;
                    img.setAttribute('width', imgWidth.toString());
                    img.setAttribute('height', imgHeight.toString());
                    img.style.width = imgWidth + 'px';
                    img.style.height = imgHeight + 'px';
                    img.style.maxWidth = 'none';  // Prevent CSS from constraining the image
                    img.style.maxHeight = 'none';
                    img.setAttribute('v:shapes', 'image' + Math.random().toString(36).substr(2, 9));
                    img.alt = 'Mermaid Diagram';
                    
                    container.parentNode.replaceChild(img, container);
                } catch (err) {
                    console.warn('Failed to convert Mermaid diagram:', err);
                    // Fallback: leave as SVG
                }
            }
        }
        
        // 3. Process Chart.js charts - convert canvas to image
        const chartContainers = clone.querySelectorAll('.qde-chart-container');
        for (const container of chartContainers) {
            try {
                const containerId = container.dataset.chartId;
                const originalContainer = previewPanel.querySelector(`.qde-chart-container[data-chart-id="${containerId}"]`);
                
                if (originalContainer) {
                    const canvas = originalContainer.querySelector('canvas');
                    if (canvas && canvas.width > 0 && canvas.height > 0) {
                        try {
                            const dataUrl = canvas.toDataURL('image/png', 1.0);
                            const img = document.createElement('img');
                            img.src = dataUrl;
                            
                            // Use canvas dimensions for the image
                            const imgWidth = canvas.width;
                            const imgHeight = canvas.height;
                            
                            // Set both HTML attributes and CSS properties for maximum compatibility
                            img.width = imgWidth;
                            img.height = imgHeight;
                            img.setAttribute('width', imgWidth.toString());
                            img.setAttribute('height', imgHeight.toString());
                            img.style.width = imgWidth + 'px';
                            img.style.height = imgHeight + 'px';
                            img.style.maxWidth = 'none';
                            img.style.maxHeight = 'none';
                            img.style.margin = '0.5em 0';
                            img.setAttribute('v:shapes', 'image' + Math.random().toString(36).substr(2, 9));
                            img.alt = 'Chart';
                            
                            container.parentNode.replaceChild(img, container);
                            continue;
                        } catch (canvasErr) {
                            console.warn('Failed to convert chart canvas to image:', canvasErr);
                        }
                    }
                }
            } catch (err) {
                console.warn('Error processing chart container:', err);
            }
            
            // Fallback to placeholder
            const placeholder = document.createElement('div');
            placeholder.style.cssText = 'padding: 12px; background-color: #f0f0f0; border: 1px solid #ccc; text-align: center; margin: 0.5em 0; border-radius: 4px;';
            placeholder.textContent = '[Chart - Interactive content not available in copy]';
            container.parentNode.replaceChild(placeholder, container);
        }
        
        // 4. Process SVG fenced blocks - convert to PNG
        const svgContainers = clone.querySelectorAll('.qde-svg-container svg');
        for (const svg of svgContainers) {
            try {
                const pngBlob = await svgToPng(svg);
                const dataUrl = await new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(pngBlob);
                });
                
                const img = document.createElement('img');
                img.src = dataUrl;
                
                // Calculate dimensions for the SVG
                const hasExplicitDimensions = svg.getAttribute('width') && svg.getAttribute('height');
                
                let imgWidth, imgHeight;
                
                if (hasExplicitDimensions) {
                    // For explicit SVGs (like fenced SVG blocks), prioritize explicit attributes
                    imgWidth = parseFloat(svg.getAttribute('width')) || 
                               (svg.viewBox && svg.viewBox.baseVal.width) || 
                               svg.clientWidth || 400;
                    imgHeight = parseFloat(svg.getAttribute('height')) || 
                                (svg.viewBox && svg.viewBox.baseVal.height) || 
                                svg.clientHeight || 300;
                } else {
                    // For generated SVGs, prioritize computed dimensions
                    imgWidth = svg.clientWidth || 
                               (svg.viewBox && svg.viewBox.baseVal.width) || 
                               parseFloat(svg.getAttribute('width')) || 400;
                    imgHeight = svg.clientHeight || 
                                (svg.viewBox && svg.viewBox.baseVal.height) || 
                                parseFloat(svg.getAttribute('height')) || 300;
                }
                
                // Set both HTML attributes and CSS properties for maximum compatibility
                img.width = imgWidth;
                img.height = imgHeight;
                img.setAttribute('width', imgWidth.toString());
                img.setAttribute('height', imgHeight.toString());
                img.style.width = imgWidth + 'px';
                img.style.height = imgHeight + 'px';
                img.style.maxWidth = 'none';  // Prevent CSS from constraining the image
                img.style.maxHeight = 'none';
                img.setAttribute('v:shapes', 'image' + Math.random().toString(36).substr(2, 9));
                img.alt = 'SVG Image';
                
                svg.parentNode.replaceChild(img, svg);
            } catch (err) {
                console.warn('Failed to convert SVG to image:', err);
                // Leave as SVG if conversion fails
            }
        }
        
        // 5. Process Math equations - convert to PNG images (exactly like SquibView)
        const mathElements = Array.from(clone.querySelectorAll('.math-display'));
        
        if (mathElements.length > 0) {
            for (const mathEl of mathElements) {
                try {
                    // Find SVG inside the math element (MathJax creates it)
                    const svg = mathEl.querySelector('svg');
                    if (!svg) {
                        console.warn('No SVG found in math element, skipping');
                        continue;
                    }
                    
                    // Convert SVG to PNG data URL (exactly like SquibView)
                    const serializer = new XMLSerializer();
                    const svgStr = serializer.serializeToString(svg);
                    const svgBlob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
                    const url = URL.createObjectURL(svgBlob);
                    
                    const img = new Image();
                    const dataUrl = await new Promise((resolve, reject) => {
                        img.onload = function () {
                            const canvas = document.createElement('canvas');
                            
                            // Determine SVG dimensions robustly (exactly like SquibView)
                            let width, height;
                            try {
                                // First try baseVal.value (works for absolute units)
                                width = svg.width.baseVal.value;
                                height = svg.height.baseVal.value;
                            } catch (e) {
                                // Fallback for relative units - use viewBox or rendered size
                                if (svg.viewBox && svg.viewBox.baseVal) {
                                    width = svg.viewBox.baseVal.width;
                                    height = svg.viewBox.baseVal.height;
                                } else {
                                    // Use the natural size of the loaded image
                                    width = img.naturalWidth || img.width || 200;
                                    height = img.naturalHeight || img.height || 50;
                                }
                            }
                            
                            // Scale down for much smaller paste sizes
                            const targetMaxWidth = 150;  // Further reduced
                            const targetMaxHeight = 45;   // Further reduced
                            
                            // Apply aggressive downsizing for MathJax SVGs
                            let scaleFactor = 0.04; // Further reduced for smaller output
                            
                            let scaledWidth = width * scaleFactor;
                            let scaledHeight = height * scaleFactor;
                            
                            // If still too large after base scaling, scale down further
                            if (scaledWidth > targetMaxWidth || scaledHeight > targetMaxHeight) {
                                const scaleX = targetMaxWidth / scaledWidth;
                                const scaleY = targetMaxHeight / scaledHeight;
                                scaleFactor *= Math.min(scaleX, scaleY);
                            }
                            
                            width *= scaleFactor;
                            height *= scaleFactor;
                            
                            // Use higher DPR for crisp rendering at smaller sizes
                            const dpr = 2; // Fixed 2x for consistent quality
                            canvas.width = width * dpr;
                            canvas.height = height * dpr;
                            canvas.style.width = width + 'px';
                            canvas.style.height = height + 'px';
                            
                            const ctx = canvas.getContext('2d');
                            ctx.scale(dpr, dpr);
                            
                            // White background
                            ctx.fillStyle = "#FFFFFF";
                            ctx.fillRect(0, 0, width, height);
                            
                            // Draw the SVG image at logical size
                            ctx.drawImage(img, 0, 0, width, height);
                            
                            // Clean up URL
                            URL.revokeObjectURL(url);
                            
                            // Return data URL
                            resolve(canvas.toDataURL('image/png'));
                        };
                        
                        img.onerror = () => {
                            URL.revokeObjectURL(url);
                            reject(new Error('Failed to load SVG image'));
                        };
                        
                        img.src = url;
                    });
                    
                    // Replace math element with img tag containing the PNG data URL
                    const imgElement = document.createElement('img');
                    imgElement.src = dataUrl;
                    
                    // Extract dimensions from the data URL canvas
                    const img2 = new Image();
                    img2.src = dataUrl;
                    await new Promise((resolve) => {
                        img2.onload = resolve;
                        img2.onerror = resolve;
                        setTimeout(resolve, 100); // Timeout fallback
                    });
                    
                    // Set explicit dimensions (accounting for DPR)
                    const displayWidth = img2.naturalWidth / 2;  // Divide by DPR
                    const displayHeight = img2.naturalHeight / 2;
                    
                    imgElement.width = displayWidth;
                    imgElement.height = displayHeight;
                    imgElement.style.cssText = `display:inline-block;margin:0.5em 0;width:${displayWidth}px;height:${displayHeight}px;vertical-align:middle;`;
                    imgElement.alt = 'Math equation';
                    
                    mathEl.parentNode.replaceChild(imgElement, mathEl);
                } catch (error) {
                    console.error('Failed to convert math element to image:', error);
                    // Keep the original element if conversion fails
                }
            }
        }
        
        // 2. Process GeoJSON maps - convert to static images (following Gem's guide)
        const geojsonContainers = clone.querySelectorAll('.geojson-container');
        if (geojsonContainers.length > 0) {
            
            for (const clonedContainer of geojsonContainers) {
                try {
                    // Find the corresponding live container by matching data-original-source
                    const originalSource = clonedContainer.getAttribute('data-original-source');
                    if (!originalSource) {
                        console.warn('No original source found for GeoJSON container');
                        continue;
                    }
                    
                    // Find live container with same source
                    let liveContainer = null;
                    const allLiveContainers = previewPanel.querySelectorAll('.geojson-container');
                    for (const candidate of allLiveContainers) {
                        if (candidate.getAttribute('data-original-source') === originalSource) {
                            liveContainer = candidate;
                            break;
                        }
                    }
                    
                    if (!liveContainer) {
                        console.warn('Could not find live GeoJSON container');
                        const placeholder = document.createElement('div');
                        placeholder.style.cssText = 'padding: 12px; background-color: #f0f0f0; border: 1px solid #ccc; text-align: center; margin: 0.5em 0; border-radius: 4px;';
                        placeholder.textContent = '[GeoJSON Map - Interactive content not available in copy]';
                        clonedContainer.parentNode.replaceChild(placeholder, clonedContainer);
                        continue;
                    }
                    
                    // Check if map is ready
                    const map = liveContainer._map;
                    if (!map) {
                        console.warn('Map not initialized yet');
                        const placeholder = document.createElement('div');
                        placeholder.style.cssText = 'padding: 12px; background-color: #f0f0f0; border: 1px solid #ccc; text-align: center; margin: 0.5em 0; border-radius: 4px;';
                        placeholder.textContent = '[GeoJSON Map - Still loading]';
                        clonedContainer.parentNode.replaceChild(placeholder, clonedContainer);
                        continue;
                    }
                    
                    // Rasterize the map to PNG
                    const dataUrl = await rasterizeGeoJSONMap(liveContainer);
                    
                    if (dataUrl) {
                        // Replace with image
                        const img = document.createElement('img');
                        img.src = dataUrl;
                        img.style.cssText = 'width: 100%; height: 300px; border: 1px solid #ddd; border-radius: 4px; margin: 0.5em 0;';
                        img.alt = 'GeoJSON Map';
                        clonedContainer.parentNode.replaceChild(img, clonedContainer);
                    } else {
                        // Fallback placeholder
                        const placeholder = document.createElement('div');
                        placeholder.style.cssText = 'padding: 12px; background-color: #f0f0f0; border: 1px solid #ccc; text-align: center; margin: 0.5em 0; border-radius: 4px;';
                        placeholder.textContent = '[GeoJSON Map - Interactive content not available in copy]';
                        clonedContainer.parentNode.replaceChild(placeholder, clonedContainer);
                    }
                    
                } catch (error) {
                    console.error('Failed to process GeoJSON container:', error);
                    // Replace with placeholder
                    const placeholder = document.createElement('div');
                    placeholder.style.cssText = 'padding: 12px; background-color: #f0f0f0; border: 1px solid #ccc; text-align: center; margin: 0.5em 0; border-radius: 4px;';
                    placeholder.textContent = '[GeoJSON Map - Interactive content not available in copy]';
                    clonedContainer.parentNode.replaceChild(placeholder, clonedContainer);
                }
            }
        }
        
        
        
        // 6. Process GeoJSON/Leaflet maps - capture as single image (compose tiles + overlays)
        const mapContainers = clone.querySelectorAll('[data-qd-lang="geojson"]');
        for (const container of mapContainers) {
            try {
                const containerId = container.id;
                const originalContainer = containerId ? previewPanel.querySelector(`#${containerId}`) : null;
                if (!originalContainer) continue;
                const leafletContainer = originalContainer.querySelector('.leaflet-container');
                if (!leafletContainer) continue;

                const dpr = Math.max(1, window.devicePixelRatio || 1);
                const width = leafletContainer.clientWidth || 600;
                const height = leafletContainer.clientHeight || 400;
                const canvas = document.createElement('canvas');
                canvas.width = Math.round(width * dpr);
                canvas.height = Math.round(height * dpr);
                const ctx = canvas.getContext('2d');
                ctx.scale(dpr, dpr);
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, width, height);

                const leafRect = leafletContainer.getBoundingClientRect();

                // Draw tiles (snap to integer pixels to avoid seams)
                const tiles = Array.from(leafletContainer.querySelectorAll('img.leaflet-tile'));
                for (const tile of tiles) {
                    try {
                        const r = tile.getBoundingClientRect();
                        const x = Math.round(r.left - leafRect.left);
                        const y = Math.round(r.top - leafRect.top);
                        const w = Math.round(r.width);
                        const h = Math.round(r.height);
                        const overlaps = !(r.right <= leafRect.left || r.left >= leafRect.right || r.bottom <= leafRect.top || r.top >= leafRect.bottom);
                        const style = window.getComputedStyle(tile);
                        if (w > 0 && h > 0 && overlaps && style.display !== 'none' && style.visibility !== 'hidden') {
                            ctx.drawImage(tile, x, y, w + 1, h + 1);
                        }
                    } catch (e) {
                        console.warn('Failed to draw tile:', e);
                    }
                }

                // Draw SVG overlays (paths, markers)
                const overlaySvgs = originalContainer.querySelectorAll('.leaflet-overlay-pane svg');
                for (const svg of overlaySvgs) {
                    try {
                        const svgStr = new XMLSerializer().serializeToString(svg);
                        const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);
                        const img = new Image();
                        await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; img.src = dataUrl; });
                        const r = svg.getBoundingClientRect();
                        const x = Math.round(r.left - leafRect.left);
                        const y = Math.round(r.top - leafRect.top);
                        const w = Math.round(r.width);
                        const h = Math.round(r.height);
                        const overlaps = !(r.right <= leafRect.left || r.left >= leafRect.right || r.bottom <= leafRect.top || r.top >= leafRect.bottom);
                        if (w > 0 && h > 0 && overlaps) ctx.drawImage(img, x, y, w, h);
                    } catch (e) {
                        console.warn('Failed to draw overlay SVG:', e);
                    }
                }

                // Draw marker icons (PNG/SVG img elements)
                const markerIcons = originalContainer.querySelectorAll('.leaflet-marker-pane img.leaflet-marker-icon');
                for (const icon of markerIcons) {
                    try {
                        const r = icon.getBoundingClientRect();
                        const x = Math.round(r.left - leafRect.left);
                        const y = Math.round(r.top - leafRect.top);
                        const w = Math.round(r.width);
                        const h = Math.round(r.height);
                        const overlaps = !(r.right <= leafRect.left || r.left >= leafRect.right || r.bottom <= leafRect.top || r.top >= leafRect.bottom);
                        const style = window.getComputedStyle(icon);
                        if (w > 0 && h > 0 && overlaps && style.display !== 'none' && style.visibility !== 'hidden') {
                            ctx.drawImage(icon, x, y, w, h);
                        }
                    } catch (e) {
                        console.warn('Failed to draw marker icon:', e);
                    }
                }

                // Try to produce a data URL (may fail if canvas tainted by CORS tiles)
                let mapDataUrl = '';
                try {
                    mapDataUrl = canvas.toDataURL('image/png', 1.0);
                } catch (e) {
                    console.warn('Map canvas tainted; falling back to placeholder');
                }

                const img = document.createElement('img');
                if (mapDataUrl) {
                    img.src = mapDataUrl;
                    img.width = width;
                    img.height = height;
                    img.setAttribute('width', String(width));
                    img.setAttribute('height', String(height));
                    img.style.width = width + 'px';
                    img.style.height = height + 'px';
                    img.style.display = 'block';
                    img.style.border = '1px solid #ddd';
                    img.setAttribute('v:shapes', 'image' + Math.random().toString(36).substr(2, 9));
                    img.alt = 'Map';
                } else {
                    img.alt = 'Map';
                    img.style.width = width + 'px';
                    img.style.height = height + 'px';
                    img.style.border = '1px solid #ddd';
                    img.style.backgroundColor = '#f0f0f0';
                }

                container.parentNode.replaceChild(img, container);
            } catch (err) {
                console.warn('Failed to process map container:', err);
            }
        }
        
        // 7. Process HTML fence blocks - render the HTML content and process images
        const htmlContainers = clone.querySelectorAll('.qde-html-container');
        for (const container of htmlContainers) {
            try {
                // Get the original source HTML
                const source = container.getAttribute('data-qd-source');
                
                // Check if there's a pre element (fallback display) or actual HTML content
                const pre = container.querySelector('pre');
                
                if (source) {
                    // Parse the source HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = source;
                    
                    // Process all images in the HTML block
                    const htmlImages = tempDiv.querySelectorAll('img');
                    for (const img of htmlImages) {
                        // Preserve original dimensions from HTML attributes
                        const widthAttr = img.getAttribute('width');
                        const heightAttr = img.getAttribute('height');
                        
                        if (widthAttr) {
                            img.width = parseInt(widthAttr);
                            img.style.width = widthAttr.includes('%') ? widthAttr : `${img.width}px`;
                        }
                        if (heightAttr) {
                            img.height = parseInt(heightAttr);
                            img.style.height = heightAttr.includes('%') ? heightAttr : `${img.height}px`;
                        }
                        
                        // Convert to data URL using canvas (like squibview)
                        if (img.src && !img.src.startsWith('data:')) {
                            try {
                                // Use canvas to convert image to data URL (avoids CORS issues)
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                
                                // Create new image and wait for it to load
                                const tempImg = new Image();
                                tempImg.crossOrigin = 'anonymous';
                                
                                await new Promise((resolve, reject) => {
                                    tempImg.onload = function() {
                                        
                                        // Calculate dimensions preserving aspect ratio
                                        let displayWidth = 0;
                                        let displayHeight = 0;
                                        
                                        // Use the width specified in HTML (e.g. width="250")
                                        if (widthAttr && !widthAttr.includes('%')) {
                                            displayWidth = parseInt(widthAttr);
                                        }
                                        
                                        // Use the height if specified
                                        if (heightAttr && !heightAttr.includes('%')) {
                                            displayHeight = parseInt(heightAttr);
                                        }
                                        
                                        
                                        // If only width is specified, calculate height based on aspect ratio
                                        if (displayWidth > 0 && displayHeight === 0) {
                                            if (tempImg.naturalWidth > 0) {
                                                const aspectRatio = tempImg.naturalHeight / tempImg.naturalWidth;
                                                displayHeight = Math.round(displayWidth * aspectRatio);
                                            }
                                        }
                                        // If only height is specified, calculate width based on aspect ratio
                                        else if (displayHeight > 0 && displayWidth === 0) {
                                            if (tempImg.naturalHeight > 0) {
                                                const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
                                                displayWidth = Math.round(displayHeight * aspectRatio);
                                            }
                                        }
                                        // If neither specified, use natural dimensions
                                        else if (displayWidth === 0 && displayHeight === 0) {
                                            displayWidth = tempImg.naturalWidth || 250;
                                            displayHeight = tempImg.naturalHeight || 200;
                                        }
                                        
                                        
                                        canvas.width = displayWidth;
                                        canvas.height = displayHeight;
                                        
                                        // Draw image to canvas
                                        ctx.drawImage(tempImg, 0, 0, displayWidth, displayHeight);
                                        
                                        // Convert to data URL
                                        const dataUrl = canvas.toDataURL('image/png', 1.0);
                                        
                                        // Update original image
                                        img.src = dataUrl;
                                        img.width = displayWidth;
                                        img.height = displayHeight;
                                        img.setAttribute('width', displayWidth.toString());
                                        img.setAttribute('height', displayHeight.toString());
                                        img.style.width = displayWidth + 'px';
                                        img.style.height = displayHeight + 'px';
                                        
                                        resolve();
                                    };
                                    
                                    tempImg.onerror = function() {
                                        console.warn('Failed to load HTML fence image:', img.src);
                                        reject(new Error('Image load failed'));
                                    };
                                    
                                    // Set source - resolve relative paths
                                    if (img.src.startsWith('http') || img.src.startsWith('//')) {
                                        tempImg.src = img.src;
                                    } else {
                                        // Relative path - let browser resolve it
                                        const absoluteImg = new Image();
                                        absoluteImg.src = img.src;
                                        tempImg.src = absoluteImg.src;
                                    }
                                });
                            } catch (err) {
                                console.warn('Failed to convert HTML fence image:', img.src, err);
                            }
                        }
                        
                        // Add v:shapes for Word compatibility
                        img.setAttribute('v:shapes', 'image' + Math.random().toString(36).substr(2, 9));
                    }
                    
                    // Replace container content with processed HTML (whether it had pre or not)
                    container.innerHTML = tempDiv.innerHTML;
                } else if (!pre) {
                    // Container has rendered HTML already, process its images directly
                    const htmlImages = container.querySelectorAll('img');
                    for (const img of htmlImages) {
                        // Same image processing as above
                        const widthAttr = img.getAttribute('width');
                        const heightAttr = img.getAttribute('height');
                        
                        if (widthAttr) {
                            img.width = parseInt(widthAttr);
                            img.style.width = widthAttr.includes('%') ? widthAttr : `${img.width}px`;
                        }
                        if (heightAttr) {
                            img.height = parseInt(heightAttr);
                            img.style.height = heightAttr.includes('%') ? heightAttr : `${img.height}px`;
                        }
                        
                        if (img.src && !img.src.startsWith('data:')) {
                            try {
                                // Use same canvas approach as above
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                const tempImg = new Image();
                                tempImg.crossOrigin = 'anonymous';
                                
                                await new Promise((resolve, reject) => {
                                    tempImg.onload = function() {
                                        // Calculate dimensions preserving aspect ratio
                                        let displayWidth = img.width || 0;
                                        let displayHeight = img.height || 0;
                                        
                                        // If only width is specified, calculate height based on aspect ratio
                                        if (displayWidth && !displayHeight) {
                                            const aspectRatio = tempImg.naturalHeight / tempImg.naturalWidth;
                                            displayHeight = Math.round(displayWidth * aspectRatio);
                                        }
                                        // If only height is specified, calculate width based on aspect ratio
                                        else if (displayHeight && !displayWidth) {
                                            const aspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
                                            displayWidth = Math.round(displayHeight * aspectRatio);
                                        }
                                        // If neither specified, use natural dimensions
                                        else if (!displayWidth && !displayHeight) {
                                            displayWidth = tempImg.naturalWidth || 250;
                                            displayHeight = tempImg.naturalHeight || Math.round(250 * (tempImg.naturalHeight / tempImg.naturalWidth));
                                        }
                                        
                                        canvas.width = displayWidth;
                                        canvas.height = displayHeight;
                                        ctx.drawImage(tempImg, 0, 0, displayWidth, displayHeight);
                                        
                                        const dataUrl = canvas.toDataURL('image/png', 1.0);
                                        img.src = dataUrl;
                                        img.width = displayWidth;
                                        img.height = displayHeight;
                                        img.setAttribute('width', displayWidth.toString());
                                        img.setAttribute('height', displayHeight.toString());
                                        img.style.width = displayWidth + 'px';
                                        img.style.height = displayHeight + 'px';
                                        
                                        resolve();
                                    };
                                    
                                    tempImg.onerror = function() {
                                        console.warn('Failed to load HTML fence image:', img.src);
                                        reject(new Error('Image load failed'));
                                    };
                                    
                                    if (img.src.startsWith('http') || img.src.startsWith('//')) {
                                        tempImg.src = img.src;
                                    } else {
                                        const absoluteImg = new Image();
                                        absoluteImg.src = img.src;
                                        tempImg.src = absoluteImg.src;
                                    }
                                });
                            } catch (err) {
                                console.warn('Failed to convert HTML fence image:', img.src, err);
                            }
                        }
                        
                        img.setAttribute('v:shapes', 'image' + Math.random().toString(36).substr(2, 9));
                    }
                }
            } catch (err) {
                console.warn('Failed to process HTML container:', err);
            }
        }
        
        // 8. Tables are already HTML tables from the built-in renderer
        // No processing needed
        
        // Wrap in proper HTML structure for rich text editors
        const fragment = clone.innerHTML;
        const htmlContent = `
            <!DOCTYPE html>
            <html xmlns:v="urn:schemas-microsoft-com:vml"
                  xmlns:o="urn:schemas-microsoft-com:office:office"
                  xmlns:w="urn:schemas-microsoft-com:office:word">
              <head>
                <meta charset="utf-8">
                <style>
                  /* Table styling */
                  table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
                  th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
                  th { background-color: #f0f0f0; font-weight: bold; }
                  
                  /* Code block styling */
                  pre { background-color: #f4f4f4; padding: 1em; border-radius: 4px; overflow-x: auto; }
                  code { font-family: monospace; background-color: #f4f4f4; padding: 0.2em 0.4em; border-radius: 3px; }
                  
                  /* Image handling */
                  img { display: block; max-width: 100%; height: auto; margin: 0.5em 0; }
                  
                  /* Blockquote */
                  blockquote { border-left: 4px solid #ddd; margin-left: 0; padding-left: 1em; color: #666; }
                  
                  /* Math equations centered like squibview */
                  .math-display { text-align: center; margin: 1em 0; }
                  .math-display img { display: inline-block; margin: 0 auto; }
                </style>
              </head>
              <body><!--StartFragment-->${fragment}<!--EndFragment--></body>
            </html>`;
        
        // Get plain text version
        const text = clone.textContent || clone.innerText || '';
        
        // Get platform for clipboard strategy (like squibview)
        const platform = getPlatform();
        
        if (platform === 'macos') {
            // macOS approach (like squibview)
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': new Blob([htmlContent], { type: 'text/html' }),
                        'text/plain': new Blob([text], { type: 'text/plain' })
                    })
                ]);
                return { success: true, html: htmlContent, text };
            } catch (modernErr) {
                console.warn('Modern clipboard API failed, trying Safari fallback:', modernErr);
                // Safari fallback (selection-based HTML of fragment)
                if (copyToClipboard(fragment)) {
                    return { success: true, html: htmlContent, text };
                }
                throw new Error('Fallback copy failed');
            }
        } else {
            // Windows/Linux approach (like squibview)
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'fixed';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '0';
            // Use fragment for selection-based fallback copy
            tempDiv.innerHTML = fragment;
            document.body.appendChild(tempDiv);
            
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'text/html': new Blob([htmlContent], { type: 'text/html' }),
                        'text/plain': new Blob([text], { type: 'text/plain' })
                    })
                ]);
                return { success: true, html: htmlContent, text };
            } catch (modernErr) {
                console.warn('Modern clipboard API failed, trying execCommand fallback:', modernErr);
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(tempDiv);
                selection.removeAllRanges();
                selection.addRange(range);
                
                const successful = document.execCommand('copy');
                if (!successful) {
                    throw new Error('Fallback copy failed');
                }
                return { success: true, html: htmlContent, text };
            } finally {
                if (tempDiv && tempDiv.parentNode) {
                    document.body.removeChild(tempDiv);
                }
            }
        }
        
    } catch (err) {
        console.error('Failed to copy rendered content:', err);
        throw err;
    }
}

/**
 * Quikdown Editor - A drop-in markdown editor control
 * @version 1.0.5
 * @license BSD-2-Clause
 */


// Default options
const DEFAULT_OPTIONS = {
    mode: 'split',          // 'source' | 'preview' | 'split'
    showToolbar: true,
    showRemoveHR: false,    // Show button to remove horizontal rules (---) 
    theme: 'auto',          // 'light' | 'dark' | 'auto'
    lazy_linefeeds: false,
    inline_styles: false,   // Use CSS classes (false) or inline styles (true)
    debounceDelay: 20,      // Reduced from 100ms for better responsiveness
    placeholder: 'Start typing markdown...',
    plugins: {
        highlightjs: false,
        mermaid: false
    },
    customFences: {}, // { 'language': (code, lang) => html }
    enableComplexFences: true // Enable CSV tables, math rendering, SVG, etc.
};

/**
 * Quikdown Editor - A complete markdown editing solution
 */
class QuikdownEditor {
    constructor(container, options = {}) {
        // Resolve container
        this.container = typeof container === 'string' 
            ? document.querySelector(container) 
            : container;
            
        if (!this.container) {
            throw new Error('QuikdownEditor: Invalid container');
        }
        
        // Merge options
        this.options = { ...DEFAULT_OPTIONS, ...options };
        
        // State
        this._markdown = '';
        this._html = '';
        this.currentMode = this.options.mode;
        this.updateTimer = null;
        
        // Initialize
        this.initPromise = this.init();
    }
    
    /**
     * Initialize the editor
     */
    async init() {
        // Load plugins if requested
        await this.loadPlugins();
        
        // Build UI
        this.buildUI();
        
        // Attach event listeners
        this.attachEvents();
        
        // Apply initial theme
        this.applyTheme();
        
        // Set initial mode
        this.setMode(this.currentMode);
        
        // Set initial content if provided
        if (this.options.initialContent) {
            this.setMarkdown(this.options.initialContent);
        }
    }
    
    /**
     * Build the editor UI
     */
    buildUI() {
        // Clear container
        this.container.innerHTML = '';
        
        // Add editor class
        this.container.classList.add('qde-container');
        
        // Create toolbar if enabled
        if (this.options.showToolbar) {
            this.toolbar = this.createToolbar();
            this.container.appendChild(this.toolbar);
        }
        
        // Create editor area
        this.editorArea = document.createElement('div');
        this.editorArea.className = 'qde-editor';
        
        // Create source panel
        this.sourcePanel = document.createElement('div');
        this.sourcePanel.className = 'qde-source';
        
        this.sourceTextarea = document.createElement('textarea');
        this.sourceTextarea.className = 'qde-textarea';
        this.sourceTextarea.placeholder = this.options.placeholder;
        this.sourcePanel.appendChild(this.sourceTextarea);
        
        // Create preview panel
        this.previewPanel = document.createElement('div');
        this.previewPanel.className = 'qde-preview';
        this.previewPanel.contentEditable = true;
        
        // Add panels to editor
        this.editorArea.appendChild(this.sourcePanel);
        this.editorArea.appendChild(this.previewPanel);
        this.container.appendChild(this.editorArea);
        
        // Add built-in styles if not already present
        this.injectStyles();
    }
    
    /**
     * Create toolbar
     */
    createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.className = 'qde-toolbar';
        
        // Mode buttons
        const modes = ['source', 'split', 'preview'];
        const modeLabels = { source: 'Source', split: 'Split', preview: 'Rendered' };
        modes.forEach(mode => {
            const btn = document.createElement('button');
            btn.className = 'qde-btn';
            btn.dataset.mode = mode;
            btn.textContent = modeLabels[mode];
            btn.title = `Switch to ${modeLabels[mode]} view`;
            toolbar.appendChild(btn);
        });
        
        // Spacer
        const spacer = document.createElement('span');
        spacer.className = 'qde-spacer';
        toolbar.appendChild(spacer);
        
        // Copy buttons
        const copyButtons = [
            { action: 'copy-markdown', text: 'Copy MD', title: 'Copy markdown to clipboard' },
            { action: 'copy-html', text: 'Copy HTML', title: 'Copy HTML to clipboard' },
            { action: 'copy-rendered', text: 'Copy Rendered', title: 'Copy rich text to clipboard' }
        ];
        
        copyButtons.forEach(({ action, text, title }) => {
            const btn = document.createElement('button');
            btn.className = 'qde-btn';
            btn.dataset.action = action;
            btn.textContent = text;
            btn.title = title;
            toolbar.appendChild(btn);
        });
        
        // Remove HR button (if enabled)
        if (this.options.showRemoveHR) {
            const removeHRBtn = document.createElement('button');
            removeHRBtn.className = 'qde-btn';
            removeHRBtn.dataset.action = 'remove-hr';
            removeHRBtn.textContent = 'Remove HR';
            removeHRBtn.title = 'Remove all horizontal rules (---) from markdown';
            toolbar.appendChild(removeHRBtn);
        }
        
        return toolbar;
    }
    
    /**
     * Inject built-in styles
     */
    injectStyles() {
        if (document.getElementById('qde-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'qde-styles';
        style.textContent = `
            .qde-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                border: 1px solid #ddd;
                border-radius: 4px;
                overflow: hidden;
                background: white;
            }
            
            .qde-toolbar {
                display: flex;
                align-items: center;
                padding: 8px;
                background: #f5f5f5;
                border-bottom: 1px solid #ddd;
                gap: 4px;
            }
            
            .qde-btn {
                padding: 6px 12px;
                border: 1px solid #ccc;
                background: white;
                border-radius: 3px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.2s;
            }
            
            .qde-btn:hover {
                background: #e9e9e9;
                border-color: #999;
            }
            
            .qde-btn.active {
                background: #007bff;
                color: white;
                border-color: #0056b3;
            }
            
            .qde-spacer {
                flex: 1;
            }
            
            .qde-editor {
                display: flex;
                flex: 1;
                overflow: hidden;
            }
            
            .qde-source, .qde-preview {
                flex: 1;
                overflow: auto;
                padding: 16px;
            }
            
            .qde-source {
                border-right: 1px solid #ddd;
            }
            
            .qde-textarea {
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                resize: none;
                font-family: 'Monaco', 'Courier New', monospace;
                font-size: 14px;
                line-height: 1.5;
            }
            
            .qde-preview {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 16px;
                line-height: 1.6;
                outline: none;
                cursor: text;  /* Standard text cursor */
            }
            
            /* Fence-specific styles */
            .qde-svg-container {
                max-width: 100%;
                overflow: auto;
            }
            
            .qde-svg-container svg {
                max-width: 100%;
                height: auto;
            }
            
            .qde-html-container {
                /* HTML containers inherit background */
                margin: 12px 0;
            }
            
            .qde-math-container {
                text-align: center;
                margin: 16px 0;
                overflow-x: auto;
            }
            
            /* All tables in preview (both regular markdown and CSV) */
            .qde-preview table {
                width: 100%;
                border-collapse: collapse;
                margin: 12px 0;
                font-size: 14px;
            }
            
            .qde-preview table th,
            .qde-preview table td {
                border: 1px solid #ddd;
                padding: 8px;
            }
            
            /* Support for alignment classes from quikdown */
            .qde-preview .quikdown-left { text-align: left; }
            .qde-preview .quikdown-center { text-align: center; }
            .qde-preview .quikdown-right { text-align: right; }
            
            .qde-preview table th {
                background: #f5f5f5;
                font-weight: bold;
            }
            
            .qde-preview table tr:nth-child(even) {
                background: #f9f9f9;
            }
            
            /* Specific to CSV-generated tables */
            .qde-data-table {
                /* Can add specific CSV table styles here if needed */
            }
            
            .qde-json {
                /* Let highlight.js handle styling */
                overflow-x: auto;
            }
            
            .qde-error {
                background: #fee;
                border: 1px solid #fcc;
                color: #c00;
                padding: 8px;
                border-radius: 4px;
                font-family: monospace;
                font-size: 12px;
            }
            
            /* Read-only complex fence blocks in preview */
            .qde-preview [contenteditable="false"] {
                cursor: auto;  /* Use automatic cursor (arrow for non-text) */
                user-select: text;
                position: relative;
            }
            
            /* Ensure proper cursor for editable text elements */
            .qde-preview p,
            .qde-preview h1,
            .qde-preview h2,
            .qde-preview h3,
            .qde-preview h4,
            .qde-preview h5,
            .qde-preview h6,
            .qde-preview li,
            .qde-preview td,
            .qde-preview th,
            .qde-preview blockquote,
            .qde-preview pre[contenteditable="true"],
            .qde-preview code[contenteditable="true"] {
                cursor: text;
            }
            
            
            /* Non-editable complex renderers */
            .qde-preview .qde-svg-container[contenteditable="false"],
            .qde-preview .qde-html-container[contenteditable="false"],
            .qde-preview .qde-math-container[contenteditable="false"],
            .qde-preview .mermaid[contenteditable="false"] {
                opacity: 0.98;
            }
            
            /* Subtle hover effect for read-only blocks */
            .qde-preview [contenteditable="false"]:hover::after {
                content: "Read-only";
                position: absolute;
                top: 2px;
                right: 2px;
                font-size: 10px;
                color: #999;
                background: rgba(255, 255, 255, 0.9);
                padding: 2px 4px;
                border-radius: 2px;
                pointer-events: none;
            }
            
            /* Fix list padding in preview */
            .qde-preview ul,
            .qde-preview ol {
                padding-left: 2em;
                margin: 0.5em 0;
            }
            
            .qde-preview li {
                margin: 0.25em 0;
            }
            
            /* Mode-specific visibility */
            .qde-mode-source .qde-preview { display: none; }
            .qde-mode-source .qde-source { border-right: none; }
            .qde-mode-preview .qde-source { display: none; }
            .qde-mode-split .qde-source,
            .qde-mode-split .qde-preview { display: block; }
            
            /* Dark theme */
            .qde-dark {
                background: #1e1e1e;
                color: #e0e0e0;
            }
            
            .qde-dark .qde-toolbar {
                background: #2d2d2d;
                border-color: #444;
            }
            
            .qde-dark .qde-btn {
                background: #3a3a3a;
                color: #e0e0e0;
                border-color: #555;
            }
            
            .qde-dark .qde-btn:hover {
                background: #4a4a4a;
            }
            
            .qde-dark .qde-source {
                border-color: #444;
            }
            
            .qde-dark .qde-textarea {
                background: #1e1e1e;
                color: #e0e0e0;
            }
            
            .qde-dark .qde-preview {
                background: #1e1e1e;
                color: #e0e0e0;
            }
            
            /* Dark mode table styles */
            .qde-dark .qde-preview table th,
            .qde-dark .qde-preview table td {
                border-color: #3a3a3a;
            }
            
            .qde-dark .qde-preview table th {
                background: #2d2d2d;
            }
            
            .qde-dark .qde-preview table tr:nth-child(even) {
                background: #252525;
            }
            
            /* Mobile responsive */
            @media (max-width: 768px) {
                .qde-mode-split .qde-editor {
                    flex-direction: column;
                }
                
                .qde-mode-split .qde-source {
                    border-right: none;
                    border-bottom: 1px solid #ddd;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    /**
     * Attach event listeners
     */
    attachEvents() {
        // Source textarea input
        this.sourceTextarea.addEventListener('input', () => {
            this.handleSourceInput();
        });
        
        // Preview contenteditable input
        this.previewPanel.addEventListener('input', () => {
            this.handlePreviewInput();
        });
        
        // Toolbar buttons
        if (this.toolbar) {
            this.toolbar.addEventListener('click', (e) => {
                const btn = e.target.closest('.qde-btn');
                if (!btn) return;
                
                if (btn.dataset.mode) {
                    this.setMode(btn.dataset.mode);
                } else if (btn.dataset.action) {
                    this.handleAction(btn.dataset.action);
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1':
                        e.preventDefault();
                        this.setMode('source');
                        break;
                    case '2':
                        e.preventDefault();
                        this.setMode('split');
                        break;
                    case '3':
                        e.preventDefault();
                        this.setMode('preview');
                        break;
                }
            }
        });
    }
    
    /**
     * Handle source textarea input
     */
    handleSourceInput() {
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.updateFromMarkdown(this.sourceTextarea.value);
        }, this.options.debounceDelay);
    }
    
    /**
     * Handle preview panel input
     */
    handlePreviewInput() {
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(() => {
            this.updateFromHTML();
        }, this.options.debounceDelay);
    }
    
    /**
     * Update from markdown source
     */
    updateFromMarkdown(markdown) {
        this._markdown = markdown || '';
        
        // Show placeholder if empty
        if (!this._markdown.trim()) {
            this._html = '';
            if (this.currentMode !== 'source') {
                this.previewPanel.innerHTML = '<div style="color: #999; font-style: italic; padding: 16px;">Start typing markdown in the source panel...</div>';
            }
        } else {
            this._html = quikdown_bd(markdown, {
                fence_plugin: this.createFencePlugin(),
                lazy_linefeeds: this.options.lazy_linefeeds,
                inline_styles: this.options.inline_styles
            });
            
            // Update preview if visible
            if (this.currentMode !== 'source') {
                this.previewPanel.innerHTML = this._html;
                // Make all fence blocks non-editable
                this.makeFencesNonEditable();
                
                // Process all math elements with MathJax if loaded (like squibview)
                if (window.MathJax && window.MathJax.typesetPromise) {
                    const mathElements = this.previewPanel.querySelectorAll('.math-display');
                    if (mathElements.length > 0) {
                        mathElements.forEach(el => {
                        });
                        window.MathJax.typesetPromise(Array.from(mathElements))
                            .then(() => {
                                mathElements.forEach(el => {
                                    el.querySelector('mjx-container');
                                });
                            })
                            .catch(err => {
                                console.warn('MathJax batch processing failed:', err);
                            });
                    }
                }
            }
        }
        
        // Trigger change event
        if (this.options.onChange) {
            this.options.onChange(this._markdown, this._html);
        }
    }
    
    /**
     * Update from HTML preview
     */
    updateFromHTML() {
        // Clone the preview panel to avoid modifying the actual DOM
        const clonedPanel = this.previewPanel.cloneNode(true);
        
        // Pre-process special elements on the clone
        this.preprocessSpecialElements(clonedPanel);
        
        this._html = this.previewPanel.innerHTML;
        this._markdown = quikdown_bd.toMarkdown(clonedPanel, {
            fence_plugin: this.createFencePlugin()
        });
        
        // Update source if visible
        if (this.currentMode !== 'preview') {
            this.sourceTextarea.value = this._markdown;
        }
        
        // Trigger change event
        if (this.options.onChange) {
            this.options.onChange(this._markdown, this._html);
        }
    }
    
    /**
     * Pre-process special elements before markdown conversion
     */
    preprocessSpecialElements(panel) {
        if (!panel) return;
        
        // Restore non-editable complex fences from their data attributes
        const complexFences = panel.querySelectorAll('[contenteditable="false"][data-qd-source]');
        complexFences.forEach(element => {
            const source = element.getAttribute('data-qd-source');
            const fence = element.getAttribute('data-qd-fence') || '```';
            const lang = element.getAttribute('data-qd-lang') || '';
            
            // Create a pre element with the original source
            const pre = document.createElement('pre');
            pre.setAttribute('data-qd-fence', fence);
            if (lang) pre.setAttribute('data-qd-lang', lang);
            const code = document.createElement('code');
            // The source is already the original unescaped content when using setAttribute
            // No need to unescape since browser handles it automatically
            code.textContent = source;
            pre.appendChild(code);
            
            // Replace the complex element with pre
            element.parentNode.replaceChild(pre, element);
        });
        
        // Convert CSV tables back to CSV fence blocks (these ARE editable)
        const csvTables = panel.querySelectorAll('table.qde-csv-table[data-qd-lang]');
        csvTables.forEach(table => {
            const lang = table.getAttribute('data-qd-lang');
            if (!lang || !['csv', 'psv', 'tsv'].includes(lang)) return;
            
            const delimiter = lang === 'csv' ? ',' : lang === 'psv' ? '|' : '\t';
            
            // Extract data from table
            let csv = '';
            
            // Get headers
            const headers = [];
            const headerCells = table.querySelectorAll('thead th');
            headerCells.forEach(th => {
                const text = th.textContent.trim();
                // Quote if contains delimiter or quotes
                const needsQuoting = text.includes(delimiter) || text.includes('"') || text.includes('\n');
                headers.push(needsQuoting ? `"${text.replace(/"/g, '""')}"` : text);
            });
            csv += headers.join(delimiter) + '\n';
            
            // Get rows
            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(tr => {
                const cells = [];
                tr.querySelectorAll('td').forEach(td => {
                    const text = td.textContent.trim();
                    const needsQuoting = text.includes(delimiter) || text.includes('"') || text.includes('\n');
                    cells.push(needsQuoting ? `"${text.replace(/"/g, '""')}"` : text);
                });
                csv += cells.join(delimiter) + '\n';
            });
            
            // Create a pre element with the CSV data
            const pre = document.createElement('pre');
            pre.setAttribute('data-qd-fence', '```');
            pre.setAttribute('data-qd-lang', lang);
            const code = document.createElement('code');
            code.textContent = csv.trim();
            pre.appendChild(code);
            
            // Replace table with pre
            table.parentNode.replaceChild(pre, table);
        });
    }
    
    /**
     * Create fence plugin for syntax highlighting
     */
    createFencePlugin() {
        const render = (code, lang) => {
            // Check custom fences first (they take precedence)
            if (this.options.customFences && this.options.customFences[lang]) {
                try {
                    return this.options.customFences[lang](code, lang);
                } catch (err) {
                    console.error(`Custom fence plugin error for ${lang}:`, err);
                    return `<pre><code class="language-${lang}">${this.escapeHtml(code)}</code></pre>`;
                }
            }
            
            // For bidirectional editing, only apply syntax highlighting
            // Skip complex transformations that break round-trip conversion
            const skipComplexRendering = !this.options.enableComplexFences;
            
            if (!skipComplexRendering) {
                // Built-in lazy loading fence handlers (disabled for now)
                switch(lang) {
                    case 'svg':
                        return this.renderSVG(code);
                        
                    case 'html':
                        return this.renderHTML(code);
                        
                    case 'math':
                    case 'tex':
                    case 'latex':
                        return this.renderMath(code, lang);
                        
                    case 'csv':
                    case 'psv':
                    case 'tsv':
                        return this.renderTable(code, lang);
                        
                    case 'json':
                    case 'json5':
                        return this.renderJSON(code, lang);
                        
                    case 'katex':  // Use MathJax for katex fence blocks (backward compatibility)
                        return this.renderMath(code, 'katex');
                        
                    case 'mermaid':
                        if (window.mermaid) {
                            return this.renderMermaid(code);
                        }
                        break;
                        
                    case 'geojson':
                        return this.renderGeoJSON(code);
                        
                    case 'stl':
                        return this.renderSTL(code);
                }
            }
            
            // Syntax highlighting support - keep editable for bidirectional
            if (window.hljs && lang && hljs.getLanguage(lang)) {
                const highlighted = hljs.highlight(code, { language: lang }).value;
                // Don't add contenteditable="false" - the bidirectional system can extract text from the highlighted code
                return `<pre data-qd-fence="\`\`\`" data-qd-lang="${lang}"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
            }
            
            // Default: let quikdown handle it
            return undefined;
        };
        
        // Reverse function to extract raw source from rendered HTML
        const reverse = (element) => {
            // Get the language from data attribute
            const lang = element.getAttribute('data-qd-lang') || '';
            let content = '';
            
            // For syntax-highlighted code, extract the raw text
            if (element.querySelector('code.hljs')) {
                const code = element.querySelector('code.hljs');
                content = code.textContent || code.innerText || '';
            }
            // For other code blocks, just get the text content
            else if (element.querySelector('code')) {
                const codeEl = element.querySelector('code');
                content = codeEl.textContent || codeEl.innerText || '';
            }
            // Fallback to element text
            else {
                content = element.textContent || element.innerText || '';
            }
            
            // Return in the format quikdown_bd expects
            return {
                content: content,
                lang: lang,
                fence: '```'
            };
        };
        
        // Return object format for v1.1.0 API with both render and reverse
        return { render, reverse };
    }
    
    /**
     * Render SVG content
     */
    renderSVG(code) {
        try {
            // Basic SVG validation
            const parser = new DOMParser();
            const doc = parser.parseFromString(code, 'image/svg+xml');
            const parseError = doc.querySelector('parsererror');
            
            if (parseError) {
                throw new Error('Invalid SVG');
            }
            
            // Sanitize SVG by removing script tags and event handlers
            const svg = doc.documentElement;
            svg.querySelectorAll('script').forEach(el => el.remove());
            
            // Remove event handlers
            const walker = document.createTreeWalker(svg, NodeFilter.SHOW_ELEMENT);
            let node;
            while (node = walker.nextNode()) {
                for (let i = node.attributes.length - 1; i >= 0; i--) {
                    const attr = node.attributes[i];
                    if (attr.name.startsWith('on') || attr.value.includes('javascript:')) {
                        node.removeAttribute(attr.name);
                    }
                }
            }
            
            // Create container element programmatically to avoid attribute escaping issues
            const container = document.createElement('div');
            container.className = 'qde-svg-container';
            container.contentEditable = 'false';
            container.setAttribute('data-qd-fence', '```');
            container.setAttribute('data-qd-lang', 'svg');
            container.setAttribute('data-qd-source', code);  // No escaping needed when using setAttribute!
            container.innerHTML = new XMLSerializer().serializeToString(svg);
            
            // Return the HTML string
            return container.outerHTML;
        } catch (err) {
            const errorContainer = document.createElement('pre');
            errorContainer.className = 'qde-error';
            errorContainer.contentEditable = 'false';
            errorContainer.setAttribute('data-qd-fence', '```');
            errorContainer.setAttribute('data-qd-lang', 'svg');
            errorContainer.textContent = `Invalid SVG: ${err.message}`;
            return errorContainer.outerHTML;
        }
    }
    
    /**
     * Render HTML content with DOMPurify if available
     */
    renderHTML(code) {
        const id = `html-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // If DOMPurify is loaded, use it
        if (window.DOMPurify) {
            const clean = DOMPurify.sanitize(code);
            
            // Create container programmatically
            const container = document.createElement('div');
            container.className = 'qde-html-container';
            container.contentEditable = 'false';
            container.setAttribute('data-qd-fence', '```');
            container.setAttribute('data-qd-lang', 'html');
            container.setAttribute('data-qd-source', code);
            container.innerHTML = clean;
            
            return container.outerHTML;
        }
        
        // Try to lazy load DOMPurify
        this.lazyLoadLibrary(
            'DOMPurify',
            () => window.DOMPurify,
            'https://unpkg.com/dompurify/dist/purify.min.js'
        ).then(loaded => {
            if (loaded) {
                const element = document.getElementById(id);
                if (element) {
                    const clean = DOMPurify.sanitize(code);
                    element.innerHTML = clean;
                    // Update attributes after loading
                    element.setAttribute('data-qd-source', code);
                    element.setAttribute('data-qd-fence', '```');
                    element.setAttribute('data-qd-lang', 'html');
                }
            }
        });
        
        // Return placeholder with bidirectional attributes - non-editable
        const placeholder = document.createElement('div');
        placeholder.id = id;
        placeholder.className = 'qde-html-container';
        placeholder.contentEditable = 'false';
        placeholder.setAttribute('data-qd-fence', '```');
        placeholder.setAttribute('data-qd-lang', 'html');
        placeholder.setAttribute('data-qd-source', code);
        const pre = document.createElement('pre');
        pre.textContent = code;
        placeholder.appendChild(pre);
        
        return placeholder.outerHTML;
    }
    
    /**
     * Render math with MathJax (SVG output for better copy support)
     */
    renderMath(code, lang) {
        const id = `math-${Math.random().toString(36).substring(2, 15)}`;
        
        // Create container exactly like squibview
        const container = document.createElement('div');
        container.id = id;
        container.className = 'math-display';
        container.contentEditable = 'false';
        container.setAttribute('data-source-type', 'math');
        
        // Format content for MathJax (display mode with $$) - exactly like squibview
        const singleLineContent = code.replace(/\r?\n/g, ' ').replace(/\s+/g, ' ').trim();
        container.textContent = `$$${singleLineContent}$$`;
        
        // Add centering style
        container.style.textAlign = 'center';
        container.style.margin = '1em 0';
        
        
        // Ensure MathJax will be loaded (if not already)
        if (!window.MathJax || !window.MathJax.typesetPromise) {
            this.ensureMathJaxLoaded();
        }
        
        // MathJax will be processed in batch after preview update
        return container.outerHTML;
    }
    
    /**
     * Ensures MathJax is loaded (but doesn't process elements)
     */
    ensureMathJaxLoaded() {
        if (typeof window.MathJax === 'undefined' && !window.mathJaxLoading) {
            window.mathJaxLoading = true;
            
            // Configure MathJax before loading
            if (!window.MathJax) {
                window.MathJax = {
                    loader: { load: ['input/tex', 'output/svg'] },
                    tex: { 
                        packages: { '[+]': ['ams'] },
                        inlineMath: [['$', '$'], ['\\(', '\\)']],
                        displayMath: [['$$', '$$'], ['\\[', '\\]']],
                        processEscapes: true,
                        processEnvironments: true
                    },
                    options: {
                        renderActions: { addMenu: [] },
                        ignoreHtmlClass: 'tex2jax_ignore',
                        processHtmlClass: 'tex2jax_process'
                    },
                    svg: {
                        fontCache: 'none'  // Important: self-contained SVGs for copy
                    },
                    startup: { typeset: false }
                };
            }
            
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-svg.js';
            script.async = true;
            script.onload = () => {
                window.mathJaxLoading = false;
                
                // Process any existing math elements (like squibview)
                if (window.MathJax && window.MathJax.typesetPromise) {
                    const mathElements = document.querySelectorAll('.math-display');
                    if (mathElements.length > 0) {
                        window.MathJax.typesetPromise(Array.from(mathElements)).catch(err => {
                            console.warn('Initial MathJax processing failed:', err);
                        });
                    }
                }
            };
            script.onerror = () => {
                window.mathJaxLoading = false;
                console.error('Failed to load MathJax');
            };
            document.head.appendChild(script);
        }
    }
    
    /**
     * Render CSV/PSV/TSV as HTML table
     */
    renderTable(code, lang) {
        const escapedCode = this.escapeHtml(code);
        try {
            const delimiter = lang === 'csv' ? ',' : lang === 'psv' ? '|' : '\t';
            const lines = code.trim().split('\n');
            
            if (lines.length === 0) {
                return `<pre data-qd-fence="\`\`\`" data-qd-lang="${lang}" data-qd-source="${escapedCode}">${escapedCode}</pre>`;
            }
            
            // CSV tables CAN be editable - we'll convert HTML table back to CSV
            // Don't need data-qd-source since we convert the table structure back to CSV
            let html = `<table class="qde-data-table qde-csv-table" data-qd-fence="\`\`\`" data-qd-lang="${lang}">`;
            
            // Parse header
            const header = this.parseCSVLine(lines[0], delimiter);
            html += '<thead><tr>';
            header.forEach(cell => {
                html += `<th>${this.escapeHtml(cell.trim())}</th>`;
            });
            html += '</tr></thead>';
            
            // Parse body
            if (lines.length > 1) {
                html += '<tbody>';
                for (let i = 1; i < lines.length; i++) {
                    const row = this.parseCSVLine(lines[i], delimiter);
                    html += '<tr>';
                    row.forEach(cell => {
                        html += `<td>${this.escapeHtml(cell.trim())}</td>`;
                    });
                    html += '</tr>';
                }
                html += '</tbody>';
            }
            
            html += '</table>';
            return html;
        } catch (err) {
            return `<pre data-qd-fence="\`\`\`" data-qd-lang="${lang}" data-qd-source="${escapedCode}">${escapedCode}</pre>`;
        }
    }
    
    /**
     * Parse CSV line handling quoted values
     */
    parseCSVLine(line, delimiter) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }
    
    /**
     * Render JSON with syntax highlighting
     */
    renderJSON(code, lang) {
        // If highlight.js is available, use it for all JSON
        if (window.hljs && hljs.getLanguage('json')) {
            try {
                // Try to format if valid JSON
                let toHighlight = code;
                try {
                    const data = JSON.parse(code);
                    toHighlight = JSON.stringify(data, null, 2);
                } catch (e) {
                    // Use original if not valid JSON
                }
                
                const highlighted = hljs.highlight(toHighlight, { language: 'json' }).value;
                return `<pre class="qde-json" data-qd-fence="\`\`\`" data-qd-lang="${lang}"><code class="hljs language-json">${highlighted}</code></pre>`;
            } catch (e) {
                // Fall through if highlighting fails
            }
        }
        
        // No highlighting available - return plain
        return `<pre class="qde-json" data-qd-fence="\`\`\`" data-qd-lang="${lang}">${this.escapeHtml(code)}</pre>`;
    }
    
    /**
     * Render GeoJSON map
     */
    renderGeoJSON(code) {
        // Generate unique map ID (following SquibView pattern)
        const mapId = `map-${Math.random().toString(36).substr(2, 15)}`;
        
        // Function to render the map
        const renderMap = () => {
            const container = document.getElementById(mapId + '-container');
            if (!container || !window.L) return;
            
            try {
                const data = JSON.parse(code);
                
                // Clear container and set deterministic size for rasterization
                const mapDiv = document.createElement('div');
                mapDiv.id = mapId;
                mapDiv.style.cssText = 'width: 100%; height: 300px;';
                container.innerHTML = '';
                container.appendChild(mapDiv);
                
                // Create the map
                const map = L.map(mapId);
                
                // Store back-reference for capture (per Gem's guide)
                container._map = map; // Avoid window pollution
                
                // Add tile layer with CORS support
                const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '',
                    crossOrigin: 'anonymous' // Important for canvas capture
                });
                tileLayer.addTo(map);
                
                // Add GeoJSON layer
                const geoJsonLayer = L.geoJSON(data);
                geoJsonLayer.addTo(map);
                
                // Fit bounds if valid
                if (geoJsonLayer.getBounds().isValid()) {
                    map.fitBounds(geoJsonLayer.getBounds());
                } else {
                    map.setView([0, 0], 2);
                }
                
                // Store references for copy-time capture
                container._tileLayer = tileLayer;
                container._geoJsonLayer = geoJsonLayer;
                
                // Optional: Wait for tiles to load for better capture
                tileLayer.on('load', () => {
                    container.setAttribute('data-tiles-loaded', 'true');
                });
                
            } catch (err) {
                container.innerHTML = `<pre class="qde-error">GeoJSON error: ${this.escapeHtml(err.message)}</pre>`;
            }
        };
        
        // Check if Leaflet is already loaded
        if (window.L) {
            // Render after DOM update
            setTimeout(renderMap, 0);
        } else {
            // Lazy load Leaflet only if not already loading
            if (!window._qde_leaflet_loading) {
                window._qde_leaflet_loading = this.lazyLoadLibrary(
                    'Leaflet',
                    () => window.L,
                    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
                    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
                ).catch(err => {
                    console.warn('Failed to load Leaflet:', err);
                    // Clear the loading promise so it can be retried
                    window._qde_leaflet_loading = null;
                    return false;
                });
            }
            
            window._qde_leaflet_loading.then(loaded => {
                if (loaded) {
                    renderMap();
                } else {
                    const element = document.getElementById(id);
                    if (element) {
                        element.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Failed to load map library</div>';
                    }
                }
            }).catch(() => {
                // Error already handled above
            });
        }
        
        // Return container following SquibView pattern
        const container = document.createElement('div');
        container.className = 'geojson-container';
        container.id = mapId + '-container';
        container.style.cssText = 'width: 100%; height: 300px; border: 1px solid #ddd; border-radius: 4px; margin: 0.5em 0; background: #f0f0f0;';
        container.contentEditable = 'false';
        
        // Preserve source for copy-time identification (per Gem's guide)
        container.setAttribute('data-source-type', 'geojson');
        container.setAttribute('data-original-source', this.escapeHtml(code));
        
        // For bidirectional editing
        container.setAttribute('data-qd-fence', '```');
        container.setAttribute('data-qd-lang', 'geojson');
        container.setAttribute('data-qd-source', code);
        
        container.textContent = 'Loading map...';
        
        return container.outerHTML;
    }
    
    /**
     * Render STL 3D model
     */
    renderSTL(code) {
        const id = `qde-stl-viewer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // Function to render the 3D model
        const render3D = () => {
            const element = document.getElementById(id);
            if (!element) return;
            
            // Check if Three.js is available
            if (typeof window.THREE === 'undefined') {
                element.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Three.js library not loaded. Add &lt;script src="https://unpkg.com/three@0.147.0/build/three.min.js"&gt;&lt;/script&gt; to your HTML.</div>';
                return;
            }
            
            try {
                const THREE = window.THREE;
                
                // Create scene
                const scene = new THREE.Scene();
                scene.background = new THREE.Color(0xf0f0f0);
                
                // Create camera
                const camera = new THREE.PerspectiveCamera(75, element.clientWidth / 400, 0.1, 1000);
                
                // Create renderer
                const renderer = new THREE.WebGLRenderer({ antialias: true });
                renderer.setSize(element.clientWidth, 400);
                element.innerHTML = '';
                element.appendChild(renderer.domElement);
                
                // Store Three.js references for copy functionality (like squibview)
                element._threeScene = scene;
                element._threeCamera = camera;
                element._threeRenderer = renderer;
                
                // Parse STL data (ASCII format)
                const geometry = this.parseSTL(code);
                const material = new THREE.MeshLambertMaterial({ color: 0x0066ff });
                const mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);
                
                // Add lighting
                const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
                scene.add(ambientLight);
                
                const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
                directionalLight.position.set(1, 1, 1).normalize();
                scene.add(directionalLight);
                
                // Position camera based on object bounds
                const box = new THREE.Box3().setFromObject(mesh);
                const center = box.getCenter(new THREE.Vector3());
                const size = box.getSize(new THREE.Vector3());
                const maxDim = Math.max(size.x, size.y, size.z);
                
                camera.position.set(center.x + maxDim, center.y + maxDim, center.z + maxDim);
                camera.lookAt(center);
                
                // Animate
                const animate = () => {
                    requestAnimationFrame(animate);
                    mesh.rotation.y += 0.01;
                    renderer.render(scene, camera);
                };
                animate();
            } catch (err) {
                console.error('STL rendering error:', err);
                element.innerHTML = `<pre class="qde-error">STL error: ${this.escapeHtml(err.message)}</pre>`;
            }
        };
        
        // Render after DOM update
        setTimeout(render3D, 0);
        
        // Return placeholder with data-stl-id for copy functionality
        return `<div id="${id}" class="qde-stl-container" data-stl-id="${id}" data-qd-fence="\`\`\`" data-qd-lang="stl" data-qd-source="${this.escapeHtml(code)}" contenteditable="false" style="height: 400px; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">Loading 3D model...</div>`;
    }
    
    /**
     * Parse ASCII STL format
     * @param {string} stlData - The STL file content
     * @returns {THREE.BufferGeometry} - The parsed geometry
     */
    parseSTL(stlData) {
        const THREE = window.THREE;
        const geometry = new THREE.BufferGeometry();
        const vertices = [];
        const normals = [];
        
        const lines = stlData.split('\n');
        let currentNormal = null;
        
        for (let line of lines) {
            line = line.trim();
            
            if (line.startsWith('facet normal')) {
                const parts = line.split(/\s+/);
                currentNormal = [parseFloat(parts[2]), parseFloat(parts[3]), parseFloat(parts[4])];
            } else if (line.startsWith('vertex')) {
                const parts = line.split(/\s+/);
                vertices.push(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3]));
                if (currentNormal) {
                    normals.push(currentNormal[0], currentNormal[1], currentNormal[2]);
                }
            }
        }
        
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
        
        return geometry;
    }
    
    /**
     * Render Mermaid diagram
     */
    renderMermaid(code) {
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setTimeout(() => {
            const element = document.getElementById(id);
            if (element && window.mermaid) {
                mermaid.render(id + '-svg', code).then(result => {
                    element.innerHTML = result.svg;
                }).catch(err => {
                    element.innerHTML = `<pre>Error rendering diagram: ${err.message}</pre>`;
                });
            }
        }, 0);
        
        // Create container programmatically
        const container = document.createElement('div');
        container.id = id;
        container.className = 'mermaid';
        container.contentEditable = 'false';
        container.setAttribute('data-qd-source', code);
        container.setAttribute('data-qd-fence', '```');
        container.setAttribute('data-qd-lang', 'mermaid');
        container.textContent = 'Loading diagram...';
        
        return container.outerHTML;
    }
    
    /**
     * Escape HTML for attributes
     */
    escapeHtml(text) {
        return (text ?? "").replace(/[&"'<>]/g, m => 
            ({'&':'&amp;','"':'&quot;',"'":'&#39;','<':'&lt;','>':'&gt;'}[m]));
    }
    
    /**
     * Make complex fence blocks non-editable
     */
    makeFencesNonEditable() {
        if (!this.previewPanel) return;
        
        // Only make specific complex fence types non-editable
        // SVG, HTML, Math, Mermaid already have contenteditable="false" set
        // Syntax-highlighted code also has it set
        
        // Don't make regular code blocks or tables non-editable
        // They can be edited and properly round-trip
    }
    
    /**
     * Load plugins dynamically
     */
    async loadPlugins() {
        const promises = [];
        
        // Load highlight.js (check if already loaded)
        if (this.options.plugins.highlightjs && !window.hljs) {
            promises.push(
                this.loadScript('https://unpkg.com/@highlightjs/cdn-assets/highlight.min.js'),
                this.loadCSS('https://unpkg.com/@highlightjs/cdn-assets/styles/github.min.css')
            );
        }
        
        // Load mermaid (check if already loaded)
        if (this.options.plugins.mermaid && !window.mermaid) {
            promises.push(
                this.loadScript('https://unpkg.com/mermaid/dist/mermaid.min.js').then(() => {
                    if (window.mermaid) {
                        mermaid.initialize({ startOnLoad: false });
                    }
                })
            );
        }
        
        await Promise.all(promises);
    }
    
    /**
     * Lazy load library if not already loaded
     */
    async lazyLoadLibrary(name, check, scriptUrl, cssUrl = null) {
        // Check if library is already loaded
        if (check()) {
            return true;
        }
        
        try {
            const promises = [];
            
            // Load script
            if (scriptUrl) {
                promises.push(this.loadScript(scriptUrl));
            }
            
            // Load CSS if provided
            if (cssUrl) {
                promises.push(this.loadCSS(cssUrl));
            }
            
            await Promise.all(promises);
            
            // Verify library loaded
            return check();
        } catch (err) {
            console.error(`Failed to load ${name}:`, err);
            return false;
        }
    }
    
    /**
     * Load external script
     */
    loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }
    
    /**
     * Load external CSS
     */
    loadCSS(href) {
        return new Promise((resolve) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            document.head.appendChild(link);
            // Resolve anyway after timeout (CSS doesn't always fire onload)
            setTimeout(resolve, 1000);
        });
    }
    
    /**
     * Apply theme
     */
    applyTheme() {
        const theme = this.options.theme;
        
        if (theme === 'auto') {
            // Check system preference
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.container.classList.toggle('qde-dark', isDark);
            
            // Listen for changes
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                this.container.classList.toggle('qde-dark', e.matches);
            });
        } else {
            this.container.classList.toggle('qde-dark', theme === 'dark');
        }
    }
    
    /**
     * Set lazy linefeeds option
     * @param {boolean} enabled - Whether to enable lazy linefeeds
     */
    setLazyLinefeeds(enabled) {
        this.options.lazy_linefeeds = enabled;
        // Re-render if we have content
        if (this._markdown) {
            this.updateFromMarkdown(this._markdown);
        }
    }
    
    /**
     * Get lazy linefeeds option
     * @returns {boolean}
     */
    getLazyLinefeeds() {
        return this.options.lazy_linefeeds;
    }
    
    /**
     * Set debounce delay for input updates
     * @param {number} delay - Delay in milliseconds (0 for instant)
     */
    setDebounceDelay(delay) {
        this.options.debounceDelay = Math.max(0, delay);
    }
    
    /**
     * Get current debounce delay
     * @returns {number} Delay in milliseconds
     */
    getDebounceDelay() {
        return this.options.debounceDelay;
    }
    
    /**
     * Set editor mode
     */
    setMode(mode) {
        if (!['source', 'preview', 'split'].includes(mode)) return;
        
        this.currentMode = mode;
        this.container.className = `qde-container qde-mode-${mode}`;
        
        // Update toolbar buttons
        if (this.toolbar) {
            this.toolbar.querySelectorAll('.qde-btn[data-mode]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.mode === mode);
            });
        }
        
        // Apply theme class
        if (this.container.classList.contains('qde-dark')) {
            this.container.classList.add('qde-dark');
        }
        
        // Make fence blocks non-editable when showing preview
        if (mode !== 'source') {
            setTimeout(() => this.makeFencesNonEditable(), 0);
        }
        
        // Trigger mode change event
        if (this.options.onModeChange) {
            this.options.onModeChange(mode);
        }
    }
    
    /**
     * Handle toolbar actions
     */
    handleAction(action) {
        switch(action) {
            case 'copy-markdown':
                this.copy('markdown');
                break;
            case 'copy-html':
                this.copy('html');
                break;
            case 'copy-rendered':
                this.copyRendered();
                break;
            case 'remove-hr':
                this.removeHR();
                break;
        }
    }
    
    /**
     * Copy content to clipboard
     */
    async copy(type) {
        const content = type === 'markdown' ? this._markdown : this._html;
        
        try {
            await navigator.clipboard.writeText(content);
            
            // Visual feedback
            const btn = this.toolbar.querySelector(`[data-action="copy-${type}"]`);
            if (btn) {
                const originalText = btn.textContent;
                btn.textContent = 'Copied!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 1500);
            }
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
    
    // Public API
    
    /**
     * Get current markdown
     */
    get markdown() {
        return this._markdown;
    }
    
    /**
     * Set markdown content
     */
    set markdown(value) {
        this.setMarkdown(value);
    }
    
    /**
     * Get current HTML
     */
    get html() {
        return this._html;
    }
    
    /**
     * Get current mode
     */
    get mode() {
        return this.currentMode;
    }
    
    /**
     * Set markdown content
     */
    async setMarkdown(markdown) {
        // Wait for initialization if needed
        if (this.initPromise) {
            await this.initPromise;
        }
        
        this._markdown = markdown;
        if (this.sourceTextarea) {
            this.sourceTextarea.value = markdown;
        }
        this.updateFromMarkdown(markdown);
    }
    
    /**
     * Get markdown content
     */
    getMarkdown() {
        return this._markdown;
    }
    
    /**
     * Get HTML content
     */
    getHTML() {
        return this._html;
    }
    
    /**
     * Remove all horizontal rules (---) from markdown
     */
    async removeHR() {
        // Remove standalone HR lines (3 or more dashes/underscores/asterisks)
        // Matches: ---, ___, ***, ----, etc. with optional spaces
        const cleaned = this._markdown
            .split('\n')
            .filter(line => {
                // Keep lines that aren't just HR patterns
                const trimmed = line.trim();
                // Match HR patterns: 3+ of -, _, or * with optional spaces between
                return !(/^[-_*](\s*[-_*]){2,}\s*$/.test(trimmed));
            })
            .join('\n');
        
        // Update the markdown
        await this.setMarkdown(cleaned);
        
        // Visual feedback if toolbar button exists
        const btn = this.toolbar?.querySelector('[data-action="remove-hr"]');
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Removed!';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 1500);
        }
    }
    
    /**
     * Copy rendered content as rich text
     */
    async copyRendered() {
        try {
            const result = await getRenderedContent(this.previewPanel);
            if (result.success) {
                // Visual feedback
                const btn = this.toolbar?.querySelector('[data-action="copy-rendered"]');
                if (btn) {
                    const originalText = btn.textContent;
                    btn.textContent = 'Copied!';
                    setTimeout(() => {
                        btn.textContent = originalText;
                    }, 1500);
                }
            }
        } catch (err) {
            console.error('Failed to copy rendered content:', err);
        }
    }
    
    /**
     * Destroy the editor
     */
    destroy() {
        // Clear timers
        clearTimeout(this.updateTimer);
        
        // Clear container
        this.container.innerHTML = '';
        this.container.classList.remove('qde-container', 'qde-dark');
        
        // Remove injected styles (only if no other editors exist)
        const otherEditors = document.querySelectorAll('.qde-container');
        if (otherEditors.length === 0) {
            const style = document.getElementById('qde-styles');
            if (style) style.remove();
        }
    }
}

// Export for CommonJS (needed for bundled ESM to work with Jest)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuikdownEditor;
}

// Also export for UMD builds
if (typeof window !== 'undefined') {
    window.QuikdownEditor = QuikdownEditor;
}

// Subclass that pre-wires quikdown editor (full) as the message formatter.
// The edit build dynamically loads syntax highlighting, math rendering,
// maps, and other processors from CDN on first use.
var quikchatMDFull = /*#__PURE__*/function (_quikchat) {
  function quikchatMDFull(parentElement, onSend) {
    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    _classCallCheck(this, quikchatMDFull);
    if (!options.messageFormatter) {
      options.messageFormatter = function (content) {
        return QuikdownEditor(content);
      };
    }
    return _callSuper(this, quikchatMDFull, [parentElement, onSend, options]);
  }
  _inherits(quikchatMDFull, _quikchat);
  return _createClass(quikchatMDFull);
}(quikchat); // Expose quikdown edit on the class for direct access
quikchatMDFull.quikdown = QuikdownEditor;

export { quikchatMDFull as default };
//# sourceMappingURL=quikchat-md-full.esm.js.map
