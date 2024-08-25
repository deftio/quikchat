# QuikChat JS TODO list

* show/hide timestamps
* add support for right to left languages by making css with [send] on left
* add support for inline "user" icon with chat message instead of on top => [user][message]
* example Anthropic
* example Mistral
* example React Component
* test suite coverage to 90%
* clean up scroll to bottom behavior (in progress)
* add stats api (num messages, users, total chars written etc)
* add user mgmt  ? make wrapper class
* add callbacks : onMessageAppend, onMessageReplace

==========
1.1.5

* added  examples for nodejs and python backends including streaming

1.1.4

* added  travisci build support

1.1.3

* added onMessageNew callback
* minified css (/dist/quikchat.min.css)
* moved all border-radius to themes
* updated docs / index.html
* updated readme generator from npx to /node-modules (still using docbat)
* add ci via github actions
* added build passing badge based on github actions


1.1.2 

* updated styles and docs
* add jest test suite
* add npm and version badges in readme
* added fixes in github pages for demos

1.1.1 

* move callback from {meta} to 2nd param of constructor
* add loremIpsum Generator
* addedfix alternate light and dark to use css nth-child, added messagesAreaAlternateColors()

1.0.4

* make robust the add/remove/update message (harden id scheme for messages)
* example ChatGPT

* add center div styling (addMessage(content, user, center))
* CSS: add functions for light, dark, debug styles to be built-in

## some icons

robot icon

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="18" y="20" width="28" height="28" rx="6" ry="6" stroke="#000" stroke-width="3" fill="none"/>
  <circle cx="26" cy="30" r="3" fill="#000"/>
  <circle cx="38" cy="30" r="3" fill="#000"/>
  <rect x="30" y="14" width="4" height="6" fill="#000"/>
  <path d="M26 38 Q32 44 38 38" stroke="#000" stroke-width="2" fill="none"/>
  <rect x="14" y="24" width="4" height="10" rx="2" ry="2" stroke="#000" stroke-width="3" fill="none"/>
  <rect x="46" y="24" width="4" height="10" rx="2" ry="2" stroke="#000" stroke-width="3" fill="none"/>
</svg>
```

person icon

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="24" r="12" stroke="#000" stroke-width="3" fill="none"/>
  <path d="M16 50 Q32 38 48 50" stroke="#000" stroke-width="3" fill="none"/>
  <circle cx="28" cy="22" r="2" fill="#000"/>
  <circle cx="36" cy="22" r="2" fill="#000"/>
  <path d="M30 28 Q32 30 34 28" stroke="#000" stroke-width="2" fill="none"/>
</svg>

```
