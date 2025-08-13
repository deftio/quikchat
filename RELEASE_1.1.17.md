## v1.1.17

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
- **Fixed page jumping issue**: Changed scrolling to use scrollTop instead of scrollIntoView to prevent entire page from scrolling
- **Fixed input field clearing issue**: Input field was being cleared before callback could read the value
- **Fixed test file callbacks**: All test HTML files now properly handle user input for manual testing

### Developer Experience
- **Enhanced API documentation**: Added comprehensive docs for sanitization and i18n features
- **Improved test coverage**: Reached 85.94% coverage with 122 tests passing
- **Added favicons**: All example and test HTML files now have consistent favicon branding
- **Smart scrolling in demos**: Reduced UI jumping in multilingual demonstrations

### Test Coverage
- Added 21 new tests covering all new features
- Maintained 85%+ overall test coverage (85.94%)
- Comprehensive testing for ARIA, mobile, i18n, and sanitization functionality
- Added Playwright E2E tests for virtual scrolling + sanitizer integration