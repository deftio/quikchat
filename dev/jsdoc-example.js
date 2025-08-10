/**
 * Example of how to add JSDoc documentation to QuikChat methods
 * This provides IDE intellisense and documentation without any TypeScript
 * 
 * Benefits:
 * 1. Works in all JavaScript IDEs (VSCode, WebStorm, etc.)
 * 2. No build step required
 * 3. Documentation stays with the code
 * 4. Can generate HTML docs with JSDoc tool
 * 5. TypeScript users get typing for free
 */

// Example documentation for key QuikChat methods:

/**
 * Sets the contents of the title area
 * @param {string} title - HTML content to display in the title area
 * @param {'left'|'center'|'right'} [align='center'] - Text alignment for the title
 * @returns {void}
 * @example
 * chat.titleAreaSetContents('<h2>Support Chat</h2>', 'center');
 */
titleAreaSetContents(title, align = 'center') {
    this._titleArea.innerHTML = title;
    this._titleArea.style.textAlign = align;
}

/**
 * Adds a new message to the chat with full options
 * @param {Object} options - Message configuration object
 * @param {string} options.content - Message content (HTML allowed)
 * @param {string} [options.userString='user'] - Display name for the message sender
 * @param {'left'|'right'|'center'} [options.align='right'] - Message alignment
 * @param {string} [options.role='user'] - Role identifier (user, assistant, system)
 * @param {number} [options.userID=-1] - User ID for the message
 * @param {string|false} [options.timestamp=false] - ISO timestamp or false for auto
 * @param {string|false} [options.updatedtime=false] - Last updated timestamp
 * @param {boolean|'smart'} [options.scrollIntoView=true] - Scroll behavior
 *   - true: Always scroll to new message
 *   - false: Never scroll
 *   - 'smart': Only scroll if user is near bottom
 * @param {boolean} [options.visible=true] - Whether message is initially visible
 * @param {string[]} [options.tags=[]] - Tags for message categorization
 * @returns {number} Message ID for the newly added message
 * @example
 * const msgId = chat.messageAddFull({
 *   content: 'Hello!',
 *   userString: 'Assistant',
 *   align: 'left',
 *   role: 'assistant',
 *   scrollIntoView: 'smart',
 *   tags: ['greeting', 'bot']
 * });
 */
messageAddFull(options = {}) {
    // Implementation...
}

/**
 * Searches through chat history with filters
 * @param {Object} [filters={}] - Search filters
 * @param {string} [filters.text] - Text to search for in message content
 * @param {string} [filters.userString] - Filter by specific user
 * @param {string} [filters.role] - Filter by role (user, assistant, system)
 * @param {string[]} [filters.tags] - Filter by tags (messages must have at least one)
 * @param {number} [filters.limit=100] - Maximum number of results
 * @returns {Array<Object>} Array of matching messages
 * @example
 * // Find all error messages from the system
 * const errors = chat.historySearch({
 *   text: 'error',
 *   role: 'system',
 *   limit: 50
 * });
 */
historySearch(filters = {}) {
    // Implementation...
}

/**
 * Gets paginated history with metadata
 * @param {number} [page=1] - Page number (1-indexed)
 * @param {number} [pageSize=50] - Number of messages per page
 * @param {'asc'|'desc'} [order='asc'] - Sort order (asc: oldest first, desc: newest first)
 * @returns {Object} Paginated results with metadata
 * @returns {Array} returns.messages - Array of messages for this page
 * @returns {Object} returns.pagination - Pagination metadata
 * @returns {number} returns.pagination.currentPage - Current page number
 * @returns {number} returns.pagination.pageSize - Messages per page
 * @returns {number} returns.pagination.totalPages - Total number of pages
 * @returns {number} returns.pagination.totalMessages - Total message count
 * @returns {boolean} returns.pagination.hasNext - Whether next page exists
 * @returns {boolean} returns.pagination.hasPrevious - Whether previous page exists
 * @example
 * // Get the most recent 20 messages
 * const recent = chat.historyGetPage(1, 20, 'desc');
 * console.log(`Page ${recent.pagination.currentPage} of ${recent.pagination.totalPages}`);
 * recent.messages.forEach(msg => console.log(msg.content));
 */
historyGetPage(page = 1, pageSize = 50, order = 'asc') {
    // Implementation...
}

/**
 * Sets a callback for when messages are appended (useful for streaming)
 * @param {Function} callback - Function to call when content is appended
 * @param {QuikChat} callback.instance - The QuikChat instance
 * @param {number} callback.msgId - ID of the message being appended to
 * @param {string} callback.content - Content being appended
 * @returns {void}
 * @example
 * chat.setCallbackonMessageAppend((instance, msgId, content) => {
 *   console.log(`Streaming: "${content}" added to message ${msgId}`);
 * });
 */
setCallbackonMessageAppend(callback) {
    this._onMessageAppend = callback;
}

// Static methods also benefit from JSDoc:

/**
 * Generates Lorem Ipsum placeholder text
 * @static
 * @param {number} [length] - Length of text to generate (random if not specified)
 * @param {number} [offset] - Starting offset in Lorem text (random if not specified)
 * @param {boolean} [capitalize=true] - Whether to capitalize first letter
 * @returns {string} Generated Lorem Ipsum text
 * @example
 * // Generate 100 characters of Lorem Ipsum
 * const placeholder = QuikChat.loremIpsum(100);
 */
static loremIpsum(length, offset = undefined, capitalize = true) {
    // Implementation...
}

/**
 * Gets the QuikChat version information
 * @static
 * @returns {Object} Version information
 * @returns {string} returns.version - Version number (e.g., "1.1.15")
 * @returns {string} returns.license - License type (e.g., "BSD-2")
 * @returns {string} returns.url - Project URL
 * @returns {boolean} returns.fun - Easter egg flag
 * @example
 * const version = QuikChat.version();
 * console.log(`QuikChat v${version.version}`);
 */
static version() {
    return quikchatVersion;
}