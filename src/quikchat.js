
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
                <div class="quikchat-messages-area" role="log" aria-live="polite" aria-label="Chat messages"></div>
                <div class="quikchat-input-area">
                    <textarea class="quikchat-input-textbox" aria-label="Type a message"></textarea>
                    <button class="quikchat-input-send-btn">Send</button>
                </div>
            </div>
            `;

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
    _attachEventListeners() {
        this._sendButton.addEventListener('click', () => this._onSend(this, this._textEntry.value.trim()));
        this._textEntry.addEventListener('keydown', (event) => {
            // Check if Shift + Enter is pressed
            if (event.shiftKey && event.keyCode === 13) {
                // Prevent default behavior (adding new line)
                event.preventDefault();
                this._onSend(this, this._textEntry.value.trim());
            }
        });

        this._messagesArea.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = this._messagesArea;
            this.userScrolledUp = scrollTop + clientHeight < scrollHeight;
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

    _handleContainerResize() {
        // Layout is handled by CSS flexbox — no JS height calculation needed.
        // This hook exists for future use or custom resize callbacks.
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
        this.msgid++;
        messageDiv.classList.add(this._messagesArea.children.length % 2 === 1 ? 'quikchat-message-1' : 'quikchat-message-2');

        const userDiv = document.createElement('div');
        userDiv.classList.add('quikchat-user-label');
        userDiv.style.textAlign = input.align;
        userDiv.innerHTML = input.userString;

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('quikchat-message-content');
        contentDiv.style.textAlign = input.align;
        contentDiv.innerHTML = input.content;

        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        this._messagesArea.appendChild(messageDiv);

        // Scroll to the last message only if the user is not actively scrolling up
        if (!this.userScrolledUp) {
            this._messagesArea.scrollTop = this._messagesArea.scrollHeight;
        }

        this._textEntry.value = '';
        const timestamp = new Date().toISOString();
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
            this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.innerHTML += content;
            const item = this._history.filter((entry) => entry.msgid === n)[0];
            item.content += content;
            item.updatedtime = new Date().toISOString();
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
            this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.innerHTML = content;
            const item = this._history.filter((entry) => entry.msgid === n)[0];
            item.content = content;
            item.updatedtime = new Date().toISOString();
            success = true;

            if (!this.userScrolledUp) {
                this._messagesArea.scrollTop = this._messagesArea.scrollHeight;
            }
        } catch (_error) {
            // Message ID not found
        }
        return success;
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
            n = 0;
            m = this._history.length;
        }
        if (m === undefined) {
            m = n < 0 ? m : n + 1;
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
        return this._history[n].content;
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
        return { "version": "1.1.4", "license": "BSD-2", "url": "https://github/deftio/quikchat" };
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
