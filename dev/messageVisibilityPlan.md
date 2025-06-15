# Plan for Implementing Message Visibility in QuikChat

This document outlines the plan to add a feature for controlling the visibility of individual messages in the QuikChat library. This will allow developers to add messages to the chat history that are not initially displayed and to programmatically show or hide messages after they have been added.

## 1. Core Requirements

The new feature will consist of three main components:

1.  **Initial Visibility Control**: A way to specify whether a message should be visible when it is first added to the chat.
2.  **Dynamic Visibility Control**: Functions to change the visibility of a message after it has been added.
3.  **Visibility Status Check**: A function to check whether a specific message is currently visible.

## 2. Implementation Details

The core strategy is to **always** create and append a DOM element for every message. Visibility will be controlled by toggling the `display` CSS property of the message's container element.

### 2.1. Initial Visibility: The `visible` Property

To control whether a message is displayed when it's first added, a new `visible` property will be introduced to the `input` object of the `messageAddFull` function.

-   **`visible` (boolean)**:
    -   If `true` or the property is absent (for backward compatibility), the message will be visible.
    -   If `false`, the message's DOM element will be created and added to the DOM, but with its `style.display` set to `none`.
-   **Backward Compatibility**: The default value of `visible` will be `true`. This ensures that all existing calls to `messageAddFull` and `messageAddNew` will continue to work without any changes.
-   **History Export**: When a message is added to history, the `visible` property will be explicitly stored. If it was not provided in the input, it will be saved as `true`. This ensures that any exported history via `historyGetAllCopy()` will contain this property for every message.

### 2.2. Dynamic Visibility Control: `messageSetVisibility(msgid, isVisible)`

A new function, `messageSetVisibility`, will be added to allow for showing and hiding messages programmatically.

-   **`messageSetVisibility(msgid, isVisible)`**:
    -   `msgid` (number): The ID of the message to modify.
    -   `isVisible` (boolean): `true` to show the message, `false` to hide it.
-   **Functionality**:
    1.  The function will retrieve the message from the `_history` array using its `msgid`.
    2.  It will find the associated `messageDiv` DOM element.
    3.  If `isVisible` is `true`, it will set `messageDiv.style.display = ''`.
    4.  If `isVisible` is `false`, it will set `messageDiv.style.display = 'none'`.
    5.  After changing the visibility, it will trigger a function to recalculate the alternating background colors for all currently visible messages.
-   **Edge Cases**: The function should handle cases where the `msgid` does not exist in the history.

### 2.3. Visibility Status Check: `messageGetVisibility(msgid)`

To complement `messageSetVisibility`, a new function `messageGetVisibility` will be created.

-   **`messageGetVisibility(msgid)`**:
    -   `msgid` (number): The ID of the message to check.
-   **Functionality**:
    -   The function will find the message in the `_history` array and get its `messageDiv`.
    -   It will return `true` if `messageDiv.style.display` is not `none`.
    -   It will return `false` if `messageDiv.style.display` is `none`.
    -   If the `msgid` is not found, it will return `undefined` or `null`.

## 3. Use Case: LLM System Prompts and Moderation

This feature is useful for various applications:

-   **Hiding System Prompts**: A system prompt can be added as the first message with `visible: false`. This keeps the prompt as part of the official chat history (important for LLM context) without cluttering the user's view.
-   **Moderation**: A message can be dynamically hidden by a moderator if it violates community standards, without permanently deleting it from the history.
-   **On-Demand Visibility**: A "debug" or "show raw" mode can be implemented to reveal all hidden messages.

## 4. Test Cases

The following test cases should be created to ensure the feature is working correctly:

1.  **Backward Compatibility**: Add a message without the `visible` property.
    -   **Expected**: The message is visible. `messageGetVisibility` returns `true`. The history object for the message has `visible: true`.
2.  **Explicit `visible: true`**: Add a message with `visible: true`.
    -   **Expected**: The message is visible. Its DOM element is present and has `style.display !== 'none'`.
3.  **Explicit `visible: false`**: Add a message with `visible: false`.
    -   **Expected**: The message is not visible, but its DOM element exists with `style.display === 'none'`. `messageGetVisibility` returns `false`.
4.  **Show a Hidden Message**: Add a message with `visible: false`, then call `messageSetVisibility(msgid, true)`.
    -   **Expected**: The message appears in the UI. `messageGetVisibility` returns `true`.
5.  **Hide a Visible Message**: Add a message with `visible: true`, then call `messageSetVisibility(msgid, false)`.
    -   **Expected**: The message disappears from the UI. `messageGetVisibility` returns `false`.
6.  **Alternating Colors**: Add several messages, some visible, some not. Then toggle the visibility of a message.
    -   **Expected**: The alternating background styles (`quikchat-message-1`, `quikchat-message-2`) should be correctly recalculated and applied to all *visible* messages.
7.  **History Export**: Add a mix of messages. Call `historyGetAllCopy()`.
    -   **Expected**: All message objects in the returned array have a boolean `visible` property.
8.  **Invalid `msgid`**: Call `messageSetVisibility` and `messageGetVisibility` with a `msgid` that does not exist.
    -   **Expected**: The functions should not throw an error and should return a sensible value (`false` or `undefined`).

## 5. Documentation and Examples

To ensure developers can effectively use this new feature, the following assets will be created:

