import { quikchatVersion } from './quikchat_version.js';

/**
 * Simplified virtual scrolling implementation for QuikChat
 * @private
 */
class SimpleVirtualScroller {
    constructor(container, options = {}) {
        this.container = container;
        this.items = [];
        this.itemHeight = options.itemHeight || 80;  // Default/estimate height
        this.buffer = options.buffer || 5;
        this.visibleRange = { start: 0, end: 0 };
        this.renderedElements = new Map();
        this.itemHeights = new Map();  // Cache actual heights
        this.itemPositions = new Map();  // Cache positions
        this.totalHeight = 0;
        this.onRenderItem = options.onRenderItem || (() => {});
        this.sanitizer = options.sanitizer || null;  // Content sanitizer
        
        this._initStructure();
        this._attachScrollListener();
    }
    
    _initStructure() {
        const existingClasses = this.container.className;
        this.container.innerHTML = '';
        this.container.className = existingClasses;
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        
        // Ensure container has height
        if (this.container.offsetHeight === 0) {
            // Try to get height from computed style or parent
            const computedHeight = window.getComputedStyle(this.container).height;
            if (computedHeight === '0px' || computedHeight === 'auto') {
                // If still no height, use a reasonable default
                this.container.style.height = '400px';
                console.warn('QuikChat Virtual Scrolling: Container has no height, setting to 400px');
            }
        }
        
        this.spacer = document.createElement('div');
        this.spacer.style.cssText = 'position: absolute; top: 0; left: 0; width: 1px; pointer-events: none; z-index: -1;';
        
        this.content = document.createElement('div');
        this.content.style.cssText = 'position: relative; width: 100%;';
        
        this.container.appendChild(this.spacer);
        this.container.appendChild(this.content);
        
        // Initial render after structure is set up
        setTimeout(() => {
            this._updateVisibleRange();
            this._renderVisibleItems();
        }, 0);
    }
    
    _attachScrollListener() {
        let ticking = false;
        this.container.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this._updateVisibleRange();
                    this._renderVisibleItems();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    _getItemHeight(index) {
        // Return cached height or estimate
        return this.itemHeights.get(index) || this.itemHeight;
    }
    
    _getItemPosition(index) {
        // Return cached position or calculate
        if (this.itemPositions.has(index)) {
            return this.itemPositions.get(index);
        }
        
        // Calculate position based on previous items
        let position = 0;
        for (let i = 0; i < index; i++) {
            position += this._getItemHeight(i);
        }
        
        this.itemPositions.set(index, position);
        return position;
    }
    
    _recalculatePositions(fromIndex) {
        // Recalculate positions from a specific index onwards
        let position = fromIndex > 0 ? this._getItemPosition(fromIndex) : 0;
        
        for (let i = fromIndex; i < this.items.length; i++) {
            this.itemPositions.set(i, position);
            position += this._getItemHeight(i);
            
            // Update position of rendered elements
            const element = this.renderedElements.get(i);
            if (element) {
                element.style.top = `${this.itemPositions.get(i)}px`;
            }
        }
        
        // Update total height
        this.totalHeight = position;
        this.spacer.style.height = `${this.totalHeight}px`;
    }
    
    _updateVisibleRange() {
        const scrollTop = this.container.scrollTop;
        const viewportHeight = this.container.clientHeight;
        
        // If container has no height, don't render anything (avoid infinite loop)
        if (viewportHeight === 0) {
            this.visibleRange = { start: 0, end: 0 };
            return;
        }
        
        // Find first visible item based on positions
        let startIndex = 0;
        let endIndex = this.items.length;
        
        // Use cached positions when available
        if (this.itemPositions.size > 0) {
            // Find start index
            for (let i = 0; i < this.items.length; i++) {
                const pos = this._getItemPosition(i);
                if (pos + this._getItemHeight(i) > scrollTop) {
                    startIndex = Math.max(0, i - this.buffer);
                    break;
                }
            }
            
            // Find end index
            for (let i = startIndex; i < this.items.length; i++) {
                const pos = this._getItemPosition(i);
                if (pos > scrollTop + viewportHeight) {
                    endIndex = Math.min(this.items.length, i + this.buffer);
                    break;
                }
            }
        } else {
            // Fallback to estimate if no positions cached yet
            startIndex = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.buffer);
            endIndex = Math.min(this.items.length, Math.ceil((scrollTop + viewportHeight) / this.itemHeight) + this.buffer);
        }
        
        this.visibleRange = { start: startIndex, end: endIndex };
    }
    
