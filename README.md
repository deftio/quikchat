# quikchat.js
quikchat is a simple vanilla (no dependancies) JavaScript chat control that can be easily integrated into web applications. It provides a customizable chat interface with support for hiding and showing a title area and the input area.

## Features
* Callback function for message events.
* Responsive design for various screen sizes.
* Themeable

## Demo
[Example Code and Demo](https://deftio.github.io/quikchat/example.html)


## Installation
To use quikchat in your project, follow these steps:

Include the quikchat.js JavaScript file in your project.
Link the quikchat.css stylesheet to style the chat interface.
html

```html
<script src="./path/to/quikchat.umd.min.js"></script>
<link rel="stylesheet" href="quikchat.css">
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


## Building from Source
Make sure to run npm install.  Then run npm run build.
Note that at run time quikchat has no dependancies, but at build time several tools are used for packing and minifying code.

## Contributors

## License
quikchat is licensed under the BSD-2 License.

