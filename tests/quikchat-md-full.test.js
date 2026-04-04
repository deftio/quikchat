import quikchatMDFull from '../src/quikchat-md-full.js';

describe('quikchat-md-full', () => {
    let parentElement;
    let chatInstance;

    beforeEach(() => {
        parentElement = document.createElement('div');
        document.body.appendChild(parentElement);
        chatInstance = new quikchatMDFull(parentElement, () => {});
    });

    afterEach(() => {
        document.body.removeChild(parentElement);
    });

    test('is a subclass of quikchat', () => {
        expect(chatInstance.constructor.name).toBe('quikchatMDFull');
        expect(typeof chatInstance.messageAddNew).toBe('function');
        expect(typeof chatInstance.historyGet).toBe('function');
    });

    test('exposes quikdown bd on the class', () => {
        expect(typeof quikchatMDFull.quikdown).toBe('function');
    });

    test('quikdown bd has extended methods', () => {
        // bd export has emitStyles and configure at minimum
        expect(typeof quikchatMDFull.quikdown.emitStyles).toBe('function');
        expect(typeof quikchatMDFull.quikdown.configure).toBe('function');
    });

    test('has a default messageFormatter', () => {
        expect(chatInstance._messageFormatter).not.toBeNull();
        expect(typeof chatInstance._messageFormatter).toBe('function');
    });

    test('formats bold markdown in messages', () => {
        const id = chatInstance.messageAddNew('**bold**', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
        expect(content).toContain('bold');
    });

    test('formats code blocks with language tags', () => {
        const id = chatInstance.messageAddNew('```javascript\nconst x = 1;\n```', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-pre');
        expect(content).toContain('language-javascript');
    });

    test('formats inline code', () => {
        const id = chatInstance.messageAddNew('use `console.log()`', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-code');
    });

    test('formats links', () => {
        const id = chatInstance.messageAddNew('[click](https://example.com)', 'bot', 'left');
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-a');
        expect(content).toContain('https://example.com');
    });

    test('allows custom messageFormatter to override', () => {
        const custom = (content) => '<p>' + content + '</p>';
        const chat2 = new quikchatMDFull(document.createElement('div'), () => {}, {
            messageFormatter: custom
        });
        expect(chat2._messageFormatter).toBe(custom);
    });

    test('plain text is passed through without errors', () => {
        const id = chatInstance.messageAddNew('just plain text', 'user', 'right');
        const content = chatInstance.messageGetContent(id);
        expect(content).toBe('just plain text');
    });

    test('messageAppendContent works with formatter', () => {
        const id = chatInstance.messageAddNew('start', 'bot', 'left');
        const result = chatInstance.messageAppendContent(id, ' **more**');
        expect(result).toBe(true);
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
    });

    test('messageReplaceContent works with formatter', () => {
        const id = chatInstance.messageAddNew('original', 'bot', 'left');
        const result = chatInstance.messageReplaceContent(id, '**replaced**');
        expect(result).toBe(true);
        const el = chatInstance.messageGetDOMObject(id);
        const content = el.querySelector('.quikchat-message-content').innerHTML;
        expect(content).toContain('quikdown-strong');
    });

    test('version returns correct version info', () => {
        const v = quikchatMDFull.version();
        expect(v.version).toBe('1.2.4');
    });

    test('all base quikchat methods work', () => {
        chatInstance.changeTheme('quikchat-theme-ocean');
        expect(chatInstance.theme).toBe('quikchat-theme-ocean');
        chatInstance.setDirection('rtl');
        expect(chatInstance.getDirection()).toBe('rtl');
        const id = chatInstance.messageAddNew('test', 'u', 'right');
        chatInstance.messageSetTags(id, ['debug']);
        expect(chatInstance.messageGetTags(id)).toEqual(['debug']);
        const exported = chatInstance.historyExport();
        expect(exported.length).toBe(1);
    });
});