    _renderVisibleItems() {
        const { start, end } = this.visibleRange;
        
        // Remove elements outside range
        this.renderedElements.forEach((element, index) => {
            if (index < start || index >= end) {
                element.remove();
                this.renderedElements.delete(index);
                // Don't clear height cache - we might need it again
            }
        });
        
        // Add new visible elements
        for (let i = start; i < end; i++) {
            const item = this.items[i];
            if (!item || this.renderedElements.has(i)) continue;
            
            const element = this._createItemElement(item, i);
            element.style.position = 'absolute';
            element.style.top = `${this._getItemPosition(i)}px`;
            element.style.left = '0';
            element.style.right = '0';
            
            this.renderedElements.set(i, element);
            this.content.appendChild(element);
            
            // Measure actual height after rendering
            requestAnimationFrame(() => {
                if (this.renderedElements.has(i)) {
                    const actualHeight = element.offsetHeight;
                    if (actualHeight && actualHeight !== this._getItemHeight(i)) {
                        this.itemHeights.set(i, actualHeight);
                        this._recalculatePositions(i);
                    }
                }
            });
        }
        
        this.onRenderItem(this.content);
    }
    
    _createItemElement(item, index) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `quikchat-message quikchat-message-${item.align || 'left'} quikchat-msgid-${String(item.msgid).padStart(10, '0')}`;
        messageDiv.setAttribute('data-index', index);
        messageDiv.setAttribute('data-msgid', item.msgid);
        messageDiv.setAttribute('role', 'article');
        messageDiv.setAttribute('aria-label', `Message from ${item.userString || 'user'}`);
        
        if (item.tags && item.tags.length > 0) {
            item.tags.forEach(tag => messageDiv.classList.add(`quikchat-tag-${tag}`));
        }
        
        const userDiv = document.createElement('div');
        userDiv.className = 'quikchat-message-user';
        userDiv.innerHTML = this.sanitizer ? this.sanitizer(item.userString || '') : (item.userString || '');
        userDiv.setAttribute('aria-label', 'User');
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'quikchat-message-content';
        contentDiv.innerHTML = this.sanitizer ? this.sanitizer(item.content || '') : (item.content || '');
        contentDiv.setAttribute('aria-label', 'Message content');
        
        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        
        if (!item.visible) {
            messageDiv.style.display = 'none';
        }
        
        return messageDiv;
    }
    
    addItem(item) {
        this.items.push(item);
        const index = this.items.length - 1;
        
        // Calculate position for new item
        const position = index > 0 ? 
            this._getItemPosition(index - 1) + this._getItemHeight(index - 1) : 0;
        this.itemPositions.set(index, position);
        
        // Update total height (using estimate for new item)
        this.totalHeight = position + this.itemHeight;
        this.spacer.style.height = `${this.totalHeight}px`;
        
        if (index >= this.visibleRange.start && index < this.visibleRange.end) {
            this._renderVisibleItems();
        }
        
        if (item.scrollIntoView) {
            this.container.scrollTop = this.container.scrollHeight;
        }
        
        return index;
    }
    
    addItems(items) {
        // Batch add items for better performance
        const startLength = this.items.length;
        this.items.push(...items);
        
        // Calculate positions for new items
        let position = startLength > 0 ? 
            this._getItemPosition(startLength - 1) + this._getItemHeight(startLength - 1) : 0;
        
        for (let i = startLength; i < this.items.length; i++) {
            this.itemPositions.set(i, position);
            position += this.itemHeight;  // Use estimate for new items
        }
        
        this.totalHeight = position;
        this.spacer.style.height = `${this.totalHeight}px`;
        
        // Update visible range and render
        this._updateVisibleRange();
        this._renderVisibleItems();
        
        // Handle scrollIntoView for last item if needed
        if (items.length > 0 && items[items.length - 1].scrollIntoView) {
            this.container.scrollTop = this.container.scrollHeight;
        }
    }
    
    clear() {
        this.items = [];
        this.renderedElements.clear();
        this.itemHeights.clear();
        this.itemPositions.clear();
        this.totalHeight = 0;
        this.content.innerHTML = '';
        this.spacer.style.height = '0px';
        this.visibleRange = { start: 0, end: 0 };
        
        // Force update after clear
        this._updateVisibleRange();
        this._renderVisibleItems();
    }
    
    updateItem(index, updates) {
        if (index >= 0 && index < this.items.length) {
            this.items[index] = { ...this.items[index], ...updates };
            if (this.renderedElements.has(index)) {
                this._renderVisibleItems();
            }
        }
    }
    
    destroy() {
        this.container.innerHTML = '';
        this.items = [];
        this.renderedElements.clear();
    }
}

/**
 * QuikChat - A zero-dependency JavaScript chat widget for modern web applications
 * @class quikchat
 */
