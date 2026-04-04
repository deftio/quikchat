
class quikchat {
    /**
     *
     * @param string or DOM element  parentElement
     * @param {*} meta
     */
    constructor(parentElement, onSend = () => { }, options = {}) {
        const defaultOpts = {
            theme: 'quikchat-theme-light',
            trackHistory: true,
            showTimestamps: false,
            titleArea: { title: "Chat", show: false, align: "center" },
            messagesArea: { alternating: true },
        };
        const meta = { ...defaultOpts, ...options }; // merge options with defaults

        if (typeof parentElement === 'string') {
            parentElement = document.querySelector(parentElement);
        }
        this._parentElement = parentElement;
        this._theme = meta.theme;
        this._onSend = onSend ? onSend : () => { }; // call back function for onSend
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

    _createWidget() {
        const widgetHTML =
            `
            <div class="quikchat-base ${this.theme}">
                <div class="quikchat-title-area"></div>
                <div class="quikchat-messages-wrapper"><div class="quikchat-messages-area" role="log" aria-live="polite" aria-label="Chat messages"></div><button class="quikchat-scroll-bottom" aria-label="Scroll to bottom"></button></div>
                <div class="quikchat-input-area">
                    <textarea class="quikchat-input-textbox" rows="1" aria-label="Type a message"></textarea>
                    <button class="quikchat-input-send-btn">Send</button>
                </div>
            </div>
            `;

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
    _attachEventListeners() {
        this._sendButton.addEventListener('click', () => {
            const text = this._textEntry.value.trim();
            if (text === '') return;
            this._onSend(this, text);
        });
        this._textEntry.addEventListener('keydown', (event) => {
            // Check if Shift + Enter is pressed
            if (event.shiftKey && event.keyCode === 13) {
                event.preventDefault();
                const text = this._textEntry.value.trim();
                if (text === '') return;
                this._onSend(this, text);
            }
        });

        // Auto-grow textarea
        this._textEntry.addEventListener('input', () => this._autoGrowTextarea());

        this._messagesArea.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = this._messagesArea;
            this.userScrolledUp = scrollTop + clientHeight < scrollHeight - 1;
            this._updateScrollBottomBtn();
        });

        // Scroll-to-bottom button
        this._scrollBottomBtn.addEventListener('click', () => this.scrollToBottom());

        // Ctrl+End to scroll to bottom
        this._chatWidget.addEventListener('keydown', (event) => {
            if (event.ctrlKey && event.key === 'End') {
                event.preventDefault();
                this.scrollToBottom();
            }
        });

        // Use ResizeObserver to detect parent container resize
        if (typeof ResizeObserver !== 'undefined') {
            this._resizeObserver = new ResizeObserver(() => this._handleContainerResize());
            this._resizeObserver.observe(this._parentElement);
        }
    }

    // set the onSend function callback.
    setCallbackOnSend(callback) {
        this._onSend = callback;
    }
    // set a callback for everytime a message is added (listener)
    setCallbackonMessageAdded(callback) {
        this._onMessageAdded = callback;
    }

    // Public methods
    titleAreaToggle() {
        if (this._titleArea.style.display === 'none') {
            this.titleAreaShow();
        } else {
            this.titleAreaHide();
        }
    }

    titleAreaShow() {
        this._titleArea.style.display = '';
    }

    titleAreaHide() {
        this._titleArea.style.display = 'none';
    }

    titleAreaSetContents(title, align = 'center') {
        this._titleArea.innerHTML = title;
        this._titleArea.style.textAlign = align;
    }

    titleAreaGetContents() {
        return this._titleArea.innerHTML;
    }

    inputAreaToggle() {
        if (this._inputArea.style.display === 'none') {
            this.inputAreaShow();
        } else {
            this.inputAreaHide();
        }
    }

    inputAreaShow() {
        this._inputArea.style.display = '';
    }

    inputAreaHide() {
        this._inputArea.style.display = 'none';
    }

    inputAreaSetEnabled(enabled) {
        this._textEntry.disabled = !enabled;
        this._sendButton.disabled = !enabled;
    }

    inputAreaSetButtonText(text) {
        this._sendButton.textContent = text;
    }

    inputAreaGetButtonText() {
        return this._sendButton.textContent;
    }

    _handleContainerResize() {
        // Layout is handled by CSS flexbox — no JS height calculation needed.
        // This hook exists for future use or custom resize callbacks.
    }

    scrollToBottom() {
        this._messagesArea.scrollTop = this._messagesArea.scrollHeight;
        this.userScrolledUp = false;
        this._updateScrollBottomBtn();
    }

    _updateScrollBottomBtn() {
        if (this.userScrolledUp) {
            this._scrollBottomBtn.classList.add('quikchat-scroll-bottom-visible');
        } else {
            this._scrollBottomBtn.classList.remove('quikchat-scroll-bottom-visible');
        }
    }

    _autoGrowTextarea() {
        const el = this._textEntry;
        el.style.height = 'auto';
        const maxHeight = parseInt(getComputedStyle(el).getPropertyValue('--quikchat-input-max-height')) || 120;
        el.style.height = Math.min(el.scrollHeight, maxHeight) + 'px';
        el.style.overflowY = el.scrollHeight > maxHeight ? 'auto' : 'hidden';
    }