### 5.1. Documentation Update

-   The project's primary documentation (e.g., `README.md`) will be updated.
-   The documentation for `messageAddFull` and `messageAddNew` will be amended to include the new `visible` property in the `input` object.
-   New sections will be added for the `messageSetVisibility` and `messageGetVisibility` functions, explaining their purpose, parameters, and return values.

### 5.2. New Example File: `examples/hidden_message.html`

-   A new example file will be created at `examples/hidden_message.html`.
-   This file will provide a clean, interactive demonstration of the visibility features.
-   It will include:
    -   A QuikChat instance.
    -   Buttons to:
        -   Add a standard, visible message.
        -   Add a hidden message (e.g., a "system prompt").
        -   A button and input field to toggle the visibility of a specific message by its ID.
        -   A button to reveal all hidden messages.
    -   Clear comments and on-page text explaining what each button does and how the feature works.

## 6. Feedback and Additional Considerations

-   **Performance**: With this approach, the DOM will contain all message elements, including hidden ones. For the intended use cases (a few system messages, etc.), this has no meaningful performance impact and is the preferred method for its simplicity and robustness.
-   **CSS and Styling**: The most critical part of the implementation will be the function that re-applies the alternating background colors. This needs to iterate through the *visible* DOM elements after any visibility change and correctly set their `quikchat-message-1`/`quikchat-message-2` classes.
-   **API Simplicity**: The proposed property (`visible`) and functions (`messageSetVisibility`, `messageGetVisibility`) provide a clean and intuitive API.

This plan provides a comprehensive approach to implementing the message visibility feature. It addresses the core requirements, considers backward compatibility, and provides a clear path for implementation.

## 7. Future Enhancements: Tagged Visibility

### The Challenge with Simple Visibility

The currently implemented visibility system (`visible: true/false` and `messageSetVisibility`) is perfect for controlling the display of *individual* messages. However, it is not designed to manage the visibility of *groups* of related messages, such as a set of system prompts or moderator notes that an application might want to toggle all at once. An application would need to manually track the IDs of all relevant messages and loop through them, which is inefficient and loses the state of which messages were originally hidden by default.

### A More Powerful Proposal: A Tag-Based System

A more robust and flexible solution is to implement a generic message tagging system. This would allow developers to assign one or more tags (as CSS classes) to messages and then control the visibility of all messages with a certain tag via a single command.

#### 1. API for Tagging Messages

The core change would be to add a `tags` property to the `messageAddFull` input object.

-   `tags` (Array of strings): An optional array of strings that will be used as tags. For example: `tags: ["system-prompt", "priority"]`.
-   **Backward Compatibility:** This would be a new, optional property and would not affect existing code.

#### 2. From Tags to CSS Classes

The QuikChat library would take the provided tags and convert them into namespaced CSS classes on the message's main `div` element.

-   A tag like `"system-prompt"` would become the class `quikchat-tag-system-prompt`.
-   A message with `tags: ["system-prompt", "priority"]` would get both `quikchat-tag-system-prompt` and `quikchat-tag-priority` added to its class list.
-   This provides a powerful hook for any custom CSS styling, not just visibility.

#### 3. Toggling Visibility via Container Classes

Instead of manipulating individual messages, we would control group visibility by adding/removing classes on the main chat widget container (`_chatWidget`). This is highly efficient as it's a single DOM manipulation that leverages the browser's CSS engine.

-   **New Functions:** We would introduce new functions like `setTagVisibility(tagName, isVisible)`.
-   **Mechanism:**
    -   Calling `setTagVisibility("system-prompt", true)` would add the class `quikchat-show-tag-system-prompt` to the main widget container.
    -   Calling `setTagVisibility("system-prompt", false)` would remove that class.
-   **CSS-Driven Logic:** The actual showing and hiding would be managed entirely by CSS rules that we would add to the `quikchat.css` file.
    ```css
    /* By default, hide any message that has a tag. */
    .quikchat-base .quikchat-message[class*="quikchat-tag-"] {
        display: none;
    }

    /* When the container has the corresponding "show" class, display the tagged messages. */
    .quikchat-base.quikchat-show-tag-system-prompt .quikchat-tag-system-prompt {
        display: block; /* Or flex, depending on the message structure */
    }
    .quikchat-base.quikchat-show-tag-priority .quikchat-tag-priority {
        display: block;
    }
    /* etc. for any other tags */
    ```
    *(Note: The CSS would need to be carefully crafted to handle multiple tags and potential overrides, but this demonstrates the principle.)*

#### 4. Benefits of the Tagging Approach

-   **Decoupling:** The JavaScript logic is simple: add classes to messages and a single class to the container. The complex logic of what "visible" means is left entirely to CSS, where it belongs.
-   **Multi-Category Messages:** A single message can belong to multiple groups (e.g., a message could be tagged as both `system` and `debug`).
-   **Performance:** Toggling a class on a single parent container is vastly more performant than iterating over potentially hundreds of message elements in JavaScript.
-   **Extensibility:** This system is not limited to visibility. A developer could use the `quikchat-tag-*` classes to apply custom borders, colors, or icons to certain types of messages by simply adding their own CSS rules.
-   **Preservation of State:** The individual visibility (`style.display`) of a message remains untouched by group toggling, allowing the hybrid system to function as previously discussed. A user can still show/hide a single message from a group. 