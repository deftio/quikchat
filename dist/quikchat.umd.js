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
    return r && _defineProperties(e.prototype, r), Object.defineProperty(e, "prototype", {
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

  // quikchat.js
  var quikchat = /*#__PURE__*/function () {
    function quikchat(parentElement) {
      var meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
        theme: 'quikchat-theme-light',
        onSend: function onSend() {}
      };
      _classCallCheck(this, quikchat);
      this.parentElement = parentElement;
      this.theme = meta.theme;
      this.onSend = meta.onSend ? meta.onSend : function () {};
      this.createWidget();
      // title area
      if (meta.titleArea) {
        this.titleAreaSet(meta.titleArea.title, meta.titleArea.align);
        if (meta.titleArea.show) {
          this.titleAreaShow();
        } else {
          this.titleAreaHide();
        }
      }
      this.attachEventListeners();
    }
    return _createClass(quikchat, [{
      key: "createWidget",
      value: function createWidget() {
        var widgetHTML = "\n            <div class=\"quikchat-base ".concat(this.theme, "\">\n                <div class=\"quikchat-title-area\">\n                    <span style=\"font-size: 1.5em; font-weight: 600;\">Title Area</span>\n                </div>\n                <div class=\"quikchat-messages-area\"></div>\n                <div class=\"quikchat-input-area\">\n                    <textarea class=\"quikchat-input-textbox\"></textarea>\n                    <button class=\"quikchat-input-send-btn\">Send</button>\n                </div>\n            </div>\n            ");
        this.parentElement.innerHTML = widgetHTML;
        this.chatWidget = this.parentElement.querySelector('.quikchat-base');
        this.titleArea = this.chatWidget.querySelector('.quikchat-title-area');
        this.messagesArea = this.chatWidget.querySelector('.quikchat-messages-area');
        this.inputArea = this.chatWidget.querySelector('.quikchat-input-area');
        this.textEntry = this.inputArea.querySelector('.quikchat-input-textbox');
        this.sendButton = this.inputArea.querySelector('.quikchat-input-send-btn');
      }
    }, {
      key: "attachEventListeners",
      value: function attachEventListeners() {
        var _this = this;
        this.sendButton.addEventListener('click', function () {
          return _this.onSend(_this, _this.textEntry.value.trim());
        });
        window.addEventListener('resize', function () {
          return _this.handleContainerResize();
        });
        this.chatWidget.addEventListener('resize', function () {
          return _this.handleContainerResize();
        });
        this.textEntry.addEventListener('keydown', function (event) {
          // Check if Shift + Enter is pressed
          if (event.shiftKey && event.keyCode === 13) {
            // Prevent default behavior (adding new line)
            event.preventDefault();
            _this.onSend(_this, _this.textEntry.value.trim());
          }
        });
      }
    }, {
      key: "titleAreaToggle",
      value: function titleAreaToggle() {
        this.titleArea.style.display === 'none' ? this.titleAreaShow() : this.titleAreaHide();
      }
    }, {
      key: "titleAreaShow",
      value: function titleAreaShow() {
        this.titleArea.style.display = '';
        this.adjustMessagesAreaHeight();
      }
    }, {
      key: "titleAreaHide",
      value: function titleAreaHide() {
        this.titleArea.style.display = 'none';
        this.adjustMessagesAreaHeight();
      }
    }, {
      key: "titleAreaSet",
      value: function titleAreaSet(title) {
        var align = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'center';
        this.titleArea.textContent = title;
        this.titleArea.style.textAlign = align;
      }
    }, {
      key: "titleAreaGet",
      value: function titleAreaGet() {
        return this.titleArea.textContent;
      }
    }, {
      key: "inputAreaToggle",
      value: function inputAreaToggle() {
        this.inputArea.classList.toggle('hidden');
        this.inputArea.style.display === 'none' ? this.inputAreaShow() : this.inputAreaHide();
      }
    }, {
      key: "inputAreaShow",
      value: function inputAreaShow() {
        this.inputArea.style.display = '';
        this.adjustMessagesAreaHeight();
      }
    }, {
      key: "inputAreaHide",
      value: function inputAreaHide() {
        this.inputArea.style.display = 'none';
        this.adjustMessagesAreaHeight();
      }
    }, {
      key: "adjustMessagesAreaHeight",
      value: function adjustMessagesAreaHeight() {
        var hiddenElements = _toConsumableArray(this.chatWidget.children).filter(function (child) {
          return child.classList.contains('hidden');
        });
        var totalHiddenHeight = hiddenElements.reduce(function (sum, child) {
          return sum + child.offsetHeight;
        }, 0);
        var containerHeight = this.chatWidget.offsetHeight;
        this.messagesArea.style.height = "calc(100% - ".concat(containerHeight - totalHiddenHeight, "px)");
      }
    }, {
      key: "handleContainerResize",
      value: function handleContainerResize() {
        this.adjustMessagesAreaHeight();
        this.adjustSendButtonWidth();
        console.log('Container resized');
      }
    }, {
      key: "adjustSendButtonWidth",
      value: function adjustSendButtonWidth() {
        var sendButtonText = this.sendButton.textContent.trim();
        var fontSize = parseFloat(getComputedStyle(this.sendButton).fontSize);
        var minWidth = fontSize * sendButtonText.length + 16;
        this.sendButton.style.minWidth = "".concat(minWidth, "px");
      }
    }, {
      key: "addMessage",
      value: function addMessage(message) {
        var user = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "foo";
        var align = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'left';
        var messageDiv = document.createElement('div');
        messageDiv.classList.add('quikchat-message');
        messageDiv.classList.add(this.messagesArea.children.length % 2 === 1 ? 'quikchat-message-1' : 'quikchat-message-2');
        var userDiv = document.createElement('div');
        userDiv.textContent = user;
        userDiv.style = "width: 100%; text-align: ".concat(align, "; font-size: 1em; font-weight:700; color: #444;");
        var contentDiv = document.createElement('div');
        contentDiv.style = "width: 100%; text-align: ".concat(align, ";");
        contentDiv.textContent = message;
        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        this.messagesArea.appendChild(messageDiv);
        this.messagesArea.lastChild.scrollIntoView();
        this.textEntry.value = '';
        this.adjustMessagesAreaHeight();
      }
    }, {
      key: "removeMesssage",
      value: function removeMesssage(n) {
        this.messagesArea.removeChild(this.messagesArea.children[n]);
      }
    }, {
      key: "getMessage",
      value: function getMessage(n) {
        return this.messagesArea.children[n].lastChild.textContent;
      }
    }, {
      key: "appendMessage",
      value: function appendMessage(n, message) {
        this.messagesArea.children[n].lastChild.textContent += message;
      }
    }, {
      key: "updateMessage",
      value: function updateMessage(n, message) {
        this.messagesArea.children[n].lastChild.textContent = message;
      }
    }, {
      key: "changeTheme",
      value: function changeTheme(newTheme) {
        this.chatWidget.classList.remove(this.theme);
        this.chatWidget.classList.add(newTheme);
        this.theme = newTheme;
      }
    }]);
  }();

  return quikchat;

}));
//# sourceMappingURL=quikchat.umd.js.map
