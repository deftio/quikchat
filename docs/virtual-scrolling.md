# Virtual Scrolling (Planned)

> **Status:** Virtual scrolling was implemented in v1.1.16 but lost during a merge. It is planned for re-implementation. The old code exists in git commit `2809f83` for reference.

## What It Will Do

A built-in virtual scroller (`SimpleVirtualScroller`) that renders only the messages currently visible in the viewport. This enables smooth scrolling through tens of thousands of messages by keeping DOM node count constant (~30–50) regardless of total message count.

### Planned Design

- **Threshold-based activation** — switches from normal DOM rendering to virtual scrolling when message count exceeds a configurable threshold (default: 500)
- **Dynamic height measurement** — each message's rendered height is measured once and cached
- **Position estimation** — unmeasured messages use average cached height
- **RAF-throttled scroll** — scroll events batched via `requestAnimationFrame`
- **Spacer elements** — preserve correct scroll height and position
- **Plugin threading** — sanitizer and markdown plugins passed through to the virtual scroller

## Current State

Without virtual scrolling, all messages are rendered as DOM elements. QuikChat handles thousands of messages but performance degrades with very large counts. See the [High-Volume Message Stress Test](../examples/example_virtual_scroll.html) example to test current performance.
