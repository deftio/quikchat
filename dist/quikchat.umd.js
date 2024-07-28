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

  var quikchat = /*#__PURE__*/function () {
    /**
     * 
     * @param string or DOM element  parentElement 
     * @param {*} meta 
     */
    function quikchat(parentElement) {
      var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        theme: 'quikchat-theme-light',
        onSend: function onSend() {},
        trackHistory: true,
        titleArea: {
          title: "Title Area",
          show: false,
          align: "center"
        }
      };
      _classCallCheck(this, quikchat);
      if (typeof parentElement === 'string') {
        parentElement = document.querySelector(parentElement);
      }
      this._parentElement = parentElement;
      this._theme = meta.theme;
      this._onSend = meta.onSend ? meta.onSend : function () {};
      this._createWidget();
      // title area
      if (meta.titleArea) {
        this.titleAreaSetContents(meta.titleArea.title, meta.titleArea.align);
        if (meta.titleArea.show == true) {
          this.titleAreaShow();
        } else {
          this.titleAreaHide();
        }
      }
      this._attachEventListeners();
      this.trackHistory = meta.trackHistory || true;
      this._historyLimit = 10000000;
      this._history = [];
    }
    return _createClass(quikchat, [{
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
    }, {
      key: "_attachEventListeners",
      value: function _attachEventListeners() {
        var _this = this;
        this._sendButton.addEventListener('click', function () {
          return _this._onSend(_this, _this._textEntry.value.trim());
        });
        window.addEventListener('resize', function () {
          return _this._handleContainerResize();
        });
        this._chatWidget.addEventListener('resize', function () {
          return _this._handleContainerResize();
        });
        this._textEntry.addEventListener('keydown', function (event) {
          // Check if Shift + Enter is pressed
          if (event.shiftKey && event.keyCode === 13) {
            // Prevent default behavior (adding new line)
            event.preventDefault();
            _this._onSend(_this, _this._textEntry.value.trim());
          }
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

      // Public methods
    }, {
      key: "titleAreaToggle",
      value: function titleAreaToggle() {
        this._titleArea.style.display === 'none' ? this.titleAreaShow() : this.titleAreaHide();
      }
    }, {
      key: "titleAreaShow",
      value: function titleAreaShow() {
        this._titleArea.style.display = '';
        this._adjustMessagesAreaHeight();
      }
    }, {
      key: "titleAreaHide",
      value: function titleAreaHide() {
        this._titleArea.style.display = 'none';
        this._adjustMessagesAreaHeight();
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
        //console.log('Container resized');
      }
    }, {
      key: "_adjustSendButtonWidth",
      value: function _adjustSendButtonWidth() {
        var sendButtonText = this._sendButton.textContent.trim();
        var fontSize = parseFloat(getComputedStyle(this._sendButton).fontSize);
        var minWidth = fontSize * sendButtonText.length + 16;
        this._sendButton.style.minWidth = "".concat(minWidth, "px");
      }
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
        'quikchat-userid-' + String(input.userString).padStart(10, '0'); // hash this..
        messageDiv.classList.add('quikchat-message', msgidClass);
        this.msgid++;
        messageDiv.classList.add(this._messagesArea.children.length % 2 === 1 ? 'quikchat-message-1' : 'quikchat-message-2');
        var userDiv = document.createElement('div');
        userDiv.innerHTML = input.userString;
        userDiv.style = "width: 100%; text-align: ".concat(input.align, "; font-size: 1em; font-weight:700; color: #444;");
        var contentDiv = document.createElement('div');
        contentDiv.style = "width: 100%; text-align: ".concat(input.align, ";");
        contentDiv.innerHTML = input.content;
        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        this._messagesArea.appendChild(messageDiv);
        //this._messagesArea.lastChild.scrollIntoView();
        this._messagesArea.lastElementChild.scrollIntoView();
        this._textEntry.value = '';
        this._adjustMessagesAreaHeight();
        var timestamp = new Date().toISOString();
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
        }
        return sucess;
      }
      /* returns the message html object from the DOM
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

      /* append message to the message content
      */
    }, {
      key: "messageAppendContent",
      value: function messageAppendContent(n, content) {
        var sucess = false;
        try {
          this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0'))).lastChild.innerHTML += content;
          // update history
          var item = this._history.filter(function (item) {
            return item.msgid === n;
          })[0];
          item.content += content;
          item.updatedtime = new Date().toISOString();
          sucess = true;
          //this._messagesArea.lastChild.scrollIntoView();
          this._messagesArea.lastElementChild.scrollIntoView();
        } catch (error) {
          console.log("{String(n)} : Message ID not found");
        }
      }
      /* replace message content
      */
    }, {
      key: "messageReplaceContent",
      value: function messageReplaceContent(n, content) {
        var sucess = false;
        try {
          this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0'))).lastChild.innerHTML = content;
          // update history
          this._history.filter(function (item) {
            return item.msgid === n;
          })[0].content = content;
          sucess = true;
        } catch (error) {
          console.log("{String(n)} : Message ID not found");
        }
        return sucess;
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
          this._history[n];
        }
        return {};
      }
    }, {
      key: "historyGetMessageContent",
      value: function historyGetMessageContent(n) {
        return this._history[n].message;
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
          "version": "1.0.4",
          "license": "BSD-2",
          "url": "https://github/deftio/quikchat"
        };
      }
    }]);
  }();

  return quikchat;

}));
//# sourceMappingURL=quikchat.umd.js.map
