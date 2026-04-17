(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.quikchat = factory());
})(this, (function () { 'use strict';

  function _arrayLikeToArray(r, a) {
    (null == a || a > r.length) && (a = r.length);
    for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
    return n;
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
  function _toPrimitive(t, r) {
    if ("object" != typeof t || !t) return t;
    var e = t[Symbol.toPrimitive];
    if (void 0 !== e) {
      var i = e.call(t, r);
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
          "version": "1.2.5",
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

  return quikchat;

}));
//# sourceMappingURL=quikchat.umd.js.map
