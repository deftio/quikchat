# Release Notes

## 1.1.17 

### Content Sanitization for Security
- **XSS Protection**: Built-in content sanitization to prevent cross-site scripting attacks
- **Opt-in by default**: Maintains backward compatibility (sanitization disabled by default)
- **Built-in sanitizers**: 
  - `escapeHTML` - Escapes HTML tags to display them as text
  - `stripHTML` - Removes all HTML tags from content
- **Custom sanitizer support**: Use your own sanitization library (e.g., DOMPurify)
- **Runtime configuration**: Change sanitizers dynamically via `setSanitizer()`

### Accessibility (ARIA) Support
- Full ARIA label implementation for screen reader compatibility
- `role="log"` and `aria-live="polite"` for message area
- Proper labeling for all interactive elements (input, send button)
- Configurable ARIA labels via constructor options

### Mobile Experience Enhancements
- Automatic viewport meta tag management to prevent zoom on input focus
- Virtual keyboard detection and layout adjustment
- Dynamic padding adjustment when virtual keyboard appears/disappears
- Smooth transitions for keyboard show/hide events

### Internationalization (i18n) Support
- Built-in translation system with zero dependencies
- Support for multiple languages via `setLanguage()` method
- RTL/LTR text direction support with `setDirection()` method
- Translatable UI elements: send button, input placeholder, title
- Default English translations with easy extension for other languages

### Bug Fixes
- **Fixed input field clearing issue**: Input field was being cleared before callback could read the value
- **Fixed scrolling behavior in RTL demos**: Messages now use smart scrolling to prevent jumping
- **Fixed test file callbacks**: All test HTML files now properly handle user input for manual testing

### Developer Experience
- **Enhanced API documentation**: Added comprehensive docs for sanitization and i18n features
- **Improved test files**: All test files now support manual message input for debugging
- **Added favicons**: All example and test HTML files now have consistent favicon branding
- **Smart scrolling in demos**: Reduced UI jumping in multilingual demonstrations

### Test Coverage
- Added 21 new tests covering all new features
- Maintained 80%+ overall test coverage
- Comprehensive testing for ARIA, mobile, i18n, and sanitization functionality
- Added Playwright E2E tests for virtual scrolling + sanitizer integration

## 1.1.16 (2025-08-10)

### Major Performance Enhancement: Virtual Scrolling

#### Virtual Scrolling Implementation
- **Zero-dependency virtual scrolling** built directly into QuikChat core
- Automatically renders only visible messages in viewport plus buffer zone
- Dynamic height measurement and caching for variable-length messages (critical for LLM responses)
- Seamless activation based on configurable message count threshold

#### Performance Improvements
- **10,000 messages**: Renders in 38ms (vs 146,043ms without virtual scrolling)
- **1,000 messages**: Renders in 12ms
- **DOM efficiency**: Maintains ~36 DOM nodes regardless of total message count
- **Memory usage**: ~2MB for 10,000 messages (vs ~187MB without)

#### Configuration
- Enabled by default (`virtualScrolling: true`)
- Configurable threshold (default: 500 messages)
- Status checking via `isVirtualScrollingEnabled()` and `getVirtualScrollingConfig()`

### New Testing Infrastructure
- Added comprehensive performance test page (`test/test-long-messages.html`)
- Real-time performance metrics display
- Batch message addition support (100, 1000 messages)
- Visual performance indicators with color coding

### Bug Fixes
- Fixed virtual scrolling height calculation for variable-length messages
- Resolved CORS issues in test files

### Documentation
- Created comprehensive virtual scrolling documentation (`docs/virtual_scrolling.md`)
- Updated all documentation to use factual performance metrics
- Removed marketing language in favor of technical specifications

## 1.1.15 (2025-08-10)

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
- Improved test coverage with 57 total tests  
- **Added comprehensive JSDoc documentation** to all public methods
- **TypeScript definitions** (`dist/quikchat.d.ts`) for full TypeScript support
- **API documentation generation** via `npm run docs:api`
- IDE intellisense support through JSDoc comments
- Better error messages and debugging information

### Documentation Infrastructure
- **Replaced outdated `docbat` with modern `marked` markdown parser**
- **Reorganized documentation structure**:
  - All documentation moved to `docs/` folder
  - Only README.md and LICENSE.txt remain in root
  - Claude configuration consolidated in `.claude/memory.md`
- **New documentation build system**:
  - Automatic HTML generation from markdown files
  - Proper Unicode/emoji support (no more character encoding issues)
  - GitHub-style markdown CSS for clean, familiar styling
  - Syntax highlighting with Prism.js
  - Created `docs/index.html` as documentation hub
- **Integrated into build pipeline**: `npm run build` automatically regenerates all docs

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

