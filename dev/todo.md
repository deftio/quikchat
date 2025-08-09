# QuikChat JS TODO list

* show/hide timestamps
* add support for right to left languages by making css with [send] on left etc
* add support for inline "user" icon with chat message instead of on top => [user][message]
* example Anthropic
* example Mistral
* example React Component
* test suite coverage to 90%
* clean up scroll to bottom behavior (in progress)
* add stats api (num messages, users, total chars written etc)
* add callbacks : onMessageAppend, onMessageReplace
As a deeply experienced web developer, here's my honest assessment:

  QuikChat - The Reality

  Where It Shines

  - Zero dependencies is genuinely impressive - no framework lock-in
  - Simple mental model - just messages in a container
  - Streaming support works well for LLM use cases
  - History export/import is well-thought-out

  Where It Falls Short

  - No virtual scrolling - Will struggle with 1000+ messages (DOM bloat)
  - No message diffing - Full re-renders on updates
  - Limited extensibility - Can't inject custom components (reactions, embeds, etc.)
  - No accessibility - Missing ARIA labels, keyboard navigation
  - No i18n - Hardcoded strings, no RTL support
  - Security concerns - innerHTML usage without sanitization hooks

  Compared to Alternatives

  - vs stream-chat-react: QuikChat is 100x simpler but 10x less capable
  - vs ChatUI libraries: Lacks message threading, typing indicators, read receipts
  - vs Custom React/Vue: QuikChat wins on simplicity, loses on everything else

  Verdict: Perfect for prototypes, concerning for production at scale
==========

## some icons

robot icon

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect x="18" y="20" width="28" height="28" rx="6" ry="6" stroke="#000" stroke-width="3" fill="none"/>
  <circle cx="26" cy="30" r="3" fill="#000"/>
  <circle cx="38" cy="30" r="3" fill="#000"/>
  <rect x="30" y="14" width="4" height="6" fill="#000"/>
  <path d="M26 38 Q32 44 38 38" stroke="#000" stroke-width="2" fill="none"/>
  <rect x="14" y="24" width="4" height="10" rx="2" ry="2" stroke="#000" stroke-width="3" fill="none"/>
  <rect x="46" y="24" width="4" height="10" rx="2" ry="2" stroke="#000" stroke-width="3" fill="none"/>
</svg>
```

person icon

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <circle cx="32" cy="24" r="12" stroke="#000" stroke-width="3" fill="none"/>
  <path d="M16 50 Q32 38 48 50" stroke="#000" stroke-width="3" fill="none"/>
  <circle cx="28" cy="22" r="2" fill="#000"/>
  <circle cx="36" cy="22" r="2" fill="#000"/>
  <path d="M30 28 Q32 30 34 28" stroke="#000" stroke-width="2" fill="none"/>
</svg>

```
