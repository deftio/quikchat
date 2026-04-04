# Multi-User Chat

QuikChat supports multiple users in a single chat and multiple independent chat instances on the same page. No server or framework required — just vanilla JS routing.

## Multiple Users in One Chat

Each message has a `userString` (display name) and `align` (left/right/center). Use these to visually distinguish users:

```javascript
const chat = new quikchat('#chat', onSend);

chat.messageAddNew('Hey everyone!', 'Alice', 'left');
chat.messageAddNew('Hi Alice!',     'Bob',   'right');
chat.messageAddNew('Welcome.',      'System', 'center');
```

Convention: current user messages go `'right'`, other users go `'left'`, system/status messages go `'center'`. But this is entirely up to you.

## Multiple Chat Instances

Each `new quikchat()` creates an independent widget. They share no state.

```html
<div id="chat1" style="width:400px; height:500px;"></div>
<div id="chat2" style="width:400px; height:500px;"></div>

<script>
  const chat1 = new quikchat('#chat1');
  const chat2 = new quikchat('#chat2');

  // Different themes per instance
  chat1.changeTheme('quikchat-theme-light');
  chat2.changeTheme('quikchat-theme-dark');
</script>
```

## Routing Messages Between Instances

The dual-chatroom pattern: two chat windows where sending in one posts to the other.

```javascript
const chat1 = new quikchat('#chat1');
const chat2 = new quikchat('#chat2');

chat1.titleAreaSetContents('Alice', 'left');
chat1.titleAreaShow();
chat2.titleAreaSetContents('Bob', 'left');
chat2.titleAreaShow();

// When Alice sends, it appears in both windows
chat1.setCallbackOnSend((chat, msg) => {
  chat.messageAddNew(msg, 'Alice', 'right');   // own window: right
  chat2.messageAddNew(msg, 'Alice', 'left');   // Bob's window: left
});

// When Bob sends, it appears in both windows
chat2.setCallbackOnSend((chat, msg) => {
  chat.messageAddNew(msg, 'Bob', 'right');     // own window: right
  chat1.messageAddNew(msg, 'Bob', 'left');     // Alice's window: left
});
```

This is pure client-side routing. For a real multi-user app, the `onSend` callback would send the message to a server (WebSocket, HTTP, etc.) and incoming messages from the server would call `messageAddNew()` on the receiving chat instance.

## Read-Only Display

Hide the input area to create a message feed or log viewer:

```javascript
const feed = new quikchat('#feed');
feed.inputAreaHide();

// Add messages programmatically
feed.messageAddNew('Server started', 'system', 'left');
feed.messageAddNew('User connected', 'system', 'left');
```

## Monitoring All Messages

Use `setCallbackonMessageAdded` to observe every message added to a chat, regardless of source:

```javascript
chat.setCallbackonMessageAdded((chat, msgid) => {
  const msg = chat.historyGetMessage(chat.historyGetLength() - 1);
  console.log(`[${msg.userString}] ${msg.content}`);
  // Send to analytics, log to server, sync to another widget, etc.
});
```

## User Identification

`messageAddFull()` accepts a `userID` field for numeric user identification:

```javascript
chat.messageAddFull({
  content: 'Hello!',
  userString: 'Alice',
  align: 'left',
  role: 'user',
  userID: 42
});
```

The `userID` is stored in history and can be used for filtering:

```javascript
const aliceMessages = chat.historyGet().filter(m => m.userID === 42);
```

## Example: Simple Chat Room with WebSocket

QuikChat doesn't include networking — that's your choice. Here's a sketch of how you'd connect it to a WebSocket:

```javascript
const chat = new quikchat('#chat');
const ws = new WebSocket('wss://your-server.com/chat');
const myName = 'Alice';

// Outgoing: user sends a message
chat.setCallbackOnSend((chat, msg) => {
  chat.messageAddNew(msg, myName, 'right');
  ws.send(JSON.stringify({ user: myName, content: msg }));
});

// Incoming: message from another user
ws.onmessage = (event) => {
  const { user, content } = JSON.parse(event.data);
  chat.messageAddNew(content, user, 'left');
};
```
