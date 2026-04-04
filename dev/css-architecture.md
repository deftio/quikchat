# QuikChat CSS Architecture

This document defines the separation between **base (structural) CSS** and **theme (appearance) CSS** in quikchat. It serves as the specification for the CSS refactor and as a guide for anyone writing custom themes.

## Design Principles

1. **Base CSS owns layout and sizing.** Flex behavior, dimensions, padding, margins, font inheritance, overflow, and interaction scaffolding. Changing the base changes how the widget *works*.

2. **Theme CSS owns appearance.** Colors, backgrounds, borders, border-radius, shadows, and interaction feedback (hover/focus/active colors). Changing the theme changes how the widget *looks*.

3. **No theme should need to set structural properties.** A custom theme should only need color-related declarations. If a theme has to redeclare `padding` or `font-size` to look right, the base is incomplete.

4. **No inline styles for anything themeable.** Inline styles on DOM elements win over CSS specificity and block theme customization. Only per-message data (like `text-align` direction) may be inline.

5. **The widget should look reasonable with no theme class.** Base CSS provides enough structure and font defaults that an un-themed widget is usable, just unstyled.

6. **Form controls inherit from the widget, not the browser.** Textarea and button must explicitly inherit `font-family` and `font-size` from `.quikchat-base`, since browsers give form controls their own defaults.

## Widget HTML Structure

```
.quikchat-base .quikchat-theme-{name}
  .quikchat-title-area
  .quikchat-messages-area [role="log" aria-live="polite"]
    .quikchat-message
      .quikchat-user-label          (per-message, text-align set inline)
      .quikchat-message-content     (per-message, text-align set inline)
  .quikchat-input-area
    textarea.quikchat-input-textbox [aria-label]
    button.quikchat-input-send-btn
```

## Base CSS — Structural Properties

These properties control layout and sizing. They do **not** vary between themes.

### .quikchat-base (and scoped reset)

```css
.quikchat-base,
.quikchat-base *,
.quikchat-base *::before,
.quikchat-base *::after {
    box-sizing: border-box;
}

.quikchat-base {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    min-width: min(200px, 100%);
    min-height: min(200px, 100%);
    overflow: hidden;
    font-size: 14px;
    line-height: 1.4;
}
```

- `font-size: 14px` and `line-height: 1.4` provide a sane default. The host page can override by setting these on the parent container.
- No `font-family` is set — the widget inherits the host page's font intentionally.

### .quikchat-title-area

```css
.quikchat-title-area {
    flex-shrink: 0;
    padding: 8px;
    margin-left: 8px;
    margin-right: 8px;
    font-weight: 600;
    font-size: 1.3em;
}
```

### .quikchat-messages-area

```css
.quikchat-messages-area {
    flex: 1;
    min-height: 0;
    padding: 8px;
    overflow-y: auto;
}
```

- `min-height: 0` is required for flex items to shrink below their content height.

### .quikchat-message

```css
.quikchat-message {
    padding: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
}
```

### .quikchat-user-label (NEW)

```css
.quikchat-user-label {
    font-weight: 700;
    font-size: 1em;
}
```

- Previously set via inline `style` attribute on the user div, which blocked CSS theming.
- `text-align` remains inline because it is per-message data (left/right/center), not a theme property.

### .quikchat-message-content (NEW)

No structural styles needed. Exists as a class hook for theme styling.

### .quikchat-input-area

```css
.quikchat-input-area {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    padding: 8px;
    min-height: 56px;
    height: 4em;
}
```

### .quikchat-input-textbox

```css
.quikchat-input-textbox {
    flex-grow: 1;
    min-height: 40px;
    min-width: 0;
    resize: none;
    padding: 4px;
    height: 100%;
    font-family: inherit;
    font-size: inherit;
}
```

- `font-family: inherit` and `font-size: inherit` override browser defaults for textarea elements.

### .quikchat-input-send-btn

```css
.quikchat-input-send-btn {
    margin-left: 8px;
    padding: 8px;
    height: 100%;
    min-width: 5rem;
    cursor: pointer;
    white-space: nowrap;
    font-family: inherit;
    font-size: inherit;
}
```

### Focus defaults

```css
.quikchat-input-textbox:focus,
.quikchat-input-send-btn:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: -2px;
}
```

- `currentColor` adapts to whatever text color the theme sets.
- Themes can override with specific focus colors.

## Theme CSS — Appearance Properties

A theme is a single class (e.g., `.quikchat-theme-light`) applied alongside `.quikchat-base` on the root widget div. A theme should **only** set these categories of properties:

### Allowed in themes

| Category | Properties |
|---|---|
| Colors | `color`, `background-color` |
| Borders | `border`, `border-top`, `border-bottom`, `border-left`, `border-right` |
| Corners | `border-radius`, `border-top-left-radius`, etc. |
| Shadows | `box-shadow` |
| Interaction states | `:hover`, `:active`, `:focus` overrides (colors only) |

### NOT allowed in themes

| Category | Properties | Reason |
|---|---|---|
| Spacing | `padding`, `margin`, `margin-left`, `margin-right` | Structural — changing these moves elements |
| Typography | `font-size`, `font-weight`, `font-family`, `line-height` | Structural — changing these alters text flow and element sizing |
| Layout | `display`, `flex-*`, `width`, `height`, `min-*`, `max-*` | Structural — changing these breaks layout |
| Interaction | `cursor` | Structural — pointer cursor is behavioral, not visual |

### Theme template

A minimal custom theme needs only this:

```css
/* Container */
.my-theme {
    background-color: #fff;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 10px;
}

/* Title */
.my-theme .quikchat-title-area {
    background-color: #fff;
    color: #333;
}

/* Messages */
.my-theme .quikchat-messages-area {
    background-color: #fafafa;
    color: #333;
}

/* Alternating message rows (optional) */
.my-theme .quikchat-messages-area-alt .quikchat-message:nth-child(odd) {
    background-color: #f0f0f0;
    color: #333;
    border-radius: 4px;
}
.my-theme .quikchat-messages-area-alt .quikchat-message:nth-child(even) {
    background-color: #e0e0e0;
    color: #333;
    border-radius: 4px;
}

/* Input area */
.my-theme .quikchat-input-area {
    background-color: #fff;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}

/* Textbox */
.my-theme .quikchat-input-textbox {
    background-color: #fff;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 4px;
}

/* Send button */
.my-theme .quikchat-input-send-btn {
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
}

/* Hover/focus states (optional) */
.my-theme .quikchat-input-send-btn:hover {
    background-color: #43a047;
}
```

## Implementation Status

All changes described in this spec have been implemented:

- CSS: base/theme separation complete, all structural properties removed from themes
- JS: inline styles replaced with classes, title template cleaned up
- Tests: 114 Jest unit tests (100% coverage), 14 Playwright resize/containment tests
- Verified by `dev/check-css.cjs` — all themes appearance-only
