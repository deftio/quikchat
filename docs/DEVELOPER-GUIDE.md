# QuikChat Developer Guide

Build powerful chat applications with QuikChat - a lightweight, flexible chat UI library for web applications.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Core Concepts](#core-concepts)
3. [Theming Guide](#theming-guide)
4. [Frontend Framework Integration](#frontend-framework-integration)
5. [LLM Integration Best Practices](#llm-integration-best-practices)
6. [Advanced History Management](#advanced-history-management)
7. [Mastering Visibility Controls](#mastering-visibility-controls)
8. [Performance Optimization](#performance-optimization)
9. [Security Best Practices](#security-best-practices)

---

## Quick Start

Get a chat interface running in under 5 minutes!

### 1. Simple Chat Application

Create a basic chat interface with just a few lines of code:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css">
    <style>
        #chat { 
            width: 400px; 
            height: 600px; 
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <div id="chat"></div>
    
    <script src="https://unpkg.com/quikchat"></script>
    <script>
        // Create a chat instance
        const chat = new quikchat('#chat', (instance, message) => {
            // Display the user's message
            instance.messageAddNew(message, 'You', 'right');
            
            // Simulate a response after 1 second
            setTimeout(() => {
                instance.messageAddNew(
                    `Echo: ${message}`, 
                    'Bot', 
                    'left'
                );
            }, 1000);
        });
    </script>
</body>
</html>
```

### 2. Installation Options

#### CDN (Quickest)

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css">

<!-- JavaScript -->
<script src="https://unpkg.com/quikchat"></script>
```

#### NPM (Recommended for Projects)

```bash
npm install quikchat
```

Then import in your JavaScript:

```javascript
// ES6 Modules
import quikchat from 'quikchat';
import 'quikchat/dist/quikchat.css';

// CommonJS
const quikchat = require('quikchat');
require('quikchat/dist/quikchat.css');
```

### 3. Basic Usage Pattern

```javascript
// Initialize QuikChat
const chat = new quikchat(container, onSendCallback, options);

// Add messages programmatically
chat.messageAddNew('Hello!', 'Assistant', 'left');
chat.messageAddNew('Hi there!', 'User', 'right');

// Handle user input
function onSendCallback(instance, message) {
    // The user typed 'message' and pressed send
    // Add your logic here
    
    // Example: Echo the message
    instance.messageAddNew(message, 'You', 'right');
    
    // Example: Process with an API
    fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => response.json())
    .then(data => {
        instance.messageAddNew(data.reply, 'Bot', 'left');
    });
}
```

## Core Concepts

### Message Structure

Every message in QuikChat has these key properties:

```javascript
chat.messageAddFull({
    content: 'Hello, world!',     // The message text
    userString: 'Assistant',       // Who sent it
    align: 'left',                 // 'left', 'right', or 'center'
    role: 'assistant',             // 'user', 'assistant', or 'system'
    scrollIntoView: true,          // Auto-scroll to this message
    visible: true,                 // Show/hide the message
    tags: ['important']            // Custom tags for filtering
});
```

### Container Requirements

QuikChat needs a container with defined dimensions:

```css
/* Good - Explicit dimensions */
#chat-container {
    width: 100%;
    height: 500px;  /* Fixed height */
}

/* Also good - Viewport units */
#chat-container {
    width: 100vw;
    height: 80vh;
}

/* Also good - Flexbox child */
.parent {
    display: flex;
    height: 100vh;
}
#chat-container {
    flex: 1;  /* Takes available space */
}
```

### Common Patterns

#### Loading States

```javascript
// Show typing indicator
const typingId = chat.messageAddNew('...', 'Bot', 'left');

// Replace with actual response
fetch('/api/chat')
    .then(response => response.text())
    .then(text => {
        chat.messageReplaceContent(typingId, text);
    });
```

#### Streaming Responses

```javascript
// Add empty message
const msgId = chat.messageAddNew('', 'Bot', 'left');

// Stream chunks
eventSource.onmessage = (event) => {
    chat.messageAppendContent(msgId, event.data);
};
```

#### Error Handling

```javascript
function handleMessage(instance, message) {
    instance.messageAddNew(message, 'You', 'right');
    
    fetch('/api/chat', { 
        method: 'POST',
        body: JSON.stringify({ message })
    })
    .then(response => {
        if (!response.ok) throw new Error('Network error');
        return response.json();
    })
    .then(data => {
        instance.messageAddNew(data.reply, 'Bot', 'left');
    })
    .catch(error => {
        instance.messageAddNew(
            '⚠️ Sorry, something went wrong. Please try again.',
            'System',
            'center'
        );
    });
}
```

### Tips for Success

1. **Always set container dimensions** - QuikChat needs explicit width/height
2. **Use message IDs** - Store the return value of `messageAddNew()` for updates
3. **Handle errors gracefully** - Show user-friendly error messages
4. **Test on mobile** - Ensure your container is responsive
5. **Use themes** - Built-in themes save development time

### Troubleshooting

#### Multiple Initialization
```javascript
// ❌ Problem: Initializing chat multiple times
let chat;
function initChat() {
    chat = new quikchat('#chat', handler); // Overwrites previous instance
}

// ✅ Solution: Check for existing instance
let chat;
function initChat() {
    if (!chat) {
        chat = new quikchat('#chat', handler);
    }
    return chat;
}
```

---

## Theming Guide

### Understanding the CSS Architecture

QuikChat uses a layered CSS system:

1. **Base Structure** (`.quikchat-base`) - Layout and positioning
2. **Theme Layer** (`.quikchat-theme-*`) - Colors, fonts, spacing
3. **Component Classes** - Specific elements like messages, inputs
4. **State Classes** - Dynamic states and variations

### Creating a Custom Theme

#### Step 1: Define Your Theme Class
```css
/* custom-theme.css */
.my-custom-theme {
  border: 2px solid #2563eb;
  border-radius: 12px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  font-family: 'SF Pro Display', -apple-system, sans-serif;
}
```

#### Step 2: Style the Components
```css
/* Title Area */
.my-custom-theme .quikchat-title-area {
  background: #2563eb;
  color: white;
  padding: 16px;
  font-weight: 600;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

/* Messages Area */
.my-custom-theme .quikchat-messages-area {
  background: #ffffff;
  padding: 16px;
}

/* Individual Messages */
.my-custom-theme .quikchat-message {
  margin-bottom: 12px;
  animation: fadeIn 0.3s ease-out;
}

.my-custom-theme .quikchat-message-content {
  padding: 12px 16px;
  border-radius: 18px;
  max-width: 70%;
}

/* Left-aligned messages (other users) */
.my-custom-theme .left-singleline .quikchat-message-content,
.my-custom-theme .left-multiline .quikchat-message-content {
  background: #f3f4f6;
  color: #1f2937;
  margin-right: auto;
}

/* Right-aligned messages (current user) */
.my-custom-theme .right-singleline .quikchat-message-content,
.my-custom-theme .right-multiline .quikchat-message-content {
  background: #2563eb;
  color: white;
  margin-left: auto;
}

/* Input Area */
.my-custom-theme .quikchat-input-area {
  background: #f9fafb;
  padding: 16px;
  border-top: 1px solid #e5e7eb;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.my-custom-theme .quikchat-input-textbox {
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.my-custom-theme .quikchat-input-textbox:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.my-custom-theme .quikchat-input-send-btn {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.my-custom-theme .quikchat-input-send-btn:hover {
  background: #1d4ed8;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### Step 3: Apply Your Theme
```javascript
const chat = new quikchat('#chat', handler, {
    theme: 'my-custom-theme'
});

// Or change theme dynamically
chat.changeTheme('my-custom-theme');
```

### Multi-Instance Theming with `instanceClass`

For different themes on the same page:

```javascript
// Sales chat with professional theme
const salesChat = new quikchat('#sales-chat', handleSales, {
    theme: 'quikchat-theme-light',
    instanceClass: 'sales-instance'
});

// Support chat with friendly theme
const supportChat = new quikchat('#support-chat', handleSupport, {
    theme: 'quikchat-theme-dark', 
    instanceClass: 'support-instance'
});
```

```css
/* Scope styles to specific instances */
.sales-instance {
    border-color: #059669; /* Green for sales */
}

.support-instance {
    border-color: #dc2626; /* Red for support */
}

/* Override specific elements per instance */
.sales-instance .quikchat-input-send-btn {
    background: #059669;
}

.support-instance .quikchat-input-send-btn {
    background: #dc2626;
}
```

### Responsive Design Patterns

```css
/* Mobile-first responsive design */
.my-custom-theme {
    /* Base mobile styles */
}

@media (min-width: 768px) {
    .my-custom-theme .quikchat-message-content {
        max-width: 60%; /* Narrower on desktop */
    }
    
    .my-custom-theme .quikchat-input-area {
        display: flex;
        gap: 12px;
    }
    
    .my-custom-theme .quikchat-input-textbox {
        flex: 1;
    }
}

@media (max-width: 480px) {
    .my-custom-theme .quikchat-message-content {
        max-width: 85%; /* Wider on small screens */
        font-size: 14px;
    }
}
```

---

## Frontend Framework Integration

### React Integration

#### Basic React Component
```jsx
import React, { useRef, useEffect, useCallback } from 'react';
import quikchat from 'quikchat';
import 'quikchat/dist/quikchat.css';

function ChatWidget({ onMessage, messages = [] }) {
    const chatRef = useRef(null);
    const instanceRef = useRef(null);
    
    const handleMessage = useCallback((instance, message) => {
        if (onMessage) {
            onMessage(message);
        }
    }, [onMessage]);
    
    useEffect(() => {
        if (chatRef.current && !instanceRef.current) {
            instanceRef.current = new quikchat(
                chatRef.current,
                handleMessage,
                {
                    theme: 'quikchat-theme-light',
                    titleArea: { title: 'Chat', show: true }
                }
            );
        }
        
        return () => {
            // Cleanup if needed
            instanceRef.current = null;
        };
    }, [handleMessage]);
    
    // Add external messages to chat
    useEffect(() => {
        if (instanceRef.current && messages.length > 0) {
            const lastMessage = messages[messages.length - 1];
            instanceRef.current.messageAddNew(
                lastMessage.content,
                lastMessage.user,
                lastMessage.align || 'left'
            );
        }
    }, [messages]);
    
    return (
        <div 
            ref={chatRef} 
            style={{ width: '100%', height: '400px' }}
        />
    );
}

// Usage
function App() {
    const [botMessages, setBotMessages] = useState([]);
    
    const handleUserMessage = async (message) => {
        // Send to your API
        const response = await fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        const data = await response.json();
        
        setBotMessages(prev => [...prev, {
            content: data.response,
            user: 'Assistant',
            align: 'left'
        }]);
    };
    
    return (
        <ChatWidget 
            onMessage={handleUserMessage}
            messages={botMessages}
        />
    );
}
```

#### Advanced React Hook
```jsx
import { useRef, useEffect, useCallback, useState } from 'react';

function useQuikChat(containerId, options = {}) {
    const instanceRef = useRef(null);
    const [isReady, setIsReady] = useState(false);
    
    const sendMessage = useCallback((content, user = 'Bot', align = 'left') => {
        if (instanceRef.current) {
            return instanceRef.current.messageAddNew(content, user, align);
        }
    }, []);
    
    const clearChat = useCallback(() => {
        if (instanceRef.current) {
            instanceRef.current.historyClear();
        }
    }, []);
    
    const setVisibility = useCallback((msgId, visible) => {
        if (instanceRef.current) {
            return instanceRef.current.messageSetVisibility(msgId, visible);
        }
    }, []);
    
    useEffect(() => {
        const container = document.getElementById(containerId);
        if (container && !instanceRef.current) {
            instanceRef.current = new quikchat(
                container,
                options.onMessage || (() => {}),
                options
            );
            setIsReady(true);
        }
        
        return () => {
            instanceRef.current = null;
            setIsReady(false);
        };
    }, [containerId, options]);
    
    return {
        instance: instanceRef.current,
        isReady,
        sendMessage,
        clearChat,
        setVisibility
    };
}

// Usage
function ChatComponent() {
    const { sendMessage, clearChat, isReady } = useQuikChat('my-chat', {
        theme: 'quikchat-theme-dark',
        onMessage: (instance, msg) => {
            // Handle user messages
            console.log('User said:', msg);
        }
    });
    
    return (
        <div>
            <div id="my-chat" style={{ height: '400px' }} />
            {isReady && (
                <div>
                    <button onClick={() => sendMessage('Hello!')}>
                        Send Test Message
                    </button>
                    <button onClick={clearChat}>
                        Clear Chat
                    </button>
                </div>
            )}
        </div>
    );
}
```

### Vue Integration

```vue
<template>
  <div>
    <div ref="chatContainer" class="chat-container"></div>
    <div v-if="chatReady" class="controls">
      <button @click="addTestMessage">Add Test Message</button>
      <button @click="clearChat">Clear Chat</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import quikchat from 'quikchat';
import 'quikchat/dist/quikchat.css';

export default {
  name: 'QuikChatComponent',
  props: {
    theme: {
      type: String,
      default: 'quikchat-theme-light'
    }
  },
  emits: ['message'],
  setup(props, { emit }) {
    const chatContainer = ref(null);
    const chatInstance = ref(null);
    const chatReady = ref(false);
    
    const handleMessage = (instance, message) => {
      emit('message', { instance, message });
    };
    
    const addTestMessage = () => {
      if (chatInstance.value) {
        chatInstance.value.messageAddNew(
          'Test message from Vue!',
          'System',
          'center'
        );
      }
    };
    
    const clearChat = () => {
      if (chatInstance.value) {
        chatInstance.value.historyClear();
      }
    };
    
    onMounted(() => {
      if (chatContainer.value) {
        chatInstance.value = new quikchat(
          chatContainer.value,
          handleMessage,
          {
            theme: props.theme,
            titleArea: { title: 'Vue Chat', show: true }
          }
        );
        chatReady.value = true;
      }
    });
    
    onUnmounted(() => {
      chatInstance.value = null;
      chatReady.value = false;
    });
    
    return {
      chatContainer,
      chatReady,
      addTestMessage,
      clearChat
    };
  }
};
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 400px;
}

.controls {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
</style>
```

### Svelte Integration

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import quikchat from 'quikchat';
  import 'quikchat/dist/quikchat.css';
  
  export let theme = 'quikchat-theme-light';
  export let title = 'Svelte Chat';
  
  let chatContainer;
  let chatInstance;
  let isReady = false;
  
  function handleMessage(instance, message) {
    console.log('Message from user:', message);
    
    // Echo message
    instance.messageAddNew(message, 'You', 'right');
    
    // Simple bot response
    setTimeout(() => {
      instance.messageAddNew(
        `You said: "${message}"`,
        'Bot',
        'left'
      );
    }, 1000);
  }
  
  function addSystemMessage() {
    if (chatInstance) {
      chatInstance.messageAddNew(
        'System message from Svelte',
        'System',
        'center'
      );
    }
  }
  
  onMount(() => {
    if (chatContainer) {
      chatInstance = new quikchat(
        chatContainer,
        handleMessage,
        {
          theme,
          titleArea: { title, show: true }
        }
      );
      isReady = true;
    }
  });
  
  onDestroy(() => {
    chatInstance = null;
    isReady = false;
  });
</script>

<div class="chat-wrapper">
  <div bind:this={chatContainer} class="chat-container"></div>
  
  {#if isReady}
    <div class="controls">
      <button on:click={addSystemMessage}>
        Add System Message
      </button>
    </div>
  {/if}
</div>

<style>
  .chat-container {
    width: 100%;
    height: 400px;
  }
  
  .controls {
    margin-top: 10px;
  }
</style>
```

---

## LLM Integration Best Practices

### OpenAI Integration

```javascript
class OpenAIChat {
    constructor(apiKey, chatContainer) {
        this.apiKey = apiKey;
        this.chat = new quikchat(chatContainer, this.handleUserMessage.bind(this), {
            theme: 'quikchat-theme-light',
            titleArea: { title: 'AI Assistant', show: true }
        });
        
        // Add welcome message
        this.chat.messageAddNew(
            'Hello! I\'m your AI assistant. How can I help you today?',
            'Assistant',
            'left'
        );
    }
    
    async handleUserMessage(instance, message) {
        // Show user message
        instance.messageAddNew(message, 'You', 'right');
        
        // Show typing indicator
        const typingId = instance.messageAddNew('...', 'Assistant', 'left');
        
        try {
            // Prepare conversation history
            const history = this.formatHistoryForOpenAI();
            
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a helpful assistant.'
                        },
                        ...history,
                        {
                            role: 'user',
                            content: message
                        }
                    ],
                    stream: true
                })
            });
            
            // Remove typing indicator
            instance.messageRemove(typingId);
            
            // Handle streaming response
            await this.handleStreamingResponse(response, instance);
            
        } catch (error) {
            console.error('OpenAI API error:', error);
            instance.messageReplaceContent(typingId, 
                'Sorry, I encountered an error. Please try again.');
        }
    }
    
    formatHistoryForOpenAI() {
        const history = this.chat.historyGetAllCopy();
        
        return history
            .filter(msg => msg.userString !== 'System') // Exclude system messages
            .map(msg => ({
                role: msg.userString === 'You' ? 'user' : 'assistant',
                content: msg.content
            }));
    }
    
    async handleStreamingResponse(response, instance) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        // Create initial message for streaming
        const assistantMsgId = instance.messageAddNew('', 'Assistant', 'left');
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') return;
                        
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            
                            if (content) {
                                instance.messageAppendContent(assistantMsgId, content);
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }
}

// Usage
const aiChat = new OpenAIChat('your-api-key', '#chat-container');
```

### Anthropic Claude Integration

```javascript
class ClaudeChat {
    constructor(apiKey, chatContainer) {
        this.apiKey = apiKey;
        this.chat = new quikchat(chatContainer, this.handleUserMessage.bind(this), {
            titleArea: { title: 'Claude Assistant', show: true }
        });
    }
    
    async handleUserMessage(instance, message) {
        instance.messageAddNew(message, 'You', 'right');
        
        const typingId = instance.messageAddNew('Thinking...', 'Claude', 'left');
        
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'x-api-key': this.apiKey,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-sonnet-20240229',
                    max_tokens: 1000,
                    messages: this.formatHistoryForClaude(message)
                })
            });
            
            const data = await response.json();
            
            instance.messageReplaceContent(
                typingId,
                data.content[0].text
            );
            
        } catch (error) {
            console.error('Claude API error:', error);
            instance.messageReplaceContent(typingId,
                'I apologize, but I encountered an error. Please try again.');
        }
    }
    
    formatHistoryForClaude(newMessage) {
        const history = this.chat.historyGetAllCopy();
        const messages = [];
        
        // Convert history to Claude format
        for (const msg of history) {
            if (msg.userString === 'You') {
                messages.push({ role: 'user', content: msg.content });
            } else if (msg.userString === 'Claude') {
                messages.push({ role: 'assistant', content: msg.content });
            }
        }
        
        // Add current message
        messages.push({ role: 'user', content: newMessage });
        
        return messages;
    }
}
```

### Ollama Local Integration

```javascript
class OllamaChat {
    constructor(chatContainer, modelName = 'llama2') {
        this.modelName = modelName;
        this.ollamaUrl = 'http://localhost:11434';
        
        this.chat = new quikchat(chatContainer, this.handleUserMessage.bind(this), {
            titleArea: { title: `Ollama (${modelName})`, show: true }
        });
        
        this.initializeModel();
    }
    
    async initializeModel() {
        try {
            // Check if Ollama is running
            await fetch(`${this.ollamaUrl}/api/tags`);
            
            this.chat.messageAddNew(
                `Connected to Ollama with ${this.modelName}. How can I help?`,
                'Assistant',
                'left'
            );
        } catch (error) {
            this.chat.messageAddNew(
                'Could not connect to Ollama. Make sure it\'s running on localhost:11434',
                'System',
                'center'
            );
        }
    }
    
    async handleUserMessage(instance, message) {
        instance.messageAddNew(message, 'You', 'right');
        
        // Create message for streaming response
        const assistantMsgId = instance.messageAddNew('', 'Assistant', 'left');
        
        try {
            const response = await fetch(`${this.ollamaUrl}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.modelName,
                    prompt: this.buildPrompt(message),
                    stream: true
                })
            });
            
            await this.handleOllamaStream(response, instance, assistantMsgId);
            
        } catch (error) {
            console.error('Ollama error:', error);
            instance.messageReplaceContent(assistantMsgId,
                'Connection error. Is Ollama running?');
        }
    }
    
    buildPrompt(newMessage) {
        const history = this.chat.historyGetAllCopy();
        let prompt = '';
        
        for (const msg of history) {
            if (msg.userString === 'You') {
                prompt += `Human: ${msg.content}\n`;
            } else if (msg.userString === 'Assistant') {
                prompt += `Assistant: ${msg.content}\n`;
            }
        }
        
        prompt += `Human: ${newMessage}\nAssistant: `;
        return prompt;
    }
    
    async handleOllamaStream(response, instance, msgId) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n').filter(line => line.trim());
                
                for (const line of lines) {
                    try {
                        const data = JSON.parse(line);
                        if (data.response) {
                            instance.messageAppendContent(msgId, data.response);
                        }
                    } catch (e) {
                        // Skip invalid JSON
                    }
                }
            }
        } finally {
            reader.releaseLock();
        }
    }
}

