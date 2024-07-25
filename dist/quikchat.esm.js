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
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  function quikchat(parentElement) {
    var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      theme: 'quikchat-theme-light',
      onSend: function onSend() {},
      trackHistory: true
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
      if (meta.titleArea.show) {
        this.titleAreaShow();
      } else {
        this.titleAreaHide();
      }
    }
    this._attachEventListeners();
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
    key: "$",
    value: function $() {}
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
    key: "messageAddNew",
    value: function messageAddNew(message) {
      var user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "foo";
      var align = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left';
      var messageDiv = document.createElement('div');
      var msgid = this.msgid;
      var msgidClass = 'quikchat-msgid-' + String(msgid).padStart(10, '0');
      messageDiv.classList.add('quikchat-message', msgidClass);
      this.msgid++;
      messageDiv.classList.add(this._messagesArea.children.length % 2 === 1 ? 'quikchat-message-1' : 'quikchat-message-2');
      var userDiv = document.createElement('div');
      userDiv.innerHTML = user;
      userDiv.style = "width: 100%; text-align: ".concat(align, "; font-size: 1em; font-weight:700; color: #444;");
      var contentDiv = document.createElement('div');
      contentDiv.style = "width: 100%; text-align: ".concat(align, ";");
      contentDiv.innerHTML = message;
      messageDiv.appendChild(userDiv);
      messageDiv.appendChild(contentDiv);
      this._messagesArea.appendChild(messageDiv);
      this._messagesArea.lastChild.scrollIntoView();
      this._textEntry.value = '';
      this._adjustMessagesAreaHeight();
      return {
        msgid: msgid
      };
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
        content = this._messagesArea.querySelector(".quikchat-msgid-".concat(String(n).padStart(10, '0'))).lastChild.textContent;
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
        sucess = true;
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
        sucess = true;
      } catch (error) {
        console.log("{String(n)} : Message ID not found");
      }
      return sucess;
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
    key: "getVersion",
    value: function getVersion() {
      return {
        "version": "1.0.2"
      };
    }
  }]);
}();

export { quikchat as default };
//# sourceMappingURL=quikchat.esm.js.map
