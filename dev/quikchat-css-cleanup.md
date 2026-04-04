# QuikChat CSS/Design Cleanup

Issues found during code review. Goal: clean separation where base CSS handles layout/sizing and themes handle only visual styling (colors, shadows, borders).

## Structural vs Theme Separation

### 1. Themes re-declare structural properties
Every theme repeats `padding`, `font-size`, `font-weight`, `border-radius` values that are layout concerns, not color. If you change padding in the base, themes override it back. Someone writing a custom theme has to copy all that boilerplate.

**Affected properties that should be in base only:**
- `padding: 8px` (title-area, input-area, input-textbox)
- `font-size: 14px` (input-textbox)
- `font-weight: 600` (title-area)
- `border-radius: 10px` (container), `1em` (messages-area), `4px` (messages, buttons, textbox)
- `cursor: pointer` (send button — dark theme re-declares this)
- `margin-left: 10px` (send button — dark theme overrides the base `8px`)

**Fix:** Move all shared padding, font-size, font-weight, border-radius into the base structural section (lines 1-72). Themes should only set: `background-color`, `color`, `border-color`, `border-style`, `box-shadow`, and `transition`.

### 2. Inline styles in _createWidget (JS)
`<span style="font-size: 1.5em; font-weight: 600;">Title Area</span>` is hardcoded at line 49 of quikchat.js. This can't be overridden by CSS without `!important`. The base CSS also sets `font-weight: 600` and `font-size: 1.3em` on `.quikchat-title-area`, so there's a conflict.

**Fix:** Remove the inline style from the span. Let the base CSS `.quikchat-title-area` handle it.

### 3. Inline styles in messageAddFull (JS)
`userDiv.style = "width: 100%; text-align: ${input.align}; font-size: 1em; font-weight:700;"` — the font-size and font-weight are un-themeable because inline styles win specificity.

**Fix:** Create a `.quikchat-user-label` class for font styling. Keep only `text-align` as inline (it's per-message data).

### 4. Inconsistent theme structure
- Dark theme sets `box-shadow` but light and debug don't.
- Dark theme sets `border-bottom: 1px solid #37474f` on title-area; others don't.
- Debug theme sets `border-radius: 4px` on alternating messages; could be in base.

**Fix:** Either make all themes set the same properties (with different values) for predictability, or move shared structural defaults to base so themes only need to override colors.

## Other Design Notes

### 5. README example has syntax error
The constructor example in README.md shows the callback inside the options object, which isn't valid JS. The actual signature is `(parentElement, onSend, options)` — the README should match.

### 6. `_adjustMessagesAreaHeight` / `_adjustSendButtonWidth` removed
Per the system reminder, these were replaced by flexbox. Verify no references remain and tests cover the new behavior.