class quikchat {
    /**
     * Creates a new QuikChat instance
     * @constructor
     * @param {string|HTMLElement} parentElement - CSS selector or DOM element to attach the chat widget to
     * @param {Function} [onSend] - Callback function triggered when user sends a message
     * @param {Object} [options] - Configuration options
     * @param {string} [options.theme='quikchat-theme-light'] - CSS theme class name
     * @param {boolean} [options.trackHistory=true] - Whether to track message history
     * @param {Object} [options.titleArea] - Title area configuration
     * @param {string} [options.titleArea.title='Chat'] - Title text/HTML
     * @param {boolean} [options.titleArea.show=false] - Whether to show title area initially
     * @param {'left'|'center'|'right'} [options.titleArea.align='center'] - Title alignment
     * @param {Object} [options.messagesArea] - Messages area configuration
     * @param {boolean} [options.messagesArea.alternating=true] - Alternate message colors
     * @param {Object} [options.inputArea] - Input area configuration
     * @param {boolean} [options.inputArea.show=true] - Whether to show input area initially
     * @param {boolean} [options.sendOnEnter=true] - Send message on Enter key
     * @param {boolean} [options.sendOnShiftEnter=false] - Send message on Shift+Enter
     * @param {string} [options.instanceClass=''] - Additional CSS class for the widget instance
     * @example
     * // Basic usage
     * const chat = new quikchat('#chat-container', (instance, message) => {
     *   console.log('User sent:', message);
     * });
     * 
     * @example
     * // With options
     * const chat = new quikchat('#chat', handleMessage, {
     *   theme: 'quikchat-theme-dark',
     *   titleArea: { title: 'Support Chat', show: true },
     *   sendOnEnter: false,
     *   sendOnShiftEnter: true
     * });
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
            instanceClass: '',
            virtualScrolling: true,  // Default to true for better performance
            virtualScrollingThreshold: 500,  // Lower threshold since it performs so well
            // i18n support
            lang: 'en',
            dir: 'ltr',  // 'ltr' or 'rtl'
            translations: {
                'en': {
                    sendButton: 'Send',
                    inputPlaceholder: 'Type a message...',
                    titleDefault: 'Chat'
                }
            },
            // Security: content sanitizer callback
            sanitizer: null  // null = no sanitization (backward compatible)
        };
        const meta = { ...defaultOpts, ...options }; // merge options with defaults
        
        // Merge user translations with defaults
        if (options.translations) {
            meta.translations = { ...defaultOpts.translations, ...options.translations };
        }

        if (typeof parentElement === 'string') {
            parentElement = document.querySelector(parentElement);
        }
        //console.log(parentElement, meta);
        this._parentElement = parentElement;
        this._theme = meta.theme;
        this._onSend = onSend ? onSend : () => { }; // call back function for onSend
        
        // i18n settings
        this.lang = meta.lang;
        this.dir = meta.dir;
        this.translations = meta.translations;
        this.currentTranslations = this.translations[this.lang] || this.translations['en'];
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
        
        // Virtual scrolling setup
        this.virtualScrollingEnabled = meta.virtualScrolling;
        this.virtualScrollingThreshold = meta.virtualScrollingThreshold;
        this.virtualScroller = null;
        
        // Sanitizer setup
        this._sanitizer = meta.sanitizer || null;
        
        // Don't initialize virtual scrolling immediately - wait for threshold
        // Virtual scrolling will be initialized when message count exceeds threshold
    }
    
    /**
     * Initialize virtual scrolling
     * @private
     */
    _initVirtualScrolling() {
        if (this.virtualScrollingEnabled && this._messagesArea && !this.virtualScroller) {
            // Check if we've hit the threshold (or about to with the next message)
            if (this._history.length >= this.virtualScrollingThreshold - 1) {
                this.virtualScroller = new SimpleVirtualScroller(this._messagesArea, {
                    itemHeight: 80,
                    buffer: 5,
                    sanitizer: this._sanitizer,  // Pass sanitizer to virtual scroller
                    onRenderItem: (content) => {
                        // Apply alternating colors if enabled
                        if (this._messagesArea.classList.contains('quikchat-messages-area-alt')) {
                            this._updateMessageStyles();
                        }
                    }
                });
                
                // Migrate existing messages to virtual scroller
                this._migrateToVirtualScrolling();
            }
        }
    }
    
    /**
     * Migrate existing messages to virtual scrolling
     * @private
     */
    _migrateToVirtualScrolling() {
        if (!this.virtualScroller) return;
        
        // Don't clear DOM here - virtual scroller will do it in _initStructure
        
        // Add all messages to virtual scroller
        const items = this._history.map(msg => ({
            msgid: msg.msgid,
            content: msg.content,
            userString: msg.userString,
            align: msg.align,
            role: msg.role,
            visible: msg.visible,
            tags: msg.tags || [],
            scrollIntoView: false
        }));
        
        this.virtualScroller.addItems(items);
        
        // Force a render in case container needs time to get dimensions
        setTimeout(() => {
            if (this.virtualScroller) {
                this.virtualScroller._updateVisibleRange();
                this.virtualScroller._renderVisibleItems();
            }
        }, 10);
    }

