# Plan for Message Visibility in QuikChat

## Executive Summary

QuikChat's message visibility system provides fine-grained control over which messages are displayed to users, essential for LLM applications requiring system prompt management, content moderation, and contextual message filtering.

## Document Status

This document outlines two phases for the message visibility feature:

*   **Part 1: Individual Message Visibility:** This feature is **complete and released in v1.1.13**. It provides the foundation for showing and hiding single messages by their ID.
*   **Part 2: Tagged Visibility:** This is a **planned enhancement targeting v1.1.14**. It introduces a scalable, class-based system for managing groups of messages efficiently. Implementation is ready to begin.

---

## Part 1: Individual Message Visibility (Completed in v1.1.13)

This section documents the individual message visibility feature that has been fully implemented and released.

### 1. Core Requirements

The individual visibility feature consists of three main components:

1.  **Initial Visibility Control**: Ability to specify whether a message should be visible when first added to the chat.
2.  **Dynamic Visibility Control**: Functions to change the visibility of a message after it has been added.
3.  **Visibility Status Check**: Function to check whether a specific message is currently visible.

### 2. Implementation Details

The core strategy **always** creates and appends a DOM element for every message. Visibility is controlled by toggling the `display` CSS property of the message's container element.

#### 2.1. Initial Visibility: The `visible` Property

The `visible` property was added to the `input` object of the `messageAddFull` function to control message display at creation time.

-   **`visible` (boolean)**:
    -   If `true` or absent (for backward compatibility), the message is visible.
    -   If `false`, the message's DOM element is created and added to the DOM, but with `style.display` set to `none`.
-   **Backward Compatibility**: The default value of `visible` is `true`.
-   **History Export**: The `visible` property is explicitly stored in the history.

#### 2.2. Dynamic Visibility Control: `messageSetVisibility(msgid, isVisible)`

The `messageSetVisibility` function allows for showing and hiding messages programmatically after creation.

-   **Functionality**: Finds the message by ID and sets `messageDiv.style.display` to `''` or `'none'`, then updates the alternating message styles.

#### 2.3. Visibility Status Check: `messageGetVisibility(msgid)`

The `messageGetVisibility` function checks the current visibility of a message by inspecting its `style.display` property.

### 3. Use Cases

**Primary Use Cases:**
- **LLM System Prompts**: Hide system prompts from user view while maintaining them in chat history
- **Content Moderation**: Hide inappropriate messages without deleting them for audit trails
- **Progressive Disclosure**: Reveal messages based on user interactions or permissions
- **Debug Mode**: Toggle visibility of debug/diagnostic messages

### 4. Test Coverage

Comprehensive Jest tests cover:
- Backward compatibility with existing `messageAddFull` calls
- Explicit visibility settings (`visible: true/false`)
- Dynamic visibility toggling via `messageSetVisibility`
- Alternating color updates when visibility changes
- History export including visibility state

### 5. Documentation and Examples

-   `README.md` updated with `visible` property and function documentation
-   `examples/hidden_message.html` provides interactive demonstration
-   API documentation includes usage patterns and best practices

### 6. Technical Assessment

-   **Performance**: DOM-based approach with minimal performance overhead for typical use cases
-   **API Design**: Clean, intuitive API maintaining backward compatibility
-   **Architecture**: Foundation for future group-based visibility enhancements

---

## Part 2: Tagged Visibility (Planned for v1.1.14)

This section details the tagged visibility enhancement planned for v1.1.14. **Implementation is ready to begin.**

### 7. Enhanced Visibility: Tagged Message System

#### The Individual Visibility Limitation

The v1.1.13 visibility system (`visible: true/false` and `messageSetVisibility`) excels at controlling *individual* messages but lacks efficient group management capabilities. Applications requiring bulk visibility operations (e.g., toggling all system prompts, hiding message categories) must manually track message IDs and iterate through them, creating performance bottlenecks and losing original visibility states.

#### Architecture Decision: Performance-First Tag System

The tagged visibility system prioritizes performance through CSS-driven visibility control rather than JavaScript iteration, enabling sub-millisecond group operations regardless of message count.

### 8. Technical Implementation Plan

#### 8.1. Message Tagging API

Extend `messageAddFull` input object with new `tags` property:

```javascript
// New API signature
messageAddFull({
    content: "Hello world",
    userString: "Assistant", 
    align: "left",
    tags: ["system-prompt", "priority"], // New optional property
    visible: true
})
```

