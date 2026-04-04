# QuikChat CSS Architecture

QuikChat CSS is split into two layers: **base** (structural) and **theme** (appearance). This document explains the design and how to write custom themes.

## Base CSS — Structure and Layout

Base styles control how the widget is laid out and sized. They do not vary between themes.

| Selector | Responsibility |
|---|---|
| `.quikchat-base` | Flex column container, sizing, overflow, base font |
| `.quikchat-title-area` | Fixed-height title zone, padding, font size/weight |
| `.quikchat-messages-area` | Flexible-height scrollable message zone |
| `.quikchat-message` | Message padding, text wrapping |
| `.quikchat-user-label` | Username font weight |
| `.quikchat-message-content` | Class hook for theme styling on message body |
| `.quikchat-input-area` | Fixed-height flex row for textbox + button |
| `.quikchat-input-textbox` | Flexible-width textarea, font inheritance |
| `.quikchat-input-send-btn` | Button sizing, font inheritance, cursor |

Key structural decisions:

- **`box-sizing: border-box`** is scoped to `.quikchat-base` and all descendants. This prevents padding from causing overflow regardless of what the host page sets.
- **`flex: 1; min-height: 0`** on the messages area lets it fill available space and shrink below its content height (required for overflow scrolling to work in flex layouts).
- **`flex-shrink: 0`** on title and input areas prevents them from compressing when the container is small.
- **`font-family: inherit; font-size: inherit`** on textarea and button overrides browser defaults for form controls, so they match the widget's font.
- **`min-width: min(200px, 100%)`** prevents the widget from overflowing parents smaller than 200px.

## Theme CSS — Appearance

A theme is a class (e.g., `.quikchat-theme-light`) applied on the same element as `.quikchat-base`. Themes control how the widget *looks*, not how it's laid out.

### Properties themes should set

| Category | Properties |
|---|---|
| Colors | `color`, `background-color` |
| Borders | `border`, `border-top`, `border-bottom`, etc. |
| Corners | `border-radius` and its longhand variants |
| Shadows | `box-shadow` |
| Interaction | `:hover`, `:active`, `:focus` color overrides |

### Properties themes should NOT set

| Category | Examples | Why |
|---|---|---|
| Spacing | `padding`, `margin` | Moves elements, breaks layout |
| Typography | `font-size`, `font-weight`, `font-family` | Alters text flow and element sizing |
| Layout | `display`, `flex-*`, `width`, `height` | Breaks flex structure |
| Interaction | `cursor` | Behavioral, not visual |

## Writing a Custom Theme

A minimal theme only needs color declarations. Use the built-in themes as reference.

```css
.quikchat-theme-custom {
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #cccccc;
    border-radius: 8px;
}

.quikchat-theme-custom .quikchat-title-area {
    background-color: #f5f5f5;
    color: #333333;
}

.quikchat-theme-custom .quikchat-messages-area {
    background-color: #fafafa;
    color: #333333;
}

.quikchat-theme-custom .quikchat-messages-area-alt .quikchat-message:nth-child(odd) {
    background-color: #f0f0f0;
    border-radius: 4px;
}

.quikchat-theme-custom .quikchat-messages-area-alt .quikchat-message:nth-child(even) {
    background-color: #e8e8e8;
    border-radius: 4px;
}

.quikchat-theme-custom .quikchat-input-area {
    background-color: #ffffff;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.quikchat-theme-custom .quikchat-input-textbox {
    background-color: #ffffff;
    color: #333333;
    border: 1px solid #cccccc;
    border-radius: 4px;
}

.quikchat-theme-custom .quikchat-input-send-btn {
    background-color: #4caf50;
    color: #ffffff;
    border: none;
    border-radius: 4px;
}

.quikchat-theme-custom .quikchat-input-send-btn:hover {
    background-color: #43a047;
}
```

Apply it in JavaScript:

```javascript
const chat = new quikchat('#container', onSend, {
    theme: 'quikchat-theme-custom'
});
```

Or switch at runtime:

```javascript
chat.changeTheme('quikchat-theme-custom');
```

## ARIA Accessibility

The widget includes these ARIA attributes:

| Element | Attribute | Value |
|---|---|---|
| `.quikchat-messages-area` | `role` | `log` |
| `.quikchat-messages-area` | `aria-live` | `polite` |
| `.quikchat-messages-area` | `aria-label` | `Chat messages` |
| `.quikchat-input-textbox` | `aria-label` | `Type a message` |

Base CSS provides `outline` focus indicators on the textbox (`:focus`) and button (`:focus-visible`) using `currentColor`, which adapts to whatever text color the theme sets. Themes can override focus colors as needed.
