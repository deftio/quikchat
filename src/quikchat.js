import { quikchatVersion } from './quikchat_version.js';

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
            inputArea: { show: true },
            sendOnEnter: true,
            sendOnShiftEnter: false,
            instanceClass: ''
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

        if (meta.instanceClass) {
            this._chatWidget.classList.add(meta.instanceClass);
        }

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
        this._activeTags = new Set();

        // send on enter / shift enter
        this.sendOnEnter = meta.sendOnEnter;
        this.sendOnShiftEnter = meta.sendOnShiftEnter;
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
        this._sendButton.addEventListener('click', (event) => { event.preventDefault(); this._onSend(this, this._textEntry.value.trim()) });
        window.addEventListener('resize', () => this._handleContainerResize());
        this._chatWidget.addEventListener('resize', () => this._handleContainerResize());
        this._textEntry.addEventListener('keydown', (event) => {

            // Check if Shift + Enter is pressed then we just do carraige
            if (event.shiftKey && event.keyCode === 13) {
                // Prevent default behavior (adding new line)
                if (this.sendOnShiftEnter) {
                    event.preventDefault();
                    this._onSend(this, this._textEntry.value.trim());
                }
            } else if (event.keyCode === 13) {// Enter but not Shift + Enter
                if (this.sendOnEnter) {
                    event.preventDefault();
                    this._onSend(this, this._textEntry.value.trim());
                }
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
    
    // set a callback for when message content is appended
    setCallbackonMessageAppend(callback) {
        this._onMessageAppend = callback;
    }
    
    // set a callback for when message content is replaced
    setCallbackonMessageReplace(callback) {
        this._onMessageReplace = callback;
    }
    
    // set a callback for when a message is deleted
    setCallbackonMessageDelete(callback) {
        this._onMessageDelete = callback;
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
    messageAddFull(input = { content: "", userString: "user", align: "right", role: "user", userID: -1, timestamp: false, updatedtime: false, scrollIntoView: true, visible: true, tags: [] }) {
        const msgid = this.msgid;
        const messageDiv = document.createElement('div');
        const msgidClass = 'quikchat-msgid-' + String(msgid).padStart(10, '0');
        const userIdClass = 'quikchat-userid-' + String(input.userString).padStart(10, '0'); // hash this..
        messageDiv.classList.add('quikchat-message', msgidClass, 'quikchat-structure');

        if (Array.isArray(input.tags)) {
            input.tags.forEach(tag => {
                if (typeof tag === 'string' && /^[a-zA-Z0-9-]+$/.test(tag)) {
                    messageDiv.classList.add(`quikchat-tag-${tag}`);
                    this._activeTags.add(tag);
                }
            });
        }

        this.msgid++;

        const userDiv = document.createElement('div');
        userDiv.innerHTML = input.userString;
        userDiv.classList.add('quikchat-user-label');
        userDiv.style.textAlign = input.align;
    
        const contentDiv = document.createElement('div');
        contentDiv.classList.add('quikchat-message-content');
    
        // Determine text alignment for right-aligned messages
        if (input.align === "right") {
            const isMultiLine = input.content.includes("\n");
            const isLong = input.content.length > 50; // Adjust length threshold
    
            if (isMultiLine || isLong) {
                contentDiv.classList.add("quikchat-right-multiline");
            } else {
                contentDiv.classList.add("quikchat-right-singleline");
            }
        }
    
        contentDiv.innerHTML = input.content;
    
        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        this._messagesArea.appendChild(messageDiv);
        
        const visible = input.visible === undefined ? true : input.visible;
        if (!visible) {
            messageDiv.style.display = 'none';
        }
    
        // Handle scroll behavior based on scrollIntoView parameter
        // 'smart' = only scroll if near bottom, true = always scroll, false = never scroll
        if (input.scrollIntoView === true) {
            this.messageScrollToBottom();
        } else if (input.scrollIntoView === 'smart' && !this.userScrolledUp) {
            this.messageScrollToBottom();
        }
        // If scrollIntoView is false, don't scroll at all
    
        this._textEntry.value = '';
        this._adjustMessagesAreaHeight();
        this._handleShortLongMessageCSS(messageDiv, input.align); // Handle CSS for short/long messages
        this._updateMessageStyles();
    
        // Add timestamp now, unless it is passed in 
        const timestamp = input.timestamp ? input.timestamp : new Date().toISOString();
        const updatedtime = input.updatedtime ? input.updatedtime : timestamp;
    
        if (this.trackHistory) {
            this._history.push({ msgid, ...input, visible, timestamp, updatedtime, messageDiv });
            if (this._history.length > this._historyLimit) {
                this._history.shift();
            }
        }
    
        if (this._onMessageAdded) {
            this._onMessageAdded(this, msgid);
        }
    
        return msgid;
    }
    


    messageAddNew(content = "", userString = "user", align = "right", role = "user", scrollIntoView = true, visible = true, tags = []) {
        let retvalue = this.messageAddFull(
            { content: content, userString: userString, align: align, role: role, scrollIntoView: scrollIntoView, visible: visible, tags: tags }
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
            
            // Call the onMessageDelete callback if it exists
            if (this._onMessageDelete) {
                this._onMessageDelete(this, n);
            }
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

    /* returns the DOM Content element of a given message
    */
    messageGetContentDOMElement(n) {
        let contentElement = null;
        // now use css selector to get the message
        try {
            //contentElement = this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild;
            contentElement = this._history.filter((item) => item.msgid === n)[0].messageDiv.lastChild;
        }
        catch (error) {
            console.log(`{String(n)} : Message ID not found`);
        }
        return contentElement;
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
            
            // Call the onMessageAppend callback if it exists
            if (this._onMessageAppend) {
                this._onMessageAppend(this, n, content);
            }

            // Don't auto-scroll on append - let user control this
            // Users can call messageScrollToBottom() if they want to scroll
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
            
            // Call the onMessageReplace callback if it exists
            if (this._onMessageReplace) {
                this._onMessageReplace(this, n, content);
            }

            // Don't auto-scroll on append - let user control this
            // Users can call messageScrollToBottom() if they want to scroll
        } catch (error) {
            console.log(`${String(n)} : Message ID not found`);
        }
        return success;
    }

    /**
     * Scrolls the messages area to the bottom.
     */
    messageScrollToBottom() {
        if (this._messagesArea.lastElementChild) {
            this._messagesArea.lastElementChild.scrollIntoView();
        }
    }

    /**
     * Removes the last message from the messages area.
     */
    messageRemoveLast() {
        // find the last message by id:
        if (this._history.length >= 0) {
            let lastMsgId = this._history[this._history.length - 1].msgid;
            return this.messageRemove(lastMsgId);
        }
        return false;
    }

    messageSetVisibility(msgid, isVisible) {
        const message = this._history.find(item => item.msgid === msgid);
        if (message && message.messageDiv) {
            message.messageDiv.style.display = isVisible ? '' : 'none';
            message.visible = isVisible;
            this._updateMessageStyles();
            return true;
        }
        return false;
    }

    messageGetVisibility(msgid) {
        const message = this._history.find(item => item.msgid === msgid);
        if (message && message.messageDiv) {
            return message.messageDiv.style.display !== 'none';
        }
        return false; // Return false if not found or no messageDiv
    }

    _updateMessageStyles() {
        const visibleMessages = [...this._messagesArea.children].filter(
            child => child.style.display !== 'none'
        );

        visibleMessages.forEach((messageDiv, index) => {
            messageDiv.classList.remove('quikchat-message-1', 'quikchat-message-2');
            messageDiv.classList.add(index % 2 === 0 ? 'quikchat-message-1' : 'quikchat-message-2');
        });
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
        const isMultiLine = elementHeight > lineHeight;

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
    
    /**
     * Get a page of history messages with pagination support
     * @param {number} page - Page number (1-based)
     * @param {number} pageSize - Number of messages per page (default 50)
     * @param {string} order - 'asc' for oldest first, 'desc' for newest first (default 'asc')
     * @returns {object} Object with messages array, pagination info
     */
    historyGetPage(page = 1, pageSize = 50, order = 'asc') {
        const totalMessages = this._history.length;
        const totalPages = Math.ceil(totalMessages / pageSize);
        const currentPage = Math.max(1, Math.min(page, totalPages || 1));
        
        let start, end;
        if (order === 'desc') {
            // For descending order, page 1 shows the newest messages
            start = Math.max(0, totalMessages - (currentPage * pageSize));
            end = totalMessages - ((currentPage - 1) * pageSize);
        } else {
            // For ascending order, page 1 shows the oldest messages
            start = (currentPage - 1) * pageSize;
            end = Math.min(start + pageSize, totalMessages);
        }
        
        const messages = this._history.slice(start, end);
        
        // Reverse messages array if descending order requested
        if (order === 'desc') {
            messages.reverse();
        }
        
        return {
            messages: messages,
            pagination: {
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                totalMessages: totalMessages,
                hasNext: currentPage < totalPages,
                hasPrevious: currentPage > 1,
                order: order
            }
        };
    }
    
    /**
     * Get information about history size and pagination
     * @param {number} pageSize - Size to calculate pages for (default 50)
     * @returns {object} History metadata
     */
    /**
     * Search history for messages matching criteria
     * @param {object} criteria - Search criteria object
     * @param {string} criteria.text - Text to search for in message content
     * @param {string} criteria.userString - Filter by user name
     * @param {string} criteria.role - Filter by role
     * @param {array} criteria.tags - Filter by tags (messages with any of these tags)
     * @param {number} criteria.limit - Maximum results to return (default 100)
     * @returns {array} Array of matching messages
     */
    historySearch(criteria = {}) {
        let results = this._history;
        
        // Filter by text content (case-insensitive)
        if (criteria.text) {
            const searchText = criteria.text.toLowerCase();
            results = results.filter(msg => 
                msg.content.toLowerCase().includes(searchText)
            );
        }
        
        // Filter by user
        if (criteria.userString) {
            results = results.filter(msg => 
                msg.userString === criteria.userString
            );
        }
        
        // Filter by role
        if (criteria.role) {
            results = results.filter(msg => 
                msg.role === criteria.role
            );
        }
        
        // Filter by tags (match any tag)
        if (criteria.tags && criteria.tags.length > 0) {
            results = results.filter(msg => 
                msg.tags && msg.tags.some(tag => criteria.tags.includes(tag))
            );
        }
        
        // Limit results
        const limit = criteria.limit || 100;
        if (results.length > limit) {
            results = results.slice(0, limit);
        }
        
        return results;
    }
    
    historyGetInfo(pageSize = 50) {
        const totalMessages = this._history.length;
        return {
            totalMessages: totalMessages,
            totalPages: Math.ceil(totalMessages / pageSize),
            oldestMessage: totalMessages > 0 ? {
                msgid: this._history[0].msgid,
                timestamp: this._history[0].timestamp,
                userString: this._history[0].userString
            } : null,
            newestMessage: totalMessages > 0 ? {
                msgid: this._history[totalMessages - 1].msgid,
                timestamp: this._history[totalMessages - 1].timestamp,
                userString: this._history[totalMessages - 1].userString
            } : null,
            memoryUsage: {
                estimatedSize: JSON.stringify(this._history).length,
                averageMessageSize: totalMessages > 0 ? 
                    Math.round(JSON.stringify(this._history).length / totalMessages) : 0
            }
        };
    }

    historyClear() {
        this.msgid = 0;
        this._messagesArea.innerHTML = "";
        this._history = [];
        this._activeTags.clear();
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
        return quikchatVersion;
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

    static tempMessageGenerator (domElement, content, interval, cb = null) {
        interval = Math.max(interval, 100); // Ensure at least 100ms interval
    
        let count = 0;

        let defaultCB = (msg, count) => {msg += "."; return msg; };

        if (cb && typeof cb !== 'function') {
            cb = null;
        }

        cb = cb || defaultCB;
        
        // if its a string, then get the element (css sel) or its an DOM element already 
        let el  = domElement;
        if (typeof el === 'string') {
            el = document.querySelector(el);
        } 

        const element = el;

    
        // Ensure the element exists
        if (!element) return;
    
        element.innerHTML = content;
        let currentMsg = content;
    
        const intervalId = setInterval(() => {
            if (element.innerHTML !== currentMsg) {
                clearInterval(intervalId); // Stop updating if content is changed externally
                return;
            }
            
            currentMsg = String( cb(currentMsg, count)) ;// Use callback return value if provided
            
            count++;
            element.innerHTML = currentMsg;
        }, interval);
    }

    static createTempMessageDOMStr(initialContent, updateInterval = 1000, callback = null, options = {}) {
        // Make sure the interval is at least 100ms
        updateInterval = Math.max(updateInterval, 100);
        
        // Validate callback; if not a function, ignore it.
        if (callback && typeof callback !== 'function') {
          callback = null;
        }
        // Default callback simply appends a dot.
        callback = callback || function(msg, count) {
          return msg + ".";
        };
      
        // Allow an optional CSS class for the container element
        const containerClass = options.containerClass ? options.containerClass : '';
      
        // Generate a unique id so that the inline script can reliably find the container.
        const uniqueId = "tempMsg_" + Date.now() + "_" + Math.floor(Math.random() * 1000000);
      
        // Build and return the HTML string.
        // Note the use of <\/script> (with a backslash) so that the inline script is not terminated early.
        return `
          <span id="${uniqueId}" ${containerClass ? `class="${containerClass}"` : ''}>
            ${initialContent}
          </span>
          <script>
            (function(){
              // Get our container element by its unique id.
              var container = document.getElementById("${uniqueId}");
              if (!container) return;
              var count = 0;
              var currentMsg = container.innerHTML;
              var interval = ${updateInterval};
              // Convert the callback function into its string representation.
              var cb = ${callback.toString()};
              var intervalId = setInterval(function(){
                // If the content has been replaced, stop updating.
                if(container.innerHTML !== currentMsg){
                  clearInterval(intervalId);
                  return;
                }
                // Use the callback to generate the new message.
                currentMsg = String(cb(currentMsg, count));
                count++;
                container.innerHTML = currentMsg;
              }, interval);
            })();
          <\/script>
        `;
      }
      
    setTagVisibility(tagName, isVisible) {
        if (typeof tagName !== 'string' || !/^[a-zA-Z0-9-]+$/.test(tagName)) {
            return false;
        }
        const className = `quikchat-show-tag-${tagName}`;
        if (isVisible) {
            this._chatWidget.classList.add(className);
        } else {
            this._chatWidget.classList.remove(className);
        }
        this._updateMessageStyles();
        return true;
    }

    getTagVisibility(tagName) {
        if (typeof tagName !== 'string' || !/^[a-zA-Z0-9-]+$/.test(tagName)) {
            return false;
        }
        return this._chatWidget.classList.contains(`quikchat-show-tag-${tagName}`);
    }

    getActiveTags() {
        return Array.from(this._activeTags);
    }
}

export default quikchat;