// Usage
const ollamaChat = new OllamaChat('#chat-container', 'llama2');
```

### Error Handling & Rate Limiting

```javascript
class ResilientLLMChat {
    constructor(provider, chatContainer) {
        this.provider = provider;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.rateLimitDelay = 1000;
        
        this.chat = new quikchat(chatContainer, this.handleUserMessage.bind(this));
    }
    
    async handleUserMessage(instance, message) {
        instance.messageAddNew(message, 'You', 'right');
        
        const statusMsgId = instance.messageAddNew('...', 'Assistant', 'left');
        
        try {
            await this.sendWithRetry(instance, message, statusMsgId);
        } catch (error) {
            this.handleFinalError(instance, statusMsgId, error);
        }
    }
    
    async sendWithRetry(instance, message, statusMsgId, attempt = 1) {
        try {
            const response = await this.provider.send(message);
            instance.messageReplaceContent(statusMsgId, response);
            this.retryCount = 0; // Reset on success
            
        } catch (error) {
            if (attempt <= this.maxRetries) {
                // Update status to show retry
                instance.messageReplaceContent(statusMsgId, 
                    `Retrying... (${attempt}/${this.maxRetries})`);
                
                // Exponential backoff
                const delay = this.rateLimitDelay * Math.pow(2, attempt - 1);
                await new Promise(resolve => setTimeout(resolve, delay));
                
                return this.sendWithRetry(instance, message, statusMsgId, attempt + 1);
            } else {
                throw error;
            }
        }
    }
    
