[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![NPM version](https://img.shields.io/npm/v/quikchat.svg?style=flat-square)](https://www.npmjs.com/package/quikchat)
![CI](https://github.com/deftio/quikchat/actions/workflows/ci.yml/badge.svg)

# QuikChat (js)

Quikchat is a vanilla (no dependancies) JavaScript chat control that can be easily integrated into web applications. It provides a customizable chat interface with support for hiding and showing a title area and the input area.

## Features

* Themeable with CSS (examples for light and dark)
* Responsive design for various screen sizes and resizes with parent container
* Hideable/Showable Title and Text Entry areas allows flexibility of usage
* Full message history storage and retrieval
* History can be fed directly to OpenAI / Mistral / Ollama compatible APIs for context aware chats
* Available via NPM, CDN or source via github
* Provided in UMD and ESM formats (minified)
* Multiple separate instances can run on a single page
* Multiple users can be in a chat
* Messages can be searched, appended to (streamed token completion), replaced, or removed.
* Left / Right / Center support of individual users
* Callback for all message events (to monitor chat)

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
[Simple Demo](https://deftio.github.io/quikchat/examples/example_umd.html)

Full examples are in the [examples/](./examples/index.html) folder, including ESM/UMD usage, theming, running multiple chats on the same page, and integration with LLM providers (Ollama, LM Studio, OpenAI).

## Installation

To use quikchat in your project, follow these steps:

Include the quikchat.js JavaScript file in your project.
Link the quikchat.css stylesheet to style the chat interface.
html

```html
<script src="./path/to/quikchat.umd.min.js"></script>
<link rel="stylesheet" href="./path/to/quikchat.css">
```

### use quikchat Via CDN

```html
<script src="https://unpkg.com/quikchat"></script>
<link rel="stylesheet" href="https://unpkg.com/quikchat/dist/quikchat.css" />
```

Create a container element in your HTML where you want the chat interface to appear.  The quikchat widget will take 100% of the paretn container height and width.  If the parent container width or height is not specified the quikchat widget may grow as content is added.  If the parent container is resized, quikchat will resize with the parent container.

```html
<style>
#chat-container {width: 100%; height: 50vh;}  /* use any width / height as appropriate for your app */
</style>
<div id="chat-container"></div>
```

Initialize quikchat in your JavaScript code by providing the container element and a callback function for message events:

See /examples for full working code.

```javascript
const chat = new quikchat(
      "#chat-container",   // CSS selector or DOM element
      (chat, msg) => {     // callback triggered when user clicks Send or Shift+Enter
            // messages are not automatically echoed — you decide what to do
            chat.messageAddNew(msg, 'me', 'right'); // echo msg to chat area

            // now call an LLM or do other actions with msg
            // callLLM(msg);
            // callLLM(chat.historyGet());  // pass full history for conversational memory
      },
      {
        theme: 'quikchat-theme-light',
        titleArea: { title: 'My Chat', align: 'left', show: true },
      });

// Add a message at any point not just from callback
chat.messageAddNew('Hello!', 'You', 'left');  // user should appear left or right justified
chat.messageAddNew('Hello!', 'Them', 'right');  // user should appear left or right justified


//... other logic
let messageHistory = chat.historyGet(); // get all the messages (see docs for filters)
console.log(messageHistory); // do something with messages

// show / hide the title area
chat.titleAreaHide();  // hides the title area for a bare chat

// hide the input area
chat.inputAreaHide(); // hides the input area so chat is now just a message stream.

// change themes at any time
chat.changeTheme("quikchat-theme-dark"); // change theme on the fly (see quikchat.css for examples)
```

## Theming

QuikChat themes are pure appearance — colors, borders, border-radius, and shadows. The base CSS handles all layout and sizing. To create a custom theme, copy the light theme and change the colors. See [Theming Guide](docs/theming.md) for full details.

Themes can be changed at any time: `chat.changeTheme('my-theme')`. Multiple widgets on the same page can each have a different theme.

```css
/* Example: custom theme (appearance only — no padding, font-size, etc.) */
.my-theme {
  border: 1px solid #cccccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.my-theme .quikchat-title-area {
  color: #333;
}

.my-theme .quikchat-messages-area {
  background-color: #ffffffe2;
  color: #333;
}

.my-theme .quikchat-input-area {
  background-color: #f9f9f9;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.my-theme .quikchat-input-textbox {
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: #333;
}

.my-theme .quikchat-input-send-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
}
```

## Building from Source

quikchat is built with [rollup.js](https://rollupjs.org/).

```bash
npm install
npm run build    # lint, build all formats, report bundle sizes
```

Note that at run time quikchat has zero dependencies.  Build-time tooling (rollup, babel, eslint, jest, etc.) is all in devDependencies.

## Testing

quikchat is tested with the jest framework.  To run unit tests and see coverage run:

```bash
npm test
```

## Development

To start a new feature branch with an automatic patch version bump:

```bash
npm run feature my-feature-name        # creates feature/my-feature-name, bumps 0.0.1
npm run feature my-feature-name minor  # bumps 0.x.0
```

A pre-commit hook runs lint and tests automatically before each commit.

See [RELEASE-PROCEDURE.md](RELEASE-PROCEDURE.md) for the full release workflow.

## License

quikchat is licensed under the BSD-2 License.

## Home Page

[quikchat homepage and source code](https://github.com/deftio/quikchat)

 

