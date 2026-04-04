# QuikChat QA TODO — Resize & Layout Fixes

Issues discovered via Playwright resize probing (2026-04-03).
Check off items as they are completed.

## CSS Bugs

- [x] **Bug 1: Dark theme typo** — `.quikchat-theme-darl` fixed to `.quikchat-theme-dark` in `dist/quikchat.css`.

- [x] **Bug 2: Horizontal overflow from `width: 100%` + padding + `content-box`** — Removed `width: 100%` from `.quikchat-messages-area` and `.quikchat-input-area`. Flex column children stretch by default.

- [x] **Bug 3: Inconsistent `box-sizing` across widget elements** — Added scoped `box-sizing: border-box` reset for `.quikchat-base` and all descendants.

- [x] **Bug 4: Widget overflows parent below `min-height`/`min-width`** — Changed to `min-height: min(200px, 100%)` and `min-width: min(200px, 100%)`. Added `overflow: hidden` on `.quikchat-base`.

## JavaScript Bugs

- [x] **Bug 5: `_adjustMessagesAreaHeight()` calc formula was wrong** — Removed entirely. Layout now handled by CSS flexbox with `flex: 1; min-height: 0;` on messages area and `flex-shrink: 0` on title/input areas.

- [x] **Bug 6: No `ResizeObserver` — parent-only resize went undetected** — Added `ResizeObserver` on parent element. Removed dead `window.resize` and `chatWidget.resize` listeners.

- [x] **Removed `_adjustSendButtonWidth()`** — CSS `min-width: 5rem` in stylesheet is sufficient.

- [x] **Bug 7: `trackHistory` was always `true`** — `meta.trackHistory || true` always evaluates to `true`. Fixed to `meta.trackHistory !== false`.

- [x] **Bug 8: `historyGetMessageContent()` returned `undefined`** — Referenced `.message` but history stores `.content`. Fixed.

- [x] **Bug 9: `historyGetMessage()` didn't return the entry** — Missing `return` statement. Fixed.

- [x] **Bug 10: `inputAreaToggle()` had vestigial `classList.toggle('hidden')`** — Removed.

- [x] **Dead code: second `typeof numChars` check in `loremIpsum`** — Removed unreachable branch.

## CSS Improvements

- [x] Removed redundant `padding-left` / `padding-right` on `.quikchat-title-area` (overridden by shorthand `padding: 8px`).

- [x] Removed `width: 100%` from `.quikchat-messages-area` and `.quikchat-input-area`.

- [x] Removed `width: 75%` from `.quikchat-theme-dark .quikchat-input-textbox` (was conflicting with `flex-grow: 1`).

## ARIA Accessibility

- [x] Added `role="log"`, `aria-live="polite"`, `aria-label="Chat messages"` to messages area.

- [x] Added `aria-label="Type a message"` to textarea.

## Test Coverage

### Jest tests (unit-level) — 107 tests, all passing

- [x] Test: initialization with default options
- [x] Test: initialization with CSS selector string
- [x] Test: initialization with custom options (theme, title, alignment)
- [x] Test: initialization with null onSend callback
- [x] Test: initialization with missing titleArea/messagesArea options
- [x] Test: trackHistory=false disables history
- [x] Test: widget structure and all ARIA attributes
- [x] Test: title area show/hide/toggle/set/get
- [x] Test: input area show/hide/toggle
- [x] Test: _handleContainerResize does not throw
- [x] Test: ResizeObserver setup when available (mocked)
- [x] Test: ResizeObserver callback invokes _handleContainerResize
- [x] Test: no inline height style on messages area
- [x] Test: message add/remove/get/append/replace (golden paths)
- [x] Test: message operations on non-existent IDs (error paths)
- [x] Test: alternating message classes
- [x] Test: scroll behavior (userScrolledUp true/false)
- [x] Test: messages area alternating colors (enable/disable/toggle/default)
- [x] Test: history get all/range/single/negative index
- [x] Test: history clear/length/getMessage/getMessageContent
- [x] Test: history limit enforcement
- [x] Test: theme change/cycle/getter
- [x] Test: callbacks (onSend, onMessageAdded, Shift+Enter, edge cases)
- [x] Test: version() static method
- [x] Test: loremIpsum (exact length, deterministic, random, wrapping, no trailing whitespace)
- [x] Test: edge cases (empty content, HTML content, very long messages, rapid add/remove, double remove)

### Coverage results
- Statements: 100%
- Branches: 98.63%
- Functions: 97.67%
- Lines: 100%

## Build / Dist

- [x] Regenerated `dist/quikchat.min.css` via `tools/minifyCSS.cjs`
- [x] Rebuilt all dist JS files via rollup (UMD, CJS, ESM — minified and unminified)
- [x] Full lint + test suite passes
- [ ] Remove `@playwright/test` from devDependencies if not keeping Playwright tests long-term
