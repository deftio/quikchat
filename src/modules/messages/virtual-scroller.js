/**
 * Virtual Scrolling Module for QuikChat
 * Implements high-performance virtual scrolling to handle 1000+ messages efficiently
 * Only renders visible messages to the DOM, dramatically improving performance
 * 
 * @module virtual-scroller
 * @version 1.1.16-dev1
 */

/**
 * VirtualScroller class - Manages virtual scrolling for message rendering
 * @class
 */
export class VirtualScroller {
    /**
     * Creates a VirtualScroller instance
     * @param {HTMLElement} container - The messages area container
     * @param {Object} options - Configuration options
     * @param {number} [options.itemHeight=80] - Estimated height for unrendered items
     * @param {number} [options.buffer=5] - Number of items to render outside viewport
     * @param {number} [options.scrollDebounce=10] - Scroll event debounce in ms
     * @param {Function} [options.onRenderItem] - Callback when items are rendered
     * @param {Function} [options.onRemoveItem] - Callback when items are removed
     */
    constructor(container, options = {}) {
        this.container = container;
        this.items = [];
        this.itemHeights = new Map();
        this.visibleRange = { start: 0, end: 0 };
        this.renderedElements = new Map();
        
        // Configuration with defaults
        this.config = {
            itemHeight: options.itemHeight || 80,
            buffer: options.buffer || 5,
            scrollDebounce: options.scrollDebounce || 10,
            onRenderItem: options.onRenderItem || (() => {}),
            onRemoveItem: options.onRemoveItem || (() => {})
        };

        // Initialize the virtual scrolling structure
        this._initializeStructure();
        this._attachScrollListener();
        
        // Watch for container size changes
        this.resizeObserver = new ResizeObserver(() => this._handleResize());
        this.resizeObserver.observe(this.container);
    }

    /**
     * Initialize the DOM structure for virtual scrolling
     * @private
     */
    _initializeStructure() {
        // Preserve existing class names
        const existingClasses = this.container.className;
        
        // Clear container but preserve classes
        this.container.innerHTML = '';
        this.container.className = existingClasses;
        
        // Add virtual scrolling structure
        this.container.style.position = 'relative';
        this.container.style.overflow = 'auto';
        
        // Create spacer for total scroll height
        this.spacer = document.createElement('div');
        this.spacer.className = 'virtual-spacer';
        this.spacer.style.cssText = 'position: absolute; top: 0; left: 0; width: 1px; pointer-events: none; z-index: -1;';
        
        // Create content container for visible items
        this.content = document.createElement('div');
        this.content.className = 'virtual-content';
        this.content.style.cssText = 'position: relative; width: 100%;';
        
        this.container.appendChild(this.spacer);
        this.container.appendChild(this.content);
    }

