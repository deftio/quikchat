# Virtual Scrolling Technical Documentation

## Overview

QuikChat implements virtual scrolling to efficiently render large message volumes. Virtual scrolling is a technique where only the visible portion of content is rendered in the DOM, significantly reducing memory usage and improving performance.

## Implementation

The virtual scrolling implementation uses a `SimpleVirtualScroller` class that:

1. **Viewport Detection**: Monitors the visible area of the chat container
2. **Dynamic Rendering**: Only creates DOM elements for messages in view plus a buffer zone
3. **Spacer Element**: Maintains correct scroll height with an invisible spacer element
4. **Absolute Positioning**: Positions visible messages absolutely for smooth scrolling
5. **Batch Updates**: Uses `requestAnimationFrame` for efficient re-rendering

## Configuration

Virtual scrolling can be configured during QuikChat initialization:

```javascript
const chat = new quikchat('#chat', handler, {
    virtualScrolling: true,           // Enable/disable (default: true)
    virtualScrollingThreshold: 500    // Message count before activation (default: 500)
});
```

## API Methods

### Check Status
```javascript
// Returns true if virtual scrolling is active
const isActive = chat.isVirtualScrollingEnabled();
```

### Get Configuration
```javascript
const config = chat.getVirtualScrollingConfig();
// Returns: {
//   enabled: boolean,    // Configuration setting
//   active: boolean,     // Currently active
//   threshold: number    // Activation threshold
// }
```

## Performance Metrics

Testing was performed using the `test/performance-benchmark.html` file on a standard development machine.

### Test Configuration
- Browser: Chrome 128
- Machine: MacBook Pro M1
- DOM measurements via Chrome DevTools

### Results: 10,000 Messages

| Rendering Method | Time | DOM Nodes | Memory |
|-----------------|------|-----------|--------|
| Standard DOM | 146,043ms | 40,017 | ~187MB |
| Virtual Scrolling | 38ms | 36 | ~2.1MB |

### Results: 1,000 Messages

| Rendering Method | Time | DOM Nodes | Memory |
|-----------------|------|-----------|--------|
| Standard DOM | 1,420ms | 4,017 | ~19MB |
| Virtual Scrolling | 12ms | 36 | ~1.2MB |

### Results: 100 Messages

| Rendering Method | Time | DOM Nodes | Memory |
|-----------------|------|-----------|--------|
| Standard DOM | 78ms | 417 | ~2.8MB |
| Virtual Scrolling | 8ms | 36 | ~0.8MB |

## How It Works

### 1. Initial Setup
When virtual scrolling is enabled, QuikChat replaces the standard message rendering with a virtual scroller:

```javascript
_initVirtualScrolling() {
    if (this.virtualScrollingEnabled && this._messagesArea) {
        this.virtualScroller = new SimpleVirtualScroller(this._messagesArea, {
            itemHeight: 80,     // Estimated height per message
            buffer: 5           // Extra items to render outside viewport
        });
    }
}
```

### 2. Message Addition
Instead of creating DOM elements immediately, messages are added to an items array:

```javascript
// Virtual scrolling path
this.virtualScroller.addItem({
    msgid: msgId,
    content: message.content,
    userString: message.userString,
    align: message.align,
    visible: message.visible,
    tags: message.tags
});
```

### 3. Viewport Calculation
The scroller calculates which messages should be visible:

```javascript
_updateVisibleRange() {
    const scrollTop = this.container.scrollTop;
    const containerHeight = this.container.clientHeight;
    
    const startIndex = Math.floor(scrollTop / this.itemHeight) - this.buffer;
    const endIndex = Math.ceil((scrollTop + containerHeight) / this.itemHeight) + this.buffer;
    
    this.visibleRange = {
        start: Math.max(0, startIndex),
        end: Math.min(this.items.length, endIndex)
    };
}
```

### 4. DOM Management
Only elements in the visible range are rendered:

```javascript
_renderVisibleItems() {
    // Remove elements outside visible range
    this.renderedElements.forEach((element, index) => {
        if (index < visibleRange.start || index >= visibleRange.end) {
            element.remove();
            this.renderedElements.delete(index);
        }
    });
    
    // Add elements in visible range
    for (let i = visibleRange.start; i < visibleRange.end; i++) {
        if (!this.renderedElements.has(i)) {
            const element = this._createItemElement(this.items[i], i);
            element.style.position = 'absolute';
            element.style.top = `${i * this.itemHeight}px`;
            this.content.appendChild(element);
            this.renderedElements.set(i, element);
        }
    }
}
```

## Limitations

1. **Test Environment**: Virtual scrolling uses `requestAnimationFrame` which requires special handling in test environments (JSDOM doesn't support it natively)
2. **Simple Buffer**: Fixed buffer size rather than dynamic based on scroll velocity
3. **Text-Only Optimization**: Best suited for text messages, not optimized for media

## Browser Compatibility

Virtual scrolling uses standard DOM APIs and is compatible with:
- Chrome 61+
- Firefox 60+
- Safari 12+
- Edge 79+

The implementation gracefully degrades to standard rendering if any required APIs are unavailable.

## Testing

Virtual scrolling functionality is tested in:
- `tests/quikchat.test.js` - Unit tests for virtual scrolling methods
- `test/performance-benchmark.html` - Performance comparison tool
- `test/virtual-scroll-test.html` - Interactive testing interface

## Future Improvements

Potential enhancements for virtual scrolling:

1. **Dynamic Height Support**: Measure and cache actual message heights
2. **Smooth Scrolling**: Implement momentum-based scrolling
3. **Progressive Loading**: Load messages in chunks for very large histories
4. **Variable Buffer**: Adjust buffer size based on scroll speed
5. **Intersection Observer**: Use modern APIs for more efficient viewport detection