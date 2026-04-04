# Theming

QuikChat separates structure from appearance. Base CSS handles layout (flexbox, sizing, overflow). Theme CSS handles looks (colors, borders, shadows). You can create a custom theme without touching any structural properties.

## Built-in Themes

| Theme class | Description |
|---|---|
| `quikchat-theme-light` | Light background, green send button, subtle borders |
| `quikchat-theme-dark` | Dark background, dark green button, material-inspired |
| `quikchat-theme-modern` | Chat-bubble style — user messages in blue bubbles (right), assistant messages in grey bubbles (left) |
| `quikchat-theme-debug` | Vivid colors (orchid, salmon, seagreen) for visual debugging |

Set the theme at construction or switch at runtime:

```javascript
// At construction
const chat = new quikchat('#chat', onSend, { theme: 'quikchat-theme-dark' });

// Switch at runtime
chat.changeTheme('quikchat-theme-light');
```

Multiple chat instances on the same page can use different themes.

## Writing a Custom Theme

A theme is just a CSS class. It only needs color declarations — all layout is handled by the base CSS.

### Widget Structure

```
.quikchat-base.your-theme
  .quikchat-title-area
  .quikchat-messages-area
    .quikchat-message
      .quikchat-user-label
      .quikchat-message-content
  .quikchat-input-area
    textarea.quikchat-input-textbox
    button.quikchat-input-send-btn
```

### Minimal Theme

```css
.my-theme {
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #cccccc;
  border-radius: 8px;
}

.my-theme .quikchat-title-area {
  background-color: #f5f5f5;
  color: #333333;
}

.my-theme .quikchat-messages-area {
  background-color: #fafafa;
  color: #333333;
}

.my-theme .quikchat-input-area {
  background-color: #ffffff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.my-theme .quikchat-input-textbox {
  background-color: #ffffff;
  color: #333333;
  border: 1px solid #cccccc;
  border-radius: 4px;
}

.my-theme .quikchat-input-send-btn {
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
}

.my-theme .quikchat-input-send-btn:hover {
  background-color: #43a047;
}
```

### Alternating Row Colors (Optional)

```css
.my-theme .quikchat-messages-area-alt .quikchat-message:nth-child(odd) {
  background-color: #f0f0f0;
  color: #333;
  border-radius: 4px;
}

.my-theme .quikchat-messages-area-alt .quikchat-message:nth-child(even) {
  background-color: #e8e8e8;
  color: #333;
  border-radius: 4px;
}
```

### Apply It

```javascript
const chat = new quikchat('#chat', onSend, { theme: 'my-theme' });
```

Or load the CSS file separately and switch at runtime:

```html
<link rel="stylesheet" href="my-theme.css" />
<script>
  chat.changeTheme('my-theme');
</script>
```

## What Themes Should Set

| Category | Properties |
|---|---|
| Colors | `color`, `background-color` |
| Borders | `border`, `border-top`, `border-bottom`, etc. |
| Corners | `border-radius` and its longhand variants |
| Shadows | `box-shadow` |
| Hover/focus | `:hover`, `:active`, `:focus` color overrides |

## What Themes Should NOT Set

| Property | Why |
|---|---|
| `padding`, `margin` | Moves elements, breaks layout |
| `font-size`, `font-weight`, `font-family` | Alters text flow and element sizing |
| `display`, `flex-*`, `width`, `height` | Breaks flex structure |
| `cursor` | Behavioral, not visual |
| `resize`, `overflow` | Structural scrolling behavior |

If you find yourself needing to set any of these in a theme, the base CSS may be missing something — file an issue.

## Focus Indicators

The base CSS provides focus outlines using `currentColor`:

```css
.quikchat-input-textbox:focus,
.quikchat-input-send-btn:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: -2px;
}
```

These adapt automatically to your theme's text color. To customize, override in your theme:

```css
.my-theme .quikchat-input-textbox:focus {
  outline-color: #1976d2;
}
```

## Accessibility

QuikChat includes ARIA attributes on the widget:

| Element | Attribute | Value |
|---|---|---|
| Messages area | `role` | `log` |
| Messages area | `aria-live` | `polite` |
| Messages area | `aria-label` | `Chat messages` |
| Text input | `aria-label` | `Type a message` |

These work with any theme — no additional ARIA setup needed.

## Styling by Message Role

Every message gets a CSS class based on its `role` parameter: `quikchat-role-user`, `quikchat-role-assistant`, `quikchat-role-system`, `quikchat-role-tool`. Use these to style messages by type:

```css
/* Dim system messages */
.my-theme .quikchat-role-system .quikchat-message-content {
    color: #999;
    font-style: italic;
}

/* Color the bot's name differently */
.my-theme .quikchat-role-assistant .quikchat-user-label {
    color: #1976d2;
}

/* Highlight tool call results */
.my-theme .quikchat-role-tool .quikchat-message-content {
    border-left: 3px solid #ff9800;
}
```

No default styles are applied to role classes — they're pure hooks for your theme.

## Alignment Classes

Every message div gets an alignment class: `quikchat-align-left`, `quikchat-align-right`, or `quikchat-align-center`. These are used by the modern bubble theme to position messages, and you can use them in your own themes:

```css
/* Chat bubble layout */
.my-theme .quikchat-align-left .quikchat-message-content {
    background-color: #e5e5ea;
    margin-right: auto;
    max-width: 80%;
    border-radius: 16px;
    padding: 8px 12px;
}
.my-theme .quikchat-align-right .quikchat-message-content {
    background-color: #007aff;
    color: white;
    margin-left: auto;
    max-width: 80%;
    border-radius: 16px;
    padding: 8px 12px;
}
```

## Typing Indicator Styling

The typing indicator uses a CSS-only pulsing dot animation. The message gets a `quikchat-typing` class and the dots are inside a `quikchat-typing-dots` span. Override the animation in your theme:

```css
.my-theme .quikchat-typing-dots span {
    color: #999;
    font-size: 1.6em;
}
```

## Disabled Input Styling

When input is disabled via `inputAreaSetEnabled(false)`, the base CSS applies:

```css
.quikchat-input-textbox:disabled,
.quikchat-input-send-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
```

Themes can override the disabled appearance:

```css
.my-theme .quikchat-input-send-btn:disabled {
    background-color: #999;
}
```

## CSS Architecture Details

For the full specification of how base and theme CSS are separated, see [css-architecture.md](css-architecture.md).
