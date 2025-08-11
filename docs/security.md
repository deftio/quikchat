# Security Guide

## Overview

QuikChat provides built-in XSS (Cross-Site Scripting) protection through optional content sanitization. By default, QuikChat does **not** sanitize content (backward compatible), allowing developers full control over content handling.

## Understanding XSS in Chat Widgets

### The Risk
When user input is displayed in a chat widget without sanitization, it can execute malicious scripts:

```javascript
// User types: <script>alert('XSS')</script>
chat.messageAddNew(userInput, 'User');  // ⚠️ Script will execute!
```

### When You Need Sanitization

You should enable sanitization when:
- Displaying user-generated content
- Showing messages from untrusted sources
- Building multi-user chat applications
- Accepting input from external APIs

### When Sanitization May Not Be Needed

Sanitization might not be necessary when:
- Only displaying programmer-controlled content
- Building internal tools with trusted users
- Intentionally displaying HTML/Markdown content
- Using your own sanitization layer

## Using Built-in Sanitizers

### Option 1: Enable at Construction

```javascript
const chat = new quikchat('#chat', onSend, {
    sanitizer: quikchat.sanitizers.escapeHTML
});
```

### Option 2: Set After Construction

```javascript
const chat = new quikchat('#chat');
chat.setSanitizer(quikchat.sanitizers.escapeHTML);
```

### Built-in Sanitizers

#### escapeHTML
Escapes HTML entities to prevent script execution:

```javascript
// Input: <script>alert('xss')</script>Hello
// Output: &lt;script&gt;alert('xss')&lt;/script&gt;Hello
```

#### stripHTML
Removes all HTML tags but preserves text content:

```javascript
// Input: <b>Bold</b> and <i>italic</i> text
// Output: Bold and italic text
```

## Custom Sanitizers

You can provide your own sanitization function:

```javascript
// Example: Using DOMPurify
const chat = new quikchat('#chat', onSend, {
    sanitizer: (content) => DOMPurify.sanitize(content)
});

// Example: Custom markdown sanitizer
const chat = new quikchat('#chat', onSend, {
    sanitizer: (content) => {
        // Allow only specific markdown elements
        return content
            .replace(/[<>]/g, '')  // Remove HTML brackets
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')  // Bold
            .replace(/\*(.*?)\*/g, '<i>$1</i>');     // Italic
    }
});
```

## Common Patterns

### Secure User Input Handling

```javascript
const chat = new quikchat('#chat', (instance, message) => {
    // User input is automatically sanitized when displayed
    instance.messageAddNew(message, 'User', 'right');
    
    // Send to backend (sanitize server-side too!)
    sendToServer(message);
}, {
    sanitizer: quikchat.sanitizers.escapeHTML
});
```

### Different Sanitization for Different Users

```javascript
const chat = new quikchat('#chat');

// Escape HTML for user messages
chat.setSanitizer(quikchat.sanitizers.escapeHTML);
chat.messageAddNew(userInput, 'User', 'right');

// Allow HTML for system messages (trusted source)
chat.setSanitizer(null);
chat.messageAddNew('<b>System:</b> User joined', 'System', 'center');

// Re-enable for next user message
chat.setSanitizer(quikchat.sanitizers.escapeHTML);
```

### Streaming with Sanitization

```javascript
const chat = new quikchat('#chat', null, {
    sanitizer: quikchat.sanitizers.escapeHTML
});

// Safe streaming - each append is sanitized
const msgId = chat.messageAddNew('', 'Assistant', 'left');
streamResponse.on('data', (chunk) => {
    chat.messageAppendContent(msgId, chunk);  // Sanitized automatically
});
```

## Performance Considerations

### Impact
- **escapeHTML**: ~2-5% overhead for typical use
- **stripHTML**: ~1-3% overhead
- **Custom sanitizers**: Varies (DOMPurify: ~10-20% overhead)

### Benchmarks
Based on 1000 messages:
- Without sanitizer: ~40ms
- With escapeHTML: ~42ms (5% overhead)
- Per message cost: ~0.002ms

### Optimization Tips

1. **Use built-in sanitizers** when possible (optimized for performance)
2. **Avoid heavy sanitizers** for streaming content
3. **Consider batching** for bulk message additions
4. **Enable virtual scrolling** for large message volumes

## Security Best Practices

### 1. Defense in Depth
Always sanitize on both client and server:

```javascript
// Client-side
const chat = new quikchat('#chat', null, {
    sanitizer: quikchat.sanitizers.escapeHTML
});

// Server-side (Node.js example)
app.post('/message', (req, res) => {
    const sanitized = escapeHtml(req.body.message);
    broadcast(sanitized);
});
```

### 2. Content Security Policy (CSP)
QuikChat is CSP-compatible. Add appropriate headers:

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self' 'unsafe-inline';">
```

### 3. Regular Updates
Keep QuikChat updated for the latest security improvements:

```bash
npm update quikchat
```

## Testing Your Implementation

### Manual Testing
Try these payloads to verify sanitization:

```javascript
// XSS attempts
'<script>alert("XSS")</script>'
'<img src=x onerror=alert("XSS")>'
'<svg onload=alert("XSS")>'
'javascript:alert("XSS")'

// HTML injection
'<marquee>Annoying</marquee>'
'<style>body{display:none}</style>'
```

### Automated Testing

```javascript
describe('Security', () => {
    test('should prevent XSS', () => {
        const chat = new quikchat('#chat', null, {
            sanitizer: quikchat.sanitizers.escapeHTML
        });
        
        chat.messageAddNew('<script>window.xss=true</script>', 'User');
        
        expect(window.xss).toBeUndefined();
        expect(document.querySelector('.quikchat-message-content').innerHTML)
            .toBe('&lt;script&gt;window.xss=true&lt;/script&gt;');
    });
});
```

## Migration Guide

### From Unsanitized to Sanitized

```javascript
// Before (no sanitization)
const chat = new quikchat('#chat', handleMessage);

// After (with sanitization)
const chat = new quikchat('#chat', handleMessage, {
    sanitizer: quikchat.sanitizers.escapeHTML
});

// Or update existing instance
existingChat.setSanitizer(quikchat.sanitizers.escapeHTML);
```

### Supporting Rich Content Safely

```javascript
// Option 1: Use markdown library with built-in sanitization
const chat = new quikchat('#chat', null, {
    sanitizer: (content) => {
        const html = markdownLibrary.render(content);
        return DOMPurify.sanitize(html);
    }
});

// Option 2: Whitelist specific HTML tags
const chat = new quikchat('#chat', null, {
    sanitizer: (content) => {
        return DOMPurify.sanitize(content, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'code'],
            ALLOWED_ATTR: ['href']
        });
    }
});
```

## FAQ

### Q: Does sanitization affect performance?
A: Built-in sanitizers add minimal overhead (2-5%). Heavy sanitizers like DOMPurify may add 10-20% overhead.

### Q: Can I display HTML/Markdown with sanitization enabled?
A: Yes, use a custom sanitizer that allows safe HTML tags or use a markdown parser with sanitization.

### Q: Is sanitization enabled by default?
A: No, to maintain backward compatibility. You must explicitly enable it.

### Q: Does sanitization protect against all attacks?
A: It protects against XSS via message content. Always implement server-side validation and sanitization too.

### Q: Can I use different sanitizers for different message types?
A: Yes, use `setSanitizer()` to change the sanitizer dynamically.

## Support

For security issues, please email security@quikchat.com rather than using public issue trackers.

For questions and discussions, visit our [GitHub Discussions](https://github.com/deftio/quikchat/discussions).