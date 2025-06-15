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

## 7. Advanced Group Visibility Control

### 7.1. The Challenge with Individual Visibility

The `messageSetVisibility` function is ideal for controlling single messages. However, it is not well-suited for managing categories of messages, such as a set of system prompts that should be toggled together. An application would need to manually track the IDs of all system messages and loop through them, which is inefficient and loses the state of which messages were originally hidden by default.

### 7.2. A Hybrid, Class-Based Solution

To solve this, we will implement a more powerful, class-based group toggling system that works in tandem with the existing individual visibility controls.

1.  **New `visibilityGroup` Property:**
    -   A new optional string property, `visibilityGroup`, will be added to the `messageAddFull` input object.
    -   When a message is added with `visibilityGroup: 'system'`, its DOM element will receive a corresponding CSS class: `quikchat-visibility-group-system`.

2.  **New Group-Toggle Functions:**
    -   `setGroupVisibility(groupName, isVisible)`: This function will add or remove a class on the main chat container (`_chatWidget`). For example, `setGroupVisibility('system', true)` will add the class `quikchat-show-group-system` to the container.
    -   `toggleGroupVisibility(groupName)`: A convenience function to flip the current visibility of a group.
    -   `getGroupVisibility(groupName)`: Checks if a given group is currently set to be visible.

3.  **CSS-Driven Logic:**
    -   The core showing and hiding will be managed by CSS, not by iterating through DOM elements in JavaScript.
    -   By default, any element with a `quikchat-visibility-group-*` class will have `display: none`.
    -   A CSS rule will specify that when the container has a `quikchat-show-group-*` class, the corresponding messages within it should have `display: ''` (or `block`).
    -   The `_updateMessageStyles` function must be called after any group visibility change to fix the alternating background colors.

### 7.3. Interaction Between Individual and Group Controls

This hybrid system allows for maximum flexibility. Because inline `style` attributes have higher CSS specificity than classes, the individual controls will always override group settings.

-   **Scenario:** A message is part of the `system` group, which is currently hidden.
-   An admin calls `messageSetVisibility(msgid, true)` on that single message.
-   **Result:** That specific message will appear, while all other messages in the `system` group remain hidden. This is the desired and most intuitive behavior. 