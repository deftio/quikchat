# Getting Started

QuikChat is a zero-dependency vanilla JavaScript chat widget. Drop it into any page — no framework needed, no build step required.

## Install

**CDN** (simplest):

```html
<script src="https://unpkg.com/quikchat"></script>
<link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css" />
```

**npm**:

```bash
npm install quikchat
```

```javascript
import quikchat from 'quikchat';
```

**Local files** (download from GitHub):

```html
<script src="path/to/quikchat.umd.min.js"></script>
<link rel="stylesheet" href="path/to/quikchat.css" />
```

## Minimal Example

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/quikchat"></script>
  <link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css" />
  <style>
    #chat { width: 400px; height: 500px; }
  </style>
</head>
<body>
  <div id="chat"></div>
  <script>
    const chat = new quikchat('#chat', (chat, msg) => {
      chat.messageAddNew(msg, 'me', 'right');
    });
  </script>
</body>
</html>
```

That's it — a working chat widget in 5 lines of JavaScript.

## How It Works

QuikChat takes three arguments:

```javascript
const chat = new quikchat(parentElement, onSend, options);
```

| Argument | Type | Description |
|---|---|---|
| `parentElement` | `string` or `Element` | CSS selector (`'#chat'`) or DOM element |
| `onSend` | `function` | Called when the user clicks Send or presses Shift+Enter. Receives `(chatInstance, messageText)` |
| `options` | `object` | Optional configuration (see below) |

The widget fills 100% of its parent container. **You must set a width and height on the parent** — otherwise the widget will grow unbounded as messages are added.

```css
#chat { width: 100%; height: 50vh; }
```

## Options

```javascript
const chat = new quikchat('#chat', onSend, {
  theme: 'quikchat-theme-light',       // 'quikchat-theme-light', 'quikchat-theme-dark', 'quikchat-theme-modern', or your own
  trackHistory: true,                   // store messages in history array
  titleArea: {
    title: 'My Chat',                   // title text (supports HTML)
    show: true,                         // show title area on init
    align: 'left'                       // 'left', 'center', or 'right'
  },
  messagesArea: {
    alternating: true                   // alternating row background colors
  },
  sanitize: true,                       // escape HTML in messages (true, false, or a function)
  messageFormatter: null,               // (content) => html — e.g., markdown renderer
  showTimestamps: false,                // show timestamps on messages
  direction: 'ltr',                     // 'ltr' or 'rtl' for right-to-left languages
});
```

All options are optional. The defaults give you a light-themed chat with no title bar, history tracking on, alternating message colors, and no sanitization or formatting.

### Content Processing Pipeline

When `sanitize` and/or `messageFormatter` are set, message content is processed as: **sanitize → format → display**.

- `sanitize: true` escapes HTML entities (`<`, `>`, `&`, etc.) to prevent XSS
- `sanitize: (content) => cleanedContent` lets you use a custom sanitizer (e.g., DOMPurify)
- `messageFormatter: (content) => html` transforms content (e.g., markdown → HTML)

The formatter's output is trusted and set as innerHTML. Sanitize untrusted input _before_ formatting.

## The onSend Callback

Messages are **not** automatically echoed to the chat area. The `onSend` callback gives you full control:

```javascript
const chat = new quikchat('#chat', (chat, msg) => {
  // Echo the message to the chat
  chat.messageAddNew(msg, 'me', 'right');

  // Then do whatever you want with it:
  // - Send to an LLM API
  // - Route to another chat instance
  // - Filter, validate, transform
  // - Ignore it entirely
});
```

This design means quikchat works for any use case — simple echo chat, LLM integration, multi-user routing, or read-only message display.

## Markdown Build

The `-md` build bundles [quikdown](https://github.com/deftio/quikdown) as the default `messageFormatter`:

```html
<script src="https://unpkg.com/quikchat/dist/quikchat-md.umd.min.js"></script>
```

```javascript
// Markdown rendering is automatic — no configuration needed
const chat = new quikchat('#chat', onSend);
chat.messageAddNew('**bold** and *italic*', 'bot', 'left');
// renders as formatted HTML
```

You can override the formatter at any time with `chat.setMessageFormatter(myFn)`.

## What's Next

- [API Reference](api-reference.md) — every public method and property
- [Streaming](streaming.md) — token-by-token LLM response display, typing indicators
- [Multi-User Chat](multi-user-chat.md) — multiple users, dual instances, message routing
- [LLM Integration](llm-integration.md) — connect to Ollama, OpenAI, or any LLM
- [Theming](theming.md) — custom themes, modern bubble theme, CSS architecture