    _createWidget() {
        const sendButtonText = this.currentTranslations.sendButton || 'Send';
        const inputPlaceholder = this.currentTranslations.inputPlaceholder || 'Type a message...';
        
        const widgetHTML =
            `
            <div class="quikchat-base ${this._theme}" dir="${this.dir}" lang="${this.lang}" role="region" aria-label="Chat widget">
                <div class="quikchat-title-area" role="heading" aria-level="2">
                    <span style="font-size: 1.5em; font-weight: 600;">Title Area</span>
                </div>
                <div class="quikchat-messages-area" role="log" aria-live="polite" aria-label="Chat messages"></div>
                <div class="quikchat-input-area" role="form" aria-label="Message input">
                    <textarea class="quikchat-input-textbox" 
                              placeholder="${inputPlaceholder}"
                              aria-label="Type your message"
                              autocomplete="off"
                              autocapitalize="sentences"></textarea>
                    <button class="quikchat-input-send-btn" 
                            aria-label="Send message"
                            type="button">${sendButtonText}</button>
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
        
        // Add mobile viewport handling
        this._setupMobileSupport();
    }

    /**
     * Setup mobile support - prevent zoom on input focus and handle virtual keyboard
     * @private
     */
    _setupMobileSupport() {
        // Prevent zoom on input focus for mobile
        let meta = document.querySelector('meta[name="viewport"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'viewport';
            document.head.appendChild(meta);
        }
        
        // Store original content
        this._originalViewport = meta.content;
        
        // Prevent zoom on focus
        this._textEntry.addEventListener('focus', () => {
            if (window.innerWidth <= 768) {  // Mobile device width
                meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0';
            }
        });
        
        this._textEntry.addEventListener('blur', () => {
            if (this._originalViewport) {
                meta.content = this._originalViewport;
            } else {
                meta.content = 'width=device-width, initial-scale=1.0';
            }
        });
        
        // Handle virtual keyboard resize
        if ('visualViewport' in window) {
            window.visualViewport.addEventListener('resize', () => {
                this._handleVirtualKeyboard();
            });
        }
    }
    
    /**
     * Handle virtual keyboard appearance/disappearance
     * @private
     */
    _handleVirtualKeyboard() {
        // Adjust layout when virtual keyboard appears
        const keyboardHeight = window.innerHeight - window.visualViewport.height;
        if (keyboardHeight > 0) {
            // Keyboard is visible - adjust chat widget height
            this._chatWidget.style.paddingBottom = `${keyboardHeight}px`;
        } else {
            // Keyboard hidden - restore original padding
            this._chatWidget.style.paddingBottom = '';
        }
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
    
    /**
     * Sets the callback function for when content is appended to a message
     * @param {Function} callback - Function to call when content is appended
     * @param {quikchat} callback.instance - The QuikChat instance
     * @param {number} callback.msgId - The ID of the message being appended to
     * @param {string} callback.content - The content being appended
     * @since 1.1.15
     * @example
     * chat.setCallbackonMessageAppend((instance, msgId, content) => {
     *   console.log(`Appended "${content}" to message ${msgId}`);
     * });
     */
    setCallbackonMessageAppend(callback) {
        this._onMessageAppend = callback;
    }
    
    /**
     * Sets the callback function for when a message's content is replaced
     * @param {Function} callback - Function to call when content is replaced
     * @param {quikchat} callback.instance - The QuikChat instance
     * @param {number} callback.msgId - The ID of the message being replaced
     * @param {string} callback.content - The new content
     * @since 1.1.15
     * @example
     * chat.setCallbackonMessageReplace((instance, msgId, content) => {
     *   console.log(`Message ${msgId} replaced with: ${content}`);
     * });
     */
    setCallbackonMessageReplace(callback) {
        this._onMessageReplace = callback;
    }
    
    /**
     * Sets the callback function for when a message is deleted
     * @param {Function} callback - Function to call when a message is deleted
     * @param {quikchat} callback.instance - The QuikChat instance
     * @param {number} callback.msgId - The ID of the deleted message
     * @since 1.1.15
     * @example
     * chat.setCallbackonMessageDelete((instance, msgId) => {
     *   console.log(`Message ${msgId} was deleted`);
     * });
     */
    setCallbackonMessageDelete(callback) {
        this._onMessageDelete = callback;
    }

    // Public methods
    /**
     * Toggles the visibility of the title area
     * @returns {void}
     */
    titleAreaToggle() {
        this._titleArea.style.display === 'none' ? this.titleAreaShow() : this.titleAreaHide();
    }

    /**
     * Shows the title area
     * @returns {void}
     */
    titleAreaShow() {
        this._titleArea.style.display = '';
        this._adjustMessagesAreaHeight();
    }

    /**
     * Hides the title area
     * @returns {void}
     */
    titleAreaHide() {
        this._titleArea.style.display = 'none';
        this._adjustMessagesAreaHeight();
    }

    /**
     * Sets the contents of the title area
     * @param {string} title - HTML content to display in the title area
     * @param {'left'|'center'|'right'} [align='center'] - Text alignment
     * @returns {void}
     * @example
     * chat.titleAreaSetContents('<h2>Support Chat</h2>', 'center');
     */
    titleAreaSetContents(title, align = 'center') {
        this._titleArea.innerHTML = this._sanitizeContent(title);
        this._titleArea.style.textAlign = align;
    }

    /**
     * Gets the current contents of the title area
     * @returns {string} The HTML content of the title area
     */
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
    /**
     * Adds a new message to the chat with full configuration options
     * @param {Object} input - Message configuration object
     * @param {string} [input.content=''] - Message content (HTML allowed)
     * @param {string} [input.userString='user'] - Display name for the message sender
     * @param {'left'|'right'|'center'} [input.align='right'] - Message alignment
     * @param {string} [input.role='user'] - Role identifier (user, assistant, system)
     * @param {number} [input.userID=-1] - User ID for the message
     * @param {string|false} [input.timestamp=false] - ISO timestamp or false for auto
     * @param {string|false} [input.updatedtime=false] - Last updated timestamp
     * @param {boolean|'smart'} [input.scrollIntoView=true] - Scroll behavior (true/false/'smart')
     * @param {boolean} [input.visible=true] - Whether message is initially visible
     * @param {string[]} [input.tags=[]] - Tags for message categorization
     * @returns {number} Message ID for the newly added message
     * @example
     * const msgId = chat.messageAddFull({
     *   content: 'Hello!',
     *   userString: 'Bot',
     *   align: 'left',
     *   scrollIntoView: 'smart',
     *   tags: ['greeting']
     * });
     */
    messageAddFull(input = { content: "", userString: "user", align: "right", role: "user", userID: -1, timestamp: false, updatedtime: false, scrollIntoView: true, visible: true, tags: [] }) {
        const msgid = this.msgid;
        this.msgid++;
        let messageDiv = null; // Initialize messageDiv to null
        
        // Check if we should initialize virtual scrolling
        if (this.virtualScrollingEnabled && !this.virtualScroller && this._history.length >= this.virtualScrollingThreshold - 1) {
            this._initVirtualScrolling();
        }
        
        // If virtual scrolling is enabled, use the virtual scroller
        if (this.virtualScroller) {
            const messageData = {
                msgid: msgid,
                content: input.content,
                userString: input.userString,
                align: input.align,
                role: input.role,
                visible: input.visible !== undefined ? input.visible : true,
                tags: input.tags || [],
                scrollIntoView: input.scrollIntoView
            };
            
            // Add tags to active tags set
            if (Array.isArray(input.tags)) {
                input.tags.forEach(tag => {
                    if (typeof tag === 'string' && /^[a-zA-Z0-9-]+$/.test(tag)) {
                        this._activeTags.add(tag);
                    }
                });
            }
            
            // Add to virtual scroller
            this.virtualScroller.addItem(messageData);
            
            // Clear text entry
            this._textEntry.value = '';
            this._adjustMessagesAreaHeight();
        } else {
            // Original DOM-based implementation
            messageDiv = document.createElement('div');
            const msgidClass = 'quikchat-msgid-' + String(msgid).padStart(10, '0');
            const userIdClass = 'quikchat-userid-' + String(input.userString).padStart(10, '0'); // hash this..
            messageDiv.classList.add('quikchat-message', msgidClass, 'quikchat-structure');
            messageDiv.setAttribute('role', 'article');
            messageDiv.setAttribute('aria-label', `Message from ${input.userString || 'user'}`);

            if (Array.isArray(input.tags)) {
                input.tags.forEach(tag => {
                    if (typeof tag === 'string' && /^[a-zA-Z0-9-]+$/.test(tag)) {
                        messageDiv.classList.add(`quikchat-tag-${tag}`);
                        this._activeTags.add(tag);
                    }
                });
            }

            const userDiv = document.createElement('div');
            userDiv.innerHTML = this._sanitizeContent(input.userString);
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
        
            contentDiv.innerHTML = this._sanitizeContent(input.content);
        
            messageDiv.appendChild(userDiv);
            messageDiv.appendChild(contentDiv);
            this._messagesArea.appendChild(messageDiv);
            
            if (input.visible === false) {
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
        }
    
        // Add timestamp now, unless it is passed in 
        const timestamp = input.timestamp ? input.timestamp : new Date().toISOString();
        const updatedtime = input.updatedtime ? input.updatedtime : timestamp;
        const visible = input.visible !== undefined ? input.visible : true;
    
        if (this.trackHistory) {
            this._history.push({ msgid, ...input, visible, timestamp, updatedtime, messageDiv: messageDiv || null });
            if (this._history.length > this._historyLimit) {
                this._history.shift();
            }
        }
    
        if (this._onMessageAdded) {
            this._onMessageAdded(this, msgid);
        }
    
        return msgid;
    }
    


    /**
     * Adds a new message to the chat (simplified version of messageAddFull)
     * @param {string} [content=''] - Message content (HTML allowed)
     * @param {string} [userString='user'] - Display name for the message sender
     * @param {'left'|'right'|'center'} [align='right'] - Message alignment
     * @param {string} [role='user'] - Role identifier (user, assistant, system)
     * @param {boolean|'smart'} [scrollIntoView=true] - Scroll behavior
     * @param {boolean} [visible=true] - Whether message is initially visible
     * @param {string[]} [tags=[]] - Tags for message categorization
     * @returns {number} Message ID for the newly added message
     * @example
     * // Simple message
     * chat.messageAddNew('Hello!', 'User', 'right');
     * 
     * // Bot message with smart scroll
     * chat.messageAddNew('Hi there!', 'Bot', 'left', 'assistant', 'smart');
     */
    messageAddNew(content = "", userString = "user", align = "right", role = "user", scrollIntoView = true, visible = true, tags = []) {
        let retvalue = this.messageAddFull(
            { content: content, userString: userString, align: align, role: role, scrollIntoView: scrollIntoView, visible: visible, tags: tags }
        );
        // this.messageScrollToBottom();
        return retvalue;
    }

    /**
     * Removes a message from the chat by its ID
     * @param {number} n - Message ID to remove
     * @returns {boolean} True if message was removed, false if not found
     * @example
     * const success = chat.messageRemove(5);
     */
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
    /**
     * Gets the DOM element for a message by its ID
     * @param {number} n - Message ID
     * @returns {HTMLElement|null} The message DOM element or null if not found
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
    /**
     * Gets the content of a message by its ID
     * @param {number} n - Message ID
     * @returns {string} The message content or empty string if not found
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
            // Update history first
            let item = this._history.filter((item) => item.msgid === n)[0];
            item.content += content;
            item.updatedtime = new Date().toISOString();
            
            // If virtual scrolling is active, update the virtual scroller
            if (this.virtualScroller) {
                // Find the item index in virtual scroller
                const index = this.virtualScroller.items.findIndex(item => item.msgid === n);
                if (index >= 0) {
                    this.virtualScroller.items[index].content += content;  // Don't double-sanitize, it's done on render
                    // Re-render if the item is currently visible
                    this.virtualScroller.updateItem(index, { content: this.virtualScroller.items[index].content });
                }
            } else {
                // Regular DOM manipulation
                this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.innerHTML += this._sanitizeContent(content);
            }
            
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
            // Update history first
            let item = this._history.filter((item) => item.msgid === n)[0];
            item.content = content;
            item.updatedtime = new Date().toISOString();
            
            // If virtual scrolling is active, update the virtual scroller
            if (this.virtualScroller) {
                // Find the item index in virtual scroller
                const index = this.virtualScroller.items.findIndex(item => item.msgid === n);
                if (index >= 0) {
                    this.virtualScroller.items[index].content = content;  // Don't double-sanitize, it's done on render
                    // Re-render if the item is currently visible
                    this.virtualScroller.updateItem(index, { content: content });
                }
            } else {
                // Regular DOM manipulation
                this._messagesArea.querySelector(`.quikchat-msgid-${String(n).padStart(10, '0')}`).lastChild.innerHTML = this._sanitizeContent(content);
            }
            
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
        // Always use scrollTop to avoid page jumping
        // This ensures only the chat container scrolls, not the entire page
        this._messagesArea.scrollTop = this._messagesArea.scrollHeight;
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
    /**
     * Gets a slice of message history
     * @param {number} [n] - Start index (defaults to 0)
     * @param {number} [m] - End index (defaults to history length)
     * @returns {Array} Array of message objects
     * @example
     * // Get first 10 messages
     * const messages = chat.historyGet(0, 10);
     * 
     * // Get all messages
     * const allMessages = chat.historyGet();
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

    /**
     * Gets a copy of the entire message history
     * @returns {Array} Complete array of all message objects
     * @example
     * const history = chat.historyGetAllCopy();
     * console.log(`Total messages: ${history.length}`);
     */
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
    /**
     * Searches through message history with various filters
     * @param {Object} [criteria={}] - Search criteria
     * @param {string} [criteria.text] - Text to search for in message content
     * @param {string} [criteria.userString] - Filter by specific user
     * @param {string} [criteria.role] - Filter by role (user, assistant, system)
     * @param {string[]} [criteria.tags] - Filter by tags (messages must have at least one)
     * @param {number} [criteria.limit=100] - Maximum number of results
     * @returns {Array} Array of matching messages
     * @since 1.1.15
     * @example
     * // Search for messages containing 'error'
     * const errors = chat.historySearch({ text: 'error' });
     * 
     * // Find all bot messages
     * const botMessages = chat.historySearch({ role: 'assistant' });
     * 
     * // Complex search
     * const results = chat.historySearch({
     *   text: 'help',
     *   userString: 'Support',
     *   tags: ['urgent'],
     *   limit: 20
     * });
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
    
    /**
     * Gets metadata and statistics about the message history
     * @param {number} [pageSize=50] - Page size for calculating total pages
     * @returns {Object} History information object
     * @returns {number} returns.totalMessages - Total number of messages
     * @returns {number} returns.totalPages - Total pages based on page size
     * @returns {Object|null} returns.oldestMessage - First message info
     * @returns {Object|null} returns.newestMessage - Last message info
     * @returns {Object} returns.memoryUsage - Memory usage statistics
     * @since 1.1.15
     * @example
     * const info = chat.historyGetInfo();
     * console.log(`Messages: ${info.totalMessages}`);
     * console.log(`Memory: ${info.memoryUsage.estimatedSize} bytes`);
     */
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

    /**
     * Clears all messages and resets the chat
     * @returns {void}
     * @example
     * chat.historyClear(); // Removes all messages
     */
    historyClear() {
        this.msgid = 0;
        
        // Handle virtual scroller
        if (this.virtualScroller) {
            this.virtualScroller.clear();
        } else {
            this._messagesArea.innerHTML = "";
        }
        
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
    /**
     * Gets the QuikChat version information
     * @static
     * @returns {Object} Version information object
     * @returns {string} returns.version - Version number (e.g., '1.1.15')
     * @returns {string} returns.license - License type (e.g., 'BSD-2')
     * @returns {string} returns.url - Project URL
     * @returns {boolean} returns.fun - Easter egg flag
     * @example
     * const version = quikchat.version();
     * console.log(`QuikChat v${version.version}`);
     */
    static version() {
        return quikchatVersion;
    }

    /**
     * Built-in content sanitizers for XSS protection
     * @static
     * @type {Object}
     * @property {Function} escapeHTML - Escapes HTML entities
     * @property {Function} stripHTML - Removes all HTML tags
     * @example
     * // Use built-in HTML escaper
     * const chat = new quikchat('#chat', onSend, {
     *   sanitizer: quikchat.sanitizers.escapeHTML
     * });
     */
    static sanitizers = {
        /**
         * Escapes HTML entities to prevent XSS
         * @param {string} str - String to escape
         * @returns {string} Escaped string
         */
        escapeHTML: (str) => {
            if (typeof str !== 'string') return str;
            return str.replace(/[&<>"']/g, (m) => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#39;'
            })[m]);
        },
        
        /**
         * Strips all HTML tags but keeps text content
         * @param {string} str - String to strip
         * @returns {string} Text without HTML tags
         */
        stripHTML: (str) => {
            if (typeof str !== 'string') return str;
            return str.replace(/<[^>]*>/g, '');
        }
    };

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

    /**
     * Generates Lorem Ipsum placeholder text
     * @static
     * @param {number} [numChars] - Length of text to generate (random if not specified)
     * @param {number} [startSpot] - Starting offset in Lorem text (random if not specified)
     * @param {boolean} [startWithCapitalLetter=true] - Whether to capitalize first letter
     * @returns {string} Generated Lorem Ipsum text
     * @example
     * // Generate 100 characters
     * const text = quikchat.loremIpsum(100);
     * 
     * // Generate random length
     * const randomText = quikchat.loremIpsum();
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

    /**
     * Creates a temporary message that updates periodically
     * @static
     * @param {string|HTMLElement} domElement - Element selector or DOM element
     * @param {string} content - Initial message content
     * @param {number} interval - Update interval in milliseconds (min 100ms)
     * @param {Function} [cb=null] - Callback to generate new content
     * @param {string} cb.message - Current message
     * @param {number} cb.count - Update count
     * @returns {void}
     * @example
     * // Simple loading indicator
     * quikchat.tempMessageGenerator('#loading', 'Loading', 500);
     * 
     * // Custom update function
     * quikchat.tempMessageGenerator('#status', 'Processing', 1000, (msg, count) => {
     *   return `Processing... ${count}%`;
     * });
     */
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
      
    /**
     * Sets visibility for all messages with a specific tag
     * @param {string} tagName - Tag name to control
     * @param {boolean} isVisible - Whether to show or hide messages with this tag
     * @returns {boolean} True if successful, false if invalid tag name
     * @since 1.1.14
     * @example
     * // Hide all system messages
     * chat.setTagVisibility('system', false);
     * 
     * // Show urgent messages
     * chat.setTagVisibility('urgent', true);
     */
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

    /**
     * Gets the visibility state of a tag
     * @param {string} tagName - Tag name to check
     * @returns {boolean} True if tag is visible, false otherwise
     * @since 1.1.14
     * @example
     * const isVisible = chat.getTagVisibility('system');
     */
    getTagVisibility(tagName) {
        if (typeof tagName !== 'string' || !/^[a-zA-Z0-9-]+$/.test(tagName)) {
            return false;
        }
        return this._chatWidget.classList.contains(`quikchat-show-tag-${tagName}`);
    }

    /**
     * Gets all active tags in the chat
     * @returns {string[]} Array of all tags currently in use
     * @since 1.1.14
     * @example
     * const tags = chat.getActiveTags();
     * console.log('Active tags:', tags);
     */
    getActiveTags() {
        return Array.from(this._activeTags);
    }

    /**
     * Checks if virtual scrolling is currently enabled
     * @returns {boolean} True if virtual scrolling is enabled, false otherwise
     * @since 1.1.16
     * @example
     * if (chat.isVirtualScrollingEnabled()) {
     *     console.log('Virtual scrolling is active');
     * }
     */
    isVirtualScrollingEnabled() {
        return this.virtualScrollingEnabled && this.virtualScroller !== null;
    }

    /**
     * Gets the virtual scrolling configuration
     * @returns {Object} Virtual scrolling configuration with enabled status and threshold
     * @since 1.1.16
     * @example
     * const config = chat.getVirtualScrollingConfig();
     * console.log(`Virtual scrolling: ${config.enabled}, threshold: ${config.threshold}`);
     */
    getVirtualScrollingConfig() {
        return {
            enabled: this.virtualScrollingEnabled,
            active: this.virtualScroller !== null,
            threshold: this.virtualScrollingThreshold
        };
    }
    
    /**
     * Set the language for the widget
     * @param {string} lang - Language code (e.g., 'en', 'es', 'fr')
     * @param {Object} [translations] - Optional translations object for the language
     * @example
     * chat.setLanguage('es', {
     *   sendButton: 'Enviar',
     *   inputPlaceholder: 'Escribe un mensaje...',
     *   titleDefault: 'Chat'
     * });
     */
    setLanguage(lang, translations) {
        this.lang = lang;
        
        // Add translations if provided
        if (translations) {
            this.translations[lang] = { ...this.translations[lang], ...translations };
        }
        
        // Update current translations
        this.currentTranslations = this.translations[lang] || this.translations['en'];
        
        // Update UI elements
        this._updateUITranslations();
    }
    
    /**
     * Get current language
     * @returns {string} Current language code
     */
    getLanguage() {
        return this.lang;
    }
    
    /**
     * Set text direction (LTR or RTL)
     * @param {string} dir - Direction ('ltr' or 'rtl')
     */
    setDirection(dir) {
        if (dir === 'ltr' || dir === 'rtl') {
            this.dir = dir;
            this._chatWidget.setAttribute('dir', dir);
        }
    }
    
    /**
     * Get current text direction
     * @returns {string} Current direction ('ltr' or 'rtl')
     */
    getDirection() {
        return this.dir;
    }
    
    /**
     * Update UI elements with current translations
     * @private
     */
    _updateUITranslations() {
        // Update send button text
        if (this._sendButton) {
            this._sendButton.textContent = this.currentTranslations.sendButton || 'Send';
        }
        
        // Update input placeholder
        if (this._textEntry) {
            this._textEntry.placeholder = this.currentTranslations.inputPlaceholder || 'Type a message...';
        }
        
        // Update widget language attribute
        if (this._chatWidget) {
            this._chatWidget.setAttribute('lang', this.lang);
        }
    }
    
    /**
     * Sets the content sanitizer function
     * @param {Function|null} sanitizer - Function to sanitize content or null to disable
     * @returns {void}
     * @example
     * // Use built-in HTML escaper
     * chat.setSanitizer(quikchat.sanitizers.escapeHTML);
     * 
     * // Use custom sanitizer (e.g., DOMPurify)
     * chat.setSanitizer((content) => DOMPurify.sanitize(content));
     * 
     * // Disable sanitization
     * chat.setSanitizer(null);
     */
    setSanitizer(sanitizer) {
        if (sanitizer === null || typeof sanitizer === 'function') {
            this._sanitizer = sanitizer;
        } else {
            console.warn('Sanitizer must be a function or null');
        }
    }
    
    /**
     * Gets the current content sanitizer function
     * @returns {Function|null} The current sanitizer function or null
     * @example
     * const sanitizer = chat.getSanitizer();
     * if (sanitizer) {
     *   console.log('Sanitization is enabled');
     * }
     */
    getSanitizer() {
        return this._sanitizer;
    }
    
    /**
     * Internal method to apply sanitizer to content
     * @private
     * @param {string} content - Content to sanitize
     * @returns {string} Sanitized content
     */
    _sanitizeContent(content) {
        if (this._sanitizer && typeof this._sanitizer === 'function') {
            return this._sanitizer(content);
        }
        return content;
    }
}

export default quikchat;
