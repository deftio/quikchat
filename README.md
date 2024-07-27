# quikchat.js
quikchat is a simple vanilla (no dependancies) JavaScript chat control that can be easily integrated into web applications. It provides a customizable chat interface with support for hiding and showing a title area and the input area.

## Features
* Callback function for message events.
* Responsive design for various screen sizes.
* Themeable with css
* Hideable/Showable Title and Text Entry areas allows flexibility of usage
* Full history storage and retrieval
* History can be fed directly to OpenAI / Mistral / Ollama compatible API

## Demo
[Example Code and Demo](../examples/index.html)



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

Create a container element in your HTML where you want the chat interface to appear:
```html
<div id="chat-container"></div>
```

Initialize quikchat in your JavaScript code by providing the container element and a callback function for message events:
```javascript
const chat = new quikchat('#chat-container', messageCallback);
//Use the provided methods to interact with the chat control:

// Add a message
chat.addMessage('Hello!', 'User', 'left');  // user should appear left or right justified

```
## Theming
QuikChat also allows theming using CSS of all the messages, and user area, and overal widget.

Below is the prebuilt 'light' theme.  To change the theme, make a new set of classes with different values but the same css selector naming (e.g. change "quikchat-theme-light" to "my-theme") and save as a style.  Then pass the "my-theme" to the constructor.

Themes can be changed at anytime by calling
myChatWidget.changeTheme(newTheme) where myChatWidget is the instance of your widget. 

If several widgets are on the same page, each can have a separate theme.

```css

.quikchat-theme-light {
    border: 1px solid #cccccc;
    border-radius: 10px;
    padding: 5px;
    background-color: #f9f9f9;
  }

.quikchat-theme-light .quikchat-title-area {
color: #333;
}

.quikchat-theme-light .quikchat-messages-area {
background-color: #ffffffe2;
color: #333;
}

.quikchat-theme-light .quikchat-message-1 {
background-color: #fffffff0;
color: #005662;
}

.quikchat-theme-light .quikchat-message-2 {
background-color: #eeeeeee9;
color: #353535;
}

.quikchat-theme-light .quikchat-input-area {
background-color: #f0f0f0;
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
Make sure to run npm install.  Then run npm run build.
Note that at run time quikchat has no dependancies, but at build time several tools are used for packing and minifying code.

## Contributors

## License
quikchat is licensed under the BSD-2 License.

