# QuikChat Modular Structure Proposal

## Current State
- **Single file**: `src/quikchat.js` (944 lines)
- **Becoming difficult to maintain** as features grow
- **Mixed concerns**: UI, history, messages, callbacks all in one file

## Proposed Module Structure

```
src/
├── quikchat.js                 # Main class, constructor, and orchestration (~200 lines)
├── quikchat_version.js          # Version info (existing)
├── modules/
│   ├── ui/
│   │   ├── widget.js           # _createWidget, DOM structure (~100 lines)
│   │   ├── titleArea.js        # Title area methods (~50 lines)
│   │   ├── inputArea.js        # Input area methods (~50 lines)
│   │   └── messagesArea.js     # Messages area display methods (~100 lines)
│   ├── messages/
│   │   ├── message.js          # Message add/remove/update (~250 lines)
│   │   ├── visibility.js       # Message & tag visibility (~100 lines)
│   │   └── scroll.js           # Scroll handling (~50 lines)
│   ├── history/
│   │   ├── history.js          # History management (~150 lines)
│   │   ├── pagination.js       # Pagination logic (~50 lines)
│   │   └── search.js           # Search functionality (~50 lines)
│   ├── callbacks.js            # All callback management (~50 lines)
│   ├── events.js               # Event listeners setup (~50 lines)
│   └── utils.js                # Static methods, lorem ipsum, etc. (~100 lines)
```

## Benefits of This Structure

1. **Separation of Concerns**
   - UI components separate from business logic
   - History management isolated
   - Message operations grouped together

2. **Easier Testing**
   - Can test individual modules
   - Mock dependencies easily
   - Better unit test coverage

3. **Maintainability**
   - Find code faster
   - Smaller files (50-250 lines each)
   - Clear module responsibilities

4. **Future Growth**
   - Easy to add new features as modules
   - Can swap implementations (e.g., virtual scrolling)
   - Plugin system could hook into modules

## Implementation Strategy

### Phase 1: Add JSDoc to Current File
- Add comprehensive JSDoc comments to all public methods
- Document parameters, returns, examples
- Keep everything working as-is

### Phase 2: Create Module Structure (Non-Breaking)
- Use ES6 modules with a build step to combine
- Keep the same public API
- Maintain backward compatibility

### Phase 3: Optimize Build
- Tree-shaking for smaller bundles
- Separate builds for different module formats
- Keep zero-dependency promise

## Example Module

```javascript
// src/modules/messages/visibility.js

/**
 * Message visibility management module
 * @module visibility
 */

/**
 * Sets the visibility of a message
 * @param {number} msgid - Message ID
 * @param {boolean} isVisible - Visibility state
 * @returns {boolean} Success status
 */
export function setMessageVisibility(msgid, isVisible) {
    const message = this._history.find(msg => msg.msgid === msgid);
    if (!message || !message.messageDiv) return false;
    
    message.messageDiv.style.display = isVisible ? '' : 'none';
    message.visible = isVisible;
    this._updateMessageStyles();
    return true;
}

/**
 * Sets visibility for all messages with a specific tag
 * @param {string} tagName - Tag to control
 * @param {boolean} isVisible - Visibility state
 * @returns {boolean} Success status
 */
export function setTagVisibility(tagName, isVisible) {
    if (typeof tagName !== 'string' || !/^[a-zA-Z0-9-]+$/.test(tagName)) {
        return false;
    }
    
    const className = `quikchat-show-tag-${tagName}`;
    if (isVisible) {
        this._chatWidget.classList.add(className);
    } else {
        this._chatWidget.classList.remove(className);
    }
    
    this._updateMessageStyles();
    return true;
}
```

## Build Process Update

```json
// package.json scripts addition
{
  "scripts": {
    "build:modules": "rollup -c rollup.config.modules.js",
    "build": "npm run updateVersion && npm run build:modules && npm run buildDocs && npm run minifyCSS && npm run updateExampleCopies"
  }
}
```

## Timeline Estimate

- **Phase 1** (JSDoc): 2-3 hours
- **Phase 2** (Modularization): 4-6 hours  
- **Phase 3** (Build optimization): 2-3 hours
- **Testing**: 2-3 hours

Total: ~1-2 days of work

## Backward Compatibility

The public API remains unchanged:
- `new quikchat()` works exactly the same
- All methods remain on the main class
- Distribution files unchanged (still get minified bundle)
- Zero breaking changes

## Next Steps

1. ✅ Get approval on structure
2. Add JSDoc to current file
3. Create module structure
4. Update build process
5. Test thoroughly
6. Update documentation