    _formatTimestamp(isoString) {
        const d = new Date(isoString);
        const h = d.getHours();
        const m = String(d.getMinutes()).padStart(2, '0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        return h12 + ':' + m + ' ' + ampm;
    }

    messagesAreaShowTimestamps(show) {
        if (show) {
            this._messagesArea.classList.add('quikchat-show-timestamps');
        } else {
            this._messagesArea.classList.remove('quikchat-show-timestamps');
        }
    }

    messagesAreaShowTimestampsGet() {
        return this._messagesArea.classList.contains('quikchat-show-timestamps');
    }

    messagesAreaShowTimestampsToggle() {
        this._messagesArea.classList.toggle('quikchat-show-timestamps');
    }

    _escapeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    _processContent(content) {
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
    messagesAreaAlternateColors(alt = true) {
        if (alt) {
            this._messagesArea.classList.add('quikchat-messages-area-alt');
        }
        else {
            this._messagesArea.classList.remove('quikchat-messages-area-alt');
        }
        return alt === true;
    }
    messagesAreaAlternateColorsToggle() {
        this._messagesArea.classList.toggle('quikchat-messages-area-alt');
    }
    messagesAreaAlternateColorsGet() {
        return this._messagesArea.classList.contains('quikchat-messages-area-alt');
    }
    // message functions
    messageAddFull(input = { content: "", userString: "user", align: "right", role: "user", userID: -1 }) {
        const msgid = this.msgid;
        const messageDiv = document.createElement('div');
        const msgidClass = 'quikchat-msgid-' + String(msgid).padStart(10, '0');
        messageDiv.classList.add('quikchat-message', msgidClass);
        messageDiv.classList.add('quikchat-role-' + (input.role || 'user'));
        messageDiv.classList.add('quikchat-align-' + (input.align || 'right'));
        this.msgid++;
        messageDiv.classList.add(this._messagesArea.children.length % 2 === 1 ? 'quikchat-message-1' : 'quikchat-message-2');

        const userDiv = document.createElement('div');
        userDiv.classList.add('quikchat-user-label');
        userDiv.style.textAlign = input.align;
        userDiv.innerHTML = input.userString;

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('quikchat-message-content');
        contentDiv.style.textAlign = input.align;
        contentDiv.innerHTML = this._processContent(input.content);

        const timestamp = new Date().toISOString();
        const timestampSpan = document.createElement('span');
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
        const updatedtime = timestamp;

        if (this.trackHistory) {
            this._history.push({ msgid, ...input, timestamp, updatedtime, messageDiv });
            if (this._history.length > this._historyLimit) {
                this._history.shift();
            }
        }

        if (this._onMessageAdded) {
            this._onMessageAdded(this, msgid);
        }

        return msgid;
    }


    messageAddNew(content = "", userString = "user", align = "right", role = "user") {
        return this.messageAddFull(
            { content: content, userString: userString, align: align, role: role }
        );
    }
    messageRemove(n) {
        let success = false;
        try {
            this._messagesArea.removeChild(this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`));
            success = true;
        }
        catch (_error) {
            // Message ID not found
        }
        if (success) {
            this._history.splice(this._history.findIndex((item) => item.msgid === n), 1);
        }
        return success;
    }
    /* returns the message html object from the DOM
    */
    messageGetDOMObject(n) {
        let msg = null;
        try {
            msg = this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`);
        }
        catch (_error) {
            // Message ID not found
        }
        return msg;
    }
    /* returns the message content only
    */
    messageGetContent(n) {
        let content = "";
        try {
            content = this._history.filter((item) => item.msgid === n)[0].content;
        }
        catch (_error) {
            // Message ID not found
        }
        return content;
    }

    /* append message to the message content
    */
    messageAppendContent(n, content) {
        let success = false;
        try {
            const msgEl = this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`);
            const item = this._history.filter((entry) => entry.msgid === n)[0];
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
    messageReplaceContent(n, content) {
        let success = false;
        try {
            const msgEl = this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`);
            const item = this._history.filter((entry) => entry.msgid === n)[0];
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

    messageAddTypingIndicator(userString = '', align = 'left') {
        const msgid = this.messageAddFull({
            content: '',
            userString: userString,
            align: align,
            role: 'assistant',
        });
        const msgEl = this.messageGetDOMObject(msgid);
        msgEl.classList.add('quikchat-typing');
        const contentDiv = msgEl.querySelector('.quikchat-message-content');
        contentDiv.innerHTML = '<span class="quikchat-typing-dots"><span>.</span><span>.</span><span>.</span></span>';
        return msgid;
    }

    setMessageFormatter(formatter) {
        this._messageFormatter = formatter;
    }

    setSanitize(sanitize) {
        this._sanitize = sanitize;
    }

    // history functions
    /**
     *
     * @param {*} n
     * @param {*} m
     * @returns array of history messages
     */
    historyGet(n, m) {
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

    historyClear() {
        this.msgid = 0;
        this._history = [];
    }

    historyGetLength() {
        return this._history.length;
    }

    historyGetMessage(n) {
        if (n >= 0 && n < this._history.length) {
            return this._history[n];
        }
        return {};
    }

    historyGetMessageContent(n) {
        if (n >= 0 && n < this._history.length) {
            return this._history[n].content;
        }
        return "";
    }


    changeTheme(newTheme) {
        this._chatWidget.classList.remove(this._theme);
        this._chatWidget.classList.add(newTheme);
        this._theme = newTheme;
    }

    get theme() {
        return this._theme;
    }

    static version() {
        return { "version": "1.2.0", "license": "BSD-2", "url": "https://github/deftio/quikchat" };
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

    static loremIpsum(numChars, startSpot = undefined, startWithCapitalLetter = true) {
        const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ";

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

        const l = loremText.substring(startSpot) + loremText.substring(0, startSpot);

        let s = "";
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
    };


}

export default quikchat;
