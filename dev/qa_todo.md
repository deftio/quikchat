# QuikChat Feature Re-implementation Checklist

Base: v1.2.0 (tagged on `feature/build-tooling-and-ci`)
Branch: `quikchat-update-features`
Rule: bump version +0.0.1 per feature, maintain 100% test coverage on new lines.

## Already in 1.2.0 (verified present)

- [x] ARIA: `role="log"`, `aria-live="polite"`, `aria-label` on messages area and textarea
- [x] ARIA: scroll-to-bottom button with `aria-label`
- [x] Sanitization pipeline: `_processContent()` with `sanitize` option (true/function)
- [x] Message formatter: `messageFormatter` option, `setMessageFormatter()`, `setSanitize()`
- [x] `_escapeHTML()` built-in sanitizer
- [x] Typing indicator: `messageAddTypingIndicator()` with CSS dots animation
- [x] Typing indicator auto-cleared on `messageAppendContent()` / `messageReplaceContent()`
- [x] Role classes: `quikchat-role-{role}` on each message
- [x] Alignment classes: `quikchat-align-{align}` on each message
- [x] `quikchat-message-content` wrapper div
- [x] Timestamps: `_formatTimestamp()`, `messagesAreaShowTimestamps()`, toggle, get
- [x] `inputAreaSetEnabled()` — disable/enable input + send button
- [x] `inputAreaSetButtonText()` / `inputAreaGetButtonText()`
- [x] Scroll-to-bottom button (CSS + JS)
- [x] Auto-grow textarea
- [x] Ctrl+End keyboard shortcut to scroll to bottom
- [x] Empty message guard (don't fire onSend for blank input)
- [x] `scrollToBottom()` public method
- [x] Modern bubble theme (quikchat-theme-modern)
- [x] Disabled input styling (CSS opacity + cursor)
- [x] Focus indicators (CSS)

## To implement — from 1.1.17 (re-implement from scratch)

### 1. Message visibility & tagging — v1.2.1 ✅
- [x] `messageSetVisible(id, visible)` — show/hide a message in the DOM
- [x] `messageGetVisible(id)` — returns boolean
- [x] `messageToggleVisible(id)`
- [x] Hidden messages stay in history but are `display: none` in DOM
- [x] Tagged visibility: `messageSetVisibleByTag(tag, visible)` — group control
- [x] `messageGetTags(id)` / `messageSetTags(id, tags)`
- [x] `messageAddFull` supports `visible` and `tags` options
- [x] Tests: 18 new tests, all passing, 100% statement/line coverage

### 2. i18n / RTL support — v1.2.2 ✅
- [x] `setDirection(dir)` — sets `dir` attribute on widget root ('ltr' or 'rtl')
- [x] `getDirection()` — returns current direction
- [x] RTL CSS: input area flex reversed, send button margin mirrored
- [x] Constructor option: `direction: 'rtl'`
- [x] Tests: 7 new tests, all passing, 100% statement/line coverage

### 3. History export / import — v1.2.3 ✅
- [x] `historyExport()` — returns serializable array (no DOM refs)
- [x] `historyImport(data)` — restores messages from exported data
- [x] Round-trip: export → clear → import produces identical chat
- [x] Preserves visibility, tags, roles, alignment
- [x] Tests: 11 new tests, all passing, 97.4% branch coverage

### 4. Enhanced callbacks — v1.2.4
- [ ] `setCallbackonMessageAppend(fn)` — fires on messageAppendContent
- [ ] `setCallbackonMessageReplace(fn)` — fires on messageReplaceContent
- [ ] `setCallbackonMessageDelete(fn)` — fires on messageRemove
- [ ] Tests: each callback fires with correct args

### 5. Virtual scrolling — v1.2.5 (if needed)
- [ ] Evaluate whether this is needed for the 1.2.x line
- [ ] If yes: implement as opt-in (`virtualScroll: true` in options)
- [ ] Must not break existing scroll behavior when disabled
- [ ] Tests: large message volume rendering, scroll position preservation

## Build / QA gates (must pass before each version bump)

- [ ] `npm run lint` — 0 errors
- [ ] `npm test` — all passing, 100% statement coverage on new code
- [ ] `npm run build` — clean build with size report
