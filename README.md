[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause) [![NPM version](https://img.shields.io/npm/v/quikchat.svg?style=flat-square)](https://www.npmjs.com/package/quikchat) ![CI](https://github.com/deftio/quikchat/actions/workflows/ci.yml/badge.svg)

# QuikChat

> Zero-dependency JavaScript chat widget for modern web applications

QuikChat is a lightweight, highly customizable chat interface that integrates seamlessly with any web project. Built with vanilla JavaScript, it provides powerful features for LLM applications, real-time chat, and interactive messaging experiences.

**🚀 [Live Demo](https://deftio.github.io/quikchat/examples/example_umd.html) | 📚 [API Reference](docs/API-REFERENCE.md) | 🛠 [Developer Guide](docs/DEVELOPER-GUIDE.md)**



## ✨ Key Features

- **🚫 Zero Dependencies** - Pure vanilla JavaScript, no frameworks required
- **🎨 Fully Customizable** - Complete CSS theming system with multi-instance support
- **🤖 LLM Ready** - Built-in support for OpenAI, Anthropic, Ollama, and streaming responses
- **📱 Responsive Design** - Adapts to any screen size and container dimensions
- **⚡ High Performance** - Virtual scrolling for large message volumes
- **👁 Advanced Visibility** - Individual and group-based message control (v1.1.13+)
- **🏷 Tagged Messages** - Powerful tagging system for message organization (v1.1.14+)
- **💾 Full History Control** - Save, load, and restore complete chat sessions
- **🔧 Developer Friendly** - TypeScript-ready with comprehensive API



## 🚀 Quick Start

Get a working chat interface in under 60 seconds:

### Via CDN
```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css">
</head>
<body>
    <div id="chat" style="width: 100%; height: 400px;"></div>
    
    <script src="https://unpkg.com/quikchat"></script>
    <script>
        const chat = new quikchat('#chat', (instance, message) => {
            // Echo user message
            instance.messageAddNew(message, 'You', 'right');
            
            // Add bot response
            setTimeout(() => {
                instance.messageAddNew('Thanks for your message!', 'Bot', 'left');
            }, 1000);
        });
        
        // Add welcome message
        chat.messageAddNew('Hello! How can I help you today?', 'Bot', 'left');
    </script>
</body>
</html>
```

### Via NPM
```bash
npm install quikchat
```

```javascript
import quikchat from 'quikchat';
import 'quikchat/dist/quikchat.css';

const chat = new quikchat('#chat-container', (instance, message) => {
    // Your message handling logic
    console.log('User said:', message);
});
```



## 📦 Installation Options

### NPM Package
```bash
npm install quikchat
```

### CDN (Latest Version)
```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css">

<!-- JavaScript -->
<script src="https://unpkg.com/quikchat"></script>
```

### Direct Download
Download the latest release from [GitHub Releases](https://github.com/deftio/quikchat/releases)



## 🆕 What's New in v1.1.16

### ⚡ Virtual Scrolling for High Performance
QuikChat now includes built-in virtual scrolling that handles 10,000+ messages efficiently. Only visible messages are rendered in the DOM, providing massive performance improvements:

- **10,000 messages**: Renders in 38ms (vs 146 seconds without)
- **Memory efficient**: ~2MB for 10,000 messages (vs ~187MB without)
- **Automatic activation**: Enables at 500+ messages by default
- **Dynamic height support**: Handles variable-length LLM responses

```javascript
// Virtual scrolling is enabled by default
const chat = new quikchat('#chat', handler);

// Check if virtual scrolling is active
if (chat.isVirtualScrollingEnabled()) {
    console.log('Virtual scrolling is active');
}

// Get virtual scrolling configuration
const config = chat.getVirtualScrollingConfig();
console.log(`Enabled: ${config.enabled}, Threshold: ${config.threshold}`);

// Disable if needed for specific use cases
const customChat = new quikchat('#custom-chat', handler, {
    virtualScrolling: false
});
```

### 🎯 Smart Scroll Behavior
Improved user experience when reading chat history:

```javascript
// Never auto-scroll (user has full control)
chat.messageAddNew('New message', 'Bot', 'left', 'assistant', false);

// Smart scroll - only scrolls if user is near bottom
chat.messageAddNew('New message', 'Bot', 'left', 'assistant', 'smart');

// Always scroll to new messages (default)
chat.messageAddNew('New message', 'Bot', 'left', 'assistant', true);
```

### 🔔 Enhanced Message Callbacks
Track message modifications for streaming and real-time updates:

```javascript
// Track streaming content as it arrives
chat.setCallbackonMessageAppend((instance, msgId, content) => {
  console.log(`Streaming: ${content} added to message ${msgId}`);
});

// Monitor message edits
chat.setCallbackonMessageReplace((instance, msgId, newContent) => {
  console.log(`Message ${msgId} updated`);
});

// Track deletions
chat.setCallbackonMessageDelete((instance, msgId) => {
  console.log(`Message ${msgId} deleted`);
});
```

### 📚 Powerful History Management
Efficiently handle large chat histories with pagination and search:

```javascript
// Paginated history retrieval
const page = chat.historyGetPage(1, 20, 'desc'); // Get newest 20 messages
console.log(page.messages);
console.log(page.pagination.hasNext); // Check if more pages exist

// Search through history
const results = chat.historySearch({ 
  text: 'error',
  userString: 'Support',
  limit: 50 
});

// Get history metadata
const info = chat.historyGetInfo();
console.log(`Total messages: ${info.totalMessages}`);
console.log(`Memory used: ${info.memoryUsage.estimatedSize} bytes`);
```

## 📦 Previous Release: v1.1.14

### 🏷 Tagged Message System
Group and control message visibility with powerful tagging:

```javascript
// Add messages with tags
chat.messageAddNew('System initialized', 'System', 'center', 'system', true, true, ['system', 'startup']);

// Control visibility by tag
chat.setTagVisibility('system', false); // Hide all system messages
chat.setTagVisibility('system', true);  // Show all system messages

// Get active tags
const tags = chat.getActiveTags(); // ['system', 'startup', 'user']
```

### 🎯 Instance Scoping
Multiple chat instances with different styling and behavior:

```javascript
const salesChat = new quikchat('#sales', handler, {
    theme: 'quikchat-theme-light',
    instanceClass: 'sales-chat'
});

const supportChat = new quikchat('#support', handler, {
    theme: 'quikchat-theme-dark',
    instanceClass: 'support-chat'
});
```

### 👁 Enhanced Visibility Controls (v1.1.13+)
Fine-grained control over message display:

```javascript
// Hide individual messages
chat.messageSetVisibility(messageId, false);

// Check visibility status
const isVisible = chat.messageGetVisibility(messageId);
```

**[View Complete Changelog](https://github.com/deftio/quikchat/releases)**



## 🎨 Theming & Customization

QuikChat includes beautiful built-in themes and supports complete customization:

```javascript
// Use built-in themes
const chat = new quikchat('#chat', handler, {
    theme: 'quikchat-theme-dark' // or 'quikchat-theme-light'
});

// Switch themes dynamically
chat.changeTheme('quikchat-theme-light');
```

### Custom Themes
Create your own themes with CSS:

```css
.my-custom-theme {
    border: 2px solid #3b82f6;
    border-radius: 12px;
    font-family: 'SF Pro Display', sans-serif;
}

.my-custom-theme .quikchat-message-content {
    border-radius: 18px;
    padding: 12px 16px;
}

/* Apply to chat */
const chat = new quikchat('#chat', handler, {
    theme: 'my-custom-theme'
});
```

**📖 [Complete Theming Guide](docs/DEVELOPER-GUIDE.md#theming-guide)**



## 🤖 LLM Integration Examples

### OpenAI Integration
```javascript
async function handleMessage(chat, message) {
    chat.messageAddNew(message, 'You', 'right');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: formatChatHistory(chat.historyGetAllCopy(), message)
        })
    });
    
    const data = await response.json();
    chat.messageAddNew(data.choices[0].message.content, 'Assistant', 'left');
}
```

### Streaming Responses
```javascript
// Create message for streaming
const botMsgId = chat.messageAddNew('', 'Bot', 'left');

// Append content as it arrives
streamingAPI.onChunk(chunk => {
    chat.messageAppendContent(botMsgId, chunk);
});
```

**🛠 [Complete LLM Integration Guide](docs/DEVELOPER-GUIDE.md#llm-integration-best-practices)**



## 🏗 Framework Integration

### React
```jsx
function ChatComponent() {
    const chatRef = useRef(null);
    const instanceRef = useRef(null);
    
    useEffect(() => {
        instanceRef.current = new quikchat(chatRef.current, handleMessage);
    }, []);
    
    return <div ref={chatRef} style={{ height: '400px' }} />;
}
```

### Vue
```vue
<template>
    <div ref="chatContainer" class="chat-container"></div>
</template>

<script>
import quikchat from 'quikchat';

export default {
    mounted() {
        this.chat = new quikchat(this.$refs.chatContainer, this.handleMessage);
    }
}
</script>
```

**⚛️ [Framework Integration Examples](docs/DEVELOPER-GUIDE.md#frontend-framework-integration)**



## 📖 Documentation

| Document | Description |
|-|-|
| **[API Reference](docs/API-REFERENCE.md)** | Complete technical reference for all methods and options |
| **[Developer Guide](docs/DEVELOPER-GUIDE.md)** | Practical recipes and advanced patterns |
| **[Examples](examples/)** | Working code examples and demos |
| **[Live Demo](https://deftio.github.io/quikchat/examples/)** | Interactive examples and showcase |



## 🌟 Examples & Demos

- **[Basic Chat](https://deftio.github.io/quikchat/examples/example_umd.html)** - Simple chat interface
- **[LLM Integration](examples/openai.html)** - OpenAI GPT integration
- **[Multi-Instance](examples/dual-chatrooms.html)** - Multiple chats on one page
- **[Visibility Controls](examples/hidden_message.html)** - Message visibility features
- **[Theme Showcase](https://deftio.github.io/quikchat/examples/)** - Light and dark themes
- **[React Integration](examples/quikchat-react.html)** - React component example
- **[Backend Examples](examples/)** - FastAPI and Node.js backends

**📂 [Browse All Examples](examples/index.html)**



## 🚀 Performance

QuikChat is built for production use:

- **Lightweight**: ~25KB minified + gzipped
- **Fast**: Sub-millisecond message rendering
- **Scalable**: Tested with 10,000 messages rendering in 38ms with virtual scrolling
- **Memory Efficient**: Only renders visible messages in viewport

**📊 [Virtual Scrolling Technical Details](docs/virtual_scrolling.md) | [Performance Guide](docs/DEVELOPER-GUIDE.md#performance-optimization)**



## 🛠 Building from Source

```bash
# Clone repository
git clone https://github.com/deftio/quikchat.git
cd quikchat

# Install dependencies
npm install

# Build for production
npm run build

# Run tests
npm test

# Start development server
npm run dev
```

**Requirements**: Node.js 14+ and npm 6+



## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🐛 Report Issues** - Found a bug? [Open an issue](https://github.com/deftio/quikchat/issues)
2. **💡 Feature Requests** - Have an idea? We'd love to hear it
3. **🔧 Code Contributions** - Submit pull requests for bug fixes or new features
4. **📖 Documentation** - Help improve our guides and examples
5. **🌟 Share Examples** - Show us what you've built with QuikChat

### Development Setup
```bash
git clone https://github.com/deftio/quikchat.git
cd quikchat
npm install
npm run dev
```

**📋 [Contributing Guidelines](CONTRIBUTING.md)**



## 📄 License

QuikChat is licensed under the [BSD-2-Clause License](LICENSE.txt).



## 🔗 Links

- **📦 [NPM Package](https://www.npmjs.com/package/quikchat)**
- **🐙 [GitHub Repository](https://github.com/deftio/quikchat)**
- **🚀 [Live Examples](https://deftio.github.io/quikchat/examples/)**
- **📖 [Medium Article](https://medium.com/gitconnected/quikchat-4be8d4a849e5)**
- **💬 [Issues & Support](https://github.com/deftio/quikchat/issues)**

