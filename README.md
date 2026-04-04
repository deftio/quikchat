[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![NPM version](https://img.shields.io/npm/v/quikchat.svg?style=flat-square)](https://www.npmjs.com/package/quikchat)
![CI](https://github.com/deftio/quikchat/actions/workflows/ci.yml/badge.svg)

# QuikChat

A lightweight, zero-dependency vanilla JavaScript chat widget. Drop it into any page — no React, no Vue, no build step required — and connect it to any LLM, WebSocket, or message source with plain `fetch()`.

```html
<script src="https://unpkg.com/quikchat"></script>
<link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css" />
```

```javascript
const chat = new quikchat('#chat', async (chat, msg) => {
    chat.messageAddNew(msg, 'me', 'right', 'user');

    // Stream a response from any LLM
    const id = chat.messageAddTypingIndicator('bot');
    const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: 'llama3.1',
            messages: chat.historyGet(),   // full conversation context
            stream: true
        })
    });

    const reader = response.body.getReader();
    let first = true;
    while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const token = JSON.parse(new TextDecoder().decode(value).trim()).message.content;
        if (first) { chat.messageReplaceContent(id, token); first = false; }
        else       { chat.messageAppendContent(id, token); }
    }
});
```

That's a working streaming LLM chat in one file — no bundler, no framework, no SDK.

## Features

- **LLM-ready** — `historyGet()` returns `{ role, content }` objects compatible with OpenAI, Ollama, Mistral, and Claude APIs
- **Streaming built in** — `messageAddNew()` → `messageAppendContent()` for token-by-token display
- **Typing indicator** — animated "..." dots that auto-clear when streaming begins
- **Markdown support** — three tiers: base (no markdown), `-md` (basic markdown via [quikdown](https://github.com/deftio/quikdown)), `-md-full` (syntax highlighting, math, diagrams, maps — loaded on demand from CDN)
- **HTML sanitization** — built-in XSS protection or plug in your own sanitizer
- **Themeable** — 8 built-in CSS themes (light, dark, blue, warm, midnight, ocean, modern, debug) or write your own
- **Multi-user** — multiple users per chat, multiple independent chats per page
- **Message visibility & tagging** — hide system prompts and tool-call results from the UI while keeping them in history for LLM context
- **History export / import** — save and restore complete chat sessions (`historyExport()` / `historyImport()`)
- **RTL support** — `setDirection('rtl')` for Arabic, Hebrew, and other right-to-left languages
- **Event callbacks** — hooks for message add, append, replace, and delete events
- **Timestamps** — optional per-message timestamps (show/hide)
- **Zero runtime dependencies** — ~5 KB gzipped (base), ~9 KB with markdown, ~14 KB full
- **Any environment** — works with CDN, npm, or local files; UMD, ESM, and CJS builds included
- **Responsive** — fills its parent container and resizes automatically
- **Accessible** — ARIA roles and labels on all interactive elements

## Quick Start

### CDN

```html
<script src="https://unpkg.com/quikchat"></script>
<link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css" />
```

### npm

```bash
npm install quikchat
```

```javascript
import quikchat from 'quikchat';
```

### With Markdown

```html
<!-- Basic markdown (bold, italic, code, tables, lists) — ~9 KB gzip -->
<script src="https://unpkg.com/quikchat/dist/quikchat-md.umd.min.js"></script>

<!-- Full markdown (+ syntax highlighting, math, diagrams, maps) — ~23 KB gzip -->
<script src="https://unpkg.com/quikchat/dist/quikchat-md-full.umd.min.js"></script>

<link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css" />
```

The `-md-full` build uses [quikdown](https://github.com/deftio/quikdown)'s editor as a rendering engine. When your LLM returns a fenced code block with a language tag, highlight.js loads from CDN automatically. Same for math (MathJax), diagrams (Mermaid), and maps (Leaflet) — each loads on demand the first time it's encountered.

Same API across all three builds — just pick your script tag.

## Usage

```javascript
const chat = new quikchat(
    '#chat-container',           // CSS selector or DOM element
    (chat, msg) => {             // onSend callback
        chat.messageAddNew(msg, 'me', 'right');
    },
    {
        theme: 'quikchat-theme-light',
        titleArea: { title: 'My Chat', align: 'left', show: true },
    }
);

// Add messages programmatically
chat.messageAddNew('Hello!', 'Alice', 'left', 'user');
chat.messageAddNew('Hi there!', 'Bot', 'left', 'assistant');
chat.messageAddNew('System notice', 'system', 'center', 'system');

// Streaming pattern
const id = chat.messageAddTypingIndicator('bot');     // show "..." dots
chat.messageReplaceContent(id, firstToken);            // first token clears dots
chat.messageAppendContent(id, nextToken);              // append subsequent tokens

// Disable input while bot is responding
chat.inputAreaSetEnabled(false);
chat.inputAreaSetButtonText('Thinking...');
// ... after response completes ...
chat.inputAreaSetEnabled(true);
chat.inputAreaSetButtonText('Send');

// History is LLM-API compatible
const history = chat.historyGet();  // [{ role: "user", content: "..." }, ...]
```

## Message Formatter & Sanitization

Process message content before display — render markdown, sanitize HTML, or both:

```javascript
const chat = new quikchat('#chat', onSend, {
    // Sanitize user input (true = escape HTML entities, or pass a function)
    sanitize: true,

    // Format content (e.g., markdown → HTML)
    messageFormatter: (content) => myMarkdownParser(content),
});

// Change at runtime
chat.setMessageFormatter((content) => marked.parse(content));
chat.setSanitize((content) => DOMPurify.sanitize(content));
```

The pipeline is: **sanitize → format → display**. Sanitize cleans untrusted input; the formatter's output is trusted.

The `-md` and `-md-full` builds pre-wire [quikdown](https://github.com/deftio/quikdown) as the formatter — no configuration needed. The `-md-full` build additionally renders syntax-highlighted code, math equations, Mermaid diagrams, and maps via dynamic CDN loading.

## Theming

Themes are pure CSS — colors, borders, and shadows only. The base CSS handles all layout.

```javascript
// Built-in themes
chat.changeTheme('quikchat-theme-light');
chat.changeTheme('quikchat-theme-dark');
chat.changeTheme('quikchat-theme-modern');   // chat-bubble style

// Or write your own — just color overrides
```

```css
.my-theme {
    background-color: #f9f9f9;
    border: 1px solid #ccc;
    border-radius: 10px;
}
.my-theme .quikchat-title-area { color: #333; }
.my-theme .quikchat-messages-area { background-color: #fff; color: #333; }
.my-theme .quikchat-input-send-btn { background-color: #4caf50; color: white; border: none; border-radius: 4px; }
```

The **modern bubble theme** uses alignment classes (`quikchat-align-left`, `quikchat-align-right`) to position messages as chat bubbles with colored backgrounds — left-aligned messages appear as grey bubbles, right-aligned as blue.

Style messages by role with CSS hooks: `.quikchat-role-user`, `.quikchat-role-assistant`, `.quikchat-role-system`, `.quikchat-role-tool`.

## Documentation

| Guide | Description |
|---|---|
| [Getting Started](docs/getting-started.md) | Installation, minimal example, constructor options |
| [API Reference](docs/api-reference.md) | Every public method, property, and return value |
| [Streaming](docs/streaming.md) | Token-by-token LLM response display |
| [Multi-User Chat](docs/multi-user-chat.md) | Multiple users, dual instances, message routing |
| [LLM Integration](docs/llm-integration.md) | Ollama, OpenAI, LM Studio, tool calls, conversational memory |
| [Theming](docs/theming.md) | Custom themes, CSS architecture, built-in themes |
| [CSS Architecture](docs/css-architecture.md) | Base vs theme separation, ARIA accessibility |

## Demo & Examples

[Live Demo](https://deftio.github.io/quikchat/site/) | [Examples](https://deftio.github.io/quikchat/examples/)

Examples include: basic UMD/ESM usage, theme switching, dual chatrooms, markdown rendering ([basic](./examples/example_markdown.html) and [full with syntax highlighting + math + diagrams](./examples/example_md_full.html)), streaming with Ollama/OpenAI/LM Studio, and React integration.

## Build Variants

| Build | What you get | UMD (gzipped) | Network |
|---|---|---|---|
| **Base** | Chat widget, zero deps | `quikchat.umd.min.js` (~5 KB) | None |
| **Markdown** | + bold, italic, code, tables, lists | `quikchat-md.umd.min.js` (~9 KB) | None |
| **Full** | + syntax highlighting, math, diagrams, maps | `quikchat-md-full.umd.min.js` (~14 KB) | CDN on demand |
| **CSS** | All themes (light, dark, blue, warm, midnight, ocean, modern, debug) | `quikchat.css` (~2.4 KB) | None |

All builds are also available in ESM and CJS formats. Each has sourcemaps.

The `-md` builds bundle [quikdown](https://github.com/deftio/quikdown). The `-md-full` build uses quikdown's editor as a rendering engine with fence plugins that dynamically load highlight.js, MathJax, Mermaid, and Leaflet from CDN when needed. The base builds have zero runtime dependencies.

## Building from Source

```bash
npm install
npm run build    # lint, build all formats, report bundle sizes
npm test         # jest unit tests with coverage
```

Build-time tooling (rollup, babel, eslint, jest) is all in devDependencies — zero runtime dependencies.

## Testing

```bash
npm test                # unit tests (jest, 100% coverage)
npm run test:e2e        # browser tests (playwright)
```

## Development

```bash
npm run feature my-feature-name        # creates feature/my-feature-name, bumps patch
npm run feature my-feature-name minor  # bumps minor
```

A pre-commit hook runs lint and tests automatically before each commit.

See [RELEASE-PROCEDURE.md](RELEASE-PROCEDURE.md) for the full release workflow.

## License

BSD-2-Clause

## Home Page

[github.com/deftio/quikchat](https://github.com/deftio/quikchat)