    handleFinalError(instance, statusMsgId, error) {
        let errorMessage = 'Sorry, I encountered an error.';
        
        if (error.status === 429) {
            errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (error.status === 401) {
            errorMessage = 'Authentication error. Please check your API key.';
        } else if (error.status >= 500) {
            errorMessage = 'Server error. Please try again later.';
        }
        
        instance.messageReplaceContent(statusMsgId, errorMessage);
    }
}
```

---

## Advanced History Management

### Persistent Storage with LocalStorage

```javascript
class PersistentChat {
    constructor(chatContainer, storageKey = 'quikchat-history') {
        this.storageKey = storageKey;
        
        this.chat = new quikchat(chatContainer, this.handleMessage.bind(this), {
            titleArea: { title: 'Persistent Chat', show: true }
        });
        
        this.loadHistory();
        this.setupAutoSave();
    }
    
    handleMessage(instance, message) {
        instance.messageAddNew(message, 'You', 'right');
        this.saveHistory();
        
        // Your message handling logic here
    }
    
    loadHistory() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const history = JSON.parse(saved);
                this.chat.historyRestoreAll(history);
                
                console.log(`Loaded ${history.length} messages from storage`);
            }
        } catch (error) {
            console.error('Failed to load chat history:', error);
        }
    }
    
    saveHistory() {
        try {
            const history = this.chat.historyGetAllCopy();
            
            // Remove DOM references before saving
            const cleanHistory = history.map(msg => {
                const { messageDiv, ...cleanMsg } = msg;
                return cleanMsg;
            });
            
            localStorage.setItem(this.storageKey, JSON.stringify(cleanHistory));
        } catch (error) {
            console.error('Failed to save chat history:', error);
        }
    }
    
    setupAutoSave() {
        // Save on page unload
        window.addEventListener('beforeunload', () => {
            this.saveHistory();
        });
        
        // Periodic saves
        setInterval(() => {
            this.saveHistory();
        }, 30000); // Save every 30 seconds
    }
    
    clearHistory() {
        this.chat.historyClear();
        localStorage.removeItem(this.storageKey);
    }
    
    exportHistory() {
        const history = this.chat.historyGetAllCopy();
        const cleanHistory = history.map(msg => {
            const { messageDiv, ...cleanMsg } = msg;
            return cleanMsg;
        });
        
        const blob = new Blob([JSON.stringify(cleanHistory, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
    
    async importHistory(file) {
        try {
            const text = await file.text();
            const history = JSON.parse(text);
            
            this.chat.historyRestoreAll(history);
            this.saveHistory();
            
            return true;
        } catch (error) {
            console.error('Failed to import history:', error);
            return false;
        }
    }
}

// Usage with file import
const persistentChat = new PersistentChat('#chat');

// Add import/export controls
document.getElementById('export-btn').addEventListener('click', () => {
    persistentChat.exportHistory();
});

document.getElementById('import-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        persistentChat.importHistory(file);
    }
});
```

### Server-Side History Sync

```javascript
class CloudSyncChat {
    constructor(chatContainer, userId, apiEndpoint) {
        this.userId = userId;
        this.apiEndpoint = apiEndpoint;
        this.syncInterval = null;
        
        this.chat = new quikchat(chatContainer, this.handleMessage.bind(this));
        
        this.loadFromServer();
        this.startAutoSync();
    }
    
    async handleMessage(instance, message) {
        instance.messageAddNew(message, 'You', 'right');
        
        // Optimistically save to server
        await this.syncToServer();
    }
    
    async loadFromServer() {
        try {
            const response = await fetch(`${this.apiEndpoint}/history/${this.userId}`);
            
            if (response.ok) {
                const history = await response.json();
                this.chat.historyRestoreAll(history);
            }
        } catch (error) {
            console.error('Failed to load history from server:', error);
        }
    }
    
    async syncToServer() {
        try {
            const history = this.chat.historyGetAllCopy();
            
            // Clean history for transmission
            const cleanHistory = history.map(msg => {
                const { messageDiv, ...cleanMsg } = msg;
                return cleanMsg;
            });
            
            await fetch(`${this.apiEndpoint}/history/${this.userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cleanHistory)
            });
            
        } catch (error) {
            console.error('Failed to sync to server:', error);
        }
    }
    
    startAutoSync() {
        // Sync every 2 minutes
        this.syncInterval = setInterval(() => {
            this.syncToServer();
        }, 120000);
    }
    
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }
    
    async mergeWithServer() {
        // Advanced: merge local and server history
        try {
            const serverHistory = await this.loadFromServer();
            const localHistory = this.chat.historyGetAllCopy();
            
            // Merge logic based on timestamps
            const merged = this.mergeHistories(localHistory, serverHistory);
            
            this.chat.historyRestoreAll(merged);
            await this.syncToServer();
            
        } catch (error) {
            console.error('Failed to merge histories:', error);
        }
    }
    
    mergeHistories(local, server) {
        // Simple merge by timestamp - implement your own logic
        const allMessages = [...local, ...server];
        
        // Remove duplicates by msgid
        const unique = allMessages.filter((msg, index, arr) => 
            arr.findIndex(m => m.msgid === msg.msgid) === index
        );
        
        // Sort by timestamp
        return unique.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );
    }
}
```

### Data Compression for Large Histories

```javascript
class CompressedHistoryManager {
    constructor(chat) {
        this.chat = chat;
    }
    
    async compressHistory() {
        const history = this.chat.historyGetAllCopy();
        
        // Remove DOM references and clean data
        const cleanHistory = history.map(msg => ({
            msgid: msg.msgid,
            content: msg.content,
            userString: msg.userString,
            align: msg.align,
            role: msg.role,
            timestamp: msg.timestamp,
            visible: msg.visible,
            tags: msg.tags
        }));
        
        // Convert to JSON and compress
        const json = JSON.stringify(cleanHistory);
        const compressed = await this.compress(json);
        
        return compressed;
    }
    
    async compress(text) {
        // Use browser's CompressionStream if available
        if ('CompressionStream' in window) {
            const stream = new CompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            writer.write(new TextEncoder().encode(text));
            writer.close();
            
            const chunks = [];
            let done = false;
            
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) chunks.push(value);
            }
            
            return new Uint8Array(chunks.reduce((acc, chunk) => 
                [...acc, ...chunk], []));
        } else {
            // Fallback: just return encoded text
            return new TextEncoder().encode(text);
        }
    }
    
    async decompressHistory(compressedData) {
        try {
            const decompressed = await this.decompress(compressedData);
            const history = JSON.parse(decompressed);
            
            this.chat.historyRestoreAll(history);
            return true;
        } catch (error) {
            console.error('Failed to decompress history:', error);
            return false;
        }
    }
    
    async decompress(compressedData) {
        if ('DecompressionStream' in window) {
            const stream = new DecompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            writer.write(compressedData);
            writer.close();
            
            const chunks = [];
            let done = false;
            
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) chunks.push(value);
            }
            
            const result = new Uint8Array(chunks.reduce((acc, chunk) => 
                [...acc, ...chunk], []));
            return new TextDecoder().decode(result);
        } else {
            // Fallback
            return new TextDecoder().decode(compressedData);
        }
    }
}
```

---

## Mastering Visibility Controls
*Available in v1.1.13+*

### Individual Message Visibility

Perfect for hiding specific messages without deleting them:

```javascript
class ModerationChat {
    constructor(chatContainer) {
        this.chat = new quikchat(chatContainer, this.handleMessage.bind(this));
        this.hiddenMessages = new Set();
    }
    
    handleMessage(instance, message) {
        const msgId = instance.messageAddNew(message, 'User', 'right');
        
        // Check for inappropriate content
        if (this.isInappropriate(message)) {
            this.moderateMessage(msgId, message);
        }
    }
    
    isInappropriate(message) {
        const badWords = ['spam', 'inappropriate']; // Your filter logic
        return badWords.some(word => 
            message.toLowerCase().includes(word)
        );
    }
    
    moderateMessage(msgId, originalMessage) {
        // Hide the message
        this.chat.messageSetVisibility(msgId, false);
        this.hiddenMessages.add(msgId);
        
        // Add moderation notice
        this.chat.messageAddNew(
            '[Message hidden by moderation]',
            'System',
            'center',
            'system',
            true,
            true,
            ['moderation', 'system']
        );
        
        // Log for review
        console.log('Moderated message:', { msgId, originalMessage });
    }
    
    showHiddenMessages() {
        // Reveal all hidden messages for review
        this.hiddenMessages.forEach(msgId => {
            this.chat.messageSetVisibility(msgId, true);
        });
    }
    
    permanentlyDeleteHidden() {
        // Actually remove moderated messages
        this.hiddenMessages.forEach(msgId => {
            this.chat.messageRemove(msgId);
        });
        this.hiddenMessages.clear();
    }
}
```

### Tagged Visibility System
*Available in v1.1.14+*

Group-based visibility control with high performance:

```javascript
class AdvancedVisibilityChat {
    constructor(chatContainer) {
        this.chat = new quikchat(chatContainer, this.handleMessage.bind(this), {
            instanceClass: 'advanced-chat'
        });
        
        this.setupVisibilityControls();
        this.addWelcomeMessages();
    }
    
    handleMessage(instance, message) {
        // Add user message with appropriate tags
        const tags = this.classifyMessage(message);
        
        instance.messageAddNew(
            message,
            'You',
            'right',
            'user',
            true,
            true,
            tags
        );
        
        // Simulate bot response with tags
        setTimeout(() => {
            instance.messageAddNew(
                'I understand your message.',
                'Assistant',
                'left',
                'assistant',
                true,
                true,
                ['bot-response', 'public']
            );
        }, 1000);
    }
    
    classifyMessage(message) {
        const tags = ['user-message'];
        
        // Add tags based on content
        if (message.includes('?')) tags.push('question');
        if (message.length > 100) tags.push('long-message');
        if (this.isUrgent(message)) tags.push('urgent');
        
        return tags;
    }
    
    isUrgent(message) {
        const urgentWords = ['urgent', 'emergency', 'asap', 'immediately'];
        return urgentWords.some(word => 
            message.toLowerCase().includes(word)
        );
    }
    
    addWelcomeMessages() {
        // System messages
        this.chat.messageAddNew(
            'Chat session initialized',
            'System',
            'center',
            'system',
            true,
            false, // Hidden by default
            ['system', 'session-start']
        );
        
        // Debug messages
        this.chat.messageAddNew(
            'Debug mode enabled',
            'Debug',
            'center',
            'debug',
            true,
            false, // Hidden by default
            ['debug', 'system']
        );
        
        // Welcome message
        this.chat.messageAddNew(
            'Welcome! I can help you with various tasks.',
            'Assistant',
            'left',
            'assistant',
            true,
            true,
            ['welcome', 'bot-response']
        );
    }
    
    setupVisibilityControls() {
        // Create control panel
        this.createControlPanel();
    }
    
    createControlPanel() {
        const controlPanel = document.createElement('div');
        controlPanel.className = 'visibility-controls';
        controlPanel.innerHTML = `
            <h3>Visibility Controls</h3>
            <div class="control-group">
                <label>
                    <input type="checkbox" id="show-system" />
                    Show System Messages
                </label>
                <label>
                    <input type="checkbox" id="show-debug" />
                    Show Debug Messages
                </label>
                <label>
                    <input type="checkbox" id="show-questions" />
                    Highlight Questions
                </label>
                <label>
                    <input type="checkbox" id="show-urgent" />
                    Show Only Urgent
                </label>
            </div>
            <div class="active-tags">
                <strong>Active Tags:</strong>
                <span id="tags-list"></span>
            </div>
        `;
        
        // Insert control panel
        const chatContainer = this.chat._parentElement;
        chatContainer.parentNode.insertBefore(controlPanel, chatContainer.nextSibling);
        
        // Wire up controls
        this.wireControlPanel();
    }
    
    wireControlPanel() {
        document.getElementById('show-system').addEventListener('change', (e) => {
            this.chat.setTagVisibility('system', e.target.checked);
            this.updateTagsList();
        });
        
        document.getElementById('show-debug').addEventListener('change', (e) => {
            this.chat.setTagVisibility('debug', e.target.checked);
            this.updateTagsList();
        });
        
        document.getElementById('show-questions').addEventListener('change', (e) => {
            this.chat.setTagVisibility('question', e.target.checked);
            this.updateTagsList();
        });
        
        document.getElementById('show-urgent').addEventListener('change', (e) => {
            if (e.target.checked) {
                // Hide all other tags, show only urgent
                this.chat.setTagVisibility('user-message', false);
                this.chat.setTagVisibility('bot-response', false);
                this.chat.setTagVisibility('urgent', true);
            } else {
                // Restore normal visibility
                this.chat.setTagVisibility('user-message', true);
                this.chat.setTagVisibility('bot-response', true);
            }
            this.updateTagsList();
        });
        
        // Initial update
        this.updateTagsList();
    }
    
    updateTagsList() {
        const activeTags = this.chat.getActiveTags();
        const visibleTags = activeTags.filter(tag => 
            this.chat.getTagVisibility(tag)
        );
        
        document.getElementById('tags-list').textContent = 
            visibleTags.length > 0 ? visibleTags.join(', ') : 'None';
    }
}
```

### CSS for Custom Tag Styling

```css
/* Base visibility rules */
.advanced-chat .quikchat-tag-system {
    display: none; /* Hidden by default */
}

.advanced-chat .quikchat-tag-debug {
    display: none; /* Hidden by default */
}

/* Show when enabled */
.advanced-chat.quikchat-show-tag-system .quikchat-tag-system {
    display: block;
}

.advanced-chat.quikchat-show-tag-debug .quikchat-tag-debug {
    display: block;
}

/* Custom styling for different tag types */
.advanced-chat .quikchat-tag-urgent .quikchat-message-content {
    border-left: 4px solid #ef4444;
    background-color: #fef2f2;
}

.advanced-chat .quikchat-tag-question .quikchat-message-content {
    border-left: 4px solid #3b82f6;
    background-color: #eff6ff;
}

.advanced-chat .quikchat-tag-system .quikchat-message-content {
    font-style: italic;
    color: #6b7280;
    background-color: #f9fafb;
}

.advanced-chat .quikchat-tag-debug .quikchat-message-content {
    font-family: monospace;
    font-size: 12px;
    background-color: #1f2937;
    color: #10b981;
}

/* Control panel styling */
.visibility-controls {
    margin-top: 20px;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #f9fafb;
}

.control-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 12px 0;
}

.control-group label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
}

.active-tags {
    margin-top: 12px;
    padding: 8px;
    background: white;
    border-radius: 4px;
    font-size: 14px;
}
```

### Multi-Instance with Different Rules

```javascript
// Support chat - show all messages including system
const supportChat = new quikchat('#support-chat', handleSupport, {
    instanceClass: 'support-instance'
});

// Customer chat - hide system messages by default
const customerChat = new quikchat('#customer-chat', handleCustomer, {
    instanceClass: 'customer-instance'
});

// Apply different visibility rules via CSS
```

```css
/* Support instance: show everything */
.support-instance .quikchat-tag-system {
    display: block;
}

.support-instance .quikchat-tag-debug {
    display: block;
}

/* Customer instance: hide technical messages */
.customer-instance .quikchat-tag-system {
    display: none;
}

.customer-instance .quikchat-tag-debug {
    display: none;
}

/* Only show when explicitly enabled */
.customer-instance.quikchat-show-tag-system .quikchat-tag-system {
    display: block;
}
```

---

## Performance Optimization

### Virtual Scrolling (v1.1.16+)

QuikChat includes built-in virtual scrolling that automatically activates for large message volumes. Virtual scrolling ensures smooth performance by only rendering messages that are visible in the viewport.

```javascript
// Virtual scrolling is enabled by default
const chat = new quikchat('#chat', handler);

// Check if virtual scrolling is active
if (chat.isVirtualScrollingEnabled()) {
    console.log('Virtual scrolling is handling rendering');
}

// Get virtual scrolling configuration
const config = chat.getVirtualScrollingConfig();
console.log(`Threshold: ${config.threshold} messages`);

// Customize virtual scrolling settings
const customChat = new quikchat('#chat', handler, {
    virtualScrolling: true,           // Enable/disable virtual scrolling
    virtualScrollingThreshold: 1000   // Messages before activation (default: 500)
});
```

**How it works:**
- Only renders messages visible in the viewport
- Automatically activates at 500+ messages (configurable)
- Uses absolute positioning for efficient scrolling
- Maintains scroll position during updates

**[Technical details and performance metrics](virtual_scrolling.md)**

### Managing Large Conversation Histories

For applications that need to manage extensive chat histories beyond what's currently visible:

```javascript
class OptimizedChat {
    constructor(chatContainer, maxVisibleMessages = 100) {
        this.maxVisibleMessages = maxVisibleMessages;
        this.allMessages = [];
        
        // Virtual scrolling handles rendering performance automatically
        this.chat = new quikchat(chatContainer, this.handleMessage.bind(this));
    }
    
    handleMessage(instance, message) {
        // Add to our message store
        const msgData = {
            content: message,
            userString: 'User',
            align: 'right',
            timestamp: new Date().toISOString()
        };
        
        this.allMessages.push(msgData);
        
        // Add to visible chat
        instance.messageAddNew(message, 'User', 'right');
        
        // Trim if we have too many visible messages
        this.trimVisibleMessages();
    }
    
    trimVisibleMessages() {
        const history = this.chat.historyGetAllCopy();
        
        if (history.length > this.maxVisibleMessages) {
            // Remove oldest messages from display
            const toRemove = history.length - this.maxVisibleMessages;
            
            for (let i = 0; i < toRemove; i++) {
                this.chat.messageRemove(history[i].msgid);
            }
        }
    }
    
    setupVirtualScrolling() {
        // Implement virtual scrolling for very large histories
        // This is a simplified version - real implementation would be more complex
        
        const messagesArea = this.chat._messagesArea;
        let scrollTimeout;
        
        messagesArea.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 100);
        });
    }
    
    handleScroll() {
        const messagesArea = this.chat._messagesArea;
        const scrollTop = messagesArea.scrollTop;
        
        // If user scrolls to top, load more history
        if (scrollTop < 100) {
            this.loadMoreHistory();
        }
    }
    
    loadMoreHistory() {
        // Load previous messages that were trimmed
        const currentHistory = this.chat.historyGetAllCopy();
        const currentOldest = currentHistory[0];
        
        if (currentOldest) {
            const oldestIndex = this.allMessages.findIndex(msg => 
                msg.timestamp === currentOldest.timestamp
            );
            
            if (oldestIndex > 0) {
                // Add previous 20 messages
                const previousMessages = this.allMessages.slice(
                    Math.max(0, oldestIndex - 20),
                    oldestIndex
                );
                
                // Insert at beginning of chat
                previousMessages.forEach(msg => {
                    this.chat.messageAddFull({
                        ...msg,
                        scrollIntoView: false
                    });
                });
            }
        }
    }
    
    // Memory management
    cleanup() {
        // Remove old messages from memory if needed
        if (this.allMessages.length > 10000) {
            this.allMessages = this.allMessages.slice(-5000); // Keep last 5000
        }
    }
}
```

### Efficient Message Batching

```javascript
class BatchedChat {
    constructor(chatContainer) {
        this.chat = new quikchat(chatContainer, this.handleMessage.bind(this));
        this.messageQueue = [];
        this.batchTimeout = null;
    }
    
    handleMessage(instance, message) {
        // Add user message immediately
        instance.messageAddNew(message, 'User', 'right');
        
        // Simulate API that returns multiple messages
        this.simulateAPIResponse(message);
    }
    
    simulateAPIResponse(userMessage) {
        // Simulate getting multiple response chunks
        const responses = [
            'Processing your request...',
            'Analyzing data...',
            'Here are my findings:',
            'Final response: Thank you for your message.'
        ];
        
        // Queue all responses for batching
        responses.forEach((response, index) => {
            this.queueMessage({
                content: response,
                userString: 'Assistant',
                align: 'left',
                delay: index * 500 // Stagger the messages
            });
        });
    }
    
    queueMessage(messageData) {
        this.messageQueue.push(messageData);
        this.scheduleBatch();
    }
    
    scheduleBatch() {
        if (this.batchTimeout) return;
        
        this.batchTimeout = setTimeout(() => {
            this.processBatch();
            this.batchTimeout = null;
        }, 100); // Batch messages within 100ms
    }
    
    processBatch() {
        if (this.messageQueue.length === 0) return;
        
        // Sort by delay
        this.messageQueue.sort((a, b) => (a.delay || 0) - (b.delay || 0));
        
        // Process messages with appropriate delays
        this.messageQueue.forEach((msgData, index) => {
            const delay = msgData.delay || 0;
            
            setTimeout(() => {
                this.chat.messageAddNew(
                    msgData.content,
                    msgData.userString,
                    msgData.align
                );
            }, delay);
        });
        
        this.messageQueue = [];
    }
}
```

### Memory-Efficient History Export

```javascript
class EfficientHistoryManager {
    constructor(chat) {
        this.chat = chat;
    }
    
    exportHistoryStream() {
        // Stream large histories without loading everything into memory
        const history = this.chat.historyGetAllCopy();
        
        return new ReadableStream({
            start(controller) {
                const encoder = new TextEncoder();
                controller.enqueue(encoder.encode('[\n'));
            },
            
            pull(controller) {
                if (history.length > 0) {
                    const message = history.shift();
                    const cleanMsg = this.cleanMessage(message);
                    const json = JSON.stringify(cleanMsg, null, 2);
                    
                    const encoder = new TextEncoder();
                    const comma = history.length > 0 ? ',\n' : '\n';
                    controller.enqueue(encoder.encode(json + comma));
                } else {
                    const encoder = new TextEncoder();
                    controller.enqueue(encoder.encode(']'));
                    controller.close();
                }
            }
        });
    }
    
    cleanMessage(message) {
        // Remove DOM references and large objects
        const { messageDiv, ...cleanMsg } = message;
        return cleanMsg;
    }
    
    async downloadHistoryStream() {
        const stream = this.exportHistoryStream();
        const response = new Response(stream);
        const blob = await response.blob();
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-history-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}
```

### Performance Monitoring

```javascript
class PerformanceMonitor {
    constructor(chat) {
        this.chat = chat;
        this.metrics = {
            messageAddTime: [],
            renderTime: [],
            memoryUsage: []
        };
        
        this.startMonitoring();
    }
    
    startMonitoring() {
        // Monitor message addition performance
        const originalAddNew = this.chat.messageAddNew.bind(this.chat);
        
        this.chat.messageAddNew = (...args) => {
            const start = performance.now();
            const result = originalAddNew(...args);
            const end = performance.now();
            
            this.metrics.messageAddTime.push(end - start);
            this.checkPerformance();
            
            return result;
        };
        
        // Monitor memory usage periodically
        setInterval(() => {
            if (performance.memory) {
                this.metrics.memoryUsage.push({
                    timestamp: Date.now(),
                    used: performance.memory.usedJSHeapSize,
                    total: performance.memory.totalJSHeapSize
                });
            }
        }, 10000); // Every 10 seconds
    }
    
    checkPerformance() {
        const recent = this.metrics.messageAddTime.slice(-10);
        const average = recent.reduce((a, b) => a + b, 0) / recent.length;
        
        if (average > 50) { // If adding messages takes > 50ms
            console.warn('Performance degradation detected:', {
                averageTime: average,
                messageCount: this.chat.historyGetLength()
            });
            
            this.suggestOptimizations();
        }
    }
    
    suggestOptimizations() {
        const messageCount = this.chat.historyGetLength();
        
        if (messageCount > 1000) {
            console.log('Suggestion: Consider implementing message virtualization');
        }
        
        if (this.metrics.memoryUsage.length > 0) {
            const latest = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
            const mbUsed = latest.used / (1024 * 1024);
            
            if (mbUsed > 50) {
                console.log('Suggestion: Consider clearing old history or implementing compression');
            }
        }
    }
    
    getPerformanceReport() {
        return {
            messageCount: this.chat.historyGetLength(),
            averageAddTime: this.getAverageAddTime(),
            memoryTrend: this.getMemoryTrend(),
            suggestions: this.getOptimizationSuggestions()
        };
    }
    
    getAverageAddTime() {
        if (this.metrics.messageAddTime.length === 0) return 0;
        
        return this.metrics.messageAddTime.reduce((a, b) => a + b, 0) / 
               this.metrics.messageAddTime.length;
    }
    
    getMemoryTrend() {
        if (this.metrics.memoryUsage.length < 2) return 'insufficient-data';
        
        const first = this.metrics.memoryUsage[0];
        const last = this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1];
        
        const growth = (last.used - first.used) / first.used;
        
        if (growth > 0.5) return 'high-growth';
        if (growth > 0.2) return 'moderate-growth';
        return 'stable';
    }
    
    getOptimizationSuggestions() {
        const suggestions = [];
        const messageCount = this.chat.historyGetLength();
        
        if (messageCount > 500) {
            suggestions.push('Consider implementing virtual scrolling');
        }
        
        if (this.getAverageAddTime() > 30) {
            suggestions.push('Message addition is slow - check DOM complexity');
        }
        
        if (this.getMemoryTrend() === 'high-growth') {
            suggestions.push('Memory usage growing - implement cleanup strategies');
        }
        
        return suggestions;
    }
}

// Usage
const monitor = new PerformanceMonitor(chat);

// Get performance report periodically
setInterval(() => {
    const report = monitor.getPerformanceReport();
    console.log('Performance Report:', report);
}, 60000); // Every minute
```

---

## Security Best Practices

### Content Sanitization

QuikChat provides built-in sanitization to protect against XSS attacks. **Sanitization is opt-in** to maintain backward compatibility.

#### Built-in Sanitizers

```javascript
// HTML Escaping - Converts HTML tags to entities
const secureChat = new quikchat('#chat', handler, {
    sanitizer: quikchat.sanitizers.escapeHTML
});
// Input: <script>alert('xss')</script>
// Output: &lt;script&gt;alert('xss')&lt;/script&gt;

// HTML Stripping - Removes all HTML tags
const plainChat = new quikchat('#chat', handler, {
    sanitizer: quikchat.sanitizers.stripHTML
});
// Input: <b>Hello</b> <script>alert('xss')</script>
// Output: Hello
```

#### Custom Sanitizers

```javascript
// Use DOMPurify for advanced sanitization
const customChat = new quikchat('#chat', handler, {
    sanitizer: (content) => {
        // Your custom sanitization logic
        return DOMPurify.sanitize(content, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
            ALLOWED_ATTR: ['href']
        });
    }
});

// Change sanitizer at runtime
chat.setSanitizer(quikchat.sanitizers.escapeHTML);

// Check current sanitizer
const currentSanitizer = chat.getSanitizer();
```

#### When to Use Sanitization

**Always enable sanitization when:**
- Displaying user-generated content
- Receiving content from external APIs
- Building public-facing applications
- Handling untrusted input sources

**Sanitization may not be needed when:**
- All content is from trusted sources
- You need to preserve HTML formatting
- Working with internal tools only

#### Testing Sanitization

```javascript
// Test your sanitization configuration
const testPayloads = [
    '<script>alert("XSS")</script>',
    '<img src=x onerror="alert(\'XSS\')">',
    '<svg onload="alert(\'XSS\')">',
    'javascript:alert("XSS")',
    '<iframe src="javascript:alert(\'XSS\')"></iframe>'
];

testPayloads.forEach(payload => {
    chat.messageAddNew(payload, 'Test', 'left');
});

// Check if content is properly sanitized in DOM
const messages = document.querySelectorAll('.quikchat-message-content');
messages.forEach(msg => {
    if (msg.innerHTML.includes('<script>')) {
        console.error('Sanitization failed!');
    }
});
```

### Additional Security Considerations

1. **CSP Headers**: Implement Content Security Policy headers
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; script-src 'self' 'unsafe-inline';">
```

2. **Input Validation**: Validate message length and format
```javascript
chat.setCallbackonSend((instance, message) => {
    // Validate message length
    if (message.length > 10000) {
        alert('Message too long');
        return;
    }
    
    // Validate content
    if (containsProfanity(message)) {
        alert('Please keep the conversation respectful');
        return;
    }
    
    instance.messageAddNew(message, 'User', 'right');
});
```

3. **Rate Limiting**: Prevent spam and abuse
```javascript
class RateLimitedChat {
    constructor(container, maxMessagesPerMinute = 30) {
        this.messageTimestamps = [];
        this.maxMessagesPerMinute = maxMessagesPerMinute;
        
        this.chat = new quikchat(container, this.handleMessage.bind(this), {
            sanitizer: quikchat.sanitizers.escapeHTML
        });
    }
    
    handleMessage(instance, message) {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Remove old timestamps
        this.messageTimestamps = this.messageTimestamps.filter(
            ts => ts > oneMinuteAgo
        );
        
        // Check rate limit
        if (this.messageTimestamps.length >= this.maxMessagesPerMinute) {
            alert('Too many messages. Please slow down.');
            return;
        }
        
        this.messageTimestamps.push(now);
        instance.messageAddNew(message, 'User', 'right');
    }
}
```

---

*For complete API documentation, see [API Reference](API-REFERENCE.md). For questions and examples, visit our [GitHub repository](https://github.com/deftio/quikchat).*