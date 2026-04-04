import quikchatMD from '../src/quikchat-md.js';

describe('quikchat-md', () => {
    let parentElement;
    let chatInstance;

    beforeEach(() => {
        parentElement = document.createElement('div');
        document.body.appendChild(parentElement);
        chatInstance = new quikchatMD(parentElement, () => {});
    });

    afterEach(() => {
        document.body.removeChild(parentElement);
    });

    test('is a subclass of quikchat', () => {
        expect(chatInstance.constructor.name).toBe('quikchatMD');
        expect(typeof chatInstance.messageAddNew).toBe('function');
        expect(typeof chatInstance.historyGet).toBe('function');
    });

    test('exposes quikdown on the class', () => {
        expect(typeof quikchatMD.quikdown).toBe('function');
    });

    test('has a default messageFormatter', () => {
        expect(chatInstance._messageFormatter).not.toBeNull();
        expect(typeof chatInstance._messageFormatter).toBe('function');
    });

    test('formats bold markdown in messages', () => {
        const id = chatInstance.messageAddNew('**bold text**', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
        expect(content).toContain('bold text');
    });

    test('formats italic markdown in messages', () => {
        const id = chatInstance.messageAddNew('*italic text*', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-em');
        expect(content).toContain('italic text');
    });

    test('formats inline code in messages', () => {
        const id = chatInstance.messageAddNew('use `console.log()`', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-code');
        expect(content).toContain('console.log()');
    });

    test('formats code blocks in messages', () => {
        const id = chatInstance.messageAddNew('```\nconst x = 1;\n```', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-pre');
    });

    test('formats links in messages', () => {
        const id = chatInstance.messageAddNew('[click](https://example.com)', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-a');
        expect(content).toContain('https://example.com');
    });

    test('allows custom messageFormatter to override', () => {
        const custom = (content) => '<div class="custom">' + content + '</div>';
        const chat2 = new quikchatMD(document.createElement('div'), () => {}, {
            messageFormatter: custom
        });
        expect(chat2._messageFormatter).toBe(custom);
    });

    test('messageAppendContent re-processes through formatter', () => {
        const id = chatInstance.messageAddNew('**start**', 'bot', 'left');
        chatInstance.messageAppendContent(id, ' *more*');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
        expect(content).toContain('quikdown-em');
    });

    test('messageReplaceContent re-processes through formatter', () => {
        const id = chatInstance.messageAddNew('plain text', 'bot', 'left');
        chatInstance.messageReplaceContent(id, '**replaced**');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
        expect(content).toContain('replaced');
    });

    test('plain text is passed through without errors', () => {
        const id = chatInstance.messageAddNew('just plain text', 'user', 'right');
        const content = chatInstance.messageGetContent(id);
        expect(content).toBe('just plain text');
    });

    test('version returns correct version info', () => {
        const v = quikchatMD.version();
        expect(v.version).toBe('1.2.4');
    });

    test('all base quikchat methods work', () => {
        // Quick smoke test of inherited methods
        chatInstance.titleAreaShow();
        chatInstance.titleAreaHide();
        chatInstance.changeTheme('quikchat-theme-dark');
        expect(chatInstance.theme).toBe('quikchat-theme-dark');
        chatInstance.setDirection('rtl');
        expect(chatInstance.getDirection()).toBe('rtl');
        const id = chatInstance.messageAddNew('test', 'u', 'right');
        expect(chatInstance.messageGetVisible(id)).toBe(true);
        chatInstance.messageSetVisible(id, false);
        expect(chatInstance.messageGetVisible(id)).toBe(false);
    });
});
