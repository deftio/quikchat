# Streaming Responses

QuikChat supports token-by-token streaming for LLM responses. This is the pattern used by ChatGPT, Claude, and other AI interfaces where text appears word-by-word.

## The Pattern

Two methods make streaming work:

1. **`messageAddNew()`** — creates a new message with the first token, returns its ID
2. **`messageAppendContent(id, token)`** — appends each subsequent token to that message

```javascript
// First token: create the message
const id = chat.messageAddNew(firstToken, 'bot', 'left');

// Subsequent tokens: append to it
chat.messageAppendContent(id, nextToken);
chat.messageAppendContent(id, anotherToken);
// ... keep appending until the stream ends
```

QuikChat handles scrolling automatically — as tokens are appended, the messages area scrolls to show the latest content (unless the user has manually scrolled up).

## Complete Example with fetch + ReadableStream

This is the core streaming pattern used by all the LLM examples. It works with any API that returns a streaming response (Ollama, OpenAI, Mistral, LM Studio, etc.).

```javascript
const chat = new quikchat('#chat', async (chat, userInput) => {
  // 1. Echo the user's message
  chat.messageAddNew(userInput, 'user', 'right');

  // 2. Call the API with streaming enabled
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1',
      messages: chat.historyGet(),  // pass full conversation history
      stream: true
    })
  });

  // 3. Read the stream token by token
  const reader = response.body.getReader();
  let id;
  let first = true;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const text = new TextDecoder().decode(value, { stream: true });
    const token = JSON.parse(text.trim()).message.content;

    if (first) {
      id = chat.messageAddNew(token, 'bot', 'left');  // create message
      first = false;
    } else {
      chat.messageAppendContent(id, token);            // append to it
    }
  }
});
```

## OpenAI-Style SSE Streams

OpenAI and compatible APIs use Server-Sent Events (`data: {...}\n`) rather than NDJSON. The stream parsing is slightly different but the quikchat pattern is the same:

```javascript
async function streamOpenAI(chat, userInput) {
  chat.messageAddNew(userInput, 'user', 'right');

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...chat.historyGet()
      ],
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let id;
  let first = true;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop(); // keep incomplete line for next iteration

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6);
      if (data === '[DONE]') return;

      const token = JSON.parse(data).choices[0].delta.content;
      if (!token) continue;

      if (first) {
        id = chat.messageAddNew(token, 'bot', 'left');
        first = false;
      } else {
        chat.messageAppendContent(id, token);
      }
    }
  }
}
```

## Non-Streaming (Simple Completion)

If you don't need streaming, just await the full response and add it as one message:

```javascript
const chat = new quikchat('#chat', async (chat, userInput) => {
  chat.messageAddNew(userInput, 'user', 'right');

  const response = await fetch('http://localhost:11434/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1',
      prompt: userInput,
      stream: false
    })
  });

  const data = await response.json();
  chat.messageAddNew(data.response, 'bot', 'left');
});
```

## Replacing Content

`messageReplaceContent(id, newContent)` replaces the entire message body. This is useful for:

- Replacing a "thinking..." placeholder with the actual response
- Updating a tool-call result after execution
- Correcting a message

```javascript
const id = chat.messageAddNew('Thinking...', 'bot', 'left');
// ... later ...
chat.messageReplaceContent(id, 'Here is the actual answer.');
```

## Tips

- **The `role` parameter matters.** When you pass `chat.historyGet()` to an LLM API, the `role` field maps directly to the API's role system (`'user'`, `'assistant'`, `'system'`). Use `'assistant'` for bot messages if you're sending history to an LLM.
- **History includes timestamps.** Each message has `timestamp` (created) and `updatedtime` (last appended). Useful for logging or display.
- **Scroll behavior is automatic.** QuikChat scrolls to the bottom on each append — unless the user has scrolled up, in which case it leaves them where they are.
