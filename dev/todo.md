# QuikChat JS TODO list

* restore virtual scrolling (SimpleVirtualScroller) — lost in a bad merge around v1.1.16. Old implementation exists in commit 2809f83. The example (`examples/example_virtual_scroll.html`), docs (`docs/virtual-scrolling.md`), and CLAUDE.md all reference it but the code is missing from `src/quikchat.js`. Key features: threshold-based activation (500 msgs default), dynamic height measurement, RAF-throttled scroll, spacer elements for correct scroll height, sanitizer/markdown plugin threading.
* add support for inline "user" icon with chat message instead of on top
* add user mgmt

==========

* (done 1.2.7) example LLM tool editor (example_tool_editor.html)
* (done 1.2.x) show/hide timestamps
* (done 1.2.x) add support for right to left languages (setDirection('rtl'))
* (done 1.2.x) example React Component (quikchat-react.html, frameworks.html)
* (done 1.2.x) test suite coverage to 97% (threshold enforced in jest config, currently 100% stmts)
* (done 1.2.x) improve docs site (full site with getting started, API ref, theming, etc.)
* (done 1.2.x) clean up scroll to bottom behavior (scroll-to-bottom button)
* (done 1.2.x) add stats api (historyStats)
* (done 1.2.x) add callbacks: onMessageAppend, onMessageReplace (setCallbackonMessageAppended, etc.)
* (done 1.2.x) CSS cleanup: separate structural from theme properties
* (done 1.2.x) example Anthropic / Mistral (openai.html supports any OpenAI-compatible API)

==========

* (done 1.1.3) minified css (/dist/quikchat.min.css)
* (done 1.1.3) moved all border-radius to themes
* (done 1.1.3) updated docs / index.html
* (done 1.1.3) updated readme generator from npx to /node-modules (still using docbat)
* (done 1.1.3) add ci via github actions

* (done 1.1.2) updated styles and docs
* (done 1.1.2) add jest test suite
* (done 1.1.2) add npm and version badges in readme
* (done 1.1.2) added fixes in github pages for demos

* (done 1.1.1) move callback from {meta} to 2nd param of constructor
* (done 1.1.1) add loremIpsum Generator
* (done 1.1.1) addedfix alternate light and dark to use css nth-child, added messagesAreaAlternateColors()

* (done 1.0.4) make robust the add/remove/update message (harden id scheme for messages)
* (done 1.0.4) example ChatGPT

* (done 1.0.3) add center div styling (addMessage(content, user, center))
* (done 1.0.2) CSS: add functions for light, dark, debug styles to be built-in




