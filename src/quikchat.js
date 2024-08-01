
class quikchat {
    /**
     * 
     * @param string or DOM element  parentElement 
     * @param {*} meta 
     */
    constructor(parentElement, options = {}) 
    {
        const defaultOpts = {
            theme: 'quikchat-theme-light',
            onSend: () => { },
            trackHistory: true,
            titleArea: { title: "Chat", show: false, align: "center" },
            messagesArea: { alternating : true },
        };
        const meta = { ...defaultOpts, ...options }; // merge options with defaults
        
        if (typeof parentElement === 'string') {
            parentElement = document.querySelector(parentElement);
        }
        console.log(parentElement, meta);
        this._parentElement = parentElement;
        this._theme = meta.theme;
        this._onSend = meta.onSend ? meta.onSend : () => { };
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

    _attachEventListeners() {
        this._sendButton.addEventListener('click', () => this._onSend(this, this._textEntry.value.trim()));
        window.addEventListener('resize', () => this._handleContainerResize());
        this._chatWidget.addEventListener('resize', () => this._handleContainerResize());
        this._textEntry.addEventListener('keydown', (event) => {
            // Check if Shift + Enter is pressed
            if (event.shiftKey && event.keyCode === 13) {
                // Prevent default behavior (adding new line)
                event.preventDefault();
                this._onSend(this, this._textEntry.value.trim())
            }
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
        //console.log('Container resized');
    }

    _adjustSendButtonWidth() {
        const sendButtonText = this._sendButton.textContent.trim();
        const fontSize = parseFloat(getComputedStyle(this._sendButton).fontSize);
        const minWidth = fontSize * sendButtonText.length + 16;
        this._sendButton.style.minWidth = `${minWidth}px`;
    }

    //messagesArea functions
    messagesAreaAlternateColors(alt = true) {
        if (alt) {
            this._messagesArea.classList.add('quikchat-messages-area-alt');
        }
        else {
            this._messagesArea.classList.remove('quikchat-messages-area-alt');
        }
        return alt===true;
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
        const userIdClass = 'quikchat-userid-' + String(input.userString).padStart(10, '0'); // hash this..
        messageDiv.classList.add('quikchat-message', msgidClass);
        this.msgid++;
        messageDiv.classList.add(this._messagesArea.children.length % 2 === 1 ? 'quikchat-message-1' : 'quikchat-message-2');

        const userDiv = document.createElement('div');
        userDiv.innerHTML = input.userString;
        userDiv.style = `width: 100%; text-align: ${input.align}; font-size: 1em; font-weight:700;`;

        const contentDiv = document.createElement('div');
        contentDiv.style = `width: 100%; text-align: ${input.align};`;
        contentDiv.innerHTML = input.content;

        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        this._messagesArea.appendChild(messageDiv);
        //this._messagesArea.lastChild.scrollIntoView();
        this._messagesArea.lastElementChild.scrollIntoView()

        this._textEntry.value = '';
        this._adjustMessagesAreaHeight();
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
        };
        return msgid;
    }
    messageAddNew(content = "", userString = "user", align = "right", role = "user") {
        return this.messageAddFull(
            { content: content, userString: userString, align: align, role: role }
        );
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
        let sucess = false;
        try {
            this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.innerHTML += content;
            // update history
            let item = this._history.filter((item) => item.msgid === n)[0];
            item.content += content;
            item.updatedtime = new Date().toISOString();
            sucess = true;
            //this._messagesArea.lastChild.scrollIntoView();
            this._messagesArea.lastElementChild.scrollIntoView()
        }
        catch (error) {
            console.log(`{String(n)} : Message ID not found`);
        }
    }
    /* replace message content
    */
    messageReplaceContent(n, content) {
        let sucess = false;
        try {
            this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.innerHTML = content;
            // update history
            this._history.filter((item) => item.msgid === n)[0].content = content;
            sucess = true;
        }
        catch (error) {
            console.log(`{String(n)} : Message ID not found`);
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

    historyClear() {
        this.msgid = 0;
        this._history = [];
    }

    historyGetLength() {
        return this._history.length;
    }

    historyGetMessage(n) {
        if (n >= 0 && n < this._history.length) {
            this._history[n];
        }
        return {};

    }

    historyGetMessageContent(n) {
        return this._history[n].message;
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
        return { "version": "1.1.0", "license": "BSD-2", "url": "https://github/deftio/quikchat" };
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

     static loremIpsum (numChars, startSpot = undefined, startWithCapitalLetter = true) {
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
