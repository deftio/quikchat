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
- **Markdown support** — optional `-md` build bundles [quikdown](https://github.com/deftio/quikdown) for markdown rendering, or bring your own formatter via the `messageFormatter` hook
- **HTML sanitization** — built-in XSS protection or plug in your own sanitizer
- **Themeable** — pure CSS themes (light, dark, modern bubbles, or write your own)
- **Multi-user** — multiple users per chat, multiple independent chats per page
- **Zero runtime dependencies** — ~3 KB gzipped (base), ~7 KB with markdown
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

### With Markdown (quikdown bundled)

```html
<!-- UMD build with markdown support -->
<script src="https://unpkg.com/quikchat/dist/quikchat-md.umd.min.js"></script>
<link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css" />
```

Or with npm:

```javascript
import quikchat from 'quikchat/dist/quikchat-md.esm.min.js';
// quikchat.quikdown is available for direct use
```

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

The `-md` build pre-wires [quikdown](https://github.com/deftio/quikdown) as the formatter — no configuration needed.

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

## Demo & Examples

[Live Demo](https://deftio.github.io/quikchat/examples/example_umd.html)

Full examples in the [examples/](./examples/index.html) folder: ESM/UMD usage, theming, multiple chats on the same page, streaming with Ollama/OpenAI/LM Studio.

## Build Variants

| Build | Format | File | Gzipped |
|---|---|---|---|
| Base | UMD | `quikchat.umd.min.js` | ~3.3 KB |
| Base | ESM | `quikchat.esm.min.js` | ~3.3 KB |
| Base | CJS | `quikchat.cjs.min.js` | ~3.3 KB |
| With Markdown | UMD | `quikchat-md.umd.min.js` | ~7 KB |
| With Markdown | ESM | `quikchat-md.esm.min.js` | ~7 KB |
| With Markdown | CJS | `quikchat-md.cjs.min.js` | ~7 KB |
| CSS | — | `quikchat.css` | ~1.7 KB |

The `-md` builds bundle [quikdown](https://github.com/deftio/quikdown) for markdown rendering. The base builds have zero runtime dependencies.

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
