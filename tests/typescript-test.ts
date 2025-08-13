/**
 * TypeScript compilation test for QuikChat type definitions
 * This file verifies that our TypeScript definitions are correct
 * Run: npx tsc --noEmit tests/typescript-test.ts
 */

import QuikChat, { 
    Alignment, 
    MessageRole, 
    MessageOptions, 
    HistoryMessage,
    QuikChatOptions,
    sanitizers 
} from '../dist/quikchat';

// Test constructor
const chat1 = new QuikChat('#chat');
const chat2 = new QuikChat(document.getElementById('chat')!);
const chat3 = new QuikChat('#chat', (instance, message) => {
    console.log(message);
});

// Test with all options
const options: QuikChatOptions = {
    theme: 'dark',
    trackHistory: true,
    titleArea: {
        title: 'Chat',
        show: true,
        align: 'center'
    },
    messagesArea: {
        alternating: true
    },
    inputArea: {
        show: true
    },
    sendOnEnter: true,
    sendOnShiftEnter: false,
    instanceClass: 'my-chat',
    language: 'en',
    direction: 'ltr',
    sanitizer: 'escapeHTML',
    virtualScrolling: {
        enabled: true,
        threshold: 500,
        buffer: 10,
        debounceTime: 100
    }
};

const chat4 = new QuikChat('#chat', (instance, message) => {
    // Test callback
}, options);

// Test message methods with type aliases
const align: Alignment = 'left';
const role: MessageRole = 'assistant';
const msgId = chat4.messageAddNew('Hello', 'Bot', align, role, 'smart', true, ['greeting']);

// Test new v1.1.17 methods
chat4.setLanguage('es', { send: 'Enviar' });
const lang = chat4.getLanguage();
chat4.setDirection('rtl');
const dir = chat4.getDirection();

// Test sanitizer methods
chat4.setSanitizer(sanitizers.escapeHTML);
chat4.setSanitizer(sanitizers.stripHTML);
chat4.setSanitizer((content: string) => content.toUpperCase());
chat4.setSanitizer(null);
const currentSanitizer = chat4.getSanitizer();

// Test virtual scrolling methods
const isVirtual = chat4.isVirtualScrollingEnabled();
const virtualConfig = chat4.getVirtualScrollingConfig();
console.log(virtualConfig.visibleRange.start);

// Test callbacks with async support
chat4.setCallbackOnSend(async (instance, message) => {
    await fetch('/api/send', { method: 'POST', body: message });
});

chat4.setCallbackOnMessageAdded((instance, msgId) => {
    console.log('Message added:', msgId);
});

chat4.setCallbackOnMessageAppend(async (instance, msgId, content) => {
    console.log('Appended:', content);
});

// Test deprecated callback names (should still work)
chat4.setCallbackonMessageAdded((instance, msgId) => {
    console.log('Using deprecated name');
});

// Test history methods
const history = chat4.historyGetAllCopy();
const page = chat4.historyGetPage(1, 20, 'desc');
const searchResults = chat4.historySearch({
    text: 'hello',
    userString: 'Bot',
    role: 'assistant',
    tags: ['greeting'],
    limit: 10
});

// Test that historyGetMessage returns undefined (not {})
const msg = chat4.historyGetMessage(0);
if (msg === undefined) {
    console.log('Correctly returns undefined');
}

// Test static methods
const version = QuikChat.version();
console.log(version.version);
const lorem = QuikChat.loremIpsum(100);

// Test MessageOptions interface
const msgOptions: MessageOptions = {
    content: 'Test',
    userString: 'User',
    align: 'right',
    role: 'user',
    userID: 123,
    timestamp: '2024-01-01',
    updatedtime: false,
    scrollIntoView: 'smart',
    visible: true,
    tags: ['test']
};

chat4.messageAddFull(msgOptions);

// Test tag management
chat4.setTagVisibility('important', true);
const isVisible = chat4.getTagVisibility('important');
const activeTags = chat4.getActiveTags();

// Verify types are exported correctly
const testAlign: Alignment = 'center';
const testRole: MessageRole = 'system';
const testHistory: HistoryMessage = {
    msgid: 1,
    content: 'Test',
    userString: 'Bot',
    align: 'left',
    role: 'assistant'
};

console.log('TypeScript compilation test complete');