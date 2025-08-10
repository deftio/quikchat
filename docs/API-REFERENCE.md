# QuikChat API Reference

Complete technical reference for QuikChat v1.1.14+ - a zero-dependency JavaScript chat widget.

## Table of Contents

1. [Constructor](#constructor)
2. [Message Management](#message-management)
3. [Visibility Controls](#visibility-controls)
4. [History Management](#history-management)
5. [UI Controls](#ui-controls)
6. [Static Methods](#static-methods)
7. [Events & Callbacks](#events--callbacks)

---

## Constructor

### `new quikchat(parentElement, onSend, options)`

Creates a new QuikChat instance.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `parentElement` | string \| HTMLElement | CSS selector string or DOM element to contain the chat widget |
| `onSend` | function | Callback function triggered when user sends a message |
| `options` | object | Configuration options (see table below) |

**Options Object:**

| Property | Type | Default | Description | Version |
|----------|------|---------|-------------|---------|
| `theme` | string | `'quikchat-theme-light'` | CSS theme class name | v1.0+ |
| `trackHistory` | boolean | `true` | Whether to maintain message history | v1.0+ |
| `titleArea.title` | string | `"Chat"` | Title text to display | v1.0+ |
| `titleArea.show` | boolean | `false` | Whether title area is visible | v1.0+ |
| `titleArea.align` | string | `"center"` | Title alignment: `left`, `center`, `right` | v1.0+ |
| `messagesArea.alternating` | boolean | `true` | Enable alternating message row colors | v1.0+ |
| `inputArea.show` | boolean | `true` | Whether input area is visible | v1.0+ |
| `sendOnEnter` | boolean | `true` | Send message on Enter key | v1.0+ |
| `sendOnShiftEnter` | boolean | `false` | Send message on Shift+Enter | v1.0+ |
| `instanceClass` | string | `''` | Custom CSS class for multi-instance scoping | v1.1.14+ |

**Example:**
```javascript
const chat = new quikchat('#chat-container', 
  (chatInstance, message) => {
    // Echo user message
    chatInstance.messageAddNew(message, 'You', 'right');
    
    // Add bot response
    chatInstance.messageAddNew('Thanks for your message!', 'Bot', 'left');
  },
  {
    theme: 'quikchat-theme-dark',
    titleArea: { title: 'Support Chat', show: true, align: 'left' },
    instanceClass: 'support-chat'
  }
);
```

---

## Message Management

### `messageAddNew(content, userString, align, role, scrollIntoView, visible, tags)`

Adds a new message to the chat with simplified parameters.

**Parameters:**

| Parameter | Type | Default | Description | Version |
|-----------|------|---------|-------------|---------|
| `content` | string | `""` | HTML content of the message | v1.0+ |
| `userString` | string | `"user"` | Display name for the message sender | v1.0+ |
| `align` | string | `"right"` | Message alignment: `left`, `right`, `center` | v1.0+ |
| `role` | string | `"user"` | Semantic role (for history/LLM context) | v1.0+ |
| `scrollIntoView` | boolean\|'smart' | `true` | Scroll behavior: `true` = always scroll, `false` = never scroll, `'smart'` = only scroll if near bottom | v1.0+ (smart mode v1.1.15+) |
| `visible` | boolean | `true` | Whether message is initially visible | v1.1.13+ |
| `tags` | Array<string> | `[]` | Array of tag strings for grouping | v1.1.14+ |

**Returns:** `number` - Unique message ID

**Example:**
```javascript
// Basic message
const msgId = chat.messageAddNew('Hello world!', 'Alice', 'left');

// Message with tags and hidden initially
const systemMsgId = chat.messageAddNew(
  'System: Chat session started', 
  'System', 
  'center', 
  'system', 
  true, 
  false, 
  ['system', 'session']
);
```

### `messageAddFull(input)`

Adds a message with complete control over all properties.

**Parameters:**

| Property | Type | Default | Description | Version |
|----------|------|---------|-------------|---------|
| `input.content` | string | `""` | HTML content of the message | v1.0+ |
| `input.userString` | string | `"user"` | Display name for sender | v1.0+ |
| `input.align` | string | `"right"` | Message alignment | v1.0+ |
| `input.role` | string | `"user"` | Semantic role | v1.0+ |
| `input.userID` | number | `-1` | Numeric user identifier | v1.0+ |
| `input.timestamp` | string\|boolean | `false` | ISO timestamp or false for auto | v1.0+ |
| `input.updatedtime` | string\|boolean | `false` | Last update time | v1.0+ |
| `input.scrollIntoView` | boolean\|'smart' | `true` | Scroll behavior: `true` = always, `false` = never, `'smart'` = only if near bottom | v1.0+ (smart mode v1.1.15+) |
| `input.visible` | boolean | `true` | Initial visibility | v1.1.13+ |
| `input.tags` | Array<string> | `[]` | Tag array | v1.1.14+ |

**Returns:** `number` - Unique message ID

**Example:**
```javascript
const msgId = chat.messageAddFull({
  content: 'Welcome to the chat!',
  userString: 'ChatBot',
  align: 'left',
  role: 'assistant',
  userID: 100,
  timestamp: new Date().toISOString(),
  visible: true,
  tags: ['welcome', 'bot-message']
});
```

### `messageRemove(msgid)`

Removes a message from both display and history.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `msgid` | number | Message ID to remove |

**Returns:** `boolean` - Success status

**Example:**
```javascript
const success = chat.messageRemove(42);
if (success) {
  console.log('Message removed successfully');
}
```

### `messageRemoveLast()`

Removes the most recently added message.

**Returns:** `boolean` - Success status

**Example:**
```javascript
chat.messageRemoveLast(); // Undo last message
```

### `messageAppendContent(msgid, content)`

Appends content to an existing message (useful for streaming).

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `msgid` | number | Target message ID |
| `content` | string | HTML content to append |

**Returns:** `boolean` - Success status

**Example:**
```javascript
// Simulate streaming response
const botMsgId = chat.messageAddNew('', 'Bot', 'left');
const words = ['Hello', ' there', '!'];
words.forEach((word, i) => {
  setTimeout(() => {
    chat.messageAppendContent(botMsgId, word);
  }, i * 500);
});
```

### `messageReplaceContent(msgid, content)`

Replaces the entire content of an existing message.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `msgid` | number | Target message ID |
| `content` | string | New HTML content |

**Returns:** `boolean` - Success status

**Example:**
```javascript
// Update message with corrected content
chat.messageReplaceContent(42, 'Corrected message content');
```

### `messageGetContent(msgid)`

Retrieves the text content of a message.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `msgid` | number | Target message ID |

**Returns:** `string` - Message content or empty string if not found

### `messageGetDOMObject(msgid)`

Returns the DOM element for a message.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `msgid` | number | Target message ID |

**Returns:** `HTMLElement|null` - Message DOM element or null if not found

---

## Visibility Controls

### `messageSetVisibility(msgid, isVisible)` 
*Available in v1.1.13+*

Controls the visibility of an individual message.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `msgid` | number | Target message ID |
| `isVisible` | boolean | Whether message should be visible |

**Returns:** `boolean` - Success status

**Example:**
```javascript
// Hide a system message
chat.messageSetVisibility(systemMsgId, false);

// Show it again later
chat.messageSetVisibility(systemMsgId, true);
```

### `messageGetVisibility(msgid)`
*Available in v1.1.13+*

Checks if a message is currently visible.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `msgid` | number | Target message ID |

**Returns:** `boolean` - Visibility status

### `setTagVisibility(tagName, isVisible)`
*Available in v1.1.14+*

Controls visibility for all messages with a specific tag.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tagName` | string | Tag name to target |
| `isVisible` | boolean | Whether tagged messages should be visible |

**Returns:** `boolean` - Success status

**Example:**
```javascript
// Hide all system messages
chat.setTagVisibility('system', false);

// Show all priority messages
chat.setTagVisibility('priority', true);
```

### `getTagVisibility(tagName)`
*Available in v1.1.14+*

Checks if messages with a specific tag are set to be visible.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `tagName` | string | Tag name to check |

**Returns:** `boolean` - Whether the tag visibility is enabled

### `getActiveTags()`
*Available in v1.1.14+*

Returns all unique tags that have been used in the current chat.

**Returns:** `Array<string>` - Array of active tag names

**Example:**
```javascript
const tags = chat.getActiveTags();
console.log('Active tags:', tags); // ['system', 'user', 'priority']
```

---

## History Management

### `historyGet(start, end)`

Retrieves a slice of the message history.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `start` | number | `0` | Starting index |
| `end` | number | `history.length` | Ending index |

**Returns:** `Array<object>` - Array of message objects

**Example:**
```javascript
// Get last 5 messages
const recent = chat.historyGet(-5);

// Get messages 10-20
const slice = chat.historyGet(10, 20);
```

### `historyGetAllCopy()`

Returns a complete copy of the chat history.

**Returns:** `Array<object>` - Deep copy of all messages

**Example:**
```javascript
// Save chat for later or send to API
const fullHistory = chat.historyGetAllCopy();
localStorage.setItem('chatHistory', JSON.stringify(fullHistory));
```

### `historyGetPage(page, pageSize, order)`
*Available in v1.1.15+*

Get a page of history messages with pagination support.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | number | `1` | Page number (1-based) |
| `pageSize` | number | `50` | Number of messages per page |
| `order` | string | `'asc'` | Sort order: `'asc'` (oldest first) or `'desc'` (newest first) |

**Returns:** `object` - Object containing messages array and pagination metadata

**Example:**
```javascript
// Get first page of 20 messages
const result = chat.historyGetPage(1, 20);
console.log(result.messages); // Array of 20 messages
console.log(result.pagination); // { currentPage: 1, totalPages: 5, hasNext: true, ... }

// Get newest messages first
const recent = chat.historyGetPage(1, 10, 'desc');
```

### `historySearch(criteria)`
*Available in v1.1.15+*

Search history for messages matching specified criteria.

**Parameters:**

| Property | Type | Description |
|----------|------|-------------|
| `criteria.text` | string | Text to search for in message content (case-insensitive) |
| `criteria.userString` | string | Filter by user name |
| `criteria.role` | string | Filter by role (user, assistant, system) |
| `criteria.tags` | Array<string> | Filter by tags (matches any tag) |
| `criteria.limit` | number | Maximum results to return (default: 100) |

**Returns:** `Array<object>` - Array of matching messages

**Example:**
```javascript
// Search for messages containing "error"
const errors = chat.historySearch({ text: 'error' });

// Find all messages from Alice
const aliceMessages = chat.historySearch({ userString: 'Alice' });

// Find important system messages
const important = chat.historySearch({ 
  role: 'system', 
  tags: ['important'],
  limit: 50
});

// Combined search
const results = chat.historySearch({
  text: 'login',
  userString: 'Support',
  role: 'assistant'
});
```

### `historyGetInfo(pageSize)`
*Available in v1.1.15+*

Get metadata about the chat history.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `pageSize` | number | `50` | Page size for calculating total pages |

**Returns:** `object` - History metadata including size, pagination info, and memory usage

**Example:**
```javascript
const info = chat.historyGetInfo(25);
console.log(info);
// {
//   totalMessages: 150,
//   totalPages: 6,
//   oldestMessage: { msgid: 1, timestamp: '...', userString: 'User' },
//   newestMessage: { msgid: 150, timestamp: '...', userString: 'Bot' },
//   memoryUsage: { estimatedSize: 45000, averageMessageSize: 300 }
// }
```

### `historyClear()`

Removes all messages and resets the chat.

**Example:**
```javascript
chat.historyClear(); // Fresh start
```

### `historyRestoreAll(messageList)`

Restores chat from a saved message array.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `messageList` | Array<object> | Array of message objects |

**Example:**
```javascript
// Restore from saved data
const saved = JSON.parse(localStorage.getItem('chatHistory'));
chat.historyRestoreAll(saved);
```

### `historyGetLength()`

Returns the number of messages in history.

**Returns:** `number` - Message count

### `historyGetMessage(index)`

Gets a specific message by history index.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `index` | number | History array index |

**Returns:** `object` - Message object or empty object if not found

---

## UI Controls

### `titleAreaShow()` / `titleAreaHide()` / `titleAreaToggle()`

Controls title area visibility.

**Example:**
```javascript
chat.titleAreaShow();
chat.titleAreaHide();
chat.titleAreaToggle();
```

### `titleAreaSetContents(title, align)`

Updates title area content and alignment.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | | HTML content for title |
| `align` | string | `'center'` | Text alignment |

### `inputAreaShow()` / `inputAreaHide()` / `inputAreaToggle()`

Controls input area visibility.

**Example:**
```javascript
// Create read-only chat display
chat.inputAreaHide();
```

### `changeTheme(newTheme)`

Switches the chat theme.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `newTheme` | string | CSS theme class name |

**Example:**
```javascript
chat.changeTheme('quikchat-theme-dark');
```

### `messageScrollToBottom()`

Scrolls the message area to show the latest message.

**Example:**
```javascript
chat.messageScrollToBottom();
```

---

## Static Methods

### `quikchat.version()`

Returns library version and metadata.

**Returns:** `object` - Version information

**Example:**
```javascript
const info = quikchat.version();
console.log(`QuikChat v${info.version}`);
```

### `quikchat.loremIpsum(numChars, startSpot, startWithCapitalLetter)`

Generates Lorem Ipsum text for testing.

**Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `numChars` | number | random 25-150 | Number of characters |
| `startSpot` | number | random | Starting position in lorem text |
| `startWithCapitalLetter` | boolean | `true` | Capitalize first letter |

**Returns:** `string` - Generated text

**Example:**
```javascript
// Add test messages
chat.messageAddNew(quikchat.loremIpsum(100), 'Test User', 'left');
```

### `quikchat.tempMessageGenerator(domElement, content, interval, callback)`

Creates a self-updating message element.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `domElement` | string\|HTMLElement | Target element |
| `content` | string | Initial content |
| `interval` | number | Update interval in ms |
| `callback` | function | Content update function |

**Example:**
```javascript
// Animate typing dots
quikchat.tempMessageGenerator('#status', 'Typing', 500, 
  (msg, count) => msg + (count % 3 === 0 ? '' : '.')
);
```

---

## Events & Callbacks

### Constructor Callback: `onSend(chatInstance, message)`

Called when user submits a message.

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `chatInstance` | quikchat | The chat instance |
| `message` | string | User's message text |

### `setCallbackOnSend(callback)`

Updates the send callback after construction.

### `setCallbackonMessageAdded(callback)`

Sets a callback for when any message is added.

**Callback Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `chatInstance` | quikchat | The chat instance |
| `msgid` | number | ID of the added message |

**Example:**
```javascript
chat.setCallbackonMessageAdded((instance, msgid) => {
  console.log(`Message ${msgid} added`);
});
```

### `setCallbackonMessageAppend(callback)` 
*Available in v1.1.15+*

Sets a callback for when message content is appended.

**Callback Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `chatInstance` | quikchat | The chat instance |
| `msgid` | number | ID of the appended message |
| `content` | string | Content that was appended |

**Example:**
```javascript
chat.setCallbackonMessageAppend((instance, msgid, content) => {
  console.log(`Appended "${content}" to message ${msgid}`);
});
```

### `setCallbackonMessageReplace(callback)`
*Available in v1.1.15+*

Sets a callback for when message content is replaced.

**Callback Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `chatInstance` | quikchat | The chat instance |
| `msgid` | number | ID of the replaced message |
| `content` | string | New content of the message |

**Example:**
```javascript
chat.setCallbackonMessageReplace((instance, msgid, content) => {
  console.log(`Replaced message ${msgid} with "${content}"`);
});
```

### `setCallbackonMessageDelete(callback)`
*Available in v1.1.15+*

Sets a callback for when a message is deleted.

**Callback Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `chatInstance` | quikchat | The chat instance |
| `msgid` | number | ID of the deleted message |

**Example:**
```javascript
chat.setCallbackonMessageDelete((instance, msgid) => {
  console.log(`Message ${msgid} deleted`);
});
```

---

## CSS Classes Reference

QuikChat uses a structured CSS class system for styling and functionality:

### Core Structure
- `.quikchat-base` - Main container
- `.quikchat-theme-*` - Theme classes
- `.quikchat-message` - Individual message container
- `.quikchat-message-content` - Message content area
- `.quikchat-user-label` - User name display

### Message Positioning
- `.left-singleline` / `.left-multiline` - Left-aligned messages
- `.right-singleline` / `.right-multiline` - Right-aligned messages  
- `.center-singleline` / `.center-multiline` - Center-aligned messages

### Visibility & Tagging *(v1.1.14+)*
- `.quikchat-tag-{tagname}` - Applied to tagged messages
- `.quikchat-show-tag-{tagname}` - Applied to container to show tagged messages

### Message IDs
- `.quikchat-msgid-{id}` - Unique identifier for each message (zero-padded)

---

*This reference covers QuikChat v1.1.14. For migration guides and practical examples, see the [Developer Guide](DEVELOPER-GUIDE.md).*