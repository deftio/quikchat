# LLM Integration

QuikChat is designed to work with any LLM API — local or cloud, streaming or non-streaming. No SDK or library required; just `fetch()`.

## Why QuikChat Works Well with LLMs

1. **History format matches LLM APIs.** `historyGet()` returns objects with `role` and `content` fields — the same shape OpenAI, Ollama, Mistral, and Claude expect.
2. **Streaming is built in.** `messageAddNew()` + `messageAppendContent()` handles token-by-token display.
3. **The onSend callback is async-friendly.** Return a Promise or use `async/await` — quikchat doesn't care.
4. **Zero dependencies.** No SDK conflicts, no bundler configuration, no version mismatches.

## General Pattern

Every LLM integration follows the same three steps:

```javascript
const chat = new quikchat('#chat', async (chat, userInput) => {
  // 1. Echo user message
  chat.messageAddNew(userInput, 'user', 'right');

  // 2. Call the API (pass history for conversational memory)
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: modelName,
      messages: [
        { role: 'system', content: systemPrompt },
        ...chat.historyGet()  // full conversation context
      ],
      stream: true
    })
  });

  // 3. Stream tokens into the chat
  const reader = response.body.getReader();
  let id, first = true;
  // ... read loop, append tokens ...
});
```

The only things that change between providers are the URL, the request format, and the response parsing.

## Ollama (Local)

Ollama runs locally and exposes an API at `http://localhost:11434`. No API key needed.

```javascript
const chat = new quikchat('#chat', async (chat, userInput) => {
  chat.messageAddNew(userInput, 'user', 'right');

  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'llama3.1',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        ...chat.historyGet()
      ],
      stream: true
    })
  });

  const reader = response.body.getReader();
  let id, first = true;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    const chunk = JSON.parse(new TextDecoder().decode(value).trim());
    const token = chunk.message.content;

    if (first) {
      id = chat.messageAddNew(token, 'bot', 'left');
      first = false;
    } else {
      chat.messageAppendContent(id, token);
    }
  }
});
```

Ollama streams NDJSON — one JSON object per line, each with a `message.content` field.

## OpenAI / GPT-4

OpenAI uses Server-Sent Events (SSE). The response is a series of `data: {...}` lines.

```javascript
const chat = new quikchat('#chat', async (chat, userInput) => {
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
  let buffer = '', id, first = true;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop();

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
});
```

This same code works with any OpenAI-compatible API (Azure OpenAI, Mistral, Groq, etc.) — just change the URL, model name, and API key.

## LM Studio (Local)

LM Studio exposes an OpenAI-compatible API on `http://localhost:1234`. The code is almost identical to the OpenAI example — just change the URL and remove the Authorization header.

```javascript
const response = await fetch('http://localhost:1234/v1/chat/completions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    model: 'local-model',
    messages: [...chat.historyGet()],
    stream: true
  })
});
// Same SSE parsing as OpenAI
```

## Conversational Memory

The key to context-aware conversations is passing history to the API. QuikChat's `historyGet()` returns the full message array with `role` and `content` fields:

```javascript
const history = chat.historyGet();
// [
//   { role: "user", content: "What is JavaScript?", ... },
//   { role: "assistant", content: "JavaScript is a programming...", ... },
//   { role: "user", content: "How does it differ from Java?", ... }
// ]
```

Spread this into your API call's `messages` array (after the system prompt) and the LLM will have full context of the conversation.

To limit context window size, slice the history:

```javascript
const recent = chat.historyGet(-10); // last 10 messages
```

## System Prompts

Prepend a system message to set the LLM's behavior:

```javascript
const messages = [
  { role: 'system', content: 'You are a pirate. Respond in pirate speak.' },
  ...chat.historyGet()
];
```

The system prompt is not stored in quikchat's history — it's injected at call time. This lets you change it without clearing the chat.

## Non-Streaming Responses

If streaming isn't needed, await the full response:

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

## Tool Calls / Function Calling

QuikChat doesn't impose any message structure — you can display tool call results however you like:

```javascript
// Show the tool being called
const toolMsgId = chat.messageAddNew('Calling weather API...', 'system', 'center');

// Execute the tool
const weather = await getWeather(location);

// Replace the placeholder with the result
chat.messageReplaceContent(toolMsgId, `Weather in ${location}: ${weather.temp}F, ${weather.conditions}`);
```

Or display tool calls inline in the bot response:

```javascript
// Bot says it's calling a tool
const id = chat.messageAddNew('Let me look that up...', 'bot', 'left');

// After the tool returns, replace with the answer
const result = await callTool(toolName, toolArgs);
chat.messageReplaceContent(id, `Based on the data: ${result}`);
```

## Working Examples

See the `examples/` directory for complete, runnable demos:

- `simple_ollama.html` — Ollama with and without streaming
- `ollama_with_memory.html` — Ollama with conversational memory
- `lmstudio_with_memory.html` — LM Studio with memory
- `openai.html` — OpenAI with settings panel and streaming
- `ollama_adapters.js` — Reusable callback functions for Ollama
