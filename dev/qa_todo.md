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

## Implemented features (v1.2.1–v1.2.4)

### 1. Message visibility & tagging — v1.2.1 ✅
- [x] `messageSetVisible(id, visible)` — show/hide a message in the DOM
- [x] `messageGetVisible(id)` — returns boolean
- [x] `messageToggleVisible(id)`
- [x] Hidden messages stay in history but are `display: none` in DOM
- [x] Tagged visibility: `messageSetVisibleByTag(tag, visible)` — group control
- [x] `messageGetTags(id)` / `messageSetTags(id, tags)`
- [x] `messageAddFull` supports `visible` and `tags` options
- [x] Tests: 18 new tests

### 2. i18n / RTL support — v1.2.2 ✅
- [x] `setDirection(dir)` — sets `dir` attribute on widget root ('ltr' or 'rtl')
- [x] `getDirection()` — returns current direction
- [x] RTL CSS: input area flex reversed, send button margin mirrored
- [x] Constructor option: `direction: 'rtl'`
- [x] Tests: 7 new tests

### 3. History export / import — v1.2.3 ✅
- [x] `historyExport()` — returns serializable array (no DOM refs)
- [x] `historyImport(data)` — restores messages from exported data
- [x] Round-trip: export → clear → import produces identical chat
- [x] Preserves visibility, tags, roles, alignment
- [x] Tests: 11 new tests

### 4. Enhanced callbacks — v1.2.4 ✅
- [x] `setCallbackonMessageAppend(fn)` — fires on messageAppendContent
- [x] `setCallbackonMessageReplace(fn)` — fires on messageReplaceContent
- [x] `setCallbackonMessageDelete(fn)` — fires on messageRemove
- [x] Tests: 7 new tests

### 5. quikchat-md-full build — v1.2.4 ✅
- [x] Three-tier build: base (5KB), md (9KB), md-full (14KB gzip)
- [x] quikdown/bd for markdown parsing + postProcessMessage() for fence blocks
- [x] Syntax highlighting via highlight.js (CDN on demand)
- [x] SVG inline rendering with sanitization (no CDN)
- [x] HTML inline rendering via DOMPurify (CDN on demand)
- [x] Math/TeX/LaTeX/KaTeX via MathJax (CDN on demand)
- [x] Mermaid diagrams (CDN on demand)
- [x] GeoJSON maps via Leaflet (CDN on demand)
- [x] CSV/TSV/PSV table rendering (no CDN)
- [x] JSON pretty-print + highlighting (no CDN)
- [x] Post-processing on messageAddNew, messageAddFull, messageAppendContent, messageReplaceContent
- [x] Example page: examples/example_md_full.html with sample buttons
- [x] Tests: 16 tests for md, 16 tests for md-full
- [x] Quikdown theme CSS scoped per quikchat theme (light + dark)

### 6. Virtual scrolling — DEFERRED to 1.3.0
- [ ] Not needed for current use cases (sub-1000 messages per session)
- [ ] Will implement as opt-in (`virtualScroll: true`) when real performance data demands it

## Documentation updates — v1.2.4 ✅
- [x] site/index.html: full API tables with all new methods
- [x] site/index.html: features list updated
- [x] site/index.html: examples list with md and md-full
- [x] docs/api-reference.md: visibility, tags, direction, export/import, callbacks, content processing
- [x] docs/getting-started.md: showTimestamps and direction options
- [x] README.md: three-tier build, features, sizes, examples, build variants table
- [x] site/theming.html: RTL tip
- [x] examples/index.html: markdown basic and full examples with descriptions

## Build / QA final results — v1.2.4

- [x] `npm run lint` — 0 errors, 0 warnings
- [x] `npm test` — 248 tests, 3 suites, all passing
- [x] Coverage: 100% statements, 100% lines, 97.5% branches, 97.5% functions
- [x] `npm run build` — all 9 bundles (3 tiers × 3 formats) + CSS clean

### Bundle sizes

| Build | Minified | Gzipped | CDN loads |
|-------|----------|---------|-----------|
| quikchat (base) | 17 KB | 5 KB | None |
| quikchat-md | 27 KB | 9 KB | None |
| quikchat-md-full | 44 KB | 14 KB | On demand |
| CSS (all themes) | 15 KB | 2.4 KB | None |
