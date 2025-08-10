# Release Notes

## 1.1.15 (In Development)

### New Features

#### Smart Scroll Behavior
- **Fixed GitHub Issue #1**: Messages no longer force scroll to bottom when users are reading earlier messages
- Added `'smart'` scroll mode - only scrolls if user is near bottom of chat
- `scrollIntoView` parameter now accepts:
  - `true` - Always scroll to new message
  - `false` - Never scroll automatically  
  - `'smart'` - Only scroll if user is near bottom (new!)

#### Enhanced Callbacks for Message Modifications
- `setCallbackonMessageAppend()` - Fired when content is appended to a message (useful for streaming)
- `setCallbackonMessageReplace()` - Fired when message content is replaced
- `setCallbackonMessageDelete()` - Fired when a message is deleted

#### History API Improvements
- **`historyGetPage()`** - Paginated history retrieval with ascending/descending order support
- **`historySearch()`** - Search messages by text, user, role, or tags
- **`historyGetInfo()`** - Get metadata about history size, memory usage, and pagination
- Memory optimizations for better performance with 1000+ messages
- Efficient handling of large chat histories without loading everything at once

### Bug Fixes
- Fixed auto-scroll disrupting users reading earlier messages
- Removed unnecessary scroll triggers from append/replace operations

### Developer Experience
- Improved test coverage with 48 total tests
- Comprehensive documentation updates
- Better TypeScript compatibility preparation

### Breaking Changes
- None - all changes are backward compatible

## 1.1.14 

Add tagged visibility 
updated readme, api-docs, and quickstart


## 1.1.12 

* added temp message generator

## 1.1.7

* added get/restore full message history including timestamps
* updated messageAddFull to accept timestamp setting for history restore
* added /examples/historyDemo.html

## 1.1.6

* added show/hide input on construction
* added more test coverage (approx 87%)

## 1.1.5

* added  examples for nodejs and python backends including streaming

## 1.1.4

* added  travisci build support

## 1.1.3

* added onMessageNew callback
* minified css (/dist/quikchat.min.css)
* moved all border-radius to themes
* updated docs / index.html
* updated readme generator from npx to /node-modules (still using docbat)
* add ci via github actions
* added build passing badge based on github actions

## 1.1.2 

* updated styles and docs
* add jest test suite
* add npm and version badges in readme
* added fixes in github pages for demos

## 1.1.1 

* move callback from {meta} to 2nd param of constructor
* add loremIpsum Generator
* addedfix alternate light and dark to use css nth-child, added messagesAreaAlternateColors()

## 1.0.4

* make robust the add/remove/update message (harden id scheme for messages)
* example ChatGPT

* add center div styling (addMessage(content, user, center))
* CSS: add functions for light, dark, debug styles to be built-in

