# QuikChat Plugin System and Markdown Support

## Overview
This document outlines the design for adding markdown support to QuikChat while maintaining zero dependencies.

## Minimal Markdown Parser Specification

### Phase 1: Core Formatting (MVP)
Essential markdown features for chat applications:

#### Inline Formatting
- **Bold**: `**text**` or `__text__` → `<strong>text</strong>`
- **Italic**: `*text*` or `_text_` → `<em>text</em>` 
- **Strikethrough**: `~~text~~` → `<del>text</del>`
- **Inline code**: `` `code` `` → `<code>code</code>`
- **Links**: `[text](url)` → `<a href="url">text</a>`

#### Block Elements
- **Code blocks**: 
  ```
  ```language
  code here
  ```
  ```
  → `<pre><code class="language-{lang}">code here</code></pre>`

- **Blockquotes**: `> quote` → `<blockquote>quote</blockquote>`

- **Line breaks**: Two spaces at end of line → `<br>`

#### Lists
- **Unordered lists**: 
  ```
  - item 1
  - item 2
    - nested item
  ```
  → `<ul><li>item 1</li><li>item 2<ul><li>nested item</li></ul></li></ul>`

- **Ordered lists**:
  ```
  1. item 1
  2. item 2
  ```
  → `<ol><li>item 1</li><li>item 2</li></ol>`

#### Headings (Optional for chat)
- `# H1` → `<h1>H1</h1>`
- `## H2` → `<h2>H2</h2>` 
- `### H3` → `<h3>H3</h3>`
- (Probably only need H3-H6 for chat context)

### Phase 2: Extended Features (Future)
- Tables (complex, maybe skip)
- Images `![alt](url)` 
- Horizontal rules `---`
- Task lists `- [ ] todo`
- Footnotes

## Implementation Approach

### 1. Parser Architecture
```javascript
class MinimalMarkdownParser {
  constructor(options = {}) {
    this.options = {
      enableHeadings: false,  // Headings might be too much for chat
      enableLists: true,
      enableCodeBlocks: true,
      sanitize: true,  // Always sanitize for XSS protection
      ...options
    };
  }

  parse(text) {
    // Order matters! Process blocks first, then inline
    let html = text;
    
    // 1. Escape HTML first (XSS protection)
    html = this.escapeHtml(html);
    
    // 2. Process code blocks (before other formatting)
    html = this.processCodeBlocks(html);
    
    // 3. Process block elements
    html = this.processBlockquotes(html);
    html = this.processLists(html);
    
    // 4. Process inline formatting
    html = this.processBold(html);
    html = this.processItalic(html);
    html = this.processStrikethrough(html);
    html = this.processInlineCode(html);
    html = this.processLinks(html);
    
    // 5. Process line breaks
    html = this.processLineBreaks(html);
    
    return html;
  }
}
```

### 2. Integration with QuikChat

#### Option A: Always-on with opt-out
```javascript
// In QuikChat constructor options
{
  markdown: true,  // Default true
  markdownOptions: {
    enableHeadings: false,
    enableLists: true,
    // ...
  }
}
```

#### Option B: Opt-in 
```javascript
{
  markdown: false,  // Default false for backward compatibility
  markdownOptions: { /* ... */ }
}
```

### 3. API Design
```javascript
// When adding a message
quikchat.messageAddNew(
  "This is **bold** and `code`",
  "user",
  "left",
  "user",
  true,
  true,
  [],
  { markdown: true }  // Per-message override
);

// Global toggle
quikchat.setMarkdownEnabled(true);
quikchat.getMarkdownEnabled(); // returns boolean

// Update existing message with markdown
quikchat.messageReplaceContent(msgId, "**Updated** content", { markdown: true });
```

### 4. Security Considerations
- **Always escape HTML first** before processing markdown
- Whitelist allowed HTML tags after markdown processing
- Sanitize URLs in links (no javascript: protocol)
- Consider using Content Security Policy
- Add option for custom sanitizer function

### 5. Performance Considerations
- Parse markdown only once when message is added
- Cache parsed results
- Use efficient regex patterns
- Consider lazy parsing for off-screen messages with virtual scrolling

### 6. Testing Strategy
- Unit tests for each markdown feature
- XSS injection tests
- Performance tests with large markdown content
- Edge cases (nested formatting, malformed markdown)
- Integration tests with virtual scrolling

## Size Impact
Estimated size for minimal markdown parser:
- ~3-4KB minified
- ~1.5KB gzipped
- No external dependencies

## Migration Path
1. **v1.1.17**: Add markdown parser, disabled by default
2. **v1.1.18**: Enable by default with opt-out
3. **Future**: Plugin system for custom parsers

## Alternative: Plugin System
If we want to allow users to bring their own markdown parser:

```javascript
// Register a custom markdown processor
quikchat.registerProcessor('markdown', {
  process: (content) => {
    // User's markdown library of choice
    return marked.parse(content);
  }
});

// Or use built-in
quikchat.registerProcessor('markdown', 'builtin');
```

## Decision Points
1. Should markdown be enabled by default? (Backward compatibility vs modern expectations)
2. Which features are essential for MVP? (Balance size vs functionality)
3. Should we support per-message markdown toggle?
4. Do we need heading support in a chat context?
5. How to handle markdown in message history export/import?

## Next Steps
1. Implement minimal parser with core features
2. Add comprehensive XSS tests
3. Create examples showing markdown usage
4. Document markdown syntax in user guide
5. Consider future plugin system for v2.0

---
*Created: 2025-08-11*