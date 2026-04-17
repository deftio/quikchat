# Virtual Scrolling

QuikChat includes a built-in virtual scroller that renders only the messages currently visible in the viewport. This lets you display tens of thousands of messages without browser slowdown.

## When It Activates

Virtual scrolling activates automatically when the message count exceeds `virtualScrollingThreshold` (default: **500**). Below that threshold, messages are rendered as normal DOM elements.

You can configure the threshold in the constructor options:

```javascript
const chat = new quikchat('#chat', onSend, {
  virtualScrollingThreshold: 200  // activate earlier
});
```

Once activated, the switch is permanent for that widget instance — it won't revert to normal rendering if messages are deleted.

## How It Works

The `SimpleVirtualScroller` class (internal to QuikChat) manages the rendering:

1. **Height caching** — each message's rendered height is measured once and cached. This avoids expensive re-measurement during scroll.
2. **Position estimation** — for messages that haven't been rendered yet, the scroller uses the average cached height to estimate positions.
3. **Viewport calculation** — on each scroll event, the scroller determines which messages are visible and renders only those, plus a small buffer above and below.
4. **RAF throttling** — scroll events are batched using `requestAnimationFrame` to avoid layout thrashing.

The scroller maintains a spacer element above and below the visible messages to preserve the correct scroll height and position.

## Performance Characteristics

| Messages | DOM Nodes | Scroll FPS |
|----------|-----------|------------|
| 100      | ~100      | 60 (no virtual scrolling) |
| 1,000    | ~30–50    | 60 |
| 10,000   | ~30–50    | 60 |
| 50,000   | ~30–50    | 60 |

The number of DOM nodes stays roughly constant regardless of total message count — only the visible window plus buffer is rendered.

## Performance Tips

- **Keep message content simple.** Complex HTML (deeply nested elements, inline styles, images) takes longer to measure and render. Plain text and basic markdown are fastest.
- **Use streaming for long messages.** `messageAppendContent()` updates the existing DOM element rather than creating a new one, so it's more efficient for token-by-token display.
- **Avoid forced reflows.** If you need to read layout properties (width, height, scroll position) while adding many messages in a loop, batch the reads after the loop completes.

## Interaction with Other Features

- **Timestamps** — `messagesAreaShowTimestamps(true)` works with virtual scrolling. Timestamps are included in the rendered message element.
- **Tags and visibility** — `messageSetVisibleByTag()` works correctly. Hidden messages are excluded from the virtual scroller's layout calculations.
- **History export/import** — `historyExport()` and `historyImport()` include all messages regardless of virtual scrolling state.
- **Sanitizer and markdown** — both plugins are passed through to the virtual scroller and applied to each message as it enters the visible window.

## Try It

See the [Virtual Scrolling Stress Test](../examples/example_virtual_scroll.html) example to load 10,000 or 50,000 messages and observe scrolling performance.
