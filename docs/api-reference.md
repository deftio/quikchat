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
| `role` | `string` | `"user"` | Role tag stored in history (e.g., `'user'`, `'assistant'`, `'system'`) |

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

### historyGet(n, m)

Get a slice of the history array.

```javascript
chat.historyGet();        // all messages
chat.historyGet(0, 5);    // first 5 messages
chat.historyGet(-3);      // last 3 messages
```

### historyGetLength()

```javascript
const count = chat.historyGetLength();
```

### historyGetMessage(n)

Get a single history entry by index. Returns `{}` if out of bounds.

```javascript
const msg = chat.historyGetMessage(0); // first message
```

### historyGetMessageContent(n)

Get just the content string of a history entry by index.

```javascript
const text = chat.historyGetMessageContent(0);
```

### historyClear()

Clear all messages from history and reset the message ID counter. Does **not** remove messages from the DOM.

```javascript
chat.historyClear();
```

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

Switch the theme CSS class. Built-in themes: `'quikchat-theme-light'`, `'quikchat-theme-dark'`, `'quikchat-theme-debug'`.

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

---

## Static Methods

### quikchat.version()

```javascript
quikchat.version();
// { version: "1.1.4", license: "BSD-2", url: "https://github/deftio/quikchat" }
```

### quikchat.loremIpsum(numChars, startSpot, startWithCapitalLetter)

Generate Lorem Ipsum text for testing. If `numChars` is omitted, a random length (25–150) is used.

```javascript
quikchat.loremIpsum(200);            // 200 chars, random start, capitalized
quikchat.loremIpsum(100, 0, false);  // 100 chars, start at index 0, lowercase
quikchat.loremIpsum();               // random length, random start
```