    /**
     * Attach scroll listener with debouncing
     * @private
     */
    _attachScrollListener() {
        let scrollTimeout;
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this._updateVisibleRange();
                    this._renderVisibleItems();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        this.container.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, this.config.scrollDebounce);
            handleScroll(); // Immediate update for responsiveness
        });
    }

    /**
     * Handle container resize
     * @private
     */
    _handleResize() {
        this._updateVisibleRange();
        this._renderVisibleItems();
    }

    /**
     * Calculate which items should be visible based on scroll position
     * @private
     */
    _updateVisibleRange() {
        const scrollTop = this.container.scrollTop;
        const viewportHeight = this.container.clientHeight;
        const scrollBottom = scrollTop + viewportHeight;
        
        let accumulatedHeight = 0;
        let startIndex = 0;
        let endIndex = this.items.length;
        
        // Find start index with binary search for better performance
        for (let i = 0; i < this.items.length; i++) {
            const itemHeight = this.itemHeights.get(i) || this.config.itemHeight;
            if (accumulatedHeight + itemHeight > scrollTop) {
                startIndex = Math.max(0, i - this.config.buffer);
                break;
            }
            accumulatedHeight += itemHeight;
        }
        
        // Find end index
        accumulatedHeight = 0;
        for (let i = 0; i < this.items.length; i++) {
            const itemHeight = this.itemHeights.get(i) || this.config.itemHeight;
            accumulatedHeight += itemHeight;
            if (accumulatedHeight > scrollBottom) {
                endIndex = Math.min(this.items.length, i + this.config.buffer + 1);
                break;
            }
        }
        
        this.visibleRange = { start: startIndex, end: endIndex };
    }

    /**
     * Render only the visible items to the DOM
     * @private
     */
    _renderVisibleItems() {
        const { start, end } = this.visibleRange;
        
        // Calculate offset for positioning visible items
        let offsetTop = 0;
        for (let i = 0; i < start; i++) {
            offsetTop += this.itemHeights.get(i) || this.config.itemHeight;
        }
        
        // Track which elements to keep
        const elementsToKeep = new Set();
        
        // Clear items outside visible range
        this.renderedElements.forEach((element, index) => {
            if (index < start || index >= end) {
                this.config.onRemoveItem(element);
                element.remove();
                this.renderedElements.delete(index);
            } else {
                elementsToKeep.add(index);
            }
        });
        
        // Render visible items
        const fragment = document.createDocumentFragment();
        
        for (let i = start; i < end; i++) {
            const item = this.items[i];
            if (!item) continue;
            
            // Skip if already rendered
            if (this.renderedElements.has(i)) continue;
            
            const element = this._createItemElement(item, i);
            this.renderedElements.set(i, element);
            fragment.appendChild(element);
            
            // Measure actual height after next paint
            requestAnimationFrame(() => {
                if (element.offsetHeight && this.itemHeights.get(i) !== element.offsetHeight) {
                    this.itemHeights.set(i, element.offsetHeight);
                    this._updateSpacerHeight();
                }
            });
        }
        
        // Position content and add new elements
        this.content.style.transform = `translateY(${offsetTop}px)`;
        this.content.appendChild(fragment);
        
        // Sort children by index to maintain order
        const children = Array.from(this.content.children);
        children.sort((a, b) => {
            const aIndex = parseInt(a.getAttribute('data-index'));
            const bIndex = parseInt(b.getAttribute('data-index'));
            return aIndex - bIndex;
        });
        
        // Reorder if needed
        children.forEach(child => this.content.appendChild(child));
        
        this.config.onRenderItem(this.content);
    }

    /**
     * Create DOM element for a message item
     * @private
     * @param {Object} item - Message data
     * @param {number} index - Item index
     * @returns {HTMLElement} Message element
     */
    _createItemElement(item, index) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `quikchat-message quikchat-message-${item.align || 'left'} quikchat-msgid-${String(item.msgid).padStart(10, '0')}`;
        messageDiv.setAttribute('data-index', index);
        messageDiv.setAttribute('data-msgid', item.msgid);
        messageDiv.setAttribute('data-role', item.role || 'user');
        
        // Add alternating classes for styling
        const visibleIndex = this._getVisibleIndex(index);
        messageDiv.classList.add(`quikchat-message-${(visibleIndex % 2) + 1}`);
        
        if (item.tags && item.tags.length > 0) {
            messageDiv.setAttribute('data-tags', item.tags.join(','));
            item.tags.forEach(tag => {
                messageDiv.classList.add(`quikchat-tag-${tag}`);
            });
        }
        
        const userDiv = document.createElement('div');
        userDiv.className = 'quikchat-message-user';
        userDiv.innerHTML = item.userString || '';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'quikchat-message-content';
        contentDiv.innerHTML = item.content || '';
        
        messageDiv.appendChild(userDiv);
        messageDiv.appendChild(contentDiv);
        
        if (!item.visible) {
            messageDiv.style.display = 'none';
        }
        
        return messageDiv;
    }

    /**
     * Get visible index for alternating colors
     * @private
     * @param {number} index - Actual item index
     * @returns {number} Visible index
     */
    _getVisibleIndex(index) {
        let visibleIndex = 0;
        for (let i = 0; i < index; i++) {
            if (this.items[i] && this.items[i].visible !== false) {
                visibleIndex++;
            }
        }
        return visibleIndex;
    }

    /**
     * Update the spacer height to match total content height
     * @private
     */
    _updateSpacerHeight() {
        let totalHeight = 0;
        for (let i = 0; i < this.items.length; i++) {
            totalHeight += this.itemHeights.get(i) || this.config.itemHeight;
        }
        this.spacer.style.height = `${totalHeight}px`;
    }

    /**
     * Add a new message item
     * @param {Object} item - Message data
     * @returns {number} Index of added item
     */
    addItem(item) {
        this.items.push(item);
        const index = this.items.length - 1;
        
        // Update spacer height
        this._updateSpacerHeight();
        
        // Check if we should auto-scroll
        const shouldScroll = item.scrollIntoView === true || 
                           (item.scrollIntoView === 'smart' && this._isNearBottom());
        
        // Re-render if item is in visible range
        if (index >= this.visibleRange.start && index < this.visibleRange.end) {
            this._renderVisibleItems();
        }
        
        // Scroll if needed
        if (shouldScroll) {
            this.scrollToBottom();
        }
        
        return index;
    }

    /**
     * Check if scrolled near bottom
     * @private
     * @returns {boolean} True if near bottom
     */
    _isNearBottom() {
        const threshold = 100; // pixels from bottom
        const { scrollTop, scrollHeight, clientHeight } = this.container;
        return scrollTop + clientHeight >= scrollHeight - threshold;
    }

    /**
     * Update an existing item
     * @param {number} index - Item index
     * @param {Object} updates - Properties to update
     */
    updateItem(index, updates) {
        if (index >= 0 && index < this.items.length) {
            this.items[index] = { ...this.items[index], ...updates };
            
            // Update rendered element if visible
            if (this.renderedElements.has(index)) {
                const element = this.renderedElements.get(index);
                
                // Update content if changed
                if (updates.content !== undefined) {
                    const contentDiv = element.querySelector('.quikchat-message-content');
                    if (contentDiv) contentDiv.innerHTML = updates.content;
                }
                
                // Update visibility if changed
                if (updates.visible !== undefined) {
                    element.style.display = updates.visible ? '' : 'none';
                }
                
                // Re-measure height
                requestAnimationFrame(() => {
                    if (element.offsetHeight) {
                        this.itemHeights.set(index, element.offsetHeight);
                        this._updateSpacerHeight();
                    }
                });
            }
        }
    }

    /**
     * Append content to an existing message
     * @param {number} index - Item index
     * @param {string} content - Content to append
     */
    appendToItem(index, content) {
        if (index >= 0 && index < this.items.length) {
            this.items[index].content = (this.items[index].content || '') + content;
            
            if (this.renderedElements.has(index)) {
                const element = this.renderedElements.get(index);
                const contentDiv = element.querySelector('.quikchat-message-content');
                if (contentDiv) {
                    contentDiv.innerHTML += content;
                    
                    // Re-measure height
                    requestAnimationFrame(() => {
                        if (element.offsetHeight) {
                            this.itemHeights.set(index, element.offsetHeight);
                            this._updateSpacerHeight();
                        }
                    });
                }
            }
        }
    }

    /**
     * Remove an item
     * @param {number} index - Item index to remove
     */
    removeItem(index) {
        if (index >= 0 && index < this.items.length) {
            // Remove from items array
            this.items.splice(index, 1);
            
            // Remove rendered element if exists
            if (this.renderedElements.has(index)) {
                const element = this.renderedElements.get(index);
                this.config.onRemoveItem(element);
                element.remove();
                this.renderedElements.delete(index);
            }
            
            // Update indices for rendered elements
            const newRenderedElements = new Map();
            this.renderedElements.forEach((element, idx) => {
                if (idx > index) {
                    element.setAttribute('data-index', idx - 1);
                    newRenderedElements.set(idx - 1, element);
                } else {
                    newRenderedElements.set(idx, element);
                }
            });
            this.renderedElements = newRenderedElements;
            
            // Update height map indices
            const newHeights = new Map();
            this.itemHeights.forEach((height, idx) => {
                if (idx > index) {
                    newHeights.set(idx - 1, height);
                } else if (idx < index) {
                    newHeights.set(idx, height);
                }
            });
            this.itemHeights = newHeights;
            
            // Update display
            this._updateSpacerHeight();
            this._updateVisibleRange();
            this._renderVisibleItems();
        }
    }

    /**
     * Find item index by message ID
     * @param {number} msgid - Message ID
     * @returns {number} Item index or -1 if not found
     */
    findIndexByMsgId(msgid) {
        return this.items.findIndex(item => item.msgid === msgid);
    }

    /**
     * Clear all items
     */
    clear() {
        // Clean up rendered elements
        this.renderedElements.forEach(element => {
            this.config.onRemoveItem(element);
        });
        
        // Reset everything
        this.items = [];
        this.itemHeights.clear();
        this.renderedElements.clear();
        this.content.innerHTML = '';
        this.spacer.style.height = '0px';
        this.visibleRange = { start: 0, end: 0 };
    }

    /**
     * Scroll to bottom of messages
     */
    scrollToBottom() {
        this.container.scrollTop = this.container.scrollHeight;
    }

    /**
     * Scroll to a specific item
     * @param {number} index - Item index
     */
    scrollToItem(index) {
        if (index >= 0 && index < this.items.length) {
            let offsetTop = 0;
            for (let i = 0; i < index; i++) {
                offsetTop += this.itemHeights.get(i) || this.config.itemHeight;
            }
            this.container.scrollTop = offsetTop;
        }
    }

    /**
     * Get currently visible items
     * @returns {Array} Visible items
     */
    getVisibleItems() {
        return this.items.slice(this.visibleRange.start, this.visibleRange.end);
    }

    /**
     * Force re-render of visible items
     */
    forceUpdate() {
        this._updateVisibleRange();
        this._renderVisibleItems();
    }

    /**
     * Get all items
     * @returns {Array} All items
     */
    getAllItems() {
        return this.items;
    }

    /**
     * Destroy the virtual scroller
     */
    destroy() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        
        this.renderedElements.forEach(element => {
            this.config.onRemoveItem(element);
        });
        
        this.container.innerHTML = '';
        this.items = [];
        this.itemHeights.clear();
        this.renderedElements.clear();
    }
}

/**
 * Factory function to create a VirtualScroller instance
 * @param {HTMLElement} container - Container element
 * @param {Object} options - Configuration options
 * @returns {VirtualScroller} VirtualScroller instance
 */
export function createVirtualScroller(container, options) {
    return new VirtualScroller(container, options);
}