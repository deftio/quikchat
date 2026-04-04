'use strict';

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
        "version": "1.1.4",
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