**Key Properties:**
-   `tags` (Array of strings): Optional array of tag identifiers (e.g., `["system-prompt", "priority"]`)
-   **Backward Compatibility:** New optional property, zero impact on existing code
-   **Validation**: Tag names restricted to alphanumeric and hyphens for CSS class compatibility

#### 8.2. Tag-to-CSS-Class Transformation

Tags are automatically converted to namespaced CSS classes on message elements:

**Transformation Rules:**
-   Tag `"system-prompt"` → CSS class `quikchat-tag-system-prompt`
-   Tag `"priority"` → CSS class `quikchat-tag-priority`
-   Multiple tags create multiple classes on the same element

**Benefits:**
-   **Namespacing**: Prevents conflicts with developer CSS
-   **Extensibility**: Enables custom styling beyond visibility
-   **Performance**: Leverages browser's native CSS engine
-   **Debugging**: Tags visible in DevTools as CSS classes

#### 8.3. Container-Based Visibility Control

Group visibility is controlled through CSS classes on the main chat widget container, not individual message manipulation.

**New API Functions:**
```javascript
// Show all messages with specific tag
chat.setTagVisibility("system-prompt", true);  // Adds quikchat-show-tag-system-prompt

// Hide all messages with specific tag  
chat.setTagVisibility("system-prompt", false); // Removes quikchat-show-tag-system-prompt

// Check if tag is currently visible
chat.getTagVisibility("system-prompt"); // Returns boolean

// Get all active tags in chat
chat.getActiveTags(); // Returns array of tag names
```

**Performance Architecture:**
-   **Single DOM Operation**: One class toggle on container vs. N message iterations
-   **CSS Engine Optimization**: Browser handles visibility calculations natively
-   **Scalability**: Performance independent of message count

#### 8.4. CSS Architecture and Cascade Rules

Let's consider a practical scenario to illustrate the power of this system. Assume an application needs to:
1.  Assign all system-related messages a `system-message` tag.
2.  Assign all messages from a specific user a `user1-message` tag.
3.  **By default:** All `system-message`s should be hidden, and all `user1-message`s should have a constant red border.

This is achieved by adding two different kinds of rules to the `quikchat.css` stylesheet:

**Static Styling Rule:**
This rule is always active and directly targets the tag on the message element.

```css
/* This rule is always on. Any message with this tag gets a red border. */
.quikchat-base .quikchat-tag-user1-message {
  border: 2px solid red;
}
```

**Dynamic Visibility Rules:**
This uses a two-part system. First, the default state for the tagged message, and second, an override rule that is activated by a class on the parent container.

```css
/* 1. Default State: Messages with this tag are hidden. */
.quikchat-base .quikchat-tag-system-message {
  display: none;
}

/* 2. Override Rule: This only applies when the parent has the corresponding 'show' class. */
.quikchat-base.quikchat-show-tag-system-message .quikchat-tag-system-message {
  display: block; /* Or flex */
}
```

**Cascade Interaction:**
- Static rules (borders, colors) remain active regardless of visibility state
- Dynamic rules only activate when corresponding container classes are present
- CSS specificity ensures proper override behavior
- Individual message `style.display` overrides take precedence over tag-based rules

### 9. Architecture Benefits

**Performance Advantages:**
-   **O(1) Group Operations**: Single container class toggle vs. O(n) message iteration
-   **CSS Engine Optimization**: Native browser performance for visibility calculations
-   **Reduced JavaScript Overhead**: Minimal DOM manipulation required

**Flexibility Benefits:**
-   **Multi-Category Messages**: Single message can belong to multiple tag groups
-   **Extensible Styling**: Tag classes enable custom CSS beyond visibility
-   **State Preservation**: Individual visibility settings override group settings
-   **Developer Control**: Clear separation between library CSS and developer CSS

**Maintainability Benefits:**
-   **Simplified Logic**: JavaScript manages classes, CSS handles presentation
-   **Debugging Support**: Tag classes visible in DevTools
-   **Backward Compatibility**: No impact on existing v1.1.13 visibility features

### 10. Multi-Instance Architecture

#### Design Principle: CSS Separation
QuikChat maintains strict separation: `quikchat.css` provides base functionality, developer stylesheets handle customization.

#### Challenge: Per-Instance Tag Behavior
Global CSS rules cannot differentiate between chat instances when different tag visibility behaviors are required.

#### Solution: Instance-Scoped CSS Classes

**New Constructor Option:**
```javascript
// Each instance gets unique CSS scope
const salesChat = new quikchat('#chat1', callback, { 
    instanceClass: 'sales-chat' 
});
const supportChat = new quikchat('#chat2', callback, { 
    instanceClass: 'support-chat' 
});
```

**Developer CSS Implementation:**
```css
/* my-app-styles.css - loaded after quikchat.css */

/* Sales chat: hide system messages by default */
.sales-chat .quikchat-tag-system-message {
    display: none;
}
.sales-chat.quikchat-show-tag-system-message .quikchat-tag-system-message {
    display: block;
}

/* Support chat: show system messages by default */
.support-chat .quikchat-tag-system-message {
    display: block;
}
.support-chat.quikchat-hide-tag-system-message .quikchat-tag-system-message {
    display: none;
}
```

**Benefits:**
- **Instance Isolation**: Each chat instance can have different tag behaviors
- **CSS Specificity**: Developer rules override library defaults
- **Maintainability**: Clear separation of concerns

### 11. Implementation Timeline (v1.1.14)

**Phase 1: Core Implementation (Week 1-2)**
- Extend `messageAddFull` with `tags` property
- Implement tag-to-CSS-class conversion
- Add container-based visibility control functions
- Update core CSS with tag visibility rules

**Phase 2: Advanced Features (Week 3)**
- Implement `instanceClass` constructor option
- Add comprehensive tag management API
- Ensure individual vs. group visibility precedence

**Phase 3: Testing & Documentation (Week 4)**
- Comprehensive Jest test suite covering:
  - Tag-to-class conversion accuracy
  - Container class management
  - Instance scoping functionality
  - Individual vs. group visibility interactions
  - Backward compatibility with v1.1.13

**Phase 4: Examples & Release (Week 5)**
- Redesign `hidden_message.html` as comprehensive showcase
- Update documentation and README
- Performance benchmarking
- Release v1.1.14

### 12. Success Metrics

**Performance Targets:**
- Group visibility operations < 1ms (vs. 10-100ms for iteration-based approaches)
- Zero performance regression for individual message operations
- Memory overhead < 5% for tagged messages

**API Quality Targets:**
- 100% backward compatibility with v1.1.13
- Comprehensive test coverage (>95%)
- Clear documentation with working examples
- Developer-friendly error messages for invalid tag names

---
## Implementation Checklist for Tagged Visibility (v1.1.14)

**Part 1: Core Implementation**
- [x] **`src/quikchat.js`**: Update constructor to accept and apply `instanceClass` option.
- [x] **`src/quikchat.js`**: Update `messageAddFull` to accept `tags` array and add `quikchat-tag-*` classes to message elements.
- [x] **`src/quikchat.js`**: Ensure `tags` are saved to the `_history` object for each message.
- [x] **`src/quikchat.js`**: Implement `setTagVisibility(tagName, isVisible)`.
- [x] **`src/quikchat.js`**: Implement `getTagVisibility(tagName)`.
- [x] **`src/quikchat.js`**: Implement `getActiveTags()` using an internal Set for efficiency.
- [x] **`src/quikchat.js`**: Update `historyRestoreAll` to correctly rebuild the active tags set.
- [x] **`src/quikchat.js`**: Ensure individual `messageSetVisibility` calls still override group visibility.

**Part 2: Testing**
- [x] **`tests/quikchat.test.js`**: Add new `describe` block for "Tagged Visibility".
- [x] **`tests/quikchat.test.js`**: Add tests for `instanceClass` option.
- [x] **`tests/quikchat.test.js`**: Add tests for adding single and multiple tags to messages.
- [x] **`tests/quikchat.test.js`**: Add tests for `setTagVisibility`, `getTagVisibility`, and `getActiveTags` APIs.
- [x] **`tests/quikchat.test.js`**: Add tests for the interaction between individual and group visibility.
- [x] **`tests/quikchat.test.js`**: Add tests for `historyRestoreAll` with tagged messages.

**Part 3: Example Showcase**
- [x] **`examples/hidden_message.html`**: Overhaul HTML structure for a two-column layout (Chat + Control Panel).
- [x] **`examples/hidden_message.html`**: Apply new professional styling to the page and Control Panel.
- [x] **`examples/hidden_message.html`**: Implement interactive controls for individual visibility.
- [x] **`examples/hidden_message.html`**: Implement interactive controls for tagged visibility.
- [x] **`examples/hidden_message.html`**: Implement "Add Tagged Message" functionality.
- [x] **`examples/hidden_message.html`**: Implement live display of the container's class list.
- [x] **`examples/hidden_message.html`**: Add clear explanations for each feature.

**Part 4: Documentation**
- [x] **`README.md`**: Update documentation to include the new tagged visibility features and `instanceClass` option.
- [x] **`dev/messageVisibilityPlan.md`**: Mark this checklist as complete upon finishing all tasks. 