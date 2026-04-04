# QuikChat Enhancement Plan

This document covers four enhancements discussed for quikchat v1.2+. Each section includes the problem, design, API, and implementation notes.

---

## 1. Markdown Support

### Problem

LLMs return markdown (code blocks, bold, lists, headers). Currently quikchat renders raw HTML via `innerHTML` — markdown shows as plain text unless the user pre-processes it.

### Design Options

| Option | Bundle size | Pros | Cons |
|---|---|---|---|
| **A. `messageFormatter` callback** | 0 KB added | Zero-dep, user brings their own renderer | User must find, import, and wire up a markdown lib |
| **B. Bundle quikdown** | ~9 KB added | Same author, zero-dep, BSD-2, already tested | quikchat is no longer truly zero-dep in the bundled build |
| **C. Dual builds** | 0 / ~9 KB | Choice of `quikchat.umd.js` (no markdown) or `quikchat-md.umd.js` (with quikdown) | Two builds to maintain, potential user confusion |
| **D. A + C combined** | 0 / ~9 KB | Base build has the hook, markdown build ships with quikdown pre-wired | Best of both worlds |

### Recommendation: Option D

Ship **both** a formatter hook (Option A) and a quikdown-bundled build (Option C).

**Phase 1 — formatter hook (no new deps, ships in v1.2):**

```javascript
const chat = new quikchat('#chat', onSend, {
  messageFormatter: (content) => myMarkdownLib(content)
});
```

The hook is called in `messageAddFull()` and `messageAppendContent()` before writing to `innerHTML`. Default is `null` (no formatting, current behavior preserved).

Implementation in `messageAddFull()`:

```javascript
const formatted = this._messageFormatter ? this._messageFormatter(input.content) : input.content;
contentDiv.innerHTML = formatted;
```

For `messageAppendContent()`, the formatter needs to run on the **full accumulated content**, not just the appended delta, because markdown is context-dependent (a `*` might start bold or be a list item depending on what precedes it):

```javascript
messageAppendContent(n, content) {
    const item = this._history.find(e => e.msgid === n);
    item.content += content;
    const formatted = this._messageFormatter ? this._messageFormatter(item.content) : item.content;
    msgElement.lastChild.innerHTML = formatted;
}
```

This means the formatter re-runs on the full message text each time a token appends. For a 9KB lib like quikdown this is fast. For heavier libs, users can debounce in their formatter function.

**Phase 2 — quikdown-bundled build (ships alongside, optional):**

Add a rollup config that imports quikdown and pre-wires the formatter. Separate builds, separate file names:

```
dist/quikchat.umd.js              ← base (no markdown)
dist/quikchat.umd.min.js
dist/quikchat.cjs.js
dist/quikchat.cjs.min.js
dist/quikchat.esm.js
dist/quikchat.esm.min.js
dist/quikchat.css
dist/quikchat.min.css

dist/quikchat-md.umd.js           ← quikdown bundled, formatter pre-wired
dist/quikchat-md.umd.min.js
dist/quikchat-md.cjs.js
dist/quikchat-md.cjs.min.js
dist/quikchat-md.esm.js
dist/quikchat-md.esm.min.js
dist/quikchat-md.css               ← base CSS + markdown typography
dist/quikchat-md.min.css
```

The `-md` build would set `messageFormatter` to quikdown's render function by default. Users of the base build can still use any markdown library via the hook. The size reporter (`tools/reportSizes.cjs`) already supports both groups and will show `-md` sizes automatically once those files exist.

### Quikdown Specifics

- **Package**: `quikdown` on npm, github.com/deftio/quikdown
- **Size**: ~9 KB core
- **API**: function call — pass markdown string, get HTML string
- **Features**: bold, italic, strikethrough, code/code blocks, headings, lists (including task lists), links, auto-URL detection, tables, blockquotes, horizontal rules
- **Does NOT support**: reference-style links, footnotes, definition lists
- **Dependencies**: zero runtime deps
- **License**: BSD-2 (same as quikchat)
- **Extras**: fence plugins for custom rendering, bidirectional conversion (HTML→markdown), optional editor component — none of which we'd need for the basic formatter

### CSS for Markdown

Rendered markdown needs basic typography styles. These should go in a separate optional CSS file (not in quikchat.css) or be provided by the user:

```
dist/quikchat-md.css           ← optional typography for rendered markdown
```

This keeps the base CSS lean and doesn't force markdown styles on non-markdown users.

---

## 2. Input Area Flexibility

### Problem

The input area is a fixed textarea + Send button. LLM use cases commonly need:
- Disable input while the bot is responding
- Change button text ("Send" → "Stop")
- Show a loading/thinking indicator

### Design

Add a small set of methods that cover 80% of use cases without over-engineering:

```javascript
// Enable / disable the entire input area (textarea + button)
chat.inputAreaSetEnabled(true);    // default
chat.inputAreaSetEnabled(false);   // greys out textarea, disables button

// Change button text
chat.inputAreaSetButtonText('Stop');
chat.inputAreaSetButtonText('Send');  // back to default

// Get current button text
chat.inputAreaGetButtonText();  // 'Send'
```

### Implementation

```javascript
inputAreaSetEnabled(enabled) {
    this._textEntry.disabled = !enabled;
    this._sendButton.disabled = !enabled;
}

inputAreaSetButtonText(text) {
    this._sendButton.textContent = text;
}

inputAreaGetButtonText() {
    return this._sendButton.textContent;
}
```

CSS for disabled state (base CSS, not theme):

```css
.quikchat-input-textbox:disabled,
.quikchat-input-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

Themes can override the disabled appearance:

```css
.my-theme .quikchat-input-send-btn:disabled {
    background-color: #999;
}
```

### Usage Pattern

```javascript
const chat = new quikchat('#chat', async (chat, msg) => {
    chat.messageAddNew(msg, 'user', 'right');
    chat.inputAreaSetEnabled(false);
    chat.inputAreaSetButtonText('Thinking...');

    const id = await streamLLMResponse(chat, msg);

    chat.inputAreaSetEnabled(true);
    chat.inputAreaSetButtonText('Send');
});
```

---

## 3. Message Role Grouping

### Problem

User messages, bot messages, system messages, and tool-call results all render identically. There's no CSS hook to style them differently by role.

### Design

When a message is created in `messageAddFull()`, add a CSS class derived from the `role` parameter:

```javascript
messageDiv.classList.add('quikchat-role-' + (input.role || 'user'));
```

This produces classes like:
- `quikchat-role-user`
- `quikchat-role-assistant`
- `quikchat-role-system`
- `quikchat-role-tool`

### Base CSS

No default styling — the classes are hooks only. This avoids breaking existing behavior.

```css
/* No base styles for role classes — they're pure hooks for themes */
```

### Theme Usage

Themes (or user CSS) can then target roles:

```css
.my-theme .quikchat-role-system .quikchat-message-content {
    color: #888;
    font-style: italic;
}

.my-theme .quikchat-role-assistant .quikchat-user-label {
    color: #1976d2;
}

