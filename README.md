[![License](https://img.shields.io/badge/License-BSD%202--Clause-blue.svg)](https://opensource.org/licenses/BSD-2-Clause)
[![NPM version](https://img.shields.io/npm/v/quikchat.svg?style=flat-square)](https://www.npmjs.com/package/quikchat)
![CI](https://github.com/deftio/quikchat/actions/workflows/ci.yml/badge.svg)

# QuikChat (js)

Quikchat is a vanilla (no dependancies) JavaScript chat control that can be easily integrated into web applications. It provides a customizable chat interface with support for hiding and showing a title area and the input area.

## Features

* Themeable with CSS (examples for light and dark)
* Responsive design for various screen sizes and resizes with parent container
* Hideable/Showable Title and Text Entry areas allows flexibility of usage
* Full message history storage and retrieval (save and resume full chats)
* History can be fed directly to OpenAI / Mistral / Ollama compatible APIs for context aware chats
* Available via NPM, CDN or source via github
* Provided in UMD and ESM formats (+ minified)
* Multiple separate instances can run on a single page
* Multiple users can be in a chat
* Messages can be searched, appended to (streamed token completion), replaced, or removed.
* Left / Right / Center support of individual users
* Callback for all message events (to monitor chat)
* Example backends for Python FastApi and Nodejs (see examples for working full projects)

## Demo & Examples

[Simple Demo](https://deftio.github.io/quikchat/examples/example_umd.html)

[List of Examples on Github](https://deftio.github.io/quikchat/examples/index.html)


Full Examples are in the repo examples folder (relative link): 
[Example Code and Demo](./examples/index.html).

Examples include using ESM, UMD modules, theming, running multiple chats on the same page, and integration with LLM providers such as Ollama, LMStudio, OpenAI compatible providers.

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
chat = new quikchat(
      "#chat-container",//a css selector such as "#chat-container" or DOM element
      (chat, msg) => { // this callback triggered when user hits the Send
            // messages are not automatically echoed.
            // this allows filtering of the message before posting.
            chat.messageAddNew(msg, 'me', 'right'); // echo msg to chat area 
            // now call an LLM or do other actions with msg
            // ... callLLM(msg) ... do other logic if needed.
            // or callLLM(chat.historyGet());  // pass full history (can also filter)
      },
      {
        theme: 'quikchat-theme-light', // set theme, see quikchat.css
        titleArea: { title: 'My Chat', align: 'left', show: true }, // internal title area if desired
      });

// Add a message at any point not just from callback
chat.messageAddNew('Hello!', 'You', 'left');    //  should appear left justified
chat.messageAddNew('Hello!', 'Them', 'right');  //  should appear  right justified


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

QuikChat allows theming using CSS of all the messages, and user area, and overal widget.

Below is the prebuilt 'light' theme.  To change the theme, make a new set of classes with different values but the same css selector naming (e.g. change "quikchat-theme-light" to "my-theme") and save as a style.  Then pass the "my-theme" to the constructor or to the changeTheme() function.

Themes can be changed at anytime by calling
myChatWidget.changeTheme(newTheme) where myChatWidget is the instance of your widget. 

If several widgets are on the same page, each can have a separate theme.

```css
/* quikchat theme light */
.quikchat-theme-light {
  border: 1px solid #cccccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}
  
.quikchat-theme-light .quikchat-title-area {
  padding: 8px;
  color: #333;
}
  
.quikchat-theme-light .quikchat-messages-area {
  background-color: #ffffffe2;
  color: #333;
}
 
/* support for alternating row styles */
.quikchat-theme-light .quikchat-messages-area-alt .quikchat-message:nth-child(odd) {
    background-color: #fffffff0;
    color: #005662;
}
.quikchat-theme-light .quikchat-messages-area-alt .quikchat-message:nth-child(even) {
    background-color: #eeeeeee9;
    color: #353535;
}

/* input area / text entry / send button */
.quikchat-theme-light .quikchat-input-area {
  background-color: #f9f9f9;
  border-bottom-left-radius : 10px;
  border-bottom-right-radius : 10px;
}

.quikchat-theme-light .quikchat-input-textbox {
  background-color: #ffffff;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}
  
.quikchat-theme-light .quikchat-input-send-btn {
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
}
```

## Building from Source

quikchat is built with [rollup.js](https://rollupjs.org/).

Make sure to run npm install.  Then run npm run build.

Note that at run time quikchat has no dependancies, but at build time several tools are used for packing and minifying code.

## Testing

quikchat is tested with the jest framwork.  To run unit tests and see coverage run:

```bash
npm run test
```

## License

quikchat is licensed under the BSD-2 License.

## Home Page

[quikchat homepage and source code](https://githhub.com/deftio/quikchat)

   
   

 

