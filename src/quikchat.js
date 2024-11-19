
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
            inputArea: { show: true }
        };
        const meta = { ...defaultOpts, ...options }; // merge options with defaults

        if (typeof parentElement === 'string') {
            parentElement = document.querySelector(parentElement);
        }
        //console.log(parentElement, meta);
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

        // input area
        if (meta.inputArea) {
            if (meta.inputArea.show === true)
                this.inputAreaShow();
            else
                this.inputAreaHide();
        }
        // plumbing
        this._attachEventListeners();
        this.trackHistory = meta.trackHistory || true;
        this._historyLimit = 10000000;
        this._history = [];
    }

    _createWidget() {
        const widgetHTML =
            `
            <div class="quikchat-base ${this.theme}">
                <div class="quikchat-title-area">
                    <span style="font-size: 1.5em; font-weight: 600;">Title Area</span>
                </div>
                <div class="quikchat-messages-area"></div>
                <div class="quikchat-input-area">
                    <textarea class="quikchat-input-textbox"></textarea>
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
        window.addEventListener('resize', () => this._handleContainerResize());
        this._chatWidget.addEventListener('resize', () => this._handleContainerResize());
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
        this._titleArea.style.display === 'none' ? this.titleAreaShow() : this.titleAreaHide();
    }

    titleAreaShow() {
        this._titleArea.style.display = '';
        this._adjustMessagesAreaHeight();
    }

    titleAreaHide() {
        this._titleArea.style.display = 'none';
        this._adjustMessagesAreaHeight();
    }

    titleAreaSetContents(title, align = 'center') {
        this._titleArea.innerHTML = title;
        this._titleArea.style.textAlign = align;
    }

    titleAreaGetContents() {
        return this._titleArea.innerHTML;
    }

    inputAreaToggle() {
        this._inputArea.classList.toggle('hidden');
        this._inputArea.style.display === 'none' ? this.inputAreaShow() : this.inputAreaHide();
    }

    inputAreaShow() {
        this._inputArea.style.display = '';
        this._adjustMessagesAreaHeight();
    }

    inputAreaHide() {
        this._inputArea.style.display = 'none';
        this._adjustMessagesAreaHeight();
    }

    _adjustMessagesAreaHeight() {
        const hiddenElements = [...this._chatWidget.children].filter(child => child.classList.contains('hidden'));
        const totalHiddenHeight = hiddenElements.reduce((sum, child) => sum + child.offsetHeight, 0);
        const containerHeight = this._chatWidget.offsetHeight;
        this._messagesArea.style.height = `calc(100% - ${containerHeight - totalHiddenHeight}px)`;
    }

    _handleContainerResize() {
        this._adjustMessagesAreaHeight();
        this._adjustSendButtonWidth();
        return true;
    }

    _adjustSendButtonWidth() {
        const sendButtonText = this._sendButton.textContent.trim();
        const fontSize = parseFloat(getComputedStyle(this._sendButton).fontSize);
        const minWidth = fontSize * sendButtonText.length + 16;
        this._sendButton.style.minWidth = `${minWidth}px`;
        return true;
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
    messageAddFull(input = { content: "", userString: "user", align: "right", role: "user", userID: -1, timestamp: false, updatedtime: false, scrollIntoView: true }) {
        const msgid = this.msgid;
        const messageDiv = document.createElement('div');
        const msgidClass = 'quikchat-msgid-' + String(msgid).padStart(10, '0');
        const userIdClass = 'quikchat-userid-' + String(input.userString).padStart(10, '0'); // hash this..
        messageDiv.classList.add('quikchat-message', msgidClass);
        this.msgid++;
        messageDiv.classList.add(this._messagesArea.children.length % 2 === 1 ? 'quikchat-message-1' : 'quikchat-message-2');

        const userDiv = document.createElement('div');
        userDiv.innerHTML = input.userString;
        userDiv.style = `width: 100%; text-align: ${input.align}; font-size: 1em; font-weight:700;`;

        const contentDiv = document.createElement('div');
        contentDiv.style = `width: 100%;`; // text-align: ${input.align};`;
        contentDiv.innerHTML = input.content;

        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        this._messagesArea.appendChild(messageDiv);

        // Scroll to the last message only if the user is not actively scrolling up
        if ((!this.userScrolledUp) || input.scrollIntoView) {
            this.messageScrollToBottom();
        }

        this._textEntry.value = '';
        this._adjustMessagesAreaHeight();
        this._handleShortLongMessageCSS(messageDiv, input.align); // Handle CSS for short/long messages
        // add timestamp now, unless it is passed in 

        const timestamp = input.timestamp ? input.timestamp : new Date().toISOString()
        const updatedtime = input.updatedtime ? input.updatedtime : timestamp;

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


    messageAddNew(content = "", userString = "user", align = "right", role = "user", scrollIntoView = true) {
        let retvalue = this.messageAddFull(
            { content: content, userString: userString, align: align, role: role, scrollIntoView: scrollIntoView }
        );
        // this.messageScrollToBottom();
        return retvalue;

    }
    messageRemove(n) {
        // use css selector to remove the message
        let sucess = false;
        try {
            this._messagesArea.removeChild(this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`));
            sucess = true;
        }
        catch (error) {
            console.log(`{String(n)} : Message ID not found`);
        }
        if (sucess) {
            // slow way to remove from history
            //this._history = this._history.filter((item) => item.msgid !== n); // todo make this more efficient

            // better way to delete this from history
            this._history.splice(this._history.findIndex((item) => item.msgid === n), 1);
        }
        return sucess;
    }
    /* returns the message html object from the DOM
    */
    messageGetDOMObject(n) {
        let msg = null;
        // now use css selector to get the message 
        try {
            msg = this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`);
        }
        catch (error) {
            console.log(`{String(n)} : Message ID not found`);
        }
        return msg;
    }
    /* returns the message content only
    */
    messageGetContent(n) {
        let content = ""
        // now use css selector to get the message 
        try {
            // get from history..
            content = this._history.filter((item) => item.msgid === n)[0].content;
            //content =  this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.textContent;
        }
        catch (error) {
            console.log(`{String(n)} : Message ID not found`);
        }
        return content;
    }

    /* append message to the message content
    */

    messageAppendContent(n, content) {
        let success = false;
        try {
            this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.innerHTML += content;
            // update history
            let item = this._history.filter((item) => item.msgid === n)[0];
            item.content += content;
            item.updatedtime = new Date().toISOString();
            success = true;

            // Scroll to the last message only if the user is not actively scrolling up
            if (!this.userScrolledUp) {
                this._messagesArea.lastElementChild.scrollIntoView();
            }
        } catch (error) {
            console.log(`${String(n)} : Message ID not found`);
        }
        return success;
    }

    /* replace message content
    */
    messageReplaceContent(n, content) {
        let success = false;
        try {
            this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.innerHTML = content;
            // update history
            let item = this._history.filter((item) => item.msgid === n)[0];
            item.content = content;
            item.updatedtime = new Date().toISOString();
            success = true;

            // Scroll to the last message only if the user is not actively scrolling up
            if (!this.userScrolledUp) {
                this._messagesArea.lastElementChild.scrollIntoView();
            }
        } catch (error) {
            console.log(`${String(n)} : Message ID not found`);
        }
        return success;
    }

    /**
     * Scrolls the messages area to the bottom.
     */
    messageScrollToBottom() {
        this._messagesArea.lastElementChild.scrollIntoView();
    }

    /**
     * For right sided or centered messages, we need to handle the CSS for short and long messages.
     * for short messages we use simple justifying, for long messages we need to wrap and perform multiline
     * formatting. 
     * 
     * @param {*} messageElement 
     * @returns nothing
     */
    _handleShortLongMessageCSS(messageElement, align) {
        // console.log(messageElement);
        // Reset classes
        messageElement.classList.remove(
            'left-singleline', 'left-multiline', 
            'center-singleline', 'center-multiline', 
            'right-singleline', 'right-multiline');
        let contentDiv = messageElement.lastChild;
        window.lastDiv = contentDiv; // for debugging   
        // Determine if the message is short or long

        const computedStyle = window.getComputedStyle(contentDiv);

        // Get the element's height
        const elementHeight = contentDiv.offsetHeight;
      
        // Calculate or estimate line height
        let lineHeight;
        if (computedStyle.lineHeight === "normal") {
          const fontSize = parseFloat(computedStyle.fontSize);
          lineHeight = fontSize * 1.2; // approximate "normal" as 1.2 times font-size
        } else {
          lineHeight = parseFloat(computedStyle.lineHeight);
        }
      
        // Check if the element height is more than one line-height
        const isMultiLine =  elementHeight > lineHeight;

        // Using scrollHeight and clientHeight to check for overflow (multi-line)
        switch (align) {
            case 'center':
                if (isMultiLine) {
                    messageElement.classList.add('center-multiline');
                }
                else {
                    messageElement.classList.add('center-singleline');
                }
                break;
            case 'right':
                if (isMultiLine) {
                    messageElement.classList.add('right-multiline');
                }
                else {
                    messageElement.classList.add('right-singleline');
                }
                break;
            case 'left':
            default:
                if (isMultiLine) {
                    messageElement.classList.add('left-multiline');
                }
                else {
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
    historyGet(n, m) {

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

    historyGetAllCopy() {
        return this._history.slice();
    }

    historyClear() {
        this.msgid = 0;
        this._messagesArea.innerHTML = "";
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
        if (n >= 0 && n < this._history.length)
            return this._history[n].content;
        else
            return "";
    }

    // expects an array of messages to be in the format of the history object
    historyRestoreAll(messageList) {
        // clear all messages and history
        this.historyClear();

        // clear the messages div 
        this._messagesArea.innerHTML = "";

        // add all messages
        messageList.forEach((message) => {
            this.messageAddFull(message);
        });
    }
    /**
     * 
     * @param {string} newTheme 
     */
    changeTheme(newTheme) {
        this._chatWidget.classList.remove(this._theme);
        this._chatWidget.classList.add(newTheme);
        this._theme = newTheme;
    }

    /**
     *  Get the current theme
     * @returns {string} - The current theme
     */
    get theme() {
        return this._theme;
    }

    /**
     * 
     * @returns {object} - Returns the version and license information for the library.
     */
    static version() {
        return { "version": "1.1.10", "license": "BSD-2", "url": "https://github/deftio/quikchat", "fun" : true };
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
            numChars = Math.floor(Math.random() * (150)) + 25;
        }

        if (startSpot === undefined) {
            startSpot = Math.floor(Math.random() * loremText.length);
        }

        startSpot = startSpot % loremText.length;

        // Move startSpot to the next non-whitespace and non-punctuation character
        while (loremText[startSpot] === ' ' || /[.,:;!?]/.test(loremText[startSpot])) {
            startSpot = (startSpot + 1) % loremText.length;
        }

        let l = loremText.substring(startSpot) + loremText.substring(0, startSpot);

        if (typeof numChars !== "number") {
            numChars = l.length;
        }

        let s = "";
        while (numChars > 0) {
            s += numChars < l.length ? l.substring(0, numChars) : l;
            numChars -= l.length;
        }

        if (s[s.length - 1] === " ") {
            s = s.substring(0, s.length - 1) + "."; // always end on non-whitespace. "." was chosen arbitrarily.
        }

        if (startWithCapitalLetter) {
            let c = s[0].toUpperCase();
            c = /[A-Z]/.test(c) ? c : "M";
            s = c + s.substring(1);
        }

        return s;
    };


}

export default quikchat;