.my-theme .quikchat-role-tool .quikchat-message-content {
    background-color: #f5f5f5;
    border-left: 3px solid #ff9800;
    padding-left: 8px;
}
```

### Alignment Convention (Documentation)

Document a convention (not enforced in code):

| Role | Typical `align` | Typical `userString` |
|---|---|---|
| `user` | `'right'` | User's name |
| `assistant` | `'left'` | Bot/model name |
| `system` | `'center'` | `'system'` |
| `tool` | `'left'` | Tool name |

### Impact

- Fully backward compatible — no existing behavior changes
- One line of code added to `messageAddFull()`
- Opens up significant styling possibilities for LLM/tool-call use cases
- Zero cost if unused

---

## 4. History API Cleanup

### Problem

The current history API has inconsistencies:

1. **`historyGet(n, m)` is overloaded and confusing:**
   - `historyGet()` → all messages (OK)
   - `historyGet(3)` → just message at index 3 (unexpected — looks like "first 3")
   - `historyGet(-3)` → last 3 messages (OK, but `m` is undefined which triggers `m = n < 0 ? m : n + 1` where `m` evaluates to `undefined`)
   - `historyGet(2, 5)` → slice(2, 5) (OK)

2. **Index vs ID confusion:**
   - `historyGetMessage(n)` takes an **array index**
   - `messageGetContent(msgid)` takes a **message ID**
   - These look similar but work differently

3. **`historyGetMessageContent(n)` throws if index is out of bounds** (no guard)

### Proposed Fixes

#### 4a. Fix `historyGet()` semantics (breaking change — v2, or deprecation path)

The cleanest API would be:

```javascript
chat.historyGet()         // all messages
chat.historyGet(n)        // last n messages (always a count)
chat.historyGet(n, m)     // slice from index n to m
```

But changing `historyGet(3)` from "message at index 3" to "last 3 messages" is a breaking change. Options:

**Option A: Fix in v2** — document the current behavior clearly, fix in next major version.

**Option B: Deprecate + new method** — add `historySlice(start, end)` and `historyRecent(n)` with clear semantics, deprecate `historyGet(n)` single-arg form.

**Recommendation: Option A.** The current behavior is quirky but functional, and the LLM integration examples all use `historyGet()` with zero args. Document it clearly and fix in v2.

For now, fix the bug where `historyGet(-3)` evaluates `m` as `undefined`:

```javascript
historyGet(n, m) {
    if (n === undefined) {
        return this._history.slice();  // all messages (defensive copy)
    }
    if (m === undefined) {
        if (n < 0) {
            return this._history.slice(n);  // last |n| messages
        }
        return this._history.slice(n, n + 1);  // single message at index n
    }
    return this._history.slice(n, m);
}
```

#### 4b. Add bounds checking to `historyGetMessageContent(n)`

```javascript
historyGetMessageContent(n) {
    if (n >= 0 && n < this._history.length) {
        return this._history[n].content;
    }
    return "";
}
```

#### 4c. Document the index-vs-ID distinction clearly

In the API reference, make the distinction explicit:

- **By array index** (position in the history array): `historyGetMessage(n)`, `historyGetMessageContent(n)`
- **By message ID** (returned by `messageAddNew`/`messageAddFull`): `messageGetContent(msgid)`, `messageAppendContent(msgid, ...)`, `messageRemove(msgid)`, `messageGetDOMObject(msgid)`

The message ID is stable (doesn't change when other messages are removed). The array index shifts as messages are added or removed.

---

## Implementation Status

| Enhancement | Status | Notes |
|---|---|---|
| Message role classes | **DONE** | `quikchat-role-{role}` class on each message div |
| Alignment classes | **DONE** | `quikchat-align-{left/right/center}` on each message div |
| Input area flexibility | **DONE** | `inputAreaSetEnabled()`, `inputAreaSetButtonText()`, `inputAreaGetButtonText()`, disabled CSS |
| History bounds fix | **DONE** | `historyGetMessageContent()` bounds check, `historyGet(-n)` fix, `historyGet()` returns copy |
| `messageFormatter` hook | **DONE** | `messageFormatter` option + `setMessageFormatter()` runtime setter |
| HTML sanitization | **DONE** | `sanitize` option (true/function) + `setSanitize()` runtime setter |
| Content processing pipeline | **DONE** | `_processContent()`: sanitize → format → innerHTML |
| Typing indicator | **DONE** | `messageAddTypingIndicator()` with CSS pulsing dots, auto-cleared by append/replace |
| Quikdown bundled build | **DONE** | `quikchat-md` subclass in `src/quikchat-md.js`, 6 `-md` dist files |
| Modern bubble theme | **DONE** | `quikchat-theme-modern` using alignment classes for chat-bubble layout |
| Build size reporter | **DONE** | `tools/reportSizes.cjs` shows both base and -md groups |
| Docs update | **DONE** | All docs updated for new features |
| README rewrite | **DONE** | Leads with LLM use case, covers all new features |
| History API redesign | Planned | v2.0 breaking change — `historyGet(n)` means "last n" |

## Build Output

- 12 dist files: 6 base + 6 `-md` (UMD/CJS/ESM, each raw + minified)
- Base UMD min: ~3.3 KB gzipped
- `-md` UMD min: ~7 KB gzipped (includes quikdown)
- CSS: ~1.7 KB gzipped
- 148 tests, 100% coverage
- 14/14 Playwright e2e tests passing
