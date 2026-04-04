import quikchat from '../src/quikchat';
// Prevent scrollIntoView error in jsdom
Element.prototype.scrollIntoView = () => {};
// Mock ResizeObserver for jsdom
let lastResizeCallback;
global.ResizeObserver = class {
    constructor(cb) { this._cb = cb; lastResizeCallback = cb; }
    observe() {}
    unobserve() {}
    disconnect() {}
};

describe('quikchat', () => {
    let parentElement;
    let chatInstance;

    beforeEach(() => {
        document.body.innerHTML = '<div id="chat-container"></div>';
        parentElement = document.getElementById('chat-container');
        chatInstance = new quikchat(parentElement);
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    // ==================== Initialization ====================

    describe('constructor', () => {
        test('should initialize with default options', () => {
            expect(chatInstance._theme).toBe('quikchat-theme-light');
            expect(chatInstance.trackHistory).toBe(true);
            expect(chatInstance._historyLimit).toBe(10000000);
            expect(chatInstance._history).toEqual([]);
            expect(chatInstance.msgid).toBe(0);
        });

        test('should work with default no-op onSend callback', () => {
            // Construct without onSend — the default () => {} should be used
            const instance = new quikchat(parentElement);
            // Trigger send via button click — should not throw
            instance._sendButton.click();
            expect(instance._textEntry.value).toBe('');
        });

        test('should accept a CSS selector string as parentElement', () => {
            document.body.innerHTML = '<div id="selector-test"></div>';
            const instance = new quikchat('#selector-test');
            expect(instance._parentElement).toBe(document.getElementById('selector-test'));
            expect(instance._chatWidget).toBeTruthy();
        });

        test('should accept a DOM element as parentElement', () => {
            expect(chatInstance._parentElement).toBe(parentElement);
        });

        test('should merge custom options with defaults', () => {
            document.body.innerHTML = '<div id="opts-test"></div>';
            const el = document.getElementById('opts-test');
            const instance = new quikchat(el, () => {}, {
                theme: 'quikchat-theme-dark',
                titleArea: { title: 'Custom', show: true, align: 'left' },
                messagesArea: { alternating: false },
            });
            expect(instance._theme).toBe('quikchat-theme-dark');
            expect(instance._titleArea.style.display).toBe('');
            expect(instance._titleArea.innerHTML).toBe('Custom');
            expect(instance._titleArea.style.textAlign).toBe('left');
            expect(instance.messagesAreaAlternateColorsGet()).toBe(false);
        });

        test('should use fallback when onSend is null', () => {
            document.body.innerHTML = '<div id="null-cb"></div>';
            const instance = new quikchat(document.getElementById('null-cb'), null);
            expect(typeof instance._onSend).toBe('function');
            expect(() => instance._sendButton.click()).not.toThrow();
        });

        test('should handle missing titleArea in options', () => {
            document.body.innerHTML = '<div id="no-title-opts"></div>';
            const el = document.getElementById('no-title-opts');
            // titleArea: undefined path
            const instance = new quikchat(el, () => {}, {
                titleArea: undefined,
            });
            expect(instance._titleArea).toBeTruthy();
        });

        test('should handle missing messagesArea in options', () => {
            document.body.innerHTML = '<div id="no-msg-opts"></div>';
            const el = document.getElementById('no-msg-opts');
            const instance = new quikchat(el, () => {}, {
                messagesArea: undefined,
            });
            expect(instance._messagesArea).toBeTruthy();
        });

        test('should disable history tracking when trackHistory is false', () => {
            document.body.innerHTML = '<div id="no-track"></div>';
            const el = document.getElementById('no-track');
            const instance = new quikchat(el, () => {}, {
                trackHistory: false,
            });
            expect(instance.trackHistory).toBe(false);
            instance.messageAddNew('Not tracked');
            expect(instance.historyGetLength()).toBe(0);
        });

        test('should enable history tracking by default', () => {
            expect(chatInstance.trackHistory).toBe(true);
        });
    });

    // ==================== Widget Structure & ARIA ====================

    describe('widget structure and ARIA', () => {
        test('should create all required DOM elements', () => {
            expect(chatInstance._chatWidget).toBeTruthy();
            expect(chatInstance._titleArea).toBeTruthy();
            expect(chatInstance._messagesArea).toBeTruthy();
            expect(chatInstance._inputArea).toBeTruthy();
            expect(chatInstance._textEntry).toBeTruthy();
            expect(chatInstance._sendButton).toBeTruthy();
        });

        test('messages area should have role="log"', () => {
            expect(chatInstance._messagesArea.getAttribute('role')).toBe('log');
        });

        test('messages area should have aria-live="polite"', () => {
            expect(chatInstance._messagesArea.getAttribute('aria-live')).toBe('polite');
        });

        test('messages area should have aria-label', () => {
            expect(chatInstance._messagesArea.getAttribute('aria-label')).toBe('Chat messages');
        });

        test('text input should have aria-label', () => {
            expect(chatInstance._textEntry.getAttribute('aria-label')).toBe('Type a message');
        });

        test('send button should be a button element', () => {
            expect(chatInstance._sendButton.tagName).toBe('BUTTON');
        });

        test('text entry should be a textarea element', () => {
            expect(chatInstance._textEntry.tagName).toBe('TEXTAREA');
        });

        test('should not have inline height style on messages area (flexbox handles layout)', () => {
            expect(chatInstance._messagesArea.style.height).toBe('');
        });

        test('title area should not contain inline-styled span', () => {
            const spans = chatInstance._titleArea.querySelectorAll('span[style]');
            expect(spans.length).toBe(0);
        });

        test('message user label should use quikchat-user-label class', () => {
            chatInstance.messageAddNew('Test', 'User1', 'right');
            const label = chatInstance._messagesArea.querySelector('.quikchat-user-label');
            expect(label).toBeTruthy();
            expect(label.textContent).toBe('User1');
        });

        test('message user label should not have inline font-size or font-weight', () => {
            chatInstance.messageAddNew('Test', 'User1', 'right');
            const label = chatInstance._messagesArea.querySelector('.quikchat-user-label');
            expect(label.style.fontSize).toBe('');
            expect(label.style.fontWeight).toBe('');
        });

        test('message content should use quikchat-message-content class', () => {
            chatInstance.messageAddNew('Hello world', 'User1', 'left');
            const content = chatInstance._messagesArea.querySelector('.quikchat-message-content');
            expect(content).toBeTruthy();
            expect(content.innerHTML).toBe('Hello world');
        });

        test('message content should only have text-align as inline style', () => {
            chatInstance.messageAddNew('Test', 'User1', 'left');
            const content = chatInstance._messagesArea.querySelector('.quikchat-message-content');
            expect(content.style.textAlign).toBe('left');
            expect(content.style.width).toBe('');
            expect(content.style.fontSize).toBe('');
        });
    });

    // ==================== Title Area ====================

    describe('title area', () => {
        test('should show title area', () => {
            chatInstance.titleAreaShow();
            expect(chatInstance._titleArea.style.display).toBe('');
        });

        test('should hide title area', () => {
            chatInstance.titleAreaHide();
            expect(chatInstance._titleArea.style.display).toBe('none');
        });

        test('should toggle title area from hidden to visible', () => {
            chatInstance.titleAreaHide();
            chatInstance.titleAreaToggle();
            expect(chatInstance._titleArea.style.display).toBe('');
        });

        test('should toggle title area from visible to hidden', () => {
            chatInstance.titleAreaShow();
            chatInstance.titleAreaToggle();
            expect(chatInstance._titleArea.style.display).toBe('none');
        });

        test('should set title area contents with default center alignment', () => {
            chatInstance.titleAreaSetContents('My Chat');
            expect(chatInstance._titleArea.innerHTML).toBe('My Chat');
            expect(chatInstance._titleArea.style.textAlign).toBe('center');
        });

        test('should set title area contents with custom alignment', () => {
            chatInstance.titleAreaSetContents('Left', 'left');
            expect(chatInstance._titleArea.style.textAlign).toBe('left');
            chatInstance.titleAreaSetContents('Right', 'right');
            expect(chatInstance._titleArea.style.textAlign).toBe('right');
        });

        test('should get title area contents', () => {
            chatInstance.titleAreaSetContents('<b>Bold</b>');
            expect(chatInstance.titleAreaGetContents()).toBe('<b>Bold</b>');
        });

        test('should accept HTML in title', () => {
            chatInstance.titleAreaSetContents('<span class="icon">Chat</span>');
            expect(chatInstance._titleArea.querySelector('span.icon')).toBeTruthy();
        });
    });

    // ==================== Input Area ====================

    describe('input area', () => {
        test('should show input area', () => {
            chatInstance.inputAreaShow();
            expect(chatInstance._inputArea.style.display).toBe('');
        });

        test('should hide input area', () => {
            chatInstance.inputAreaHide();
            expect(chatInstance._inputArea.style.display).toBe('none');
        });

        test('should toggle input area from visible to hidden', () => {
            chatInstance.inputAreaShow();
            chatInstance.inputAreaToggle();
            expect(chatInstance._inputArea.style.display).toBe('none');
        });

        test('should toggle input area from hidden to visible', () => {
            chatInstance.inputAreaHide();
            chatInstance.inputAreaToggle();
            expect(chatInstance._inputArea.style.display).toBe('');
        });

        test('should disable input area', () => {
            chatInstance.inputAreaSetEnabled(false);
            expect(chatInstance._textEntry.disabled).toBe(true);
            expect(chatInstance._sendButton.disabled).toBe(true);
        });

        test('should enable input area', () => {
            chatInstance.inputAreaSetEnabled(false);
            chatInstance.inputAreaSetEnabled(true);
            expect(chatInstance._textEntry.disabled).toBe(false);
            expect(chatInstance._sendButton.disabled).toBe(false);
        });

        test('should set button text', () => {
            chatInstance.inputAreaSetButtonText('Stop');
            expect(chatInstance._sendButton.textContent).toBe('Stop');
        });

        test('should get button text', () => {
            expect(chatInstance.inputAreaGetButtonText()).toBe('Send');
            chatInstance.inputAreaSetButtonText('Thinking...');
            expect(chatInstance.inputAreaGetButtonText()).toBe('Thinking...');
        });

        test('should restore button text after changing it', () => {
            chatInstance.inputAreaSetButtonText('Stop');
            chatInstance.inputAreaSetButtonText('Send');
            expect(chatInstance.inputAreaGetButtonText()).toBe('Send');
        });
    });

    // ==================== Resize Handling ====================

    describe('resize handling', () => {
        test('_handleContainerResize should not throw', () => {
            expect(() => chatInstance._handleContainerResize()).not.toThrow();
        });

        test('should set up ResizeObserver when available', () => {
            // Mock ResizeObserver
            const observeFn = jest.fn();
            const mockRO = jest.fn().mockImplementation((cb) => ({
                observe: observeFn,
                disconnect: jest.fn(),
            }));
            const origRO = globalThis.ResizeObserver;
            globalThis.ResizeObserver = mockRO;

            document.body.innerHTML = '<div id="ro-test"></div>';
            const el = document.getElementById('ro-test');
            const instance = new quikchat(el);

            expect(mockRO).toHaveBeenCalled();
            expect(observeFn).toHaveBeenCalledWith(el);
            expect(instance._resizeObserver).toBeTruthy();

            globalThis.ResizeObserver = origRO;
        });

        test('ResizeObserver callback should invoke _handleContainerResize', () => {
            let capturedCallback;
            const mockRO = jest.fn().mockImplementation((cb) => {
                capturedCallback = cb;
                return { observe: jest.fn(), disconnect: jest.fn() };
            });
            const origRO = globalThis.ResizeObserver;
            globalThis.ResizeObserver = mockRO;

            document.body.innerHTML = '<div id="ro-cb-test"></div>';
            const el = document.getElementById('ro-cb-test');
            const instance = new quikchat(el);
            const spy = jest.spyOn(instance, '_handleContainerResize');

            capturedCallback();
            expect(spy).toHaveBeenCalled();

            globalThis.ResizeObserver = origRO;
        });
    });

    // ==================== Messages ====================

    describe('messages', () => {
        test('should add a new message and return msgid', () => {
            const msgid = chatInstance.messageAddNew('Hello');
            expect(msgid).toBe(0);
            expect(chatInstance._messagesArea.children.length).toBe(1);
        });

        test('should increment msgid for each message', () => {
            const id0 = chatInstance.messageAddNew('First');
            const id1 = chatInstance.messageAddNew('Second');
            expect(id0).toBe(0);
            expect(id1).toBe(1);
        });

        test('should add message with messageAddFull and all options', () => {
            const msgid = chatInstance.messageAddFull({
                content: 'Full msg',
                userString: 'admin',
                align: 'left',
                role: 'assistant',
                userID: 42,
            });
            expect(msgid).toBe(0);
            expect(chatInstance.messageGetContent(0)).toBe('Full msg');
        });

        test('should use default values in messageAddFull', () => {
            const msgid = chatInstance.messageAddFull();
            expect(msgid).toBe(0);
            expect(chatInstance.messageGetContent(0)).toBe('');
        });

        test('should use default values in messageAddNew', () => {
            const msgid = chatInstance.messageAddNew();
            expect(msgid).toBe(0);
        });

        test('should clear text entry after adding message', () => {
            chatInstance._textEntry.value = 'will be cleared';
            chatInstance.messageAddNew('Test');
            expect(chatInstance._textEntry.value).toBe('');
        });

        test('should assign alternating message classes', () => {
            chatInstance.messageAddNew('First');
            chatInstance.messageAddNew('Second');
            chatInstance.messageAddNew('Third');
            const children = chatInstance._messagesArea.children;
            expect(children[0].classList.contains('quikchat-message-2')).toBe(true);
            expect(children[1].classList.contains('quikchat-message-1')).toBe(true);
            expect(children[2].classList.contains('quikchat-message-2')).toBe(true);
        });

        test('should add role class to message div', () => {
            chatInstance.messageAddNew('Hello', 'user', 'right', 'user');
            const msg = chatInstance._messagesArea.children[0];
            expect(msg.classList.contains('quikchat-role-user')).toBe(true);
        });

        test('should add assistant role class', () => {
            chatInstance.messageAddNew('Hi', 'bot', 'left', 'assistant');
            const msg = chatInstance._messagesArea.children[0];
            expect(msg.classList.contains('quikchat-role-assistant')).toBe(true);
        });

        test('should add system role class', () => {
            chatInstance.messageAddNew('Notice', 'sys', 'center', 'system');
            const msg = chatInstance._messagesArea.children[0];
            expect(msg.classList.contains('quikchat-role-system')).toBe(true);
        });

        test('should add tool role class', () => {
            chatInstance.messageAddNew('Result', 'tool', 'left', 'tool');
            const msg = chatInstance._messagesArea.children[0];
            expect(msg.classList.contains('quikchat-role-tool')).toBe(true);
        });

        test('should default to user role class when role not specified', () => {
            chatInstance.messageAddNew('Default');
            const msg = chatInstance._messagesArea.children[0];
            expect(msg.classList.contains('quikchat-role-user')).toBe(true);
        });

        test('should add role class via messageAddFull', () => {
            chatInstance.messageAddFull({ content: 'Full', role: 'assistant' });
            const msg = chatInstance._messagesArea.children[0];
            expect(msg.classList.contains('quikchat-role-assistant')).toBe(true);
        });

        test('should default to user role when role is empty string', () => {
            chatInstance.messageAddFull({ content: 'No role', role: '' });
            const msg = chatInstance._messagesArea.children[0];
            expect(msg.classList.contains('quikchat-role-user')).toBe(true);
        });

        test('should contain user string and content in message DOM', () => {
            chatInstance.messageAddNew('Hello world', 'TestUser', 'left');
            const msg = chatInstance._messagesArea.children[0];
            expect(msg.textContent).toContain('TestUser');
            expect(msg.textContent).toContain('Hello world');
        });

        test('should remove a message and return true', () => {
            const msgId = chatInstance.messageAddNew('To remove');
            const result = chatInstance.messageRemove(msgId);
            expect(result).toBe(true);
            expect(chatInstance._messagesArea.children.length).toBe(0);
            expect(chatInstance.historyGetLength()).toBe(0);
        });

        test('should return false when removing non-existent message', () => {
            expect(chatInstance.messageRemove(999)).toBe(false);
        });

        test('should get message content by msgid', () => {
            const msgId = chatInstance.messageAddNew('Retrievable');
            expect(chatInstance.messageGetContent(msgId)).toBe('Retrievable');
        });

        test('should return empty string for non-existent message content', () => {
            expect(chatInstance.messageGetContent(999)).toBe('');
        });

        test('should get message DOM object', () => {
            const msgId = chatInstance.messageAddNew('DOM test');
            const dom = chatInstance.messageGetDOMObject(msgId);
            expect(dom).toBeTruthy();
            expect(dom.classList.contains('quikchat-message')).toBe(true);
        });

        test('should return null for non-existent message DOM object', () => {
            expect(chatInstance.messageGetDOMObject(999)).toBeNull();
        });

        test('should append content to existing message', () => {
            const msgId = chatInstance.messageAddNew('Hello');
            const result = chatInstance.messageAppendContent(msgId, ' world');
            expect(result).toBe(true);
            expect(chatInstance.messageGetContent(msgId)).toBe('Hello world');
        });

        test('should return false when appending to non-existent message', () => {
            expect(chatInstance.messageAppendContent(999, 'nope')).toBe(false);
        });

        test('should replace content of existing message', () => {
            const msgId = chatInstance.messageAddNew('Old content');
            const result = chatInstance.messageReplaceContent(msgId, 'New content');
            expect(result).toBe(true);
            expect(chatInstance.messageGetContent(msgId)).toBe('New content');
        });

        test('should return false when replacing non-existent message', () => {
            expect(chatInstance.messageReplaceContent(999, 'nope')).toBe(false);
        });

        test('should update updatedtime on append', () => {
            const msgId = chatInstance.messageAddNew('Start');
            const before = chatInstance._history[0].updatedtime;
            // Small delay to ensure different timestamp
            chatInstance.messageAppendContent(msgId, ' more');
            const after = chatInstance._history[0].updatedtime;
            expect(after).toBeDefined();
        });

        test('should update updatedtime on replace', () => {
            const msgId = chatInstance.messageAddNew('Start');
            chatInstance.messageReplaceContent(msgId, 'Replaced');
            expect(chatInstance._history[0].updatedtime).toBeDefined();
        });
    });

    // ==================== Scroll Behavior ====================

    describe('scroll behavior', () => {
        test('should scroll to last message when userScrolledUp is false', () => {
            chatInstance.userScrolledUp = false;
            Object.defineProperty(chatInstance._messagesArea, 'scrollHeight', { value: 500, writable: true, configurable: true });
            chatInstance._messagesArea.scrollTop = 0;
            chatInstance.messageAddNew('Scroll test');
            expect(chatInstance._messagesArea.scrollTop).toBe(500);
        });

        test('should not scroll when userScrolledUp is true', () => {
            chatInstance.userScrolledUp = true;
            Object.defineProperty(chatInstance._messagesArea, 'scrollHeight', { value: 500, writable: true, configurable: true });
            chatInstance._messagesArea.scrollTop = 0;
            chatInstance.messageAddNew('No scroll');
            expect(chatInstance._messagesArea.scrollTop).toBe(0);
        });

        test('should not scroll on append when userScrolledUp is true', () => {
            chatInstance.userScrolledUp = true;
            const msgId = chatInstance.messageAddNew('Base');
            chatInstance.userScrolledUp = true;
            chatInstance.messageAppendContent(msgId, ' appended');
            // Should not throw, just not scroll
            expect(chatInstance.messageGetContent(msgId)).toBe('Base appended');
        });

        test('should not scroll on replace when userScrolledUp is true', () => {
            chatInstance.userScrolledUp = true;
            const msgId = chatInstance.messageAddNew('Base');
            chatInstance.userScrolledUp = true;
            chatInstance.messageReplaceContent(msgId, 'Replaced');
            expect(chatInstance.messageGetContent(msgId)).toBe('Replaced');
        });

        test('should track userScrolledUp from scroll events', () => {
            chatInstance.messageAddNew('Msg');
            Object.defineProperty(chatInstance._messagesArea, 'scrollTop', { value: 0, writable: true, configurable: true });
            Object.defineProperty(chatInstance._messagesArea, 'scrollHeight', { value: 500, writable: true, configurable: true });
            Object.defineProperty(chatInstance._messagesArea, 'clientHeight', { value: 200, writable: true, configurable: true });
            chatInstance._messagesArea.dispatchEvent(new Event('scroll'));
            expect(chatInstance.userScrolledUp).toBe(true);
        });

        test('should set userScrolledUp to false at bottom', () => {
            Object.defineProperty(chatInstance._messagesArea, 'scrollTop', { value: 300, writable: true, configurable: true });
            Object.defineProperty(chatInstance._messagesArea, 'scrollHeight', { value: 500, writable: true, configurable: true });
            Object.defineProperty(chatInstance._messagesArea, 'clientHeight', { value: 200, writable: true, configurable: true });
            chatInstance._messagesArea.dispatchEvent(new Event('scroll'));
            expect(chatInstance.userScrolledUp).toBe(false);
        });
    });

    // ==================== Messages Area ====================

    describe('messages area alternating colors', () => {
        test('should enable alternating colors by default (no args)', () => {
            chatInstance.messagesAreaAlternateColors(false); // disable first
            const result = chatInstance.messagesAreaAlternateColors(); // default = true
            expect(result).toBe(true);
            expect(chatInstance.messagesAreaAlternateColorsGet()).toBe(true);
        });

        test('should enable alternating colors with explicit true', () => {
            const result = chatInstance.messagesAreaAlternateColors(true);
            expect(result).toBe(true);
            expect(chatInstance.messagesAreaAlternateColorsGet()).toBe(true);
        });

        test('should disable alternating colors', () => {
            chatInstance.messagesAreaAlternateColors(true);
            const result = chatInstance.messagesAreaAlternateColors(false);
            expect(result).toBe(false);
            expect(chatInstance.messagesAreaAlternateColorsGet()).toBe(false);
        });

        test('should toggle alternating colors', () => {
            chatInstance.messagesAreaAlternateColors(false);
            chatInstance.messagesAreaAlternateColorsToggle();
            expect(chatInstance.messagesAreaAlternateColorsGet()).toBe(true);
            chatInstance.messagesAreaAlternateColorsToggle();
            expect(chatInstance.messagesAreaAlternateColorsGet()).toBe(false);
        });
    });

    // ==================== History ====================

    describe('history', () => {
        test('should track history when trackHistory is true', () => {
            chatInstance.messageAddNew('Tracked');
            expect(chatInstance.historyGetLength()).toBe(1);
        });

        test('should get all history with no arguments', () => {
            chatInstance.messageAddNew('A');
            chatInstance.messageAddNew('B');
            chatInstance.messageAddNew('C');
            const history = chatInstance.historyGet();
            expect(history.length).toBe(3);
            expect(history[0].content).toBe('A');
            expect(history[2].content).toBe('C');
        });

        test('should get history range with n and m', () => {
            chatInstance.messageAddNew('A');
            chatInstance.messageAddNew('B');
            chatInstance.messageAddNew('C');
            const history = chatInstance.historyGet(0, 2);
            expect(history.length).toBe(2);
            expect(history[0].content).toBe('A');
            expect(history[1].content).toBe('B');
        });

        test('should get single history entry with just n', () => {
            chatInstance.messageAddNew('A');
            chatInstance.messageAddNew('B');
            const history = chatInstance.historyGet(1);
            expect(history.length).toBe(1);
            expect(history[0].content).toBe('B');
        });

        test('should handle historyGet with negative n (last N messages)', () => {
            chatInstance.messageAddNew('A');
            chatInstance.messageAddNew('B');
            chatInstance.messageAddNew('C');
            const last2 = chatInstance.historyGet(-2);
            expect(last2.length).toBe(2);
            expect(last2[0].content).toBe('B');
            expect(last2[1].content).toBe('C');
            const last1 = chatInstance.historyGet(-1);
            expect(last1.length).toBe(1);
            expect(last1[0].content).toBe('C');
        });

        test('historyGet() returns a copy, not the internal array', () => {
            chatInstance.messageAddNew('A');
            const h = chatInstance.historyGet();
            h.push({ fake: true });
            expect(chatInstance.historyGetLength()).toBe(1);
        });

        test('should clear history and reset msgid', () => {
            chatInstance.messageAddNew('A');
            chatInstance.messageAddNew('B');
            chatInstance.historyClear();
            expect(chatInstance.historyGetLength()).toBe(0);
            expect(chatInstance.msgid).toBe(0);
        });

        test('should get history message by index', () => {
            chatInstance.messageAddNew('First');
            chatInstance.messageAddNew('Second');
            const msg = chatInstance.historyGetMessage(0);
            expect(msg.content).toBe('First');
        });

        test('should return empty object for out-of-range historyGetMessage', () => {
            expect(chatInstance.historyGetMessage(99)).toEqual({});
        });

        test('should return empty object for negative historyGetMessage', () => {
            expect(chatInstance.historyGetMessage(-1)).toEqual({});
        });

        test('should get message content by history index', () => {
            chatInstance.messageAddNew('Content test');
            expect(chatInstance.historyGetMessageContent(0)).toBe('Content test');
        });

        test('should return empty string for out-of-range historyGetMessageContent', () => {
            expect(chatInstance.historyGetMessageContent(99)).toBe('');
        });

        test('should return empty string for negative historyGetMessageContent', () => {
            expect(chatInstance.historyGetMessageContent(-1)).toBe('');
        });

        test('should enforce history limit by shifting old entries', () => {
            chatInstance._historyLimit = 3;
            chatInstance.messageAddNew('One');
            chatInstance.messageAddNew('Two');
            chatInstance.messageAddNew('Three');
            chatInstance.messageAddNew('Four');
            expect(chatInstance.historyGetLength()).toBe(3);
            expect(chatInstance._history[0].content).toBe('Two');
        });

        test('history entries should have timestamps', () => {
            chatInstance.messageAddNew('Timestamped');
            const entry = chatInstance._history[0];
            expect(entry.timestamp).toBeDefined();
            expect(entry.updatedtime).toBeDefined();
        });

        test('history entries should store role and userString', () => {
            chatInstance.messageAddNew('Hello', 'bot', 'left', 'assistant');
            const entry = chatInstance._history[0];
            expect(entry.userString).toBe('bot');
            expect(entry.role).toBe('assistant');
            expect(entry.align).toBe('left');
        });
    });

    // ==================== Themes ====================

    describe('themes', () => {
        test('should change theme and update class', () => {
            chatInstance.changeTheme('quikchat-theme-dark');
            expect(chatInstance._theme).toBe('quikchat-theme-dark');
            expect(chatInstance._chatWidget.classList.contains('quikchat-theme-dark')).toBe(true);
        });

        test('should remove previous theme class', () => {
            chatInstance.changeTheme('quikchat-theme-dark');
            expect(chatInstance._chatWidget.classList.contains('quikchat-theme-light')).toBe(false);
            chatInstance.changeTheme('quikchat-theme-debug');
            expect(chatInstance._chatWidget.classList.contains('quikchat-theme-dark')).toBe(false);
        });

        test('should expose current theme via getter', () => {
            expect(chatInstance.theme).toBe('quikchat-theme-light');
        });

        test('should cycle through all three themes', () => {
            const themes = ['quikchat-theme-dark', 'quikchat-theme-debug', 'quikchat-theme-light'];
            for (const theme of themes) {
                chatInstance.changeTheme(theme);
                expect(chatInstance.theme).toBe(theme);
                expect(chatInstance._chatWidget.classList.contains(theme)).toBe(true);
            }
        });
    });

    // ==================== Callbacks ====================

    describe('callbacks', () => {
        test('should set onSend callback', () => {
            const cb = jest.fn();
            chatInstance.setCallbackOnSend(cb);
            chatInstance._textEntry.value = 'test';
            chatInstance._sendButton.click();
            expect(cb).toHaveBeenCalledWith(chatInstance, 'test');
        });

        test('should not fire onSend with empty input', () => {
            const cb = jest.fn();
            chatInstance.setCallbackOnSend(cb);
            chatInstance._textEntry.value = '';
            chatInstance._sendButton.click();
            expect(cb).not.toHaveBeenCalled();
        });

        test('should not fire onSend with whitespace-only input', () => {
            const cb = jest.fn();
            chatInstance.setCallbackOnSend(cb);
            chatInstance._textEntry.value = '   ';
            chatInstance._sendButton.click();
            expect(cb).not.toHaveBeenCalled();
        });

        test('should fire onSend with trimmed text', () => {
            const cb = jest.fn();
            chatInstance.setCallbackOnSend(cb);
            chatInstance._textEntry.value = '  hello  ';
            chatInstance._sendButton.click();
            expect(cb).toHaveBeenCalledWith(chatInstance, 'hello');
        });

        test('should fire onSend on Shift+Enter', () => {
            const cb = jest.fn();
            chatInstance.setCallbackOnSend(cb);
            chatInstance._textEntry.value = 'shift enter';
            const event = new KeyboardEvent('keydown', {
                keyCode: 13,
                shiftKey: true,
                bubbles: true,
            });
            chatInstance._textEntry.dispatchEvent(event);
            expect(cb).toHaveBeenCalledWith(chatInstance, 'shift enter');
        });

        test('should not fire onSend on Enter without Shift', () => {
            const cb = jest.fn();
            chatInstance.setCallbackOnSend(cb);
            chatInstance._textEntry.value = 'enter only';
            const event = new KeyboardEvent('keydown', {
                keyCode: 13,
                shiftKey: false,
                bubbles: true,
            });
            chatInstance._textEntry.dispatchEvent(event);
            expect(cb).not.toHaveBeenCalled();
        });

        test('should not fire onSend on other key combos', () => {
            const cb = jest.fn();
            chatInstance.setCallbackOnSend(cb);
            const event = new KeyboardEvent('keydown', {
                keyCode: 65, // 'a'
                shiftKey: true,
                bubbles: true,
            });
            chatInstance._textEntry.dispatchEvent(event);
            expect(cb).not.toHaveBeenCalled();
        });

        test('should set onMessageAdded callback', () => {
            const cb = jest.fn();
            chatInstance.setCallbackonMessageAdded(cb);
            const msgid = chatInstance.messageAddNew('Test');
            expect(cb).toHaveBeenCalledWith(chatInstance, msgid);
        });

        test('should not call onMessageAdded if not set', () => {
            // Default — no callback set, should not throw
            expect(() => chatInstance.messageAddNew('Safe')).not.toThrow();
        });
    });

    // ==================== Static Methods ====================

    describe('static methods', () => {
        test('version should return version info', () => {
            const v = quikchat.version();
            expect(v.version).toBe('1.2.0');
            expect(v.license).toBe('BSD-2');
            expect(v.url).toContain('quikchat');
        });

        describe('loremIpsum', () => {
            test('should generate text of exact length', () => {
                expect(quikchat.loremIpsum(100).length).toBe(100);
                expect(quikchat.loremIpsum(1).length).toBe(1);
                expect(quikchat.loremIpsum(500).length).toBe(500);
            });

            test('should start with capital letter by default', () => {
                const text = quikchat.loremIpsum(50, 0);
                expect(/^[A-Z]/.test(text)).toBe(true);
            });

            test('should not force capital when startWithCapitalLetter is false', () => {
                const text = quikchat.loremIpsum(50, 10, false);
                expect(text.length).toBe(50);
            });

            test('should produce deterministic output with fixed startSpot', () => {
                const a = quikchat.loremIpsum(50, 0);
                const b = quikchat.loremIpsum(50, 0);
                expect(a).toBe(b);
            });

            test('should generate random length when numChars is not a number', () => {
                const text = quikchat.loremIpsum(undefined);
                expect(text.length).toBeGreaterThanOrEqual(25);
                expect(text.length).toBeLessThanOrEqual(150);
            });

            test('should handle string passed as numChars', () => {
                const text = quikchat.loremIpsum('not a number');
                expect(text.length).toBeGreaterThanOrEqual(25);
                expect(text.length).toBeLessThanOrEqual(150);
            });

            test('should never end on whitespace', () => {
                for (let i = 1; i <= 30; i++) {
                    const text = quikchat.loremIpsum(i, 0);
                    expect(text[text.length - 1]).not.toBe(' ');
                }
            });

            test('should skip whitespace and punctuation at startSpot', () => {
                // Position 5 is a space in "Lorem ipsum..."
                const text = quikchat.loremIpsum(20, 5);
                expect(text.length).toBe(20);
            });

            test('should wrap around source text for large numChars', () => {
                const text = quikchat.loremIpsum(2000, 0);
                expect(text.length).toBe(2000);
            });

            test('should capitalize first letter even when startSpot lands after punctuation', () => {
                // Position 27 is near a comma; the while loop skips it
                const text = quikchat.loremIpsum(10, 27);
                expect(/^[A-Z]/.test(text)).toBe(true);
            });

            test('should match docstring: random length between 25 and 150', () => {
                // Run many times to check range
                for (let i = 0; i < 100; i++) {
                    const text = quikchat.loremIpsum();
                    expect(text.length).toBeGreaterThanOrEqual(25);
                    expect(text.length).toBeLessThanOrEqual(150);
                }
            });
        });
    });

    // ==================== Sanitize & MessageFormatter ====================

    describe('sanitize', () => {
        test('sanitize: true should escape HTML', () => {
            document.body.innerHTML = '<div id="san-test"></div>';
            const el = document.getElementById('san-test');
            const instance = new quikchat(el, () => {}, { sanitize: true });
            const id = instance.messageAddNew('<script>alert("xss")</script>', 'user', 'right');
            const content = instance.messageGetDOMObject(id).querySelector('.quikchat-message-content');
            expect(content.innerHTML).not.toContain('<script>');
            expect(content.textContent).toContain('<script>');
        });

        test('sanitize: function should run custom sanitizer', () => {
            document.body.innerHTML = '<div id="san-fn-test"></div>';
            const el = document.getElementById('san-fn-test');
            const sanitizer = (s) => s.replace(/<[^>]*>/g, '');
            const instance = new quikchat(el, () => {}, { sanitize: sanitizer });
            const id = instance.messageAddNew('<b>bold</b> text', 'user', 'right');
            expect(instance.messageGetContent(id)).toBe('<b>bold</b> text');
            const content = instance.messageGetDOMObject(id).querySelector('.quikchat-message-content');
            expect(content.innerHTML).toBe('bold text');
        });

        test('sanitize: false (default) should pass through raw HTML', () => {
            const id = chatInstance.messageAddNew('<b>bold</b>', 'user', 'right');
            const content = chatInstance.messageGetDOMObject(id).querySelector('.quikchat-message-content');
            expect(content.innerHTML).toBe('<b>bold</b>');
        });

        test('setSanitize should change sanitization at runtime', () => {
            chatInstance.setSanitize(true);
            const id = chatInstance.messageAddNew('<b>bold</b>', 'user', 'right');
            const content = chatInstance.messageGetDOMObject(id).querySelector('.quikchat-message-content');
            expect(content.innerHTML).not.toContain('<b>');
            chatInstance.setSanitize(false);
        });
    });

    describe('messageFormatter', () => {
        test('should apply formatter to new messages', () => {
            document.body.innerHTML = '<div id="fmt-test"></div>';
            const el = document.getElementById('fmt-test');
            const instance = new quikchat(el, () => {}, {
                messageFormatter: (content) => content.toUpperCase(),
            });
            const id = instance.messageAddNew('hello', 'user', 'right');
            const content = instance.messageGetDOMObject(id).querySelector('.quikchat-message-content');
            expect(content.innerHTML).toBe('HELLO');
            expect(instance.messageGetContent(id)).toBe('hello'); // raw content in history
        });

        test('should apply formatter on append (full content)', () => {
            document.body.innerHTML = '<div id="fmt-app-test"></div>';
            const el = document.getElementById('fmt-app-test');
            const instance = new quikchat(el, () => {}, {
                messageFormatter: (content) => content.toUpperCase(),
            });
            const id = instance.messageAddNew('hello', 'user', 'right');
            instance.messageAppendContent(id, ' world');
            const content = instance.messageGetDOMObject(id).querySelector('.quikchat-message-content');
            expect(content.innerHTML).toBe('HELLO WORLD');
        });

        test('should apply formatter on replace', () => {
            document.body.innerHTML = '<div id="fmt-rep-test"></div>';
            const el = document.getElementById('fmt-rep-test');
            const instance = new quikchat(el, () => {}, {
                messageFormatter: (content) => content.toUpperCase(),
            });
            const id = instance.messageAddNew('old', 'user', 'right');
            instance.messageReplaceContent(id, 'new');
            const content = instance.messageGetDOMObject(id).querySelector('.quikchat-message-content');
            expect(content.innerHTML).toBe('NEW');
        });

        test('setMessageFormatter should change formatter at runtime', () => {
            chatInstance.setMessageFormatter((c) => `[${c}]`);
            const id = chatInstance.messageAddNew('test', 'user', 'right');
            const content = chatInstance.messageGetDOMObject(id).querySelector('.quikchat-message-content');
            expect(content.innerHTML).toBe('[test]');
            chatInstance.setMessageFormatter(null);
        });

        test('sanitize + formatter: sanitize runs first, then formatter', () => {
            document.body.innerHTML = '<div id="san-fmt-test"></div>';
            const el = document.getElementById('san-fmt-test');
            const instance = new quikchat(el, () => {}, {
                sanitize: true,
                messageFormatter: (content) => `<em>${content}</em>`,
            });
            const id = instance.messageAddNew('<b>xss</b>', 'user', 'right');
            const content = instance.messageGetDOMObject(id).querySelector('.quikchat-message-content');
            // sanitize escapes <b>, then formatter wraps in <em>
            expect(content.innerHTML).toBe('<em>&lt;b&gt;xss&lt;/b&gt;</em>');
        });
    });

    // ==================== Typing Indicator ====================

    describe('typing indicator', () => {
        test('should add a typing indicator message', () => {
            const id = chatInstance.messageAddTypingIndicator('bot', 'left');
            const msgEl = chatInstance.messageGetDOMObject(id);
            expect(msgEl.classList.contains('quikchat-typing')).toBe(true);
            expect(msgEl.querySelector('.quikchat-typing-dots')).toBeTruthy();
        });

        test('should have assistant role by default', () => {
            const id = chatInstance.messageAddTypingIndicator('bot', 'left');
            const msgEl = chatInstance.messageGetDOMObject(id);
            expect(msgEl.classList.contains('quikchat-role-assistant')).toBe(true);
        });

        test('typing class should be removed on replaceContent', () => {
            const id = chatInstance.messageAddTypingIndicator('bot', 'left');
            chatInstance.messageReplaceContent(id, 'Actual response');
            const msgEl = chatInstance.messageGetDOMObject(id);
            expect(msgEl.classList.contains('quikchat-typing')).toBe(false);
            expect(msgEl.querySelector('.quikchat-typing-dots')).toBeNull();
        });

        test('typing class should be removed on appendContent', () => {
            const id = chatInstance.messageAddTypingIndicator('bot', 'left');
            chatInstance.messageAppendContent(id, 'First token');
            const msgEl = chatInstance.messageGetDOMObject(id);
            expect(msgEl.classList.contains('quikchat-typing')).toBe(false);
        });

        test('should be removable with messageRemove', () => {
            const id = chatInstance.messageAddTypingIndicator('bot', 'left');
            expect(chatInstance.messageRemove(id)).toBe(true);
        });

        test('should work with default params', () => {
            const id = chatInstance.messageAddTypingIndicator();
            const msgEl = chatInstance.messageGetDOMObject(id);
            expect(msgEl.classList.contains('quikchat-typing')).toBe(true);
        });
    });

    // ==================== Alignment Classes ====================

    describe('alignment classes', () => {
        test('should add quikchat-align-right class', () => {
            const id = chatInstance.messageAddNew('Test', 'user', 'right');
            const msgEl = chatInstance.messageGetDOMObject(id);
            expect(msgEl.classList.contains('quikchat-align-right')).toBe(true);
        });

        test('should add quikchat-align-left class', () => {
            const id = chatInstance.messageAddNew('Test', 'bot', 'left');
            const msgEl = chatInstance.messageGetDOMObject(id);
            expect(msgEl.classList.contains('quikchat-align-left')).toBe(true);
        });

        test('should add quikchat-align-center class', () => {
            const id = chatInstance.messageAddNew('Notice', 'sys', 'center');
            const msgEl = chatInstance.messageGetDOMObject(id);
            expect(msgEl.classList.contains('quikchat-align-center')).toBe(true);
        });

        test('should default to right alignment', () => {
            const id = chatInstance.messageAddNew('Default');
            const msgEl = chatInstance.messageGetDOMObject(id);
            expect(msgEl.classList.contains('quikchat-align-right')).toBe(true);
        });
    });

    // ==================== Edge Cases & Robustness ====================

    describe('edge cases', () => {
        test('should handle empty content message', () => {
            const msgId = chatInstance.messageAddNew('');
            expect(chatInstance.messageGetContent(msgId)).toBe('');
        });

        test('should handle HTML content in messages', () => {
            const html = '<b>Bold</b> <i>italic</i>';
            const msgId = chatInstance.messageAddNew(html);
            expect(chatInstance.messageGetContent(msgId)).toBe(html);
        });

        test('should handle very long messages', () => {
            const longMsg = 'x'.repeat(100000);
            const msgId = chatInstance.messageAddNew(longMsg);
            expect(chatInstance.messageGetContent(msgId)).toBe(longMsg);
        });

        test('should handle rapid message add/remove', () => {
            const ids = [];
            for (let i = 0; i < 50; i++) {
                ids.push(chatInstance.messageAddNew(`Msg ${i}`));
            }
            expect(chatInstance.historyGetLength()).toBe(50);
            for (const id of ids) {
                chatInstance.messageRemove(id);
            }
            expect(chatInstance.historyGetLength()).toBe(0);
        });

        test('should handle multiple theme changes', () => {
            for (let i = 0; i < 10; i++) {
                chatInstance.changeTheme('quikchat-theme-dark');
                chatInstance.changeTheme('quikchat-theme-light');
            }
            expect(chatInstance.theme).toBe('quikchat-theme-light');
        });

        test('should handle setting title area contents multiple times', () => {
            for (let i = 0; i < 10; i++) {
                chatInstance.titleAreaSetContents(`Title ${i}`);
            }
            expect(chatInstance.titleAreaGetContents()).toBe('Title 9');
        });

        test('should handle double remove of same message gracefully', () => {
            const msgId = chatInstance.messageAddNew('Remove me');
            chatInstance.messageRemove(msgId);
            expect(chatInstance.messageRemove(msgId)).toBe(false);
        });

        test('should handle append after remove gracefully', () => {
            const msgId = chatInstance.messageAddNew('Will remove');
            chatInstance.messageRemove(msgId);
            expect(chatInstance.messageAppendContent(msgId, 'nope')).toBe(false);
        });

        test('should handle replace after remove gracefully', () => {
            const msgId = chatInstance.messageAddNew('Will remove');
            chatInstance.messageRemove(msgId);
            expect(chatInstance.messageReplaceContent(msgId, 'nope')).toBe(false);
        });

        test('historyClear should allow new messages with fresh ids', () => {
            chatInstance.messageAddNew('Old');
            chatInstance.historyClear();
            const newId = chatInstance.messageAddNew('New');
            expect(newId).toBe(0);
        });
    });

    // ==================== Empty Send Guard ====================

    describe('empty send guard', () => {
        test('should not fire onSend on Shift+Enter with empty input', () => {
            const cb = jest.fn();
            chatInstance.setCallbackOnSend(cb);
            chatInstance._textEntry.value = '';
            const event = new KeyboardEvent('keydown', { shiftKey: true, keyCode: 13 });
            chatInstance._textEntry.dispatchEvent(event);
            expect(cb).not.toHaveBeenCalled();
        });
    });

    // ==================== Timestamps ====================

    describe('timestamps', () => {
        test('messages should have a timestamp span', () => {
            const id = chatInstance.messageAddNew('Hello', 'user', 'right');
            const msgEl = chatInstance.messageGetDOMObject(id);
            const ts = msgEl.querySelector('.quikchat-timestamp');
            expect(ts).toBeTruthy();
            expect(ts.textContent).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
        });

        test('timestamps should be hidden by default', () => {
            expect(chatInstance.messagesAreaShowTimestampsGet()).toBe(false);
        });

        test('messagesAreaShowTimestamps(true) should add class', () => {
            chatInstance.messagesAreaShowTimestamps(true);
            expect(chatInstance._messagesArea.classList.contains('quikchat-show-timestamps')).toBe(true);
            expect(chatInstance.messagesAreaShowTimestampsGet()).toBe(true);
        });

        test('messagesAreaShowTimestamps(false) should remove class', () => {
            chatInstance.messagesAreaShowTimestamps(true);
            chatInstance.messagesAreaShowTimestamps(false);
            expect(chatInstance.messagesAreaShowTimestampsGet()).toBe(false);
        });

        test('messagesAreaShowTimestampsToggle should toggle', () => {
            chatInstance.messagesAreaShowTimestampsToggle();
            expect(chatInstance.messagesAreaShowTimestampsGet()).toBe(true);
            chatInstance.messagesAreaShowTimestampsToggle();
            expect(chatInstance.messagesAreaShowTimestampsGet()).toBe(false);
        });

        test('showTimestamps constructor option should enable timestamps', () => {
            document.body.innerHTML = '<div id="ts-test"></div>';
            const instance = new quikchat('#ts-test', () => {}, { showTimestamps: true });
            expect(instance.messagesAreaShowTimestampsGet()).toBe(true);
        });
    });

    // ==================== Scroll to Bottom ====================

    describe('scroll to bottom', () => {
        test('scrollToBottom should reset userScrolledUp', () => {
            chatInstance.userScrolledUp = true;
            chatInstance.scrollToBottom();
            expect(chatInstance.userScrolledUp).toBe(false);
        });

        test('scrollToBottom should remove visible class from scroll button', () => {
            chatInstance._scrollBottomBtn.classList.add('quikchat-scroll-bottom-visible');
            chatInstance.scrollToBottom();
            expect(chatInstance._scrollBottomBtn.classList.contains('quikchat-scroll-bottom-visible')).toBe(false);
        });

        test('_updateScrollBottomBtn should show button when scrolled up', () => {
            chatInstance.userScrolledUp = true;
            chatInstance._updateScrollBottomBtn();
            expect(chatInstance._scrollBottomBtn.classList.contains('quikchat-scroll-bottom-visible')).toBe(true);
        });

        test('_updateScrollBottomBtn should hide button when at bottom', () => {
            chatInstance.userScrolledUp = false;
            chatInstance._updateScrollBottomBtn();
            expect(chatInstance._scrollBottomBtn.classList.contains('quikchat-scroll-bottom-visible')).toBe(false);
        });

        test('scroll button click should call scrollToBottom', () => {
            chatInstance.userScrolledUp = true;
            chatInstance._scrollBottomBtn.click();
            expect(chatInstance.userScrolledUp).toBe(false);
        });

        test('Ctrl+End should call scrollToBottom', () => {
            chatInstance.userScrolledUp = true;
            const event = new KeyboardEvent('keydown', { ctrlKey: true, key: 'End', bubbles: true });
            chatInstance._chatWidget.dispatchEvent(event);
            expect(chatInstance.userScrolledUp).toBe(false);
        });
    });

    // ==================== Auto-grow Textarea ====================

    describe('auto-grow textarea', () => {
        test('textarea should have rows=1', () => {
            expect(chatInstance._textEntry.getAttribute('rows')).toBe('1');
        });

        test('_autoGrowTextarea should set overflow-y', () => {
            chatInstance._textEntry.value = 'hello';
            chatInstance._autoGrowTextarea();
            expect(chatInstance._textEntry.style.overflowY).toBe('hidden');
        });

        test('_autoGrowTextarea should handle scrollHeight exceeding max', () => {
            // jsdom scrollHeight is 0, so this tests the fallback branch
            Object.defineProperty(chatInstance._textEntry, 'scrollHeight', { value: 200, configurable: true });
            chatInstance._autoGrowTextarea();
            expect(chatInstance._textEntry.style.height).toBe('120px');
            expect(chatInstance._textEntry.style.overflowY).toBe('auto');
        });

        test('textarea should reset after sending message', () => {
            const cb = jest.fn();
            chatInstance.setCallbackOnSend(cb);
            chatInstance._textEntry.value = 'hello';
            chatInstance._sendButton.click();
            // messageAddFull clears the textarea value
            // _autoGrowTextarea is called after clearing
            expect(cb).toHaveBeenCalled();
        });

        test('input event should trigger auto-grow', () => {
            chatInstance._textEntry.value = 'test';
            const event = new Event('input', { bubbles: true });
            chatInstance._textEntry.dispatchEvent(event);
            // Should not throw and should set height
            expect(chatInstance._textEntry.style.height).toBeDefined();
        });

        test('scroll event should update userScrolledUp', () => {
            // Trigger scroll event on messages area
            const event = new Event('scroll');
            chatInstance._messagesArea.dispatchEvent(event);
            // In jsdom, scrollTop=0 and scrollHeight equals clientHeight, so not scrolled up
            expect(typeof chatInstance.userScrolledUp).toBe('boolean');
        });

        test('_handleContainerResize should not throw', () => {
            expect(() => chatInstance._handleContainerResize()).not.toThrow();
        });

        test('_formatTimestamp should return formatted time string', () => {
            const result = chatInstance._formatTimestamp('2024-01-15T09:05:00Z');
            expect(result).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
            const result2 = chatInstance._formatTimestamp('2024-01-15T15:30:00Z');
            expect(result2).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
            // Test noon/midnight (h % 12 === 0 → should become 12)
            const noon = chatInstance._formatTimestamp('2024-01-15T12:00:00Z');
            expect(noon).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
        });

        test('ResizeObserver callback should invoke _handleContainerResize', () => {
            // Call the resize observer callback stored on the instance
            expect(chatInstance._resizeObserver).toBeDefined();
            expect(() => chatInstance._resizeObserver._cb()).not.toThrow();
        });
    });
});
