# API Reference

## Constructor

```javascript
const chat = new quikchat(parentElement, onSend, options);
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `parentElement` | `string \| Element` | — | CSS selector or DOM element. Required. |
| `onSend` | `function` | no-op | `(chatInstance, messageText) => {}` called on Send click or Shift+Enter |
| `options` | `object` | see below | Configuration object |

### Options

```javascript
{
  theme: 'quikchat-theme-light',
  trackHistory: true,
  titleArea: { title: "Chat", show: false, align: "center" },
  messagesArea: { alternating: true }
}
```

| Option | Type | Default | Description |
|---|---|---|---|
| `theme` | `string` | `'quikchat-theme-light'` | CSS class for theme |
| `trackHistory` | `boolean` | `true` | Store messages in internal history array |
| `titleArea.title` | `string` | `"Chat"` | Title text (supports HTML) |
| `titleArea.show` | `boolean` | `false` | Show title area on init |
| `titleArea.align` | `string` | `"center"` | `'left'`, `'center'`, or `'right'` |
| `messagesArea.alternating` | `boolean` | `true` | Alternating row backgrounds |
| `sanitize` | `boolean \| function` | `false` | `true` to escape HTML entities, or a `(content) => cleanedContent` function |
| `messageFormatter` | `function \| null` | `null` | `(content) => html` — transforms content before display (e.g., markdown renderer) |
| `showTimestamps` | `boolean` | `false` | Show timestamps on messages |
| `direction` | `string` | `'ltr'` | Text direction: `'ltr'` or `'rtl'` |

---

## Message Methods

### messageAddNew(content, userString, align, role)

Add a new message. Returns the message ID (integer).

```javascript
const id = chat.messageAddNew('Hello!', 'Alice', 'left', 'user');
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `content` | `string` | `""` | Message text or HTML |
| `userString` | `string` | `"user"` | Display name shown above the message |
| `align` | `string` | `"right"` | `'left'`, `'right'`, or `'center'` |
| `role` | `string` | `"user"` | Role tag — stored in history and added as a CSS class (see [Message Role Classes](#message-role-classes)) |

### messageAddFull(input)

Add a message with full control. Returns the message ID.

```javascript
const id = chat.messageAddFull({
  content: 'Hello!',
  userString: 'Alice',
  align: 'left',
  role: 'user',
  userID: 42
});
```

| Field | Type | Default | Description |
|---|---|---|---|
| `content` | `string` | `""` | Message text or HTML |
| `userString` | `string` | `"user"` | Display name |
| `align` | `string` | `"right"` | Alignment |
| `role` | `string` | `"user"` | Role tag |
| `userID` | `number` | `-1` | Numeric user identifier |

### messageAppendContent(msgid, content)

Append text to an existing message. Used for streaming token-by-token responses. Returns `true` on success, `false` if the message ID was not found.

```javascript
chat.messageAppendContent(id, ' world');
```

### messageReplaceContent(msgid, content)

Replace the entire content of an existing message. Returns `true` on success.

```javascript
chat.messageReplaceContent(id, 'Updated message');
```

### messageGetContent(msgid)

Get the content string of a message by its ID. Returns `""` if not found.

```javascript
const text = chat.messageGetContent(id);
```

### messageAddTypingIndicator(userString, align)

Show an animated "..." typing indicator. Returns the message ID. The dots auto-clear when you call `messageAppendContent()` or `messageReplaceContent()` on the same ID.

```javascript
const id = chat.messageAddTypingIndicator('bot', 'left');

// Later, when streaming starts:
chat.messageReplaceContent(id, firstToken);   // clears dots, shows first token
chat.messageAppendContent(id, nextToken);     // appends subsequent tokens
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `userString` | `string` | `""` | Display name |
| `align` | `string` | `"left"` | `'left'`, `'right'`, or `'center'` |

The indicator uses a CSS animation (pulsing dots). The message gets the `quikchat-typing` class, which is removed automatically by `messageAppendContent()` and `messageReplaceContent()`.

### messageGetDOMObject(msgid)

Get the DOM element of a message by its ID. Returns `null` if not found.

```javascript
const el = chat.messageGetDOMObject(id);
el.style.backgroundColor = 'yellow'; // highlight it
```

### messageRemove(msgid)

Remove a message from the display and history. Returns `true` on success.

```javascript
chat.messageRemove(id);
```

---

## Message Role Classes

Every message div gets a CSS class based on its `role` parameter: `quikchat-role-{role}`. This lets you style messages differently by type.

| Role | CSS Class | Typical Use |
|---|---|---|
| `'user'` | `.quikchat-role-user` | Human user messages (default) |
| `'assistant'` | `.quikchat-role-assistant` | LLM/bot responses |
| `'system'` | `.quikchat-role-system` | System notices, status messages |
| `'tool'` | `.quikchat-role-tool` | Tool call results, function outputs |

If `role` is empty or not provided, it defaults to `'user'`.

These classes are CSS hooks only — no default styling is applied. Use them in your theme or custom CSS:

```css
/* Style system messages differently */
.my-theme .quikchat-role-system .quikchat-message-content {
    color: #888;
    font-style: italic;
}

/* Highlight tool call results */
.my-theme .quikchat-role-tool .quikchat-message-content {
    border-left: 3px solid #ff9800;
}
```

The `role` value also maps directly to LLM API role fields (`'user'`, `'assistant'`, `'system'`), so `historyGet()` output is API-compatible.

---

## History Methods

QuikChat stores every message in an internal array (when `trackHistory` is `true`). Each history entry is an object:

```javascript
{
  msgid: 0,                          // integer ID
  content: "Hello!",                 // message text
  userString: "Alice",               // display name
  align: "left",                     // alignment
  role: "user",                      // role tag
  timestamp: "2024-01-15T10:30:00Z", // ISO 8601 created time
  updatedtime: "2024-01-15T10:30:05Z", // ISO 8601 last updated (for appended messages)
  messageDiv: Element                // DOM reference
}
```

The `role` and `content` fields are directly compatible with OpenAI/Ollama/Mistral chat completion APIs — you can pass `historyGet()` straight into an API call.

**Important: index vs ID.** History methods take an **array index** (position in the history array). Message methods like `messageGetContent()`, `messageAppendContent()`, `messageRemove()` take a **message ID** (the integer returned by `messageAddNew`/`messageAddFull`). The message ID is stable — it doesn't change when other messages are removed. The array index shifts as messages are added or removed.

### historyGet(n, m)

Get a slice of the history array. Returns a copy (modifications don't affect internal state).

```javascript
chat.historyGet();        // all messages (copy of the full array)
chat.historyGet(0, 5);    // first 5 messages (indices 0–4)
chat.historyGet(3);       // single message at index 3
chat.historyGet(-3);      // last 3 messages
```

### historyGetLength()

```javascript
const count = chat.historyGetLength();
```

### historyGetMessage(n)

Get a single history entry by array index. Returns `{}` if out of bounds.

```javascript
const msg = chat.historyGetMessage(0); // first message
```

### historyGetMessageContent(n)

Get just the content string of a history entry by array index. Returns `""` if out of bounds.

```javascript
const text = chat.historyGetMessageContent(0);
```

### historyClear()

Clear all messages from history and reset the message ID counter. Does **not** remove messages from the DOM.

```javascript
chat.historyClear();
```

### historyExport()

Returns a serializable array of history entries (no DOM references). Safe for `JSON.stringify()`, localStorage, or sending to a server.

```javascript
const data = chat.historyExport();
localStorage.setItem('chat-history', JSON.stringify(data));
```

### historyImport(data)

Restore messages from previously exported data. **Clears existing messages first** (both DOM and history).

```javascript
const data = JSON.parse(localStorage.getItem('chat-history'));
chat.historyImport(data);
```

Round-trip: `historyExport()` → `historyImport()` produces identical chat content, preserving visibility, tags, roles, and alignment.

---

## Message Visibility & Tagging

Messages can be hidden from the DOM while remaining in history. This is useful for system prompts, tool-calling results, and debug messages that should be part of the conversation context but not visible to the user.

### messageSetVisible(id, visible)

```javascript
chat.messageSetVisible(msgid, false);  // hide message
chat.messageSetVisible(msgid, true);   // show message
```

Returns `true` on success, `false` if the message ID doesn't exist.

### messageGetVisible(id)

```javascript
chat.messageGetVisible(msgid);  // true or false
```

### messageToggleVisible(id)

```javascript
chat.messageToggleVisible(msgid);
```

### messageSetVisibleByTag(tag, visible)

Show or hide all messages that have a given tag. Returns the number of messages affected.

```javascript
// Hide all tool-call messages
chat.messageSetVisibleByTag('tool-call', false);

// Show debug messages
chat.messageSetVisibleByTag('debug', true);
```

### messageGetTags(id) / messageSetTags(id, tags)

```javascript
chat.messageGetTags(msgid);              // ['tool-call', 'debug']
chat.messageSetTags(msgid, ['important']);
```

### Adding tagged/hidden messages

Use `messageAddFull()` with `visible` and `tags` options:

```javascript
// System prompt — in history for LLM context, but hidden in UI
const sysId = chat.messageAddFull({
  content: 'You are a helpful assistant.',
  userString: 'system',
  align: 'center',
  role: 'system',
  visible: false,
  tags: ['system-prompt']
});

// Tool call result — hidden by default, can be shown for debugging
chat.messageAddFull({
  content: JSON.stringify(toolResult),
  userString: 'tool',
  align: 'left',
  role: 'tool',
  visible: false,
  tags: ['tool-call', 'debug']
});
```

---

## Direction (RTL/LTR)

### setDirection(dir)

Set the widget text direction. Flips the input area layout for RTL languages.

```javascript
chat.setDirection('rtl');  // Arabic, Hebrew, etc.
chat.setDirection('ltr');  // default
```

### getDirection()

```javascript
chat.getDirection();  // 'ltr' or 'rtl'
```

Can also be set via constructor options: `{ direction: 'rtl' }`.

---

## Title Area Methods

### titleAreaShow() / titleAreaHide() / titleAreaToggle()

```javascript
chat.titleAreaShow();
chat.titleAreaHide();
chat.titleAreaToggle();
```

### titleAreaSetContents(title, align)

Set title text and alignment. `title` can contain HTML.

```javascript
chat.titleAreaSetContents('Chat Room', 'left');
chat.titleAreaSetContents('<b>Room</b> <em>#general</em>', 'center');
```

### titleAreaGetContents()

Returns the title area's innerHTML.

---

## Input Area Methods

### inputAreaShow() / inputAreaHide() / inputAreaToggle()

Show, hide, or toggle the text input area. Hiding the input area turns the widget into a read-only message display.

```javascript
chat.inputAreaHide();  // read-only mode
chat.inputAreaShow();  // re-enable input
```

### inputAreaSetEnabled(enabled)

Enable or disable the textarea and send button. When disabled, both controls are greyed out and non-interactive. Useful for disabling input while an LLM is responding.

```javascript
chat.inputAreaSetEnabled(false);  // disable while bot is thinking
chat.inputAreaSetEnabled(true);   // re-enable when response is complete
```

### inputAreaSetButtonText(text)

Change the send button's text. Useful for showing state ("Thinking...", "Stop", etc.).

```javascript
chat.inputAreaSetButtonText('Stop');
chat.inputAreaSetButtonText('Send');  // restore default
```

### inputAreaGetButtonText()

Returns the current button text.

```javascript
chat.inputAreaGetButtonText(); // 'Send'
```

---

## Messages Area Methods

### messagesAreaAlternateColors(alt)

Enable or disable alternating row backgrounds. `true` by default.

```javascript
chat.messagesAreaAlternateColors(false); // uniform background
```

### messagesAreaAlternateColorsToggle()

Toggle alternating colors on/off.

### messagesAreaAlternateColorsGet()

Returns `true` if alternating colors are currently enabled.

---

## Theme Methods

### changeTheme(newTheme)

Switch the theme CSS class. Built-in themes: `light`, `dark`, `blue`, `warm`, `midnight`, `ocean`, `modern`, `debug` (all prefixed `quikchat-theme-`).

```javascript
chat.changeTheme('quikchat-theme-dark');
```

### theme (getter)

```javascript
console.log(chat.theme); // 'quikchat-theme-dark'
```

---

## Callback Methods

### setCallbackOnSend(callback)

Replace the onSend callback after construction.

```javascript
chat.setCallbackOnSend((chat, msg) => {
  chat.messageAddNew(msg, 'me', 'right');
});
```

### setCallbackonMessageAdded(callback)

Set a listener called every time a message is added (by any method). Useful for logging, analytics, or syncing.

```javascript
chat.setCallbackonMessageAdded((chat, msgid) => {
  console.log('New message:', msgid, chat.messageGetContent(msgid));
});
```

### setCallbackonMessageAppend(callback)

Fires when content is appended to a message (e.g., during streaming).

```javascript
chat.setCallbackonMessageAppend((chat, msgid, appendedContent) => {
  console.log('Streaming:', appendedContent);
});
```

### setCallbackonMessageReplace(callback)

Fires when a message's content is replaced.

```javascript
chat.setCallbackonMessageReplace((chat, msgid, newContent) => {
  console.log('Message updated:', msgid);
});
```

### setCallbackonMessageDelete(callback)

Fires when a message is removed.

```javascript
chat.setCallbackonMessageDelete((chat, msgid) => {
  console.log('Message deleted:', msgid);
});
```

All callbacks only fire on successful operations. They are not called when unset.

---

## Content Processing

### setMessageFormatter(formatter)

Set or replace the message formatting function at runtime.

```javascript
chat.setMessageFormatter((content) => marked.parse(content));
chat.setMessageFormatter(null);  // remove formatter
```

### setSanitize(sanitize)

Set or replace the sanitization behavior at runtime.

```javascript
chat.setSanitize(true);                                // built-in HTML escaping
chat.setSanitize((content) => DOMPurify.sanitize(content));  // custom
chat.setSanitize(false);                               // disable
```

---

## Static Methods

### quikchat.version()

```javascript
quikchat.version();
// { version: "1.2.4", license: "BSD-2", url: "https://github/deftio/quikchat" }
```

### quikchat.loremIpsum(numChars, startSpot, startWithCapitalLetter)

Generate Lorem Ipsum text for testing. If `numChars` is omitted, a random length (25–150) is used.

```javascript
quikchat.loremIpsum(200);            // 200 chars, random start, capitalized
quikchat.loremIpsum(100, 0, false);  // 100 chars, start at index 0, lowercase
quikchat.loremIpsum();               // random length, random start
```
