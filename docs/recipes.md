# Recipes

Common patterns and quick-start snippets for QuikChat.

---

## Read-Only Display

Hide the input area and omit the callback to create a display-only widget:

```javascript
const display = new quikchat('#container', null, {
  titleArea: { title: 'Announcements', show: true }
});
display.inputAreaHide();
display.messageAddNew('System maintenance at 2 AM UTC.', 'admin', 'left');
```

---

## Log Viewer with Tag Filtering

Use `messageAddFull()` with tags and `messageSetVisibleByTag()` for filtered views:

```javascript
const log = new quikchat('#log', null);
log.inputAreaHide();

log.messageAddFull({ content: 'Connected to DB', userString: 'INFO', role: 'info', tags: ['info'] });
log.messageAddFull({ content: 'Disk usage at 90%', userString: 'WARN', role: 'warn', tags: ['warn'] });
log.messageAddFull({ content: 'Connection refused', userString: 'ERROR', role: 'error', tags: ['error'] });

// Show only errors:
log.messageSetVisibleByTag('info', false);
log.messageSetVisibleByTag('warn', false);
log.messageSetVisibleByTag('error', true);
```

Style log levels with role-based CSS: `.quikchat-role-error`, `.quikchat-role-warn`, etc. See the [Log Viewer example](../examples/example_log_viewer.html).

---

## Tool-Call Visibility Toggle

Hide tool calls from the user, then reveal them on demand:

```javascript
// Add a hidden tool-call message
chat.messageAddFull({
  content: '{"tool": "search", "query": "flights"}',
  userString: 'Tool',
  role: 'tool',
  visible: false,
  tags: ['tool-call']
});

// Toggle all tool-call messages
let showing = false;
document.getElementById('toggle').onclick = () => {
  showing = !showing;
  chat.messageSetVisibleByTag('tool-call', showing);
};
```

See the [Tool-Call Visibility example](../examples/example_tool_calls.html).

---

## Session Persistence with localStorage

Export the session, store it, and restore it on next visit:

```javascript
// Save
function saveSession() {
  const data = chat.historyExport();
  localStorage.setItem('chat-session', JSON.stringify(data));
}

// Restore
function restoreSession() {
  const raw = localStorage.getItem('chat-session');
  if (raw) {
    chat.historyImport(JSON.parse(raw));
  }
}

// Auto-save on every new message
chat.setCallbackonMessageAdded(() => saveSession());

// Restore on page load
restoreSession();
```

See the [Session Save/Restore example](../examples/example_history.html).

---

## RTL Support

Switch the entire widget to right-to-left layout:

```javascript
const chat = new quikchat('#chat', onSend, {
  titleArea: { title: 'محادثة', align: 'right', show: true }
});
chat.setDirection('rtl');

// Toggle at runtime
chat.setDirection(chat.getDirection() === 'rtl' ? 'ltr' : 'rtl');
```

See the [RTL / i18n example](../examples/example_rtl.html).

---

## Custom Sanitizer (DOMPurify)

Replace the built-in HTML escaping with DOMPurify for richer content:

```html
<script src="https://unpkg.com/dompurify/dist/purify.min.js"></script>
<script>
const chat = new quikchat('#chat', onSend);
chat.setSanitize((content) => DOMPurify.sanitize(content));
</script>
```

The sanitizer runs before the markdown plugin, so it processes raw user input.

---

## Streaming LLM Responses

The standard pattern for token-by-token display:

```javascript
const chat = new quikchat('#chat', async (chat, msg) => {
  chat.messageAddNew(msg, 'user', 'right', 'user');
  chat.inputAreaSetEnabled(false);

  const id = chat.messageAddTypingIndicator('bot');

  // ... read tokens from your stream ...
  chat.messageReplaceContent(id, firstToken);   // clears dots
  chat.messageAppendContent(id, nextToken);      // append subsequent tokens

  chat.inputAreaSetEnabled(true);
});
```

See the [Streaming guide](../docs/streaming.md) for complete fetch + ReadableStream examples.

---

## Disable Input During Response

Prevent the user from sending while the bot is thinking:

```javascript
const chat = new quikchat('#chat', async (chat, msg) => {
  chat.messageAddNew(msg, 'user', 'right');
  chat.inputAreaSetEnabled(false);
  chat.inputAreaSetButtonText('Thinking...');

  const reply = await getReply(msg);
  chat.messageAddNew(reply, 'bot', 'left');

  chat.inputAreaSetEnabled(true);
  chat.inputAreaSetButtonText('Send');
});
```